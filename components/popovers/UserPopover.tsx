"use client"

import { useState } from "react"
import { User, Settings, LogOut, X, RotateCcw } from "lucide-react"
import useAuthStore from "@/store/useAuthStore"
import useWindowStore from "@/store/useWindowStore"

export default function UserPopover() {
  const { username, logout } = useAuthStore()
  const openwindow = useWindowStore((state) => state.openwindow)
  const [showSettings, setShowSettings] = useState(false)

  const handleSignOut = () => {
    // Clear folder positions on sign out
    localStorage.removeItem("desktop-folder-positions")
    logout()
    window.location.reload()
  }

  const handleProfile = () => {
    // Open About Me in Finder
    openwindow("finder", { location: "about" })
  }

  const handleResetFolders = () => {
    localStorage.removeItem("desktop-folder-positions")
    window.location.reload()
  }

  // Get initials for avatar
  const getInitials = (name: string | null) => {
    if (!name) return "G"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  // Generate email from username
  const getEmail = (name: string | null) => {
    if (!name) return "guest@portfolio.dev"
    return `${name.toLowerCase().replace(/\s+/g, ".")}@portfolio.dev`
  }

  return (
    <>
      <div className="py-2">
        <div className="px-4 py-3 border-b border-[var(--card-border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
              {username ? (
                <span className="text-white font-semibold text-sm">
                  {getInitials(username)}
                </span>
              ) : (
                <User className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <p className="font-semibold text-sm text-[var(--panel-text)]">
                {username || "Guest User"}
              </p>
              <p className="text-xs text-[var(--muted-text)]">
                {getEmail(username)}
              </p>
            </div>
          </div>
        </div>
        <div className="py-1">
          <button
            onClick={handleProfile}
            className="w-full px-4 py-2 hover:bg-[var(--hover-bg)] transition-colors flex items-center gap-3"
          >
            <User className="w-4 h-4 text-[var(--panel-text)]" />
            <span className="text-sm text-[var(--panel-text)]">Profile</span>
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="w-full px-4 py-2 hover:bg-[var(--hover-bg)] transition-colors flex items-center gap-3"
          >
            <Settings className="w-4 h-4 text-[var(--panel-text)]" />
            <span className="text-sm text-[var(--panel-text)]">Settings</span>
          </button>
          <button
            onClick={handleSignOut}
            className="w-full px-4 py-2 hover:bg-[var(--hover-bg)] transition-colors flex items-center gap-3"
          >
            <LogOut className="w-4 h-4 text-[var(--panel-text)]" />
            <span className="text-sm text-[var(--panel-text)]">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]"
          onClick={() => setShowSettings(false)}
        >
          <div
            className="bg-[var(--panel-bg)] rounded-xl shadow-2xl w-80 overflow-hidden border border-[var(--card-border)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--card-border)]">
              <h3 className="font-semibold text-[var(--panel-text)]">Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="p-1 hover:bg-[var(--hover-bg)] rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-[var(--muted-text)]" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              {/* User Info */}
              <div className="space-y-2">
                <p className="text-xs text-[var(--muted-text)] font-medium uppercase">Account</p>
                <div className="bg-[var(--hover-bg)] rounded-lg p-3">
                  <p className="text-sm text-[var(--panel-text)] font-medium">
                    {username || "Guest User"}
                  </p>
                  <p className="text-xs text-[var(--muted-text)]">
                    {getEmail(username)}
                  </p>
                </div>
              </div>

              {/* Desktop Settings */}
              <div className="space-y-2">
                <p className="text-xs text-[var(--muted-text)] font-medium uppercase">Desktop</p>
                <button
                  onClick={handleResetFolders}
                  className="w-full flex items-center gap-3 bg-[var(--hover-bg)] hover:bg-[var(--hover-bg)]/80 rounded-lg p-3 transition-colors"
                >
                  <RotateCcw className="w-4 h-4 text-[var(--panel-text)]" />
                  <div className="text-left">
                    <p className="text-sm text-[var(--panel-text)]">Reset Folder Positions</p>
                    <p className="text-xs text-[var(--muted-text)]">Restore default layout</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
