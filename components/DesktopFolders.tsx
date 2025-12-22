"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import gsap from "gsap"
import { Draggable } from "gsap/Draggable"
import useWindowStore from "@/store/useWindowStore"

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(Draggable)
}

const STORAGE_KEY = "desktop-folder-positions"

const folders = [
  {
    id: "resume",
    name: "Resume",
    windowKey: "resume",
    data: null,
  },
  {
    id: "projects",
    name: "Projects",
    windowKey: "finder",
    data: { location: "work" },
  },
  {
    id: "about",
    name: "About Me",
    windowKey: "finder",
    data: { location: "about" },
  },
]

// Default positions for folders (in pixels from top-left)
const defaultPositions: Record<string, { x: number; y: number }> = {
  resume: { x: 30, y: 80 },
  projects: { x: 30, y: 200 },
  about: { x: 30, y: 320 },
}

export default function DesktopFolders() {
  const openwindow = useWindowStore((state) => state.openwindow)
  const folderRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const [isClient, setIsClient] = useState(false)
  const draggablesRef = useRef<Draggable[]>([])

  // Load saved positions from localStorage
  const getSavedPositions = (): Record<string, { x: number; y: number }> => {
    if (typeof window === "undefined") return defaultPositions
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        return { ...defaultPositions, ...JSON.parse(saved) }
      }
    } catch (e) {
      console.error("Failed to load folder positions:", e)
    }
    return defaultPositions
  }

  // Save positions to localStorage
  const savePositions = (positions: Record<string, { x: number; y: number }>) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(positions))
    } catch (e) {
      console.error("Failed to save folder positions:", e)
    }
  }

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    const positions = getSavedPositions()

    // Initialize positions and create draggables
    folders.forEach((folder) => {
      const el = folderRefs.current[folder.id]
      if (!el) return

      // Set initial position
      const pos = positions[folder.id] || defaultPositions[folder.id]
      gsap.set(el, { x: pos.x, y: pos.y })

      // Create draggable
      const draggable = Draggable.create(el, {
        type: "x,y",
        bounds: "main",
        cursor: "grab",
        activeCursor: "grabbing",
        onDragEnd: function () {
          // Save new position
          const currentPositions = getSavedPositions()
          currentPositions[folder.id] = { x: this.x, y: this.y }
          savePositions(currentPositions)
        },
      })[0]

      draggablesRef.current.push(draggable)
    })

    return () => {
      draggablesRef.current.forEach((d) => d.kill())
      draggablesRef.current = []
    }
  }, [isClient])

  const handleDoubleClick = (folder: (typeof folders)[0]) => {
    openwindow(folder.windowKey, folder.data)
  }

  if (!isClient) return null

  return (
    <>
      {folders.map((folder) => (
        <div
          key={folder.id}
          ref={(el) => {
            folderRefs.current[folder.id] = el
          }}
          className="absolute flex flex-col items-center gap-1 cursor-grab group select-none z-10"
          style={{ top: 0, left: 0 }}
          onDoubleClick={() => handleDoubleClick(folder)}
        >
          <div className="p-2 rounded-lg transition-all duration-150 group-hover:bg-white/10 group-active:bg-white/20">
            <Image
              src="/icons/folder.svg"
              alt={folder.name}
              width={64}
              height={64}
              className="drop-shadow-lg pointer-events-none"
              draggable={false}
            />
          </div>
          <span className="text-white text-xs font-medium px-1 py-0.5 rounded bg-black/30 backdrop-blur-sm pointer-events-none">
            {folder.name}
          </span>
        </div>
      ))}
    </>
  )
}
