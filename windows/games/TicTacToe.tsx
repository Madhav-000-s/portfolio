"use client"

import { useState, useEffect, useCallback } from "react"
import { Play } from "lucide-react"

type Player = "X" | "O" | null
type Board = Player[]

interface TicTacToeProps {
  onScoreChange: (score: number) => void
  onRestart: () => void
}

export default function TicTacToe({ onScoreChange, onRestart }: TicTacToeProps) {
  const [board, setBoard] = useState<Board>(Array(9).fill(null))
  const [isPlayerTurn, setIsPlayerTurn] = useState(true)
  const [winner, setWinner] = useState<Player | "draw">(null)
  const [wins, setWins] = useState(0)
  const [losses, setLosses] = useState(0)
  const [draws, setDraws] = useState(0)
  const [isStarted, setIsStarted] = useState(false)

  // Check winner
  const checkWinner = useCallback((currentBoard: Board): Player | "draw" | null => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6], // Diagonals
    ]

    for (const [a, b, c] of lines) {
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return currentBoard[a]
      }
    }

    if (currentBoard.every(cell => cell !== null)) {
      return "draw"
    }

    return null
  }, [])

  // Minimax algorithm for AI
  const minimax = useCallback((currentBoard: Board, depth: number, isMaximizing: boolean): number => {
    const result = checkWinner(currentBoard)

    if (result === "O") return 10 - depth
    if (result === "X") return depth - 10
    if (result === "draw") return 0

    if (isMaximizing) {
      let bestScore = -Infinity
      for (let i = 0; i < 9; i++) {
        if (currentBoard[i] === null) {
          currentBoard[i] = "O"
          const score = minimax(currentBoard, depth + 1, false)
          currentBoard[i] = null
          bestScore = Math.max(score, bestScore)
        }
      }
      return bestScore
    } else {
      let bestScore = Infinity
      for (let i = 0; i < 9; i++) {
        if (currentBoard[i] === null) {
          currentBoard[i] = "X"
          const score = minimax(currentBoard, depth + 1, true)
          currentBoard[i] = null
          bestScore = Math.min(score, bestScore)
        }
      }
      return bestScore
    }
  }, [checkWinner])

  // Find best move for AI
  const findBestMove = useCallback((currentBoard: Board): number => {
    let bestScore = -Infinity
    let bestMove = -1

    for (let i = 0; i < 9; i++) {
      if (currentBoard[i] === null) {
        currentBoard[i] = "O"
        const score = minimax([...currentBoard], 0, false)
        currentBoard[i] = null

        if (score > bestScore) {
          bestScore = score
          bestMove = i
        }
      }
    }

    return bestMove
  }, [minimax])

  // Initialize game
  const initializeGame = useCallback(() => {
    setBoard(Array(9).fill(null))
    setIsPlayerTurn(true)
    setWinner(null)
  }, [])

  // Start game
  const handleStart = () => {
    setIsStarted(true)
    initializeGame()
    onScoreChange(0)
  }

  // Restart game (play again after win/loss)
  const handlePlayAgain = () => {
    initializeGame()
    onRestart()
  }

  // Handle player move
  const handleCellClick = (index: number) => {
    if (!isStarted || board[index] || winner || !isPlayerTurn) return

    const newBoard = [...board]
    newBoard[index] = "X"
    setBoard(newBoard)
    setIsPlayerTurn(false)

    const gameResult = checkWinner(newBoard)
    if (gameResult) {
      setWinner(gameResult)
      if (gameResult === "X") {
        const newWins = wins + 1
        setWins(newWins)
        onScoreChange(newWins)
      } else if (gameResult === "draw") {
        setDraws(prev => prev + 1)
      }
    }
  }

  // AI move
  useEffect(() => {
    if (!isStarted || winner) return
    if (isPlayerTurn) return

    const timeout = setTimeout(() => {
      const bestMove = findBestMove([...board])
      if (bestMove !== -1) {
        const newBoard = [...board]
        newBoard[bestMove] = "O"
        setBoard(newBoard)
        setIsPlayerTurn(true)

        const gameResult = checkWinner(newBoard)
        if (gameResult) {
          setWinner(gameResult)
          if (gameResult === "O") {
            setLosses(prev => prev + 1)
          } else if (gameResult === "draw") {
            setDraws(prev => prev + 1)
          }
        }
      }
    }, 500)

    return () => clearTimeout(timeout)
  }, [isStarted, isPlayerTurn, winner, board, findBestMove, checkWinner])

  const getWinningLine = (): number[] | null => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ]

    for (const line of lines) {
      const [a, b, c] = line
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return line
      }
    }
    return null
  }

  const winningLine = getWinningLine()

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div className="grid grid-cols-3 gap-2 bg-[#2a2a2a] p-2 rounded-lg">
          {board.map((cell, index) => (
            <button
              key={index}
              onClick={() => handleCellClick(index)}
              disabled={!isStarted || !!cell || !!winner || !isPlayerTurn}
              className={`w-20 h-20 bg-[#1a1a1a] rounded-lg text-4xl font-bold transition-all
                ${cell === "X" ? "text-blue-400" : "text-red-400"}
                ${isStarted && !cell && !winner && isPlayerTurn ? "hover:bg-[#3a3a3a] cursor-pointer" : ""}
                ${winningLine?.includes(index) ? "bg-green-500/20" : ""}
              `}
            >
              {cell}
            </button>
          ))}
        </div>

        {/* Start overlay */}
        {!isStarted && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center rounded-lg">
            <p className="text-2xl font-bold text-white mb-4">Tic-Tac-Toe</p>
            <button
              onClick={handleStart}
              className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              <Play className="w-5 h-5" />
              Start Game
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-6 text-[var(--panel-text)]">
        <div>
          <span className="text-xs text-[var(--muted-text)]">Wins:</span>
          <span className="ml-2 font-semibold text-green-500">{wins}</span>
        </div>
        <div>
          <span className="text-xs text-[var(--muted-text)]">Losses:</span>
          <span className="ml-2 font-semibold text-red-500">{losses}</span>
        </div>
        <div>
          <span className="text-xs text-[var(--muted-text)]">Draws:</span>
          <span className="ml-2 font-semibold text-gray-500">{draws}</span>
        </div>
      </div>

      {winner && (
        <div className="text-center">
          <p className={`text-xl font-bold mb-2 ${
            winner === "X" ? "text-green-500" :
            winner === "O" ? "text-red-500" : "text-gray-500"
          }`}>
            {winner === "X" ? "You Win!" : winner === "O" ? "AI Wins!" : "Draw!"}
          </p>
          <button
            onClick={handlePlayAgain}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            Play Again
          </button>
        </div>
      )}

      <div className="text-[var(--muted-text)] text-sm text-center">
        <p>You are X, AI is O</p>
        <p>Get three in a row to win!</p>
      </div>
    </div>
  )
}
