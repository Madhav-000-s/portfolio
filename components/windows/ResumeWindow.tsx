"use client"

import { useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import gsap from "gsap"
import { Draggable } from "gsap/Draggable"
import useWindowStore from "@/store/useWindowStore"

// Dynamically import Resume component with no SSR to avoid DOMMatrix error
const Resume = dynamic(() => import("@/windows/resume"), {
  ssr: false,
  loading: () => (
    <div id="resume">
      <div id="window-header">
        <div id="window-controls">
          <div className="close" />
          <div className="minimize" />
          <div className="maximize" />
        </div>
        <h2>Resume</h2>
        <div className="w-16" />
      </div>
      <div className="flex items-center justify-center h-96 text-gray-500">
        Loading...
      </div>
    </div>
  ),
})

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(Draggable)
}

export default function ResumeWindow() {
  const resumeState = useWindowStore((state) => state.windows.resume)
  const focuswindow = useWindowStore((state) => state.focuswindow)
  const windowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!windowRef.current || !resumeState?.isOpen) return

    // Initialize draggable
    const draggableInstance = Draggable.create(windowRef.current, {
      type: "x,y",
      bounds: "main",
      trigger: "#window-header", // Only drag from header
      cursor: "move",
      onPress: () => {
        focuswindow("resume")
      },
    })

    return () => {
      // Cleanup
      draggableInstance[0]?.kill()
    }
  }, [resumeState?.isOpen, focuswindow])

  if (!resumeState?.isOpen) return null

  return (
    <div
      ref={windowRef}
      id="resume-window"
      style={{ zIndex: resumeState.zIndex }}
      className="absolute"
      onClick={() => focuswindow("resume")}
    >
      <Resume />
    </div>
  )
}
