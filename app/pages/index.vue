<script setup lang="ts">
const major = allProjects.filter(p => p.section === 'major')
const jasperfx = allProjects.filter(p => p.section === 'jasperfx')
const utility = allProjects.filter(p => p.section === 'utility')

const activeSection = useActiveSection()
const sectionIds = ['whoami', 'major-projects', 'jasperfx', 'utility-projects']

function updateActiveSection() {
  const headerHeight = document.querySelector('header')?.getBoundingClientRect().height ?? 56
  let active: string | null = null
  for (const id of sectionIds) {
    const heading = document.getElementById(id)
    if (heading && heading.getBoundingClientRect().top <= headerHeight) {
      active = id
    }
  }
  activeSection.value = active
}

onMounted(() => {
  window.addEventListener('scroll', updateActiveSection, { passive: true })
  updateActiveSection()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateActiveSection)
  activeSection.value = null
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
