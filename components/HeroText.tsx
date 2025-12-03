"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"

export default function HeroText() {
  const textRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isNearRef = useRef(false)
  const waveAnimationRef = useRef<gsap.core.Tween | null>(null)

  useEffect(() => {
    if (!textRef.current || !containerRef.current) return

    // Entrance animation
    gsap.fromTo(
      textRef.current,
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.3,
        onComplete: () => {
          // Start idle wave animation after entrance
          startWaveAnimation()
        },
      }
    )

    // Idle wave animation (left to right)
    const startWaveAnimation = () => {
      if (!textRef.current) return

      waveAnimationRef.current = gsap.to(textRef.current, {
        x: "+=20",
        y: "+=5",
        duration: 3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      })
    }

    const stopWaveAnimation = () => {
      if (waveAnimationRef.current) {
        waveAnimationRef.current.kill()
      }
    }

    // Mouse follow effect
    const xTo = gsap.quickTo(textRef.current, "x", {
      duration: 0.6,
      ease: "power3.out",
    })
    const yTo = gsap.quickTo(textRef.current, "y", {
      duration: 0.6,
      ease: "power3.out",
    })

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !textRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      // Calculate distance from center
      const deltaX = e.clientX - centerX
      const deltaY = e.clientY - centerY
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

      // Magnetic effect when within 300px
      const maxDistance = 300
      if (distance < maxDistance) {
        if (!isNearRef.current) {
          isNearRef.current = true
          stopWaveAnimation()
        }
        const strength = 1 - distance / maxDistance
        const moveX = (deltaX / distance) * strength * 30
        const moveY = (deltaY / distance) * strength * 30

        xTo(moveX)
        yTo(moveY)
      } else {
        if (isNearRef.current) {
          isNearRef.current = false
          xTo(0)
          yTo(0)
          // Restart wave animation after mouse leaves
          setTimeout(startWaveAnimation, 600)
        }
      }
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      stopWaveAnimation()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
    >
      <div ref={textRef} className="text-center select-none">
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-4 tracking-tight">
          Hello, I am Madhav.
        </h1>
        <p className="text-2xl md:text-3xl lg:text-4xl text-white/90 font-light tracking-wide">
          Welcome to my portfolio
        </p>
      </div>
    </div>
  )
}
