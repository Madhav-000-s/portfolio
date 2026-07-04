"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import gsap from "gsap"
import { socials } from "@/constants"

export type MobileAppId = "about" | "projects" | "resume" | "contact"

interface AppEntry {
  id: MobileAppId
  label: string
  icon: string
}

const apps: AppEntry[] = [
  { id: "about", label: "About Me", icon: "/images/txt.png" },
  { id: "projects", label: "Projects", icon: "/images/finder.png" },
  { id: "resume", label: "Resume", icon: "/images/pdf.png" },
  { id: "contact", label: "Contact", icon: "/images/contact.png" },
]

interface MobileAppGridProps {
  onOpen: (app: MobileAppId) => void
}

export default function MobileAppGrid({ onOpen }: MobileAppGridProps) {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!gridRef.current) return
    const icons = gridRef.current.querySelectorAll(".mobile-app-icon")
    gsap.fromTo(
      icons,
      { y: 24, opacity: 0, scale: 0.85 },
      { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "power3.out", stagger: 0.06, delay: 0.2 }
    )
  }, [])

  const iconClasses =
    "mobile-app-icon flex flex-col items-center gap-1.5 opacity-0 active:scale-90 transition-transform select-none"

  return (
    <div ref={gridRef} className="grid grid-cols-4 gap-x-3 gap-y-6 px-6">
      {apps.map((app) => (
        <button key={app.id} className={iconClasses} onClick={() => onOpen(app.id)}>
          <span className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center shadow-lg">
            <Image src={app.icon} alt={app.label} width={40} height={40} className="drop-shadow" />
          </span>
          <span className="text-white text-[11px] font-medium drop-shadow">{app.label}</span>
        </button>
      ))}

      {socials.map((social) => (
        <a
          key={social.id}
          href={social.link}
          target="_blank"
          rel="noopener noreferrer"
          className={iconClasses}
        >
          <span
            className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ backgroundColor: social.bg }}
          >
            <Image src={social.icon} alt={social.text} width={28} height={28} className="invert" />
          </span>
          <span className="text-white text-[11px] font-medium drop-shadow">{social.text}</span>
        </a>
      ))}
    </div>
  )
}
