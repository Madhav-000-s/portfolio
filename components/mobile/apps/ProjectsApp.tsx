"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Loader2, Star, ExternalLink } from "lucide-react"
import type { ProjectFolder } from "@/lib/github"

// Module-level cache so reopening the app doesn't refetch
let cachedProjects: ProjectFolder[] | null = null

export default function ProjectsApp() {
  const [projects, setProjects] = useState<ProjectFolder[] | null>(cachedProjects)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (cachedProjects) return
    let cancelled = false
    async function load() {
      try {
        const response = await fetch("/api/github")
        const data = await response.json()
        const pinned: ProjectFolder[] = data.pinned || []
        cachedProjects = pinned
        if (!cancelled) setProjects(pinned)
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
    return <p className="p-6 text-center text-sm text-red-400">Failed to load projects.</p>
  }

  if (projects === null) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-400 gap-2 text-sm">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading projects...
      </div>
    )
  }

  return (
    <div className="p-4 flex flex-col gap-3">
      {projects.map((project) => {
        const githubHref =
          project.htmlUrl || project.children.find((c) => c.fileType === "url")?.href
        return (
          <div
            key={project.id}
            className="rounded-xl bg-[#2b2b2b] border border-[#3d3d3d] p-4 flex flex-col gap-2"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-white text-sm font-semibold break-all">{project.name}</h3>
              {typeof project.stars === "number" && project.stars > 0 && (
                <span className="flex items-center gap-1 text-xs text-yellow-400 shrink-0">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  {project.stars}
                </span>
              )}
            </div>

            <p className="text-gray-400 text-xs leading-relaxed">{project.description}</p>

            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {project.language && (
                <span className="text-[11px] text-gray-300 bg-white/10 px-2 py-0.5 rounded-full">
                  {project.language}
                </span>
              )}
              {githubHref && (
                <a
                  href={githubHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[11px] text-white bg-white/10 px-2.5 py-1 rounded-full active:scale-95 transition-transform"
                >
                  <Image src="/icons/github.svg" alt="" width={12} height={12} className="invert" />
                  GitHub
                </a>
              )}
              {project.homepage && (
                <a
                  href={project.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[11px] text-white bg-[#0078d4] px-2.5 py-1 rounded-full active:scale-95 transition-transform"
                >
                  <ExternalLink className="w-3 h-3" />
                  Live Demo
                </a>
              )}
            </div>
          </div>
        )
      })}

      {projects.length === 0 && (
        <p className="text-center text-sm text-gray-400 py-8">No projects found.</p>
      )}
    </div>
  )
}
