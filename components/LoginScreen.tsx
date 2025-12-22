"use client"

import { useState, useRef, useEffect } from "react"
import { User } from "lucide-react"
import gsap from "gsap"

interface LoginScreenProps {
  onLogin: (username: string) => void
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Fade in animation
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      )
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) return

    // Fade out animation before transitioning
    if (containerRef.current) {
      await gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.inOut",
      })
    }

    onLogin(username.trim())
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9998] flex items-center justify-center"
      style={{
        backgroundImage: "url(/images/wallpaper.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Blur overlay */}
      <div className="absolute inset-0 backdrop-blur-md bg-black/40" />

      {/* Login card */}
      <div
        ref={cardRef}
        className="relative z-10 flex flex-col items-center gap-6 p-8"
      >
        {/* Avatar circle */}
        <div className="w-32 h-32 rounded-full bg-gray-600/80 flex items-center justify-center border-4 border-white/20 shadow-2xl">
          <User className="w-16 h-16 text-white/90" />
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
          {/* Username input */}
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your name"
            autoFocus
            className="w-64 px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white text-center placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all"
            style={{ fontFamily: "var(--font-geist-sans)" }}
          />

          {/* Login button */}
          <button
            type="submit"
            disabled={!username.trim()}
            className="px-8 py-2.5 rounded-full bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition-all duration-200 border border-white/20 hover:border-white/30"
          >
            Log In
          </button>
        </form>

        {/* Hint text */}
        <p className="text-white/40 text-sm mt-2">
          Enter any name to continue
        </p>
      </div>
    </div>
  )
}
