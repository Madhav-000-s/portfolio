"use client"

import { useEffect } from "react"
import useThemeStore from "@/store/useThemeStore"

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, initTheme, setTheme } = useThemeStore()

  useEffect(() => {
    // Initialize theme on mount
    initTheme()

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => {
      if (theme === "system") {
        setTheme("system")
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme, initTheme, setTheme])

  return <>{children}</>
}
