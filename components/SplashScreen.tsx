"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { useGLTF } from "@react-three/drei"

// Module-level preloads (start immediately when module loads)
useGLTF.preload("/tux.glb")

// All images to preload during splash
const preloadImages = [
  // Critical - needed for login screen
  "/images/wallpaper.png",
  // Dock icons
  "/images/finder.png",
  "/images/terminal.png",
  "/images/games.png",
  "/images/contact.png",
  "/images/trash.png",
  // Other UI
  "/images/tux.png",
  "/images/pdf.png",
  // Nav icons
  "/icons/wifi.svg",
  "/icons/search.svg",
  "/icons/user.svg",
  "/icons/mode.svg",
]

const textSequence = [
  "Hello I Am Madhav",
  "Welcome To My Portfolio",
  "Have A Look Around",
]

interface SplashScreenProps {
  onComplete: () => void
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const [preloadComplete, setPreloadComplete] = useState(false)
  const [animationComplete, setAnimationComplete] = useState(false)

  // Custom scramble text animation
  const scrambleText = (element: HTMLElement, text: string): Promise<void> => {
    return new Promise((resolve) => {
      const chars =
        "!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
      const duration = 1.5 // seconds
      const fps = 30
      const totalFrames = duration * fps
      let frame = 0

      const animate = () => {
        const progress = frame / totalFrames
        const revealedLength = Math.floor(progress * text.length)

        element.innerText = text
          .split("")
          .map((char, i) => {
            if (char === " ") return " "
            if (i < revealedLength) return text[i]
            return chars[Math.floor(Math.random() * chars.length)]
          })
          .join("")

        frame++

        if (frame <= totalFrames) {
          setTimeout(animate, 1000 / fps)
        } else {
          element.innerText = text
          resolve()
        }
      }

      animate()
    })
  }

  // Preload all images in parallel
  useEffect(() => {
    const preloadAllImages = async () => {
      await Promise.all(
        preloadImages.map(
          (src) =>
            new Promise<void>((resolve) => {
              const img = new Image()
              img.onload = () => resolve()
              img.onerror = () => resolve() // Don't block on errors
              img.src = src
            })
        )
      )
      setPreloadComplete(true)
    }

    preloadAllImages()
  }, [])

  // Run text animation sequence
  useEffect(() => {
    const runSequence = async () => {
      if (!textRef.current || !containerRef.current) return

      for (let i = 0; i < textSequence.length; i++) {
        // Scramble in the text
        await scrambleText(textRef.current, textSequence[i])

        // Hold for readability
        await new Promise((r) => setTimeout(r, 1000))

        // Fade out text (except for the last one)
        if (i < textSequence.length - 1) {
          await gsap.to(textRef.current, {
            opacity: 0,
            duration: 0.3,
            ease: "power2.out",
          })

          // Reset for next text
          gsap.set(textRef.current, { opacity: 1 })
          textRef.current.innerText = ""
        }
      }

      // Final hold before signaling animation complete
      await new Promise((r) => setTimeout(r, 500))
      setAnimationComplete(true)
    }

    runSequence()
  }, [])

  // Only complete when BOTH animation AND preload are done
  useEffect(() => {
    if (animationComplete && preloadComplete) {
      // Fade out entire splash screen
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut",
        onComplete,
      })
    }
  }, [animationComplete, preloadComplete, onComplete])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
    >
      <span
        ref={textRef}
        className="text-white text-2xl sm:text-3xl md:text-5xl font-mono tracking-wide text-center px-4"
        style={{ fontFamily: "var(--font-geist-mono)" }}
      />
    </div>
  )
}
