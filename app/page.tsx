"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/Navbar"
import HeroText from "@/components/HeroText"
import Dock from "@/components/Dock"
import DesktopFolders from "@/components/DesktopFolders"
import TerminalWindow from "@/components/windows/TerminalWindow"
import FinderWindow from "@/components/windows/FinderWindow"
import ResumeWindow from "@/components/windows/ResumeWindow"
import ContactWindow from "@/components/windows/ContactWindow"
import TextFileWindow from "@/components/windows/TextFileWindow"
import SnakeWindow from "@/components/windows/SnakeWindow"
import Game2048Window from "@/components/windows/Game2048Window"
import MemoryWindow from "@/components/windows/MemoryWindow"
import TicTacToeWindow from "@/components/windows/TicTacToeWindow"
import SplashScreen from "@/components/SplashScreen"
import LoginScreen from "@/components/LoginScreen"
import WelcomeTransition from "@/components/WelcomeTransition"
import useAuthStore from "@/store/useAuthStore"
import { CONTACT_EMAIL } from "@/constants"

type Stage = "splash" | "login" | "transition" | "desktop"

export default function Home() {
  const [stage, setStage] = useState<Stage>("splash")
  const { isLoggedIn, username, login } = useAuthStore()
  const [hydrated, setHydrated] = useState(false)

  // Wait for Zustand to hydrate from localStorage
  useEffect(() => {
    setHydrated(true)
  }, [])

  const handleSplashComplete = () => {
    // Skip login if already logged in (returning user)
    if (hydrated && isLoggedIn) {
      setStage("transition")
    } else {
      setStage("login")
    }
  }

  const handleLogin = (name: string) => {
    login(name)
    setStage("transition")
  }

  const handleTransitionComplete = () => {
    setStage("desktop")
  }

  return (
    <main>
      {/* Mobile fallback - shown only on small screens */}
      <div className="flex md:hidden min-h-dvh w-dvw flex-col items-center justify-center bg-black text-white p-8">
        <div className="text-center space-y-6 max-w-sm">
          {/* Name & Title */}
          <div>
            <h1 className="text-3xl font-bold">Madhavendranath</h1>
            <p className="text-gray-400 mt-1">Full-Stack Developer & ML Engineer</p>
          </div>

          {/* About */}
          <p className="text-gray-300 text-sm leading-relaxed">
            Building AI-powered web applications with Next.js, React, TypeScript, and Python.
            Creating immersive experiences with GSAP and Three.js.
          </p>

          {/* GitHub - highlighted CTA */}
          <a
            href="https://github.com/Madhav-000-s"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-black rounded-lg font-medium animate-bounce hover:scale-105 transition-transform"
          >
            <img src="/icons/github.svg" alt="GitHub" className="w-5 h-5 invert" />
            View My GitHub
          </a>

          {/* Desktop notice - emphasized */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <p className="text-yellow-400 text-sm font-medium">
              This site is designed for desktop
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Visit on a larger screen for the full interactive experience
            </p>
          </div>

          {/* Small links at bottom */}
          <div className="flex justify-center gap-6 text-sm text-gray-500 pt-4">
            <a
              href="/files/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Resume
            </a>
            <a
              href="https://www.linkedin.com/in/madhavendranath-s/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              LinkedIn
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="hover:text-white transition-colors"
            >
              Email
            </a>
          </div>
        </div>
      </div>

      {/* Desktop content - hidden on small screens */}
      <div className="hidden md:block">
        {/* Overlay screens */}
        {stage === "splash" && (
          <SplashScreen onComplete={handleSplashComplete} />
        )}
        {stage === "login" && <LoginScreen onLogin={handleLogin} />}
        {stage === "transition" && (
          <WelcomeTransition
            username={username}
            onComplete={handleTransitionComplete}
          />
        )}

        {/* CRITICAL: Main content is ALWAYS rendered but hidden until desktop stage
            This pre-renders all components during splash for instant reveal */}
        <div
          className={`transition-opacity duration-300 ${
            stage === "desktop" ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <Navbar />
          <DesktopFolders />
          <HeroText startAnimation={stage === "desktop"} />
          <Dock />
          <FinderWindow />
          <TerminalWindow />
          <ResumeWindow />
          <ContactWindow />
          <TextFileWindow />
          <SnakeWindow />
          <Game2048Window />
          <MemoryWindow />
          <TicTacToeWindow />
        </div>
      </div>
    </main>
  )
}
