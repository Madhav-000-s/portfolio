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

  const handleMouseEnter = (index: number, e: React.MouseEvent<HTMLDivElement>) => {
    setHoveredIndex(index)
    const iconElement = e.currentTarget.querySelector(".dock-icon")
    if (iconElement) {
      gsap.to(iconElement, {
        scale: 1.5,
        y: -20,
        duration: 0.3,
        ease: "back.out(1.7)",
      })
    }
  }

  const handleMouseLeave = (_index: number, e: React.MouseEvent<HTMLDivElement>) => {
    setHoveredIndex(null)
    const iconElement = e.currentTarget.querySelector(".dock-icon")
    if (iconElement) {
      gsap.to(iconElement, {
        scale: 1,
        y: 0,
        duration: 0.3,
        ease: "power2.out",
      })
    }
  }

  return (
    <section id="dock">
      <div ref={dockRef} className="dock-container">
        {dockApps.map((app, index) => (
          <div
            key={app.id}
            className="relative"
            onMouseEnter={(e) => handleMouseEnter(index, e)}
            onMouseLeave={(e) => handleMouseLeave(index, e)}
          >
            {/* Tooltip */}
            {hoveredIndex === index && (
              <div className="tooltip absolute bottom-full left-1/2 -translate-x-1/2 mb-8 whitespace-nowrap animate-in fade-in duration-200 z-10">
                {app.name}
              </div>
            )}

            {/* Icon */}
            <div
              className="dock-icon"
              onClick={() => {
                if (!app.canOpen) return

                const windowState = windows[app.id]
                if (windowState?.isOpen) {
                  console.log("Closing window:", app.id)
                  closewindow(app.id)
                } else {
                  console.log("Opening window:", app.id)
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
          </div>
        ))}
      </div>
    </section>
  )
}

export default Dock