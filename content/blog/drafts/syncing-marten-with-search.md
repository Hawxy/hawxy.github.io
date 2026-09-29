---
title: Keeping a search index in sync with Marten
description: Five ways to push Marten documents into your search engine.
date: 2026-09-29
tags: [marten, postgres, search, dotnet]
---

Marten is great at storing documents, but sooner or later someone wants full-text search with typo tolerance or faceting, and you reach for a dedicated engine like Meilisearch, Elasticsearch or OpenSearch. Querying the index is easy, but ensuring your index is kept up to date is now.

This post walks through five ways to do that, with the pros and cons laid out. Every example indexes the same `Order` document into a Meilisearch `orders` index, enriched with the customer's name:

```csharp [Documents.cs]
public class Order
{
    public Guid Id { get; set; }
    public string Number { get; set; } = "";
    public Guid CustomerId { get; set; }
    public decimal Total { get; set; }
}

public class Customer
{
    public Guid Id { get; set; }
    public string Name { get; set; } = "";
}

public record OrderSearchDocument(string Id, string Number, decimal Total, string? Customer)
{
    public static OrderSearchDocument From(Order order, Customer? customer) =>
        new(order.Id.ToString(), order.Number, order.Total, customer?.Name);
}
```

## Inline Calls

The first thing everyone considers: save the document, then call the search engine straight after. Incredibly simple, but not a realistic option.

```csharp [PlaceOrderHandler.cs]
public class PlaceOrderHandler(IDocumentSession session, MeilisearchClient meili)
{
    public async Task Handle(PlaceOrder command, CancellationToken ct)
    {
        var order = new Order
        {
            Id = Guid.CreateVersion7(),
            Number = command.Number,
            CustomerId = command.CustomerId,
            Total = command.Total
        };

        session.Store(order);
        await session.SaveChangesAsync(ct);

        // Committed. If anything below throws, the index is stale.
        var customer = await session.LoadAsync<Customer>(order.CustomerId, ct);
        await meili.Index("orders").AddDocumentsAsync(
            [OrderSearchDocument.From(order, customer)], cancellationToken: ct);
    }
}
```

::pros-cons
#pros
- No new infrastructure or moving parts
- Easy to read and debug, the indexing sits right next to the write
- The index is updated before the response returns
#cons
- A dual write: the commit and the index can succeed or fail, so the index silently drifts
- Every write path has to follow this pattern, including updates, deletes and admin scripts
- Search latency and availability are now part of your request path
- No way to rebuild or backfill the index without writing a separate tool
::

## Marten Session Listeners

Marten lets you hook into every session's unit of work with an `IDocumentSessionListener`. `AfterCommitAsync` receives the change set, so indexing moves out of the handlers and into one place.

```csharp [OrderSearchListener.cs]
public class OrderSearchListener(MeilisearchClient meili) : DocumentSessionListenerBase
{
    public override async Task AfterCommitAsync(
        IDocumentSession session, IChangeSet commit, CancellationToken token)
    {
        var index = meili.Index("orders");

        var orders = commit.Inserted.Concat(commit.Updated).OfType<Order>().ToList();
        if (orders.Count > 0)
        {
            var customerIds = orders.Select(o => o.CustomerId).Distinct();
            var customers = (await session.LoadManyAsync<Customer>(token, customerIds))
                .ToDictionary(c => c.Id);

            await index.AddDocumentsAsync(
                orders.Select(o => OrderSearchDocument.From(o, customers.GetValueOrDefault(o.CustomerId))),
                cancellationToken: token);
        }

        var deleted = commit.Deleted
            .Where(d => d.DocumentType == typeof(Order) && d.Id is not null)
            .Select(d => d.Id.ToString()!)
            .ToList();
        if (deleted.Count > 0)
            await index.DeleteDocumentsAsync(deleted, token);
    }
}
```

The listener is registered on the store options, so it's built once alongside the store:

```csharp [Program.cs]
builder.Services.AddSingleton(new MeilisearchClient(meiliUrl, meiliKey));
builder.Services.AddMarten(sp =>
{
    var options = new StoreOptions();
    options.Connection(connectionString);
    options.Listeners.Add(new OrderSearchListener(sp.GetRequiredService<MeilisearchClient>()));
    return options;
});
```

::pros-cons
#pros
- One place to maintain, every session is covered automatically
- Handlers go back to only caring about the domain
- Still no new infrastructure
#cons
- Still a dual write: the listener runs after the commit, so a failed index call is lost
- Only sees work done through a session's unit of work, so bulk inserts, patches and raw SQL slip past
- Runs inline with `SaveChangesAsync`, adding latency to every write
- Still no backfill story
::

## Event Sourcing with Subscriptions

If the data is event sourced, Marten's async daemon can feed events to a subscription. Events and the subscription's progress both live in Postgres, so the daemon can retry failed batches and resumes from its last checkpoint.

```csharp [OrderSearchSubscription.cs]
public record OrderPlaced(Guid OrderId, string Number, Guid CustomerId, decimal Total);
public record OrderCancelled(Guid OrderId);

public class OrderSearchSubscription : SubscriptionBase
{
    private readonly MeilisearchClient _meili;

    public OrderSearchSubscription(MeilisearchClient meili)
    {
        _meili = meili;
        Name = "order-search";
        IncludeType<OrderPlaced>();
        IncludeType<OrderCancelled>();
    }

    public override async Task<IChangeListener> ProcessEventsAsync(
        EventRange page, ISubscriptionController controller,
        IDocumentOperations operations, CancellationToken cancellationToken)
    {
        var index = _meili.Index("orders");

        var placed = page.Events.Select(e => e.Data).OfType<OrderPlaced>().ToList();
        if (placed.Count > 0)
        {
            var customerIds = placed.Select(p => p.CustomerId).Distinct();
            var customers = (await operations.LoadManyAsync<Customer>(cancellationToken, customerIds))
                .ToDictionary(c => c.Id);

            await index.AddDocumentsAsync(
                placed.Select(p => new OrderSearchDocument(
                    p.OrderId.ToString(), p.Number, p.Total,
                    customers.GetValueOrDefault(p.CustomerId)?.Name)),
                cancellationToken: cancellationToken);
        }

        var cancelled = page.Events.Select(e => e.Data).OfType<OrderCancelled>()
            .Select(c => c.OrderId.ToString())
            .ToList();
        if (cancelled.Count > 0)
            await index.DeleteDocumentsAsync(cancelled, cancellationToken);

        return NullChangeListener.Instance;
    }
}
```

```csharp [Program.cs]
builder.Services.AddSingleton(new MeilisearchClient(meiliUrl, meiliKey));
builder.Services.AddMarten(options => options.Connection(connectionString))
    .AddSubscriptionWithServices<OrderSearchSubscription>(ServiceLifetime.Singleton)
    .AddAsyncDaemon(DaemonMode.HotCold);
```

::pros-cons
#pros
- No dual write: events are the source of truth and delivery is at-least-once
- Rewinding the subscription replays history, which doubles as a backfill
- Indexing happens in batches, off the request path
- Events carry intent, so the same stream can drive notifications and integrations too
#cons
- Only an option if the data is already event sourced
- Every event that affects the index needs to be accounted for
- Enrichment across stream boundries might be complex or non-performant
::

## Bonus: Wolverine

If you're already deep in the Critter stack, you might be using Wolverine which allows for indexing to be driven by handler events. [Wolverine](https://wolverinefx.net)'s Marten integration includes a transactional outbox to take care of persistence. A handler returns a message, and Wolverine stores it in the same Postgres transaction as the document.

```csharp [PlaceOrderHandler.cs]
public record SyncOrderToSearch(Guid OrderId);

public static class PlaceOrderHandler
{
    // Returned messages go into the outbox, in the same transaction as the order
    public static SyncOrderToSearch Handle(PlaceOrder command, IDocumentSession session)
    {
        var order = new Order
        {
            Id = Guid.CreateVersion7(),
            Number = command.Number,
            CustomerId = command.CustomerId,
            Total = command.Total
        };

        session.Store(order);
        return new SyncOrderToSearch(order.Id);
    }
}
```

```csharp [SyncOrderToSearchHandler.cs]
public static class SyncOrderToSearchHandler
{
    public static async Task Handle(
        SyncOrderToSearch message, IQuerySession session, MeilisearchClient meili, CancellationToken ct)
    {
        var index = meili.Index("orders");

        var order = await session.LoadAsync<Order>(message.OrderId, ct);
        if (order is null)
        {
            await index.DeleteOneDocumentAsync(message.OrderId.ToString(), ct);
            return;
        }

        var customer = await session.LoadAsync<Customer>(order.CustomerId, ct);
        await index.AddDocumentsAsync([OrderSearchDocument.From(order, customer)], cancellationToken: ct);
    }
}
```

Durable local queues keep the message in Postgres until the handler succeeds, and an error policy retries if the search engine is unavailable:

```csharp [Program.cs]
builder.Services.AddSingleton(new MeilisearchClient(meiliUrl, meiliKey));
builder.Services.AddMarten(options => options.Connection(connectionString))
    .IntegrateWithWolverine();

builder.UseWolverine(opts =>
{
    opts.Policies.AutoApplyTransactions();
    opts.Policies.UseDurableLocalQueues();
    opts.OnException<MeilisearchCommunicationError>()
        .RetryWithCooldown(100.Milliseconds(), 1.Seconds(), 5.Seconds());
});
```

::pros-cons
#pros
- No dual write: the message commits or rolls back with the document
- Retries and error policies come built in, and indexing moves off the request path
- Loading the latest document makes every message idempotent
- The same outbox can drive notifications and integrations too
#cons
- Every write path has to ensure it sends the message
- Bulk inserts, patches and raw SQL bypass it, just like the listener
- No built-in backfill, so reindexing means sending a message per document yourself
::

## Change Data Capture with Wallaby

::note
Full disclosure: I wrote [Wallaby](https://wallabycdc.net), so weigh this section accordingly.
::

The last option skips the application entirely. Postgres already records every committed change in its write-ahead log, and logical replication streams it to anyone listening. Wallaby reads that stream, rehydrates Marten's JSONB back into your document type and hands batches of changes to a transform.

```csharp [OrderSearchTransform.cs]
public sealed class OrderSearchTransform : IWallabyMartenTransform<Order>
{
    public async Task<IReadOnlyDictionary<DocumentKey, WallabyDocument?>> TransformAsync(
        IQuerySession session, IReadOnlyList<ChangeEvent<Order>> changes, CancellationToken ct)
    {
        var customerIds = changes.Select(c => c.Entity!.CustomerId).Distinct();
        var customers = (await session.LoadManyAsync<Customer>(ct, customerIds))
            .ToDictionary(c => c.Id);

        var documents = new Dictionary<DocumentKey, WallabyDocument?>(changes.Count);
        foreach (var change in changes)
        {
            var order = change.Entity!;
            documents[change.Key] = new WallabyDocument
            {
                ["number"] = order.Number,
                ["total"] = order.Total,
                ["customer"] = customers.GetValueOrDefault(order.CustomerId)?.Name
            };
        }
        return documents;
    }
}
```

```csharp [Program.cs]
builder.Services.AddMarten(options =>
{
    options.Connection(connectionString);
    options.RegisterDocumentType<Order>();
    options.RegisterDocumentType<Customer>();
});

builder.Services.AddWallaby(cdc =>
{
    cdc.UseMarten()
       .UseConnectionString(connectionString)
       .AddMeilisearchSink("meili", m =>
       {
           m.Endpoint = meiliUrl;
           m.ApiKey = meiliKey;
       })
       .WithMappings(sink => sink
           .Map<Order>()
           .ToDestination("orders")
           .WithBackfillVersion("v1")
           .UsingTransform<Order, OrderSearchTransform>());
});
```

Deletes come through as delete events, so there's no separate code path for them. Bumping the backfill version reindexes every existing order through the same transform.

::pros-cons
#pros
- Captures every committed write, including bulk inserts, patches, raw SQL and other services
- No dual write: changes arrive in commit order with at-least-once delivery
- Backfills run through the same pipeline as live changes
- Works on plain documents, no event sourcing required
#cons
- Needs logical replication enabled (`wal_level = logical`).
- WAL consumes resources and requires monitoring
::

## Which one should you use?

| | Inline | Listener | Subscription | Wolverine | Wallaby |
| --- | --- | --- | --- | --- | --- |
| Survives a failed index call | No | No | Yes | Yes | Yes |
| Catches every write path | No | No | Events only | No | Yes |
| Built-in backfill | No | No | Replay | No | Yes |
| Requires event sourcing | No | No | Yes | No | No |
| Extra infrastructure | None | None | Async daemon | Wolverine | Replication slot |

If your data is already event sourced, then a subscription within the async daemon for one or two indexes makes a lot of sense. 
For Marten documents or more complex scenarios then Wallaby is likely the most robust solution for your requirements.
