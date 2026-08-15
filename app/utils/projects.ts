import projectData from '~/data/projects.json'

export interface Project {
  section: string
  repo: string
  blurb: string | null
  docsUrl: string | null
  description: string | null
  stars: number
  language: string | null
  archived: boolean
}

export const allProjects = projectData as Project[]

export function projectName(project: Project): string {
  return project.repo.split('/')[1] ?? project.repo
}

export function projectText(project: Project): string {
  return project.blurb ?? project.description ?? ''
}
