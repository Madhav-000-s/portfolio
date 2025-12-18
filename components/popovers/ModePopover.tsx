"use client"

import { Sun, Moon, Monitor } from "lucide-react"
import useThemeStore from "@/store/useThemeStore"

export default function ModePopover() {
  const { theme, setTheme } = useThemeStore()

  const modes = [
    { icon: Sun, label: "Light", value: "light" as const },
    { icon: Moon, label: "Dark", value: "dark" as const },
    { icon: Monitor, label: "System", value: "system" as const },
  ]

  return (
    <div className="py-2">
      <div className="px-4 py-2 border-b border-[var(--card-border)]">
        <h3 className="font-semibold text-sm text-[var(--panel-text)]">Appearance</h3>
      </div>
      <div className="py-1">
        {modes.map(({ icon: Icon, label, value }) => (
          <button
            key={value}
            onClick={() => setTheme(value)}
            className={`w-full px-4 py-2 hover:bg-[var(--hover-bg)] transition-colors flex items-center justify-between ${
              theme === value ? "bg-[#0078d4]/20" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon className="w-4 h-4 text-[var(--panel-text)]" />
              <span className="text-sm text-[var(--panel-text)]">{label}</span>
            </div>
            {theme === value && (
              <div className="w-2 h-2 rounded-full bg-blue-400" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
