import projectData from '~/data/projects.json'

export interface Project {
  section: string
  repo: string
  blurb: string | null
  logo: string | null
  docsUrl: string | null
  nuget: string | null
  description: string | null
  stars: number
  language: string | null
  archived: boolean
  createdAt: string | null
  downloads: number | null
}

export const allProjects = projectData as Project[]

export function projectName(project: Project): string {
  return project.repo.split('/')[1] ?? project.repo
}

export function projectText(project: Project): string {
  return project.blurb ?? project.description ?? ''
}

export function isNewProject(project: Project): boolean {
  if (!project.createdAt) return false
  const yearMs = 365 * 24 * 60 * 60 * 1000
  return Date.now() - new Date(project.createdAt).getTime() < yearMs
}

export function languageIcon(language: string | null): string | null {
  switch (language) {
    case 'C#':
      return 'i-simple-icons-csharp'
    case 'TypeScript':
      return 'i-simple-icons-typescript'
    default:
      return null
  }
}

export function formatCount(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`
  if (count >= 10_000) return `${Math.round(count / 1_000)}k`
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}k`
  return String(count)
}
