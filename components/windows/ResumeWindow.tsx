"use client"

import { useEffect, useRef, useState, useCallback } from "react"
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

// Size constraints for resume window. Max follows the live viewport so the
// window can grow near-fullscreen and adapts if the browser is resized.
const MIN_WIDTH = 450
const MIN_HEIGHT = 350
const DEFAULT_WIDTH = 825
const getMaxSize = () => ({
  width: Math.min(1400, window.innerWidth * 0.95),
  height: window.innerHeight * 0.91,
})

export default function ResumeWindow() {
  const resumeState = useWindowStore((state) => state.windows.resume)
  const focuswindow = useWindowStore((state) => state.focuswindow)
  const windowRef = useRef<HTMLDivElement>(null)

  // Resize state (SSR-safe default; corrected to the viewport on open)
  const [dimensions, setDimensions] = useState({ width: DEFAULT_WIDTH, height: 675 })
  const isResizing = useRef(false)
  const resizeDirection = useRef("")
  const startPos = useRef({ x: 0, y: 0, width: 0, height: 0, left: 0, top: 0 })

  // Open at default width, near-full height for the current viewport
  useEffect(() => {
    if (!resumeState?.isOpen) return
    setDimensions({ width: DEFAULT_WIDTH, height: getMaxSize().height })
  }, [resumeState?.isOpen])

  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!isResizing.current || !windowRef.current) return

    const deltaX = e.clientX - startPos.current.x
    const deltaY = e.clientY - startPos.current.y
    const dir = resizeDirection.current

    let newWidth = startPos.current.width
    let newHeight = startPos.current.height
    let newLeft = startPos.current.left
    let newTop = startPos.current.top

    const max = getMaxSize()
    if (dir.includes("e")) {
      newWidth = Math.min(max.width, Math.max(MIN_WIDTH, startPos.current.width + deltaX))
    }
    if (dir.includes("w")) {
      const widthDelta = Math.min(
        startPos.current.width - MIN_WIDTH,
        Math.max(startPos.current.width - max.width, deltaX)
      )
      newWidth = startPos.current.width - widthDelta
      newLeft = startPos.current.left + widthDelta
    }
    if (dir.includes("s")) {
      newHeight = Math.min(max.height, Math.max(MIN_HEIGHT, startPos.current.height + deltaY))
    }
    if (dir.includes("n")) {
      const heightDelta = Math.min(
        startPos.current.height - MIN_HEIGHT,
        Math.max(startPos.current.height - max.height, deltaY)
      )
      newHeight = startPos.current.height - heightDelta
      newTop = startPos.current.top + heightDelta
    }

    setDimensions({ width: newWidth, height: newHeight })

    if (dir.includes("n") || dir.includes("w")) {
      gsap.set(windowRef.current, { x: newLeft, y: newTop })
    }
  }, [])

  const handleResizeEnd = useCallback(() => {
    isResizing.current = false
    resizeDirection.current = ""
    document.removeEventListener("mousemove", handleResizeMove)
    document.removeEventListener("mouseup", handleResizeEnd)
    document.body.style.cursor = ""
    document.body.style.userSelect = ""
  }, [handleResizeMove])

  const handleResizeStart = useCallback((direction: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!windowRef.current) return

    isResizing.current = true
    resizeDirection.current = direction

    const transform = gsap.getProperty(windowRef.current, "x") as number
    const transformY = gsap.getProperty(windowRef.current, "y") as number

    startPos.current = {
      x: e.clientX,
      y: e.clientY,
      width: dimensions.width,
      height: dimensions.height,
      left: transform || 0,
      top: transformY || 0,
    }

    document.addEventListener("mousemove", handleResizeMove)
    document.addEventListener("mouseup", handleResizeEnd)
    document.body.style.cursor = getComputedStyle(e.currentTarget).cursor
    document.body.style.userSelect = "none"

    focuswindow("resume")
  }, [dimensions, focuswindow, handleResizeMove, handleResizeEnd])

  useEffect(() => {
    if (!windowRef.current || !resumeState?.isOpen) return

    const draggableInstance = Draggable.create(windowRef.current, {
      type: "x,y",
      bounds: "main",
      trigger: "#resume-window #window-header",
      cursor: "move",
      onPress: () => {
        focuswindow("resume")
      },
    })

    return () => {
      draggableInstance[0]?.kill()
    }
  }, [resumeState?.isOpen, focuswindow])

  if (!resumeState?.isOpen) return null

  return (
    <div
      ref={windowRef}
      id="resume-window"
      style={{
        zIndex: resumeState.zIndex,
        width: dimensions.width,
        height: dimensions.height,
        top: "64px",
        left: "25%",
      }}
      className="absolute"
      onClick={() => focuswindow("resume")}
    >
      <div className="resize-handle resize-handle-n" onMouseDown={handleResizeStart("n")} />
      <div className="resize-handle resize-handle-s" onMouseDown={handleResizeStart("s")} />
      <div className="resize-handle resize-handle-e" onMouseDown={handleResizeStart("e")} />
      <div className="resize-handle resize-handle-w" onMouseDown={handleResizeStart("w")} />
      <div className="resize-handle resize-handle-nw" onMouseDown={handleResizeStart("nw")} />
      <div className="resize-handle resize-handle-ne" onMouseDown={handleResizeStart("ne")} />
      <div className="resize-handle resize-handle-sw" onMouseDown={handleResizeStart("sw")} />
      <div className="resize-handle resize-handle-se" onMouseDown={handleResizeStart("se")} />

      <Resume />
    </div>
  )
}
