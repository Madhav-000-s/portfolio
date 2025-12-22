"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import Navbar from "./Navbar"

interface WelcomeTransitionProps {
  username: string | null
  onComplete: () => void
}

export default function WelcomeTransition({
  username,
  onComplete,
}: WelcomeTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const navbarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline()

    // Fade in navbar preview
    tl.fromTo(
      navbarRef.current,
      { opacity: 0 },
      { opacity: 0.6, duration: 0.3, ease: "power2.out" },
      0
    )

    // Fade in text
    tl.fromTo(
      textRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
      0
    )

    // Hold for 0.9s (total 1.5s = 0.3s in + 0.9s hold + 0.3s out)
    tl.to({}, { duration: 0.9 })

    // Fade out entire container
    tl.to(containerRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.inOut",
      onComplete,
    })
  }, [onComplete])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9997]"
    >
      {/* Navbar preview at top - shows through during transition */}
      <div ref={navbarRef} className="opacity-0">
        <Navbar />
      </div>

      {/* Dark overlay with welcome text */}
      <div className="absolute inset-0 bg-black/90 flex items-center justify-center">
        <span
          ref={textRef}
          className="text-white text-2xl sm:text-3xl md:text-4xl font-light tracking-wide opacity-0"
          style={{ fontFamily: "var(--font-geist-sans)" }}
        >
          Welcome, {username}
        </span>
      </div>
    </div>
  )
}
