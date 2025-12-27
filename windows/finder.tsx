"use client"

import { useState, useMemo, useEffect } from "react"
import { Search, Loader2, X } from "lucide-react"
import Image from "next/image"
import { locations } from "@/constants"
import useWindowStore from "@/store/useWindowStore"
import type { ProjectFolder } from "@/lib/github"

type Location = {
  id: number
  type: string
  name: string
  icon: string
  kind: string
  children: any[]
}

const Finder = () => {
  const { closewindow, openwindow, minimizewindow } = useWindowStore()
  const finderData = useWindowStore((state) => state.windows.finder?.data)
  const [activeLocation, setActiveLocation] = useState<Location>(locations.work)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [currentFolder, setCurrentFolder] = useState<any>(null)
  const [pinnedProjects, setPinnedProjects] = useState<ProjectFolder[]>([])
  const [archivedProjects, setArchivedProjects] = useState<ProjectFolder[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasShownArchivePopup, setHasShownArchivePopup] = useState(false)
  const [showArchivePopup, setShowArchivePopup] = useState(false)

  // Fetch projects from GitHub API
  useEffect(() => {
    async function fetchProjects() {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch("/api/github")
        const data = await response.json()
        if (data.pinned) {
          setPinnedProjects(data.pinned)
        }
        if (data.archived) {
          setArchivedProjects(data.archived)
        }
      } catch (err) {
        setError("Failed to load projects")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProjects()
  }, [])

  // Handle window data to navigate to specific location
  useEffect(() => {
    if (finderData?.location) {
      const locationMap: Record<string, Location> = {
        work: locations.work,
        about: locations.about,
        resume: locations.resume,
        trash: locations.trash,
        games: locations.games,
      }
      const targetLocation = locationMap[finderData.location]
      if (targetLocation) {
        setActiveLocation(targetLocation)
      }
    }
  }, [finderData])

  // Show archive popup when Archive is selected (once per reload)
  useEffect(() => {
    if (activeLocation.type === "trash" && !hasShownArchivePopup) {
      setShowArchivePopup(true)
      setHasShownArchivePopup(true)
      // Auto-dismiss after 5 seconds
      const timer = setTimeout(() => {
        setShowArchivePopup(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [activeLocation, hasShownArchivePopup])

  // Get all locations as an array
  const locationsList = useMemo(() => {
    return [locations.work, locations.about, locations.resume, locations.trash, locations.games]
  }, [])

  // Get current items to display (either root location or opened folder)
  const currentItems = useMemo(() => {
    if (currentFolder) {
      return currentFolder.children
    }
    // For work/projects location, use pinned projects
    if (activeLocation.type === "work") {
      return pinnedProjects
    }
    // For trash/archive location, use archived projects
    if (activeLocation.type === "trash") {
      return archivedProjects
    }
    return activeLocation.children
  }, [currentFolder, activeLocation, pinnedProjects, archivedProjects])

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
  const handleItemDoubleClick = async (item: any) => {
    if (item.kind === "folder") {
      // Open folder - navigate into it
      setCurrentFolder(item)
      setSearchQuery("") // Clear search when opening folder
    } else if (item.kind === "file") {
      // Open file based on file type
      switch (item.fileType) {
        case "txt":
          console.log("Opening txt file:", item.name, item.description)
          openwindow("txtfile", { title: item.name, content: item.description || "No description available" })
          break
        case "readme":
          // Fetch README content from API - opens at max size for better reading
          console.log("Opening README for repo:", item.repoName)
          openwindow("txtfile", { title: item.name, content: "Loading README...", repoName: item.repoName, maxSize: true })
          try {
            const response = await fetch(`/api/readme?repo=${item.repoName}`)
            const data = await response.json()
            console.log("README fetched:", data.content?.substring(0, 100))
            openwindow("txtfile", { title: item.name, content: data.content || "README not found.", repoName: item.repoName, maxSize: true })
          } catch (err) {
            console.error("Failed to fetch README:", err)
            openwindow("txtfile", { title: item.name, content: "Failed to load README.", repoName: item.repoName, maxSize: true })
          }
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
        case "game":
          // Open game in its own window
          if (item.gameType) {
            openwindow(item.gameType, {})
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
        <h2>Portfolio</h2>
        <div id="window-controls">
          <div className="minimize" onClick={() => minimizewindow("finder")} />
          <div className="maximize" />
          <div className="close" onClick={() => closewindow("finder")} />
        </div>
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

          {/* Archive Popup */}
          {showArchivePopup && activeLocation.type === "trash" && (
            <div className="archive-popup">
              <p>
                These are smaller projects or WIPs I have which I might or might not finish.
                Check out Projects to see the completed ones!
              </p>
              <button
                onClick={() => setShowArchivePopup(false)}
                className="popup-close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* File Grid */}
          <div className="file-grid">
            {isLoading && (activeLocation.type === "work" || activeLocation.type === "trash") ? (
              <div className="no-results">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                <p>Loading projects...</p>
              </div>
            ) : error && (activeLocation.type === "work" || activeLocation.type === "trash") ? (
              <div className="no-results">
                <p>{error}</p>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="no-results">
                <p>No items found</p>
              </div>
            ) : (
              filteredItems.map((item: any) => (
                <div
                  key={item.id}
                  className="file-item"
                  onDoubleClick={() => handleItemDoubleClick(item)}
                  title={item.description || item.name}
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
