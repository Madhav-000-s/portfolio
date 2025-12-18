import { create } from "zustand"
import { persist } from "zustand/middleware"

type Theme = "light" | "dark" | "system"

interface ThemeStore {
  theme: Theme
  resolvedTheme: "light" | "dark"
  setTheme: (theme: Theme) => void
  initTheme: () => void
}

const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: "light",
      resolvedTheme: "light",

      setTheme: (theme: Theme) => {
        let resolved: "light" | "dark" = "light"

        if (theme === "system") {
          if (typeof window !== "undefined") {
            resolved = window.matchMedia("(prefers-color-scheme: dark)").matches
              ? "dark"
              : "light"
          }
        } else {
          resolved = theme
        }

        set({ theme, resolvedTheme: resolved })

        // Apply to document
        if (typeof document !== "undefined") {
          document.documentElement.classList.remove("light", "dark")
          document.documentElement.classList.add(resolved)
        }
      },

      initTheme: () => {
        const { theme, setTheme } = get()
        setTheme(theme)
      },
    }),
    {
      name: "theme-storage",
      partialize: (state) => ({ theme: state.theme }),
    }
  )
)

export default useThemeStore
