"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import MarkdownContent from "@/components/MarkdownContent"
import { GITHUB_USERNAME } from "@/constants"

export default function AboutApp() {
  const [content, setContent] = useState<string | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const response = await fetch(`/api/readme?repo=${GITHUB_USERNAME}`)
        const data = await response.json()
        if (!cancelled) setContent(data.content || null)
        if (!cancelled && !data.content) setError(true)
      } catch {
        if (!cancelled) setError(true)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  if (error) {
    return (
      <p className="p-6 text-center text-sm text-red-400">
        Failed to load. Check my profile directly at{" "}
        <a href={`https://github.com/${GITHUB_USERNAME}`} className="underline">
          github.com/{GITHUB_USERNAME}
        </a>
      </p>
    )
  }

  if (content === null) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-400 gap-2 text-sm">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading...
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="markdown-body">
        <MarkdownContent content={content} repoName={GITHUB_USERNAME} />
      </div>
    </div>
  )
}
