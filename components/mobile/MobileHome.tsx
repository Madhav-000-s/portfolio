"use client"

import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { Monitor, X } from "lucide-react"
import gsap from "gsap"
import MobileStatusBar from "./MobileStatusBar"
import MobileAppGrid, { type MobileAppId } from "./MobileAppGrid"
import MobileAppSheet from "./MobileAppSheet"
import AboutApp from "./apps/AboutApp"
import ProjectsApp from "./apps/ProjectsApp"
import ContactApp from "./apps/ContactApp"

// Lazy-load the heavy pieces: the 3D Tux (WebGL + 1.2MB GLB) and the PDF viewer
const MobileTux = dynamic(() => import("./MobileTux"), { ssr: false })
const ResumeApp = dynamic(() => import("./apps/ResumeApp"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-40 text-gray-400 text-sm">Loading...</div>
  ),
})

const appTitles: Record<MobileAppId, string> = {
  about: "ABOUT_ME.md",
  projects: "Projects",
  resume: "Resume",
  contact: "Contact",
}

const NOTICE_KEY = "mobile-desktop-notice-dismissed"

export default function MobileHome() {
  // Only mount on actual mobile viewports — avoids a hidden WebGL canvas and
  // fetches on desktop, where this tree is display:none via md:hidden
  const [isMobile, setIsMobile] = useState(false)
  const [openApp, setOpenApp] = useState<MobileAppId | null>(null)
  const [showNotice, setShowNotice] = useState(false)
  const noticeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)")
    const update = () => setIsMobile(query.matches)
    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])

  useEffect(() => {
    if (!isMobile) return
    if (!sessionStorage.getItem(NOTICE_KEY)) {
      setShowNotice(true)
    }
  }, [isMobile])

  // Slide the notice in after the app grid entrance
  useEffect(() => {
    if (!showNotice || !noticeRef.current) return
    gsap.fromTo(
      noticeRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", delay: 1 }
    )
  }, [showNotice])

  const dismissNotice = () => {
    sessionStorage.setItem(NOTICE_KEY, "1")
    if (noticeRef.current) {
      gsap.to(noticeRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => setShowNotice(false),
      })
    } else {
      setShowNotice(false)
    }
  }

  if (!isMobile) return null

  return (
    <div
      className="relative flex flex-col h-dvh w-full overflow-hidden"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <MobileStatusBar />

      <div className="flex flex-col items-center pt-2 pb-1">
        <MobileTux />
        <div className="text-center -mt-2 mb-5 px-6">
          <h1 className="text-white text-xl font-bold drop-shadow">Madhavendranath</h1>
          <p className="text-gray-300 text-xs mt-0.5">Full-Stack Developer & ML Engineer</p>
        </div>
      </div>

      <MobileAppGrid onOpen={setOpenApp} />

      {showNotice && (
        <div
          ref={noticeRef}
          className="absolute bottom-6 left-4 right-4 opacity-0 flex items-center gap-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 px-4 py-3"
        >
          <Monitor className="w-5 h-5 text-yellow-400 shrink-0" />
          <p className="text-gray-200 text-xs leading-snug flex-1">
            This site is best experienced on a desktop — the full interactive OS awaits on a bigger
            screen.
          </p>
          <button
            onClick={dismissNotice}
            aria-label="Dismiss"
            className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-gray-300 shrink-0 active:scale-90 transition-transform"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {openApp && (
        <MobileAppSheet title={appTitles[openApp]} onClose={() => setOpenApp(null)}>
          {openApp === "about" && <AboutApp />}
          {openApp === "projects" && <ProjectsApp />}
          {openApp === "resume" && <ResumeApp />}
          {openApp === "contact" && <ContactApp />}
        </MobileAppSheet>
      )}
    </div>
  )
}
