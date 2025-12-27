"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Play } from "lucide-react"

const GRID_SIZE = 20
const CELL_SIZE = 20
const CANVAS_SIZE = GRID_SIZE * CELL_SIZE
const INITIAL_SNAKE = [{ x: 10, y: 10 }]
const INITIAL_DIRECTION = { x: 1, y: 0 }
const GAME_SPEED = 100 // ms per frame

type Position = { x: number; y: number }

interface SnakeProps {
  onScoreChange: (score: number) => void
  onRestart: () => void
}

export default function Snake({ onScoreChange, onRestart }: SnakeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE)
  const [direction, setDirection] = useState<Position>(INITIAL_DIRECTION)
  const [food, setFood] = useState<Position>({ x: 15, y: 15 })
  const [gameOver, setGameOver] = useState(false)
  const [isStarted, setIsStarted] = useState(false)
  const [score, setScore] = useState(0)
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null)
  const directionRef = useRef<Position>(INITIAL_DIRECTION)

  // Generate random food position
  const generateFood = useCallback((currentSnake: Position[]): Position => {
    let newFood: Position
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      }
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y))
    return newFood
  }, [])

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver || !isStarted) return

      const key = e.key
      const currentDir = directionRef.current

      if (key === "ArrowUp" && currentDir.y === 0) {
        directionRef.current = { x: 0, y: -1 }
        setDirection({ x: 0, y: -1 })
      } else if (key === "ArrowDown" && currentDir.y === 0) {
        directionRef.current = { x: 0, y: 1 }
        setDirection({ x: 0, y: 1 })
      } else if (key === "ArrowLeft" && currentDir.x === 0) {
        directionRef.current = { x: -1, y: 0 }
        setDirection({ x: -1, y: 0 })
      } else if (key === "ArrowRight" && currentDir.x === 0) {
        directionRef.current = { x: 1, y: 0 }
        setDirection({ x: 1, y: 0 })
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [gameOver, isStarted])

  // Game loop - only runs when started and not game over
  useEffect(() => {
    if (gameOver || !isStarted) return

    gameLoopRef.current = setInterval(() => {
      setSnake(prevSnake => {
        const head = prevSnake[0]
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        }

        // Check wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true)
          return prevSnake
        }

        // Check self collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true)
          return prevSnake
        }

        const newSnake = [newHead, ...prevSnake]

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setFood(generateFood(newSnake))
          const newScore = score + 10
          setScore(newScore)
          onScoreChange(newScore)
          return newSnake
        }

        // Remove tail if no food eaten
        newSnake.pop()
        return newSnake
      })
    }, GAME_SPEED)

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
      }
    }
  }, [gameOver, isStarted, food, score, generateFood, onScoreChange])

  // Render game
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = "#1a1a1a"
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

    // Draw grid
    ctx.strokeStyle = "#2a2a2a"
    ctx.lineWidth = 1
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath()
      ctx.moveTo(i * CELL_SIZE, 0)
      ctx.lineTo(i * CELL_SIZE, CANVAS_SIZE)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, i * CELL_SIZE)
      ctx.lineTo(CANVAS_SIZE, i * CELL_SIZE)
      ctx.stroke()
    }

    // Draw snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? "#4ade80" : "#22c55e"
      ctx.fillRect(
        segment.x * CELL_SIZE + 1,
        segment.y * CELL_SIZE + 1,
        CELL_SIZE - 2,
        CELL_SIZE - 2
      )
    })

    // Draw food
    ctx.fillStyle = "#ef4444"
    ctx.fillRect(
      food.x * CELL_SIZE + 1,
      food.y * CELL_SIZE + 1,
      CELL_SIZE - 2,
      CELL_SIZE - 2
    )
  }, [snake, food])

  const handleStart = () => {
    setIsStarted(true)
  }

  const handleRestart = () => {
    setSnake(INITIAL_SNAKE)
    setDirection(INITIAL_DIRECTION)
    directionRef.current = INITIAL_DIRECTION
    setFood({ x: 15, y: 15 })
    setGameOver(false)
    setIsStarted(true)
    setScore(0)
    onScoreChange(0)
    onRestart()
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="border-2 border-[var(--card-border)] rounded-lg"
        />

        {/* Start overlay */}
        {!isStarted && !gameOver && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center rounded-lg">
            <p className="text-2xl font-bold text-white mb-4">Snake</p>
            <button
              onClick={handleStart}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
            >
              <Play className="w-5 h-5" />
              Start Game
            </button>
          </div>
        )}
      </div>

      {gameOver && (
        <div className="text-center">
          <p className="text-xl font-bold text-red-500 mb-2">Game Over!</p>
          <button
            onClick={handleRestart}
            className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
          >
            Play Again
          </button>
        </div>
      )}

      <div className="text-[var(--muted-text)] text-sm text-center">
        <p>Use arrow keys to control the snake</p>
        <p>Eat the red food to grow and score points</p>
      </div>
    </div>
  )
}
