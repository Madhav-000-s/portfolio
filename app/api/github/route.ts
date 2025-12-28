import { NextResponse } from "next/server"
import {
  fetchGitHubRepos,
  fetchPinnedRepoNames,
  transformReposToProjects,
} from "@/lib/github"
import { FEATURED_PROJECTS } from "@/constants"

export async function GET() {
  try {
    // Fetch all repos and pinned repo names in parallel
    const [repos, pinnedNames] = await Promise.all([
      fetchGitHubRepos(),
      fetchPinnedRepoNames(),
    ])

    // Merge pinned repos with manually featured projects
    const featuredSet = new Set([...pinnedNames, ...FEATURED_PROJECTS])

    // Split repos into featured and archived, preserving order (pinned first, then featured)
    const featuredRepos = repos
      .filter((repo) => featuredSet.has(repo.name))
      .sort((a, b) => {
        // Pinned repos come first (in their original order), then featured projects
        const aIndex = pinnedNames.indexOf(a.name)
        const bIndex = pinnedNames.indexOf(b.name)
        if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
        if (aIndex !== -1) return -1
        if (bIndex !== -1) return 1
        return 0
      })
    const archivedRepos = repos.filter((repo) => !featuredSet.has(repo.name))

    // Transform both to project folders
    const pinned = transformReposToProjects(featuredRepos)
    const archived = transformReposToProjects(archivedRepos)

    return NextResponse.json({ pinned, archived })
  } catch (error) {
    console.error("GitHub API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch projects", pinned: [], archived: [] },
      { status: 500 }
    )
  }
}
