export interface GitHubRepo {
  id: number
  name: string
  description: string | null
  html_url: string
  homepage: string | null
  topics: string[]
  language: string | null
  stargazers_count: number
  updated_at: string
}

export interface ProjectFolder {
  id: number
  name: string
  description: string
  icon: string
  kind: "folder"
  children: ProjectFile[]
}

export interface ProjectFile {
  id: number
  name: string
  icon: string
  kind: "file"
  fileType: "txt" | "url" | "pdf" | "img" | "readme"
  href?: string
  description?: string
  repoName?: string
}

const GITHUB_USERNAME = "Madhav-000-s"

// Language to icon mapping (using existing icons or fallback)
const languageIcons: Record<string, string> = {
  TypeScript: "/icons/file.svg",
  JavaScript: "/icons/file.svg",
  Python: "/icons/file.svg",
  default: "/icons/work.svg",
}

function getLanguageIcon(language: string | null): string {
  return languageIcons[language || "default"] || languageIcons.default
}

export async function fetchGitHubRepos(): Promise<GitHubRepo[]> {
  const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN || process.env.GITHUB_TOKEN

  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(
    `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=30`,
    {
      headers,
      next: { revalidate: 3600 }, // Cache for 1 hour
    }
  )

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`)
  }

  return response.json()
}

export async function fetchReadme(repoName: string): Promise<string | null> {
  const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN || process.env.GITHUB_TOKEN

  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3.raw",
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}/readme`,
      { headers }
    )

    if (!response.ok) return null
    return response.text()
  } catch {
    return null
  }
}

export async function fetchPinnedRepoNames(): Promise<string[]> {
  const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN || process.env.GITHUB_TOKEN

  if (!token) {
    console.warn("No GitHub token found, cannot fetch pinned repos")
    return []
  }

  const query = `{
    user(login: "${GITHUB_USERNAME}") {
      pinnedItems(first: 6, types: REPOSITORY) {
        nodes {
          ... on Repository {
            name
          }
        }
      }
    }
  }`

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query }),
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      throw new Error(`GraphQL error: ${response.status}`)
    }

    const data = await response.json()
    const pinnedNodes = data?.data?.user?.pinnedItems?.nodes || []
    return pinnedNodes.map((node: { name: string }) => node.name)
  } catch (error) {
    console.error("Failed to fetch pinned repos:", error)
    return []
  }
}

export function transformReposToProjects(repos: GitHubRepo[]): ProjectFolder[] {
  return repos
    .filter((repo) => !repo.name.includes(".github")) // Filter out .github repos
    .map((repo, index) => {
      const children: ProjectFile[] = [
        {
          id: 1,
          name: "View on GitHub",
          icon: "/icons/github.svg",
          kind: "file",
          fileType: "url",
          href: repo.html_url,
        },
      ]

      // Add live demo link if homepage exists
      if (repo.homepage) {
        children.push({
          id: 2,
          name: "Live Demo",
          icon: "/icons/wifi.svg",
          kind: "file",
          fileType: "url",
          href: repo.homepage,
        })
      }

      // Add About file with description
      children.push({
        id: 3,
        name: "About",
        icon: "/icons/info.svg",
        kind: "file",
        fileType: "txt",
        description: repo.description || "No description available",
      })

      // Add README.md - fetches actual content on click
      children.push({
        id: 4,
        name: "README.md",
        icon: "/icons/file.svg",
        kind: "file",
        fileType: "readme",
        repoName: repo.name,
      })

      return {
        id: index + 1,
        name: repo.name,
        description: repo.description || "No description available",
        icon: "/icons/folder.svg",
        kind: "folder" as const,
        children,
      }
    })
}
