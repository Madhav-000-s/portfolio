import { NextResponse } from "next/server"
import { fetchReadme } from "@/lib/github"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const repoName = searchParams.get("repo")

  if (!repoName) {
    return NextResponse.json(
      { error: "Missing repo parameter" },
      { status: 400 }
    )
  }

  try {
    const content = await fetchReadme(repoName)

    if (!content) {
      return NextResponse.json(
        { content: "README not found for this repository." }
      )
    }

    return NextResponse.json({ content })
  } catch (error) {
    console.error("Failed to fetch README:", error)
    return NextResponse.json(
      { error: "Failed to fetch README", content: "Error loading README." },
      { status: 500 }
    )
  }
}
