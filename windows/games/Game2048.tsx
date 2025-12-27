"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import gsap from "gsap"
import { Play } from "lucide-react"

const GRID_SIZE = 4

type Tile = {
  id: number
  value: number
  row: number
  col: number
  isNew?: boolean
  isMerged?: boolean
}

interface Game2048Props {
  onScoreChange: (score: number) => void
  onRestart: () => void
}

// Dark theme tile colors
const TILE_COLORS: Record<number, { bg: string; text: string }> = {
  2: { bg: "#3d3d3d", text: "#e0e0e0" },
  4: { bg: "#4a4a4a", text: "#e0e0e0" },
  8: { bg: "#c77b30", text: "#ffffff" },
  16: { bg: "#c75f30", text: "#ffffff" },
  32: { bg: "#c74830", text: "#ffffff" },
  64: { bg: "#c73030", text: "#ffffff" },
  128: { bg: "#c7a030", text: "#ffffff" },
  256: { bg: "#c7b030", text: "#ffffff" },
  512: { bg: "#c7c030", text: "#ffffff" },
  1024: { bg: "#a0c730", text: "#ffffff" },
  2048: { bg: "#30c750", text: "#ffffff" },
}

// Helper: Get tiles in a specific row or column
const getLineTiles = (tiles: Tile[], direction: string, lineIndex: number): Tile[] => {
  if (direction === "left" || direction === "right") {
    return tiles.filter(t => t.row === lineIndex)
  }
  return tiles.filter(t => t.col === lineIndex)
}

// Helper: Sort tiles by movement direction
const sortByDirection = (tiles: Tile[], direction: string): Tile[] => {
  return [...tiles].sort((a, b) => {
    if (direction === "left") return a.col - b.col
    if (direction === "right") return b.col - a.col
    if (direction === "up") return a.row - b.row
    return b.row - a.row // down
  })
}

// Helper: Calculate new position after sliding
const getNewPosition = (direction: string, lineIndex: number, positionInLine: number): { row: number; col: number } => {
  if (direction === "left") return { row: lineIndex, col: positionInLine }
  if (direction === "right") return { row: lineIndex, col: GRID_SIZE - 1 - positionInLine }
  if (direction === "up") return { row: positionInLine, col: lineIndex }
  return { row: GRID_SIZE - 1 - positionInLine, col: lineIndex } // down
}

export default function Game2048({ onScoreChange, onRestart }: Game2048Props) {
  const [tiles, setTiles] = useState<Tile[]>([])
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const [isStarted, setIsStarted] = useState(false)
  const nextId = useRef(0)
  const tileRefs = useRef<Map<number, HTMLDivElement>>(new Map())

  // Generate random tile
  const generateRandomTile = useCallback((existingTiles: Tile[]): Tile => {
    const emptyPositions: { row: number; col: number }[] = []

    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (!existingTiles.some(t => t.row === row && t.col === col)) {
          emptyPositions.push({ row, col })
        }
      }
    }

    if (emptyPositions.length === 0) {
      return { id: nextId.current++, value: 2, row: 0, col: 0, isNew: true }
    }

    const pos = emptyPositions[Math.floor(Math.random() * emptyPositions.length)]
    return {
      id: nextId.current++,
      value: Math.random() < 0.9 ? 2 : 4,
      row: pos.row,
      col: pos.col,
      isNew: true,
    }
  }, [])

  // Initialize game
  const initializeGame = useCallback(() => {
    nextId.current = 0
    tileRefs.current.clear()
    const newTiles: Tile[] = []

    // Add two initial tiles
    for (let i = 0; i < 2; i++) {
      newTiles.push(generateRandomTile(newTiles))
    }

    setTiles(newTiles)
    setScore(0)
    setGameOver(false)
    setWon(false)
    onScoreChange(0)
  }, [generateRandomTile, onScoreChange])

  // Start game
  const handleStart = () => {
    setIsStarted(true)
    initializeGame()
  }

  // Restart game
  const handleRestart = () => {
    initializeGame()
    onRestart()
  }

  // Check if moves are available
  const canMove = useCallback((currentTiles: Tile[]): boolean => {
    if (currentTiles.length < GRID_SIZE * GRID_SIZE) return true

    for (const tile of currentTiles) {
      const { row, col, value } = tile

      const adjacents = [
        currentTiles.find(t => t.row === row - 1 && t.col === col),
        currentTiles.find(t => t.row === row + 1 && t.col === col),
        currentTiles.find(t => t.row === row && t.col === col - 1),
        currentTiles.find(t => t.row === row && t.col === col + 1),
      ]

      if (adjacents.some(adj => adj && adj.value === value)) {
        return true
      }
    }

    return false
  }, [])

  // Move tiles - completely rewritten to avoid array mutation bugs
  const moveTiles = useCallback((direction: "up" | "down" | "left" | "right") => {
    if (gameOver || won || !isStarted) return

    setTiles(prevTiles => {
      let moved = false
      let pointsEarned = 0
      let hasWon = false

      // Create working copy with reset flags
      const workingTiles: (Tile & { merged?: boolean })[] = prevTiles.map(t => ({
        ...t,
        isNew: false,
        isMerged: false,
        merged: false, // temp flag to track merges this move
      }))

      // Track which tile IDs to remove (merged away)
      const tilesToRemove = new Set<number>()

      // Process each line (row for left/right, col for up/down)
      for (let lineIndex = 0; lineIndex < GRID_SIZE; lineIndex++) {
        // Get tiles in this line
        const lineTiles = getLineTiles(workingTiles, direction, lineIndex)
          .filter(t => !tilesToRemove.has(t.id))

        if (lineTiles.length === 0) continue

        // Sort by position (tiles closest to target edge first)
        const sorted = sortByDirection(lineTiles, direction)

        // Process tiles: slide and merge
        const processed: (Tile & { merged?: boolean })[] = []

        for (const tile of sorted) {
          if (processed.length > 0) {
            const lastTile = processed[processed.length - 1]
            // Can merge if same value and last tile wasn't already merged this move
            if (lastTile.value === tile.value && !lastTile.merged) {
              // Merge: double last tile value
              lastTile.value *= 2
              lastTile.isMerged = true
              lastTile.merged = true // Mark as merged this move
              pointsEarned += lastTile.value
              moved = true

              // Check for win
              if (lastTile.value === 2048) {
                hasWon = true
              }

              // Mark current tile for removal
              tilesToRemove.add(tile.id)
              continue
            }
          }
          processed.push({ ...tile })
        }

        // Update positions for tiles in this line
        processed.forEach((tile, idx) => {
          const newPos = getNewPosition(direction, lineIndex, idx)
          const workingTile = workingTiles.find(t => t.id === tile.id)
          if (workingTile) {
            if (workingTile.row !== newPos.row || workingTile.col !== newPos.col) {
              moved = true
            }
            workingTile.row = newPos.row
            workingTile.col = newPos.col
            workingTile.value = tile.value
            workingTile.isMerged = tile.isMerged
          }
        })
      }

      // Remove merged tiles and clean up temp flags
      let finalTiles: Tile[] = workingTiles
        .filter(t => !tilesToRemove.has(t.id))
        .map(({ merged, ...rest }) => rest)

      // Add new tile if moved
      if (moved) {
        finalTiles.push(generateRandomTile(finalTiles))

        // Update score using functional setState
        setScore(prev => {
          const newScore = prev + pointsEarned
          onScoreChange(newScore)
          return newScore
        })

        // Check game state
        if (hasWon) {
          setWon(true)
        } else if (!canMove(finalTiles)) {
          setGameOver(true)
        }
      }

      return finalTiles
    })
  }, [gameOver, won, isStarted, generateRandomTile, onScoreChange, canMove])

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isStarted) return

      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault()

        if (e.key === "ArrowUp") moveTiles("up")
        else if (e.key === "ArrowDown") moveTiles("down")
        else if (e.key === "ArrowLeft") moveTiles("left")
        else if (e.key === "ArrowRight") moveTiles("right")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [moveTiles, isStarted])

  // Animate new/merged tiles and clean up old refs
  useEffect(() => {
    // Clean up refs for tiles that no longer exist
    const currentIds = new Set(tiles.map(t => t.id))
    tileRefs.current.forEach((_, id) => {
      if (!currentIds.has(id)) {
        tileRefs.current.delete(id)
      }
    })

    // Animate tiles
    tiles.forEach(tile => {
      const element = tileRefs.current.get(tile.id)
      if (!element) return

      if (tile.isNew) {
        gsap.fromTo(element,
          { scale: 0 },
          { scale: 1, duration: 0.2, ease: "back.out(1.7)" }
        )
      } else if (tile.isMerged) {
        gsap.fromTo(element,
          { scale: 1 },
          { scale: 1.1, duration: 0.1, yoyo: true, repeat: 1 }
        )
      }
    })
  }, [tiles])

  const getTileColors = (value: number) => {
    return TILE_COLORS[value] || { bg: "#30c7c7", text: "#ffffff" }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative bg-[#2a2a2a] p-2 rounded-lg" style={{ width: 280, height: 280 }}>
        {/* Grid background */}
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className="bg-[#1a1a1a] rounded"
              style={{ width: 60, height: 60 }}
            />
          ))}
        </div>

        {/* Tiles */}
        {tiles.map(tile => {
          const colors = getTileColors(tile.value)
          return (
            <div
              key={tile.id}
              ref={el => {
                if (el) tileRefs.current.set(tile.id, el)
              }}
              className="absolute flex items-center justify-center font-bold rounded transition-all duration-100"
              style={{
                width: 60,
                height: 60,
                top: tile.row * 68 + 8,
                left: tile.col * 68 + 8,
                backgroundColor: colors.bg,
                color: colors.text,
                fontSize: tile.value >= 1000 ? "1.5rem" : "2rem",
              }}
            >
              {tile.value}
            </div>
          )
        })}

        {/* Start overlay */}
        {!isStarted && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center rounded-lg">
            <p className="text-2xl font-bold text-white mb-4">2048</p>
            <button
              onClick={handleStart}
              className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors"
            >
              <Play className="w-5 h-5" />
              Start Game
            </button>
          </div>
        )}
      </div>

      {(gameOver || won) && (
        <div className="text-center">
          <p className={`text-xl font-bold mb-2 ${won ? "text-green-500" : "text-red-500"}`}>
            {won ? "You Won!" : "Game Over!"}
          </p>
          <button
            onClick={handleRestart}
            className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors"
          >
            New Game
          </button>
        </div>
      )}

      <div className="text-[var(--muted-text)] text-sm text-center">
        <p>Use arrow keys to slide tiles</p>
        <p>Combine tiles with the same number to reach 2048!</p>
      </div>
    </div>
  )
}
