import { NextResponse } from "next/server"
import {
  fetchGitHubRepos,
  fetchPinnedRepoNames,
  transformReposToProjects,
} from "@/lib/github"

export async function GET() {
  try {
    // Fetch all repos and pinned repo names in parallel
    const [repos, pinnedNames] = await Promise.all([
      fetchGitHubRepos(),
      fetchPinnedRepoNames(),
    ])

    // Create a Set for faster lookup
    const pinnedSet = new Set(pinnedNames)

    // Split repos into pinned and archived, preserving GitHub profile pin order
    const pinnedRepos = repos
      .filter((repo) => pinnedSet.has(repo.name))
      .sort((a, b) => pinnedNames.indexOf(a.name) - pinnedNames.indexOf(b.name))
    const archivedRepos = repos.filter((repo) => !pinnedSet.has(repo.name))

    // Transform both to project folders
    const pinned = transformReposToProjects(pinnedRepos)
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
