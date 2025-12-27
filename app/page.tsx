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
    </main>
  )
}
