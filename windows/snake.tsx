"use client"

import { useState } from "react"
import { RotateCcw } from "lucide-react"
import useWindowStore from "@/store/useWindowStore"
import useGameStore from "@/store/useGameStore"
import SnakeGame from "./games/Snake"

const Snake = () => {
  const { closewindow, minimizewindow } = useWindowStore()
  const { highScores, setHighScore } = useGameStore()
  const [score, setScore] = useState(0)
  const [restartKey, setRestartKey] = useState(0)

  const bestScore = highScores.snake

  return (
    <div id="snake-window">
      {/* Window Header */}
      <div id="window-header">
        <h2>Snake</h2>
        <div id="window-controls">
          <div className="minimize" onClick={() => minimizewindow("snake")} />
          <div className="maximize" />
          <div className="close" onClick={() => closewindow("snake")} />
        </div>
      </div>

      {/* Game Area */}
      <div className="bg-[#2b2b2b] p-4 overflow-auto flex items-center justify-center" style={{ height: "calc(100% - 100px)" }}>
        <SnakeGame
          key={restartKey}
          onScoreChange={(newScore) => {
            setScore(newScore)
            setHighScore("snake", newScore)
          }}
          onRestart={() => setRestartKey(prev => prev + 1)}
        />
      </div>

      {/* Score Footer */}
      <div className="bg-[#2b2b2b] border-t border-[#3d3d3d] px-4 py-3 flex items-center justify-between">
        <div className="flex gap-6">
          <div>
            <span className="text-xs text-[var(--muted-text)]">Score:</span>
            <span className="ml-2 text-sm font-semibold text-[var(--panel-text)]">{score}</span>
          </div>
          <div>
            <span className="text-xs text-[var(--muted-text)]">Best:</span>
            <span className="ml-2 text-sm font-semibold text-[var(--panel-text)]">{bestScore}</span>
          </div>
        </div>
        <button
          onClick={() => setRestartKey(prev => prev + 1)}
          className="flex items-center gap-2 px-3 py-1.5 bg-[var(--hover-bg)] hover:bg-[var(--hover-bg)]/80 rounded-lg text-sm font-medium text-[var(--panel-text)] transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Restart
        </button>
      </div>
    </div>
  )
}

export default Snake
