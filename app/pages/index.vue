<script setup lang="ts">
const major = allProjects.filter(p => p.section === 'major')
const utility = allProjects.filter(p => p.section === 'utility')
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
    </section>

    <section
      aria-labelledby="utility-projects"
      class="pb-20"
    >
      <SectionHeading
        heading-id="utility-projects"
        label="Utility projects"
      />
      <ul class="border-y border-default divide-y divide-default">
        <ProjectListItem
          v-for="project in utility"
          :key="project.repo"
          :project="project"
        />
      </ul>
    </section>
  </div>
</template>
