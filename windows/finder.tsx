"use client"

import { useState, useMemo } from "react"
import { Search } from "lucide-react"
import Image from "next/image"
import { locations } from "@/constants"
import useWindowStore from "@/store/useWindowStore"

type Location = {
  id: number
  type: string
  name: string
  icon: string
  kind: string
  children: any[]
}

const Finder = () => {
  const { closewindow, openwindow } = useWindowStore()
  const [activeLocation, setActiveLocation] = useState<Location>(locations.work)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [currentFolder, setCurrentFolder] = useState<any>(null)

  // Get all locations as an array
  const locationsList = useMemo(() => {
    return [locations.work, locations.about, locations.resume, locations.trash]
  }, [])

  // Get current items to display (either root location or opened folder)
  const currentItems = useMemo(() => {
    return currentFolder ? currentFolder.children : activeLocation.children
  }, [currentFolder, activeLocation])

  // Filter items based on search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return currentItems

    return currentItems.filter((item: any) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [currentItems, searchQuery])

  // Handle location click in sidebar
  const handleLocationClick = (location: Location) => {
    setActiveLocation(location)
    setCurrentFolder(null) // Reset to root when changing location
    setSearchQuery("") // Clear search
  }

  // Handle double-click on file/folder
  const handleItemDoubleClick = (item: any) => {
    if (item.kind === "folder") {
      // Open folder - navigate into it
      setCurrentFolder(item)
      setSearchQuery("") // Clear search when opening folder
    } else if (item.kind === "file") {
      // Open file based on file type
      switch (item.fileType) {
        case "txt":
          openwindow("terminal", { content: item.description })
          break
        case "pdf":
          openwindow("resume", { pdfUrl: item.href || "/files/resume.pdf" })
          break
        case "img":
          openwindow("photos", { imageUrl: item.imageUrl })
          break
        case "url":
          if (item.href) {
            window.open(item.href, "_blank")
          }
          break
        default:
          console.log("Unknown file type:", item.fileType)
      }
    }
  }

  // Handle back navigation
  const handleBackClick = () => {
    setCurrentFolder(null)
    setSearchQuery("")
  }

  return (
    <div id="finder">
      {/* Window Header */}
      <div id="window-header">
        <div id="window-controls">
          <div className="close" onClick={() => closewindow("finder")} />
          <div className="minimize" />
          <div className="maximize" />
        </div>
        <h2>Portfolio</h2>
        <div className="w-16" />
      </div>

      <div className="finder-content">
        {/* Sidebar */}
        <div className="sidebar">
          <h3>Favorites</h3>
          <ul>
            {locationsList.map((location) => (
              <li
                key={location.id}
                onClick={() => handleLocationClick(location)}
                className={activeLocation.id === location.id ? "active" : ""}
              >
                <Image
                  src={location.icon}
                  alt={location.name}
                  width={16}
                  height={16}
                />
                <span>{location.name}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* Toolbar with search */}
          <div className="toolbar">
            {currentFolder && (
              <button onClick={handleBackClick} className="back-btn">
                ← Back
              </button>
            )}
            <div className="search-bar">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* File Grid */}
          <div className="file-grid">
            {filteredItems.length === 0 ? (
              <div className="no-results">
                <p>No items found</p>
              </div>
            ) : (
              filteredItems.map((item: any) => (
                <div
                  key={item.id}
                  className="file-item"
                  onDoubleClick={() => handleItemDoubleClick(item)}
                >
                  <div className="file-icon">
                    <Image
                      src={item.icon}
                      alt={item.name}
                      width={64}
                      height={64}
                    />
                  </div>
                  <div className="file-name">{item.name}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

Finder.displayName = "Finder"

export default Finder
