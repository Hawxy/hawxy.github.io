// Refreshes the fetched fields in app/data/projects.json from the GitHub API.
// On any per-repo failure the committed snapshot values are kept, so the build never breaks.
import { readFile, writeFile } from 'node:fs/promises'

const file = new URL('../app/data/projects.json', import.meta.url)
const projects = JSON.parse(await readFile(file, 'utf8'))

const headers = {
  'Accept': 'application/vnd.github+json',
  'User-Agent': 'hawxy.github.io build',
  ...(process.env.GITHUB_TOKEN && { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` })
}

for (const project of projects) {
  try {
    const res = await fetch(`https://api.github.com/repos/${project.repo}`, { headers })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const repo = await res.json()
    Object.assign(project, {
      description: repo.description,
      stars: repo.stargazers_count,
      language: repo.language,
      archived: repo.archived,
      createdAt: repo.created_at
    })
    console.log(`[fetch-projects] ${project.repo}: ${project.stars} stars`)
  } catch (error) {
    console.warn(`[fetch-projects] ${project.repo}: ${error.message}, keeping snapshot values`)
  }

  if (!project.nuget) continue
  try {
    const res = await fetch(`https://azuresearch-usnc.nuget.org/query?q=packageid:${project.nuget}&prerelease=true`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const result = await res.json()
    if (result.totalHits === 0) throw new Error('package not found')
    project.downloads = result.data[0].totalDownloads
    console.log(`[fetch-projects] ${project.nuget}: ${project.downloads} downloads`)
  } catch (error) {
    console.warn(`[fetch-projects] ${project.nuget}: ${error.message}, keeping snapshot values`)
  }
}

await writeFile(file, JSON.stringify(projects, null, 2) + '\n')
