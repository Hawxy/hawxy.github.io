---
title: What's new in Alba v9
description: The biggest Alba release in years with host pooling, SSE support and more
date: 2026-11-10
tags: [alba, aspnetcore, testing, dotnet]
---

If you're reading this then [Alba](https://github.com/JasperFx/alba) v9 has been released. This post covers all the big new features worth knowing about. For the full list of changes, see the [v9 changelog](https://github.com/JasperFx/alba/blob/master/v9_CHANGELOG.md).

## Host pooling for parallel tests

Most Alba test suites get built in the same way, you start with one `AlbaHost` in a shared fixture that gets reused by every test. It's very fast, right up until two tests touch the same database rows at the same time and you're left chasing data corruption or flaky failures. From there you have two options, turn off parallelism and watch the suite slow to a crawl, or start a fresh host for every test and pay for application startup hundreds of times over.

Alba 9 adds a third option. `AlbaHostPool` keeps a small set of hosts running and rents them out to individual tests. Your tests still run in parallel, but each one gets a host to itself, and that host is cleaned up before anyone else can reuse it.

### Setting up a pool

Let's wire one up with TUnit. A pool is built from a factory that Alba calls whenever it needs another host. The factory is provided metadata about where it sits within the pool, allowing for easy isolation of infrastructure. In this example, each one gets its own database:

```csharp [AlbaPool.cs]
public sealed class AlbaPool : IAsyncDisposable
{
    public const int Hosts = 4;

    public AlbaHostPool Pool { get; } = new(slot => AlbaHost.For<WebApp.Program>()
            // Each host gets its own database
            .WithConfiguration("ConnectionStrings:Db", $"Host=localhost;Database=app_{slot.Index}"),
        new AlbaHostPoolOptions
        {
            // Hosts start as tests need them, up to this many
            MaxHosts = Hosts
        });

    public ValueTask DisposeAsync() => Pool.DisposeAsync();
}

// TUnit runs no more of the tests marked with this limiter at once than the pool has hosts
public sealed class PooledHostsLimit : IParallelLimit
{
    public int Limit => AlbaPool.Hosts;
}
```

Hosts are started lazily, so if your run never has more than two tests in flight, you only pay for two host. TUnit runs everything in parallel by default, so the parallel limiter keeps it from starting more pooled tests than there are hosts to go around. We recommend experimenting with this based on your available local & CI resources.

### Borrowing a host

Each test rents a host when it starts and hands it back when it's done. TUnit creates a new instance of the test class for every test, which makes a base class the natural home for this pattern:

```csharp [PooledTestBase.cs]
public abstract class PooledTestBase(AlbaPool pool) : IAsyncInitializer, IAsyncDisposable
{
    private AlbaHostLease? _lease;

    protected IAlbaHost Host => _lease!;

    public async Task InitializeAsync()
    {
        var test = TestContext.Current;

        // Name the test, because timeout messages would otherwise name this method
        _lease = await pool.Pool.RentAsync(test?.Execution.CancellationToken ?? default,
            caller: test?.Metadata.TestName ?? "");
    }

    // Resets the host and returns it to the pool
    public async ValueTask DisposeAsync()
    {
        if (_lease is not null) await _lease.DisposeAsync();
    }
}
```

Passing the test's name to `RentAsync` is useful for when something goes wrong. If every host is being held for too long, a timeout error lists which tests are deadlocked, so a lease that never gets returned is easy to track down.

The lease itself is an `IAlbaHost`, so the tests don't look any different from the ones you'd write against a shared host:

```csharp [PooledMathTests.cs]
[ClassDataSource<AlbaPool>(Shared = SharedType.PerTestSession)]
[ParallelLimiter<PooledHostsLimit>]
public class PooledMathTests(AlbaPool pool) : PooledTestBase(pool)
{
    [Test]
    [Arguments(1, 2, 3)]
    [Arguments(2, 3, 5)]
    [Arguments(10, 20, 30)]
    public async Task adds_numbers(int one, int two, int sum)
    {
        await Host.Scenario(x =>
        {
            x.Get.Url($"/math/add/{one}/{two}");
            x.JsonPath("$.answer").ShouldBe(sum);
        });
    }
}
```

### Cleaning up between tests

A pool is only useful if every test gets a host that looks freshly started. As a lease is returned, Alba removes any `BeforeEach` or `AfterEach` hooks the test added, rolls back extensions that implement `IResettableAlbaExtension`, then hands over to your own cleanup. Two hooks are available and should cover most situations. `OnCreated` runs once when a host starts, and `OnReturn` runs after every test:

```csharp [AlbaPool.cs]
new AlbaHostPoolOptions
{
    MaxHosts = Hosts,

    // Once per host, before its first test
    OnCreated = async (host, slot) =>
    {
        using var scope = host.Services.CreateScope();
        await scope.ServiceProvider.GetRequiredService<AppDbContext>().Database.MigrateAsync();
    },

    // After every test, for example with Marten
    OnReturn = (host, slot) => host.ResetAllMartenDataAsync()
}
```

These hooks are optional, feel free to use your existing before/after hooks within your test framework of choice.

Some state can't be reset that easily, like a singleton the test has mutated. In that scenario, a test can call `host.Discard()`, and the pool throws that host away and starts a fresh one in its place. If your tests need more than the host itself, such as mocks or seeded users, `AlbaHostPool<TState>` keeps a stateful object alongside each host.

The [pooling docs](https://jasperfx.github.io/alba/guide/pooling.html) go further, with xUnit and NUnit setups and patterns for giving each host its own queues and files.

## No more synchronous I/O

Alba no longer performs any synchronous reads or writes against the server streams, and it no longer forces `AllowSynchronousIO = true` on the `TestServer`. If middleware or a formatter in your app does blocking stream I/O, Kestrel would have rejected it in production, and now the tests will too.

Behind the scenes, the response body is now buffered once, asynchronously, as soon as the request completes. Every read after that, including the synchronous `ReadAsText()` and `ReadAsJson<T>()`, is an in-memory, repeatable operation, so you can read the body as JSON, then as text, then assert on it without worrying about stream positions or stream-copy overhead.

If your application genuinely needs synchronous I/O, opt back in after the host starts:

```csharp [ApiFixture.cs]
var host = await AlbaHost.For<Program>();
host.Server.AllowSynchronousIO = true;
```

Related to this, `BeforeEachAsync` hooks now receives the `Scenario` and is properly awaited before the request executes, instead of blocking a thread inside the test server:

```csharp [ApiFixture.cs]
host.BeforeEachAsync(async scenario =>
{
    var token = await tokens.FetchAsync();
    scenario.WithBearerToken(token);
});
```

## Fluent host configuration

Every bootstrapping method now returns a chainable & awaitable `AlbaHostBuilder`. This is done to improve readability and provide more standardize APIs for common operations, such as configuration overrides. Your own test suite can build on this syntax to apply its own extensions.

```csharp [ApiFixture.cs]
await using var host = await AlbaHost.For<Program>(x =>
    {
        x.ConfigureServices(s => s.AddSingleton<IExternalWebService>(stub));
    })
    .WithConfiguration("ConnectionStrings:Postgres", postgres.GetConnectionString())
    .WithExtension(new AuthenticationStub().WithName("jeremy"));
```

`WithConfiguration` now provides a single way to apply configuration over the application and picks the highest level of override possible depending on bootstrapping style.
With .NET 11 we're also using a new API that allows `AlbaHost.For<T>` to apply configuration overrides to the `WebApplicationBuilder` as soon as it's created, resolving some unintuitive behaviour where configuration wouldn't be applied when you expected it to be.

```csharp [Program.cs]
var builder = WebApplication.CreateBuilder();

// Always sees the value from WithConfiguration(...) on .NET 11, which was not always true with previous versions of .NET
var connectionString = builder.Configuration.GetConnectionString("Postgres");
builder.Services.AddNpgsqlDataSource(connectionString!);
```

## Server-sent events

SSE is an incredibly useful protocol to provide lightweight data streams to a client without involving heavy dependencies like SignalR.

.NET 10 added `TypedResults.ServerSentEvents` as a first-class return type and with Alba 9 you can test those endpoints in two different ways. We'll create an endpoint like this:

```csharp [Program.cs]
app.MapGet("/orders/{id}/status", (Guid id, OrderTracker tracker, CancellationToken ct) =>
    TypedResults.ServerSentEvents(tracker.WatchAsync(id, ct), eventType: "status"));
```

`WatchAsync` returns an IAsyncEnumerable that streams a number of events out to the caller.

### Finite streams

If the endpoint writes a bounded number of events and completes, a normal scenario can easily buffer the whole response. Parse it with `ReadAsServerSentEvents()`, or the typed overload that deserializes each `data:` payload using the application's own JSON options:

```csharp [OrderStatusTests.cs]
var result = await host.Scenario(x =>
{
    x.Get.Url($"/orders/{orderId}/status");
});

var events = result.ReadAsServerSentEvents<OrderStatus>();

events.Select(e => e.Data.State).ShouldBe(new[] { "Placed", "Packed", "Shipped" });
```

### Live streams

Endpoints that stream indefinitely can't be buffered. Rather than a scenario, use the `StreamServerSentEvents` function on the `AlbaHost`. 

It returns as soon as the response headers arrive, then yields each event as the application writes it:

```csharp [OrderStatusTests.cs]
using var timeout = new CancellationTokenSource(TimeSpan.FromSeconds(10));

await using var stream = await host.StreamServerSentEvents(x =>
{
    x.Get.Url($"/orders/{orderId}/status");
}, timeout.Token);

await foreach (var item in stream.ReadEvents<OrderStatus>(timeout.Token))
{
    if (item.Data.State == "Shipped") break;
}
```

Disposing the stream aborts the request, which cancels the endpoint's `RequestAborted` token. `BeforeEach` hooks and the security stubs (including per-scenario claims) apply to streams the same way they do to scenarios.

::note
Response assertions like `ContentShouldContain` aren't supported on live streams, so assert on the events instead. The expected status code is still checked, so error codes like a 401 from a missing auth setup will throw as normal.
::

## Scenarios by route name

Instead of calling a URL directly, a scenario can address an endpoint by its ASP.NET Core route name. Alba generates the url by inspecting the running application, so tests will survive a route pattern change:

```csharp [Program.cs]
app.MapGet("/api/accounts/{accountId}", GetAccount)
    .WithName("GetAccount");

app.MapPost("/api/accounts/{accountId:int}/deposits", MakeDeposit)
    .WithName("MakeDeposit");
```

```csharp [AccountTests.cs]
await host.Scenario(x =>
{
    // Values that aren't route parameters become the query string
    x.Get.RouteNamed("GetAccount", new { accountId, include = "deposits" });
});

await host.Scenario(x =>
{
    x.Post.Json(new MakeDeposit(100m)).ToRouteNamed("MakeDeposit", new { accountId });
});
```

This works with minimal API `.WithName(...)`, MVC attribute routes with `Name = ...`, and Wolverine's `RouteName`. An unknown name or a missing route value throws before the request is sent, listing the route names available within the application.

## Time travel with `TimeProviderOverride`

Anything time-sensitive (token expiry, cache TTLs, "valid until" rules) needs a deterministic clock. `TimeProviderOverride` is both an Alba extension and a [`FakeTimeProvider`](https://learn.microsoft.com/en-us/dotnet/api/microsoft.extensions.time.testing.faketimeprovider): pass it to the host, and it replaces the application's `TimeProvider` registration. Then drive time from the test:

```csharp [InviteTests.cs]
[Fact]
public async Task invites_expire_after_seven_days()
{
    var clock = new TimeProviderOverride(new DateTimeOffset(2030, 1, 1, 0, 0, 0, TimeSpan.Zero));

    await using var host = await AlbaHost.For<Program>(clock);

    var invite = await host.Scenario(x => x.Post.Json(new CreateInvite("ada@example.com")).ToUrl("/invites"));
    var code = (await invite.ReadAsJsonAsync<InviteCreated>()).Code;

    clock.Advance(TimeSpan.FromDays(6));
    await host.Scenario(x => x.Get.Url($"/invites/{code}"));

    clock.Advance(TimeSpan.FromDays(2));
    await host.Scenario(x =>
    {
        x.Get.Url($"/invites/{code}");
        x.StatusCodeShouldBe(HttpStatusCode.Gone);
    });
}
```

## Binary responses

`ReadAsBytes()` and `ReadAsBytesAsync()` return the response body as a `byte[]`, for files, images and other payloads that `ReadAsText()` would mangle:

```csharp [AvatarTests.cs]
var result = await host.Scenario(x =>
{
    x.Get.Url($"/users/{userId}/avatar");
    x.ContentTypeShouldBe("image/png");
});

var png = await result.ReadAsBytesAsync();

png[..8].ShouldBe(new byte[] { 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A });
```

## HTTP QUERY and OPTIONS

Scenarios can now issue [HTTP QUERY](https://httpwg.org/http-extensions/draft-ietf-httpbis-safe-method-w-body.html) and OPTIONS requests, alongside the existing verbs. QUERY is a new verb option and represents a safe, idempotent request that carries a body, which suits endpoints like search with filters too large for a query string:

```csharp [SearchTests.cs]
await host.Scenario(x =>
{
    x.Query.Json(new ProductSearch(Category: "keyboards", MaxPrice: 200m)).ToUrl("/products");
});

await host.Scenario(x =>
{
    x.Options.Url("/products");
    x.StatusCodeShouldBe(HttpStatusCode.NoContent);
    x.Header("Allow").SingleValueShouldEqual("GET, QUERY, OPTIONS");
});
```

`FromHttpRequestMessage(...)` accepts every method too, including custom verbs your application routes.

## Smaller improvements

- A failure in an extension's `Start` now tears down the application Alba already started, instead of leaving an orphaned host running for the rest of the test session.
- `DisposeAsync()` completes every teardown step even when one fails, and reports the failures together.
- Exceptions from async before-each actions surface with their original stack traces.

## Docs for agents and Aspire

The docs now include a ready-made [prompt for AI coding agents](https://jasperfx.github.io/alba/guide/agents.html), along with [llms.txt](https://jasperfx.github.io/alba/llms.txt) and [llms-full.txt](https://jasperfx.github.io/alba/llms-full.txt), and a new [guide for testing with .NET Aspire](https://jasperfx.github.io/alba/guide/aspire.html) dependencies.

## Upgrading

As part of this release, support for .NET 8 & 9 has been dropped.

I'd highly recommend reading the full [v9 changelog](https://github.com/JasperFx/alba/blob/master/v9_CHANGELOG.md) to see all of our new features and breaking changes.
