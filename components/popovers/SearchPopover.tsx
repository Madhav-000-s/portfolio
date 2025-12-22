"use client"

import { useState, useMemo } from "react"
import { Search, Folder, FileText, Mail, Terminal, Trash2 } from "lucide-react"
import useWindowStore from "@/store/useWindowStore"

interface SearchItem {
  name: string
  icon: React.ReactNode
  windowKey: string
  data?: Record<string, unknown> | null
}

const searchItems: SearchItem[] = [
  { name: "Projects", icon: <Folder className="w-4 h-4" />, windowKey: "finder", data: { location: "work" } },
  { name: "Resume", icon: <FileText className="w-4 h-4" />, windowKey: "resume", data: null },
  { name: "Contact", icon: <Mail className="w-4 h-4" />, windowKey: "contact", data: null },
  { name: "About Me", icon: <Folder className="w-4 h-4" />, windowKey: "finder", data: { location: "about" } },
  { name: "Skills", icon: <Terminal className="w-4 h-4" />, windowKey: "terminal", data: null },
  { name: "Archive", icon: <Trash2 className="w-4 h-4" />, windowKey: "finder", data: { location: "trash" } },
]

const quickLinks = [
  { name: "Projects", windowKey: "finder", data: { location: "work" } },
  { name: "Resume", windowKey: "resume", data: null },
  { name: "Contact", windowKey: "contact", data: null },
]

export default function SearchPopover() {
  const [query, setQuery] = useState("")
  const openwindow = useWindowStore((state) => state.openwindow)

  const filteredItems = useMemo(() => {
    if (!query.trim()) return []
    const lowerQuery = query.toLowerCase()
    return searchItems.filter((item) =>
      item.name.toLowerCase().includes(lowerQuery)
    )
  }, [query])

  const handleItemClick = (item: SearchItem) => {
    openwindow(item.windowKey, item.data)
    setQuery("")
  }

  const handleQuickLinkClick = (link: typeof quickLinks[0]) => {
    openwindow(link.windowKey, link.data)
  }

  return (
    <div className="py-2">
      <div className="px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-text)]" />
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[var(--hover-bg)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-[var(--panel-text)] placeholder:text-[var(--muted-text)]"
            autoFocus
          />
        </div>
      </div>

      {/* Search Results */}
      {filteredItems.length > 0 && (
        <div className="px-4 py-2 border-b border-[var(--card-border)]">
          <p className="text-xs text-[var(--muted-text)] mb-2 font-medium">Results</p>
          <div className="space-y-1">
            {filteredItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleItemClick(item)}
                className="w-full text-left px-3 py-2 hover:bg-[var(--hover-bg)] rounded text-sm text-[var(--panel-text)] flex items-center gap-2"
              >
                {item.icon}
                {item.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {query.trim() && filteredItems.length === 0 && (
        <div className="px-4 py-2 border-b border-[var(--card-border)]">
          <p className="text-xs text-[var(--muted-text)] text-center py-2">No results found</p>
        </div>
      )}

      {/* Quick Links */}
      <div className="px-4 py-2">
        <p className="text-xs text-[var(--muted-text)] mb-2 font-medium">Quick Links</p>
        <div className="space-y-1">
          {quickLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleQuickLinkClick(link)}
              className="w-full text-left px-3 py-2 hover:bg-[var(--hover-bg)] rounded text-sm text-[var(--panel-text)]"
            >
              {link.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
