"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { dockApps } from "@/constants"
import gsap from "gsap"
import useWindowStore from "@/store/useWindowStore"

const Dock = () => {
  const dockRef = useRef<HTMLDivElement>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const openwindow = useWindowStore((state) => state.openwindow)
  const closewindow = useWindowStore((state) => state.closewindow)
  const windows = useWindowStore((state) => state.windows)

  const animateIcons = (hoveredIdx: number | null) => {
    if (!dockRef.current) return

    const icons = dockRef.current.querySelectorAll(".dock-icon")

    icons.forEach((icon, i) => {
      if (hoveredIdx === null) {
        // Reset all icons
        gsap.to(icon, {
          scale: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        })
      } else {
        // Calculate distance from hovered icon
        const distance = Math.abs(hoveredIdx - i)

        let scale = 1
        let y = 0

        if (distance === 0) {
          scale = 1.4
          y = -16
        } else if (distance === 1) {
          scale = 1.2
          y = -8
        } else if (distance === 2) {
          scale = 1.1
          y = -4
        }

        gsap.to(icon, {
          scale,
          y,
          duration: 0.2,
          ease: "power2.out",
        })
      }
    })
  }

  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index)
    animateIcons(index)
  }

  const handleMouseLeave = () => {
    setHoveredIndex(null)
    animateIcons(null)
  }

  return (
    <section id="dock" onMouseLeave={handleMouseLeave}>
      <div ref={dockRef} className="dock-container">
        {dockApps.map((app, index) => (
          <div
            key={app.id}
            className="relative"
            onMouseEnter={() => handleMouseEnter(index)}
          >
            {/* Tooltip */}
            {hoveredIndex === index && (
              <div className="tooltip absolute bottom-full left-1/2 -translate-x-1/2 mb-3 whitespace-nowrap animate-in fade-in duration-200 z-10">
                {app.name}
              </div>
            )}

            {/* Icon */}
            <div
              className="dock-icon"
              onClick={() => {
                if (!app.canOpen) return

                // Special handling for Archive - opens Finder at Archive location
                if (app.id === "trash") {
                  const finderState = windows["finder"]
                  if (finderState?.isOpen) {
                    // If Finder is open, just update its data to navigate to Archive
                    openwindow("finder", { location: "trash" })
                  } else {
                    // Open Finder with Archive location
                    openwindow("finder", { location: "trash" })
                  }
                  return
                }

                const windowState = windows[app.id]
                if (windowState?.isOpen) {
                  closewindow(app.id)
                } else {
                  openwindow(app.id)
                }
              }}
            >
              <Image
                src={`/images/${app.icon}`}
                alt={app.name}
                width={80}
                height={80}
                className="w-full h-full"
              />
            </div>

            {/* Active indicator dot */}
            {windows[app.id]?.isOpen && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#0078d4] rounded-full" />
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

export default Dock
