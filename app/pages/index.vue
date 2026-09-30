<script setup lang="ts">
const major = allProjects.filter(p => p.section === 'major')
const jasperfx = allProjects.filter(p => p.section === 'jasperfx')
const utility = allProjects.filter(p => p.section === 'utility')
const utilityTs = utility.filter(p => p.language === 'TypeScript')
const utilityDotnet = utility.filter(p => p.language !== 'TypeScript')

useScrollSpy(['whoami', 'major-projects', 'jasperfx', 'utility-projects', 'dotnet', 'ts'])

defineOgImage('Terminal.takumi', {
  title: siteAuthor,
  description: siteDescription
})
</script>

<template>
  <div class="mx-auto max-w-4xl px-6">
    <SiteHero />

    <section
      aria-labelledby="major-projects"
      class="pb-16"
    >
      <SectionHeading
        heading-id="major-projects"
        label="Major projects"
      />
      <div class="grid gap-4 sm:grid-cols-2">
        <ProjectCard
          v-for="project in major"
          :key="project.repo"
          :project="project"
        />
      </div>

      <SectionSubheading
        heading-id="jasperfx"
        label="JasperFx"
        parent="major-projects"
      />
      <div class="grid gap-4 sm:grid-cols-2">
        <ProjectCard
          v-for="project in jasperfx"
          :key="project.repo"
          :project="project"
        />
      </div>
    </section>

    <section
      aria-labelledby="utility-projects"
      class="pb-20"
    >
      <SectionHeading
        heading-id="utility-projects"
        label="Utility projects"
      />
      <SectionSubheading
        heading-id="dotnet"
        label="dotnet"
        parent="utility-projects"
      />
      <ul class="border-y border-default divide-y divide-default">
        <ProjectListItem
          v-for="project in utilityDotnet"
          :key="project.repo"
          :project="project"
        />
      </ul>

      <SectionSubheading
        heading-id="ts"
        label="TS"
        parent="utility-projects"
      />
      <ul class="border-y border-default divide-y divide-default">
        <ProjectListItem
          v-for="project in utilityTs"
          :key="project.repo"
          :project="project"
        />
      </ul>
    </section>
  </div>
</template>
