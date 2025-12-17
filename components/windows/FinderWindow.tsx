"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { Draggable } from "gsap/Draggable"
import useWindowStore from "@/store/useWindowStore"
import Finder from "@/windows/finder"

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(Draggable)
}

export default function FinderWindow() {
  const finderState = useWindowStore((state) => state.windows.finder)
  const focuswindow = useWindowStore((state) => state.focuswindow)
  const windowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!windowRef.current || !finderState?.isOpen) return

    // Initialize draggable
    const draggableInstance = Draggable.create(windowRef.current, {
      type: "x,y",
      bounds: "main",
      trigger: "#window-header", // Only drag from header
      cursor: "move",
      onPress: () => {
        focuswindow("finder")
      },
    })

    return () => {
      // Cleanup
      draggableInstance[0]?.kill()
    }
  }, [finderState?.isOpen, focuswindow])

  if (!finderState?.isOpen) return null

  return (
    <div
      ref={windowRef}
      id="finder-window"
      style={{ zIndex: finderState.zIndex }}
      className="absolute"
      onClick={() => focuswindow("finder")}
    >
      <Finder />
    </div>
  )
}
