"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { Draggable } from "gsap/Draggable"
import useWindowStore from "@/store/useWindowStore"
import Terminal from "@/windows/terminal"

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(Draggable)
}

export default function TerminalWindow() {
  const terminalState = useWindowStore((state) => state.windows.terminal)
  const focuswindow = useWindowStore((state) => state.focuswindow)
  const windowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!windowRef.current || !terminalState?.isOpen) return

    // Initialize draggable
    const draggableInstance = Draggable.create(windowRef.current, {
      type: "x,y",
      bounds: "main",
      trigger: "#window-header", // Only drag from header
      cursor: "move",
      onPress: () => {
        focuswindow("terminal")
      },
    })

    return () => {
      // Cleanup
      draggableInstance[0]?.kill()
    }
  }, [terminalState?.isOpen, focuswindow])

  if (!terminalState?.isOpen) return null

  return (
    <div
      ref={windowRef}
      id="terminal-window"
      style={{ zIndex: terminalState.zIndex }}
      className="absolute"
      onClick={() => focuswindow("terminal")}
    >
      <Terminal />
    </div>
  )
}
