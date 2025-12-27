"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import gsap from "gsap"
import { Draggable } from "gsap/Draggable"
import useWindowStore from "@/store/useWindowStore"
import Finder from "@/windows/finder"

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(Draggable)
}

// Size constraints for finder window
const MIN_WIDTH = 675
const MAX_WIDTH = 1200
const MIN_HEIGHT = 400
const DEFAULT_MAX_HEIGHT = 800

export default function FinderWindow() {
  const finderState = useWindowStore((state) => state.windows.finder)
  const focuswindow = useWindowStore((state) => state.focuswindow)
  const windowRef = useRef<HTMLDivElement>(null)

  // Resize state
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 })
  const [maxHeight, setMaxHeight] = useState(DEFAULT_MAX_HEIGHT)

  // Calculate max height on client side
  useEffect(() => {
    setMaxHeight(window.innerHeight * 0.85)
  }, [])
  const isResizing = useRef(false)
  const resizeDirection = useRef("")
  const startPos = useRef({ x: 0, y: 0, width: 0, height: 0, left: 0, top: 0 })

  // Handle resize move
  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!isResizing.current || !windowRef.current) return

    const deltaX = e.clientX - startPos.current.x
    const deltaY = e.clientY - startPos.current.y
    const dir = resizeDirection.current

    let newWidth = startPos.current.width
    let newHeight = startPos.current.height
    let newLeft = startPos.current.left
    let newTop = startPos.current.top

    // Calculate new dimensions based on direction
    if (dir.includes("e")) {
      newWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startPos.current.width + deltaX))
    }
    if (dir.includes("w")) {
      const widthDelta = Math.min(
        startPos.current.width - MIN_WIDTH,
        Math.max(startPos.current.width - MAX_WIDTH, deltaX)
      )
      newWidth = startPos.current.width - widthDelta
      newLeft = startPos.current.left + widthDelta
    }
    if (dir.includes("s")) {
      newHeight = Math.min(maxHeight, Math.max(MIN_HEIGHT, startPos.current.height + deltaY))
    }
    if (dir.includes("n")) {
      const heightDelta = Math.min(
        startPos.current.height - MIN_HEIGHT,
        Math.max(startPos.current.height - maxHeight, deltaY)
      )
      newHeight = startPos.current.height - heightDelta
      newTop = startPos.current.top + heightDelta
    }

    // Apply new dimensions
    setDimensions({ width: newWidth, height: newHeight })

    // Update position for n/w resizing using GSAP
    if (dir.includes("n") || dir.includes("w")) {
      gsap.set(windowRef.current, { x: newLeft, y: newTop })
    }
  }, [maxHeight])

  // Handle resize end
  const handleResizeEnd = useCallback(() => {
    isResizing.current = false
    resizeDirection.current = ""
    document.removeEventListener("mousemove", handleResizeMove)
    document.removeEventListener("mouseup", handleResizeEnd)
    document.body.style.cursor = ""
    document.body.style.userSelect = ""
  }, [handleResizeMove])

  // Handle resize start
  const handleResizeStart = useCallback((direction: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!windowRef.current) return

    isResizing.current = true
    resizeDirection.current = direction

    const rect = windowRef.current.getBoundingClientRect()
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

    focuswindow("finder")
  }, [dimensions, focuswindow, handleResizeMove, handleResizeEnd])

  useEffect(() => {
    if (!windowRef.current || !finderState?.isOpen) return

    // Initialize draggable
    const draggableInstance = Draggable.create(windowRef.current, {
      type: "x,y",
      bounds: "main",
      trigger: "#window-header",
      cursor: "move",
      onPress: () => {
        focuswindow("finder")
      },
    })

    return () => {
      draggableInstance[0]?.kill()
    }
  }, [finderState?.isOpen, focuswindow])

  if (!finderState?.isOpen) return null

  return (
    <div
      ref={windowRef}
      id="finder-window"
      style={{
        zIndex: finderState.zIndex,
        width: dimensions.width,
        height: dimensions.height,
        top: "80px",
        left: "25%",
      }}
      className="absolute"
      onClick={() => focuswindow("finder")}
    >
      {/* Resize handles */}
      <div className="resize-handle resize-handle-n" onMouseDown={handleResizeStart("n")} />
      <div className="resize-handle resize-handle-s" onMouseDown={handleResizeStart("s")} />
      <div className="resize-handle resize-handle-e" onMouseDown={handleResizeStart("e")} />
      <div className="resize-handle resize-handle-w" onMouseDown={handleResizeStart("w")} />
      <div className="resize-handle resize-handle-nw" onMouseDown={handleResizeStart("nw")} />
      <div className="resize-handle resize-handle-ne" onMouseDown={handleResizeStart("ne")} />
      <div className="resize-handle resize-handle-sw" onMouseDown={handleResizeStart("sw")} />
      <div className="resize-handle resize-handle-se" onMouseDown={handleResizeStart("se")} />

      <Finder />
    </div>
  )
}
