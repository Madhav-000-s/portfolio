"use client"

import { useState, useCallback } from "react"
import { Play } from "lucide-react"

const EMOJIS = ["🎮", "🎯", "🎨", "🎭", "🎪", "🎸", "🎺", "🎻"]
const CARD_PAIRS = 8

type Card = {
  id: number
  emoji: string
  isFlipped: boolean
  isMatched: boolean
}

interface MemoryProps {
  onScoreChange: (score: number) => void
  onRestart: () => void
}

export default function Memory({ onScoreChange, onRestart }: MemoryProps) {
  const [cards, setCards] = useState<Card[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [matches, setMatches] = useState(0)
  const [gameWon, setGameWon] = useState(false)
  const [canFlip, setCanFlip] = useState(true)
  const [isStarted, setIsStarted] = useState(false)

  // Initialize game
  const initializeGame = useCallback(() => {
    const shuffledCards: Card[] = []
    const emojiPairs = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)

    emojiPairs.forEach((emoji, index) => {
      shuffledCards.push({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      })
    })

    setCards(shuffledCards)
    setFlippedCards([])
    setMoves(0)
    setMatches(0)
    setGameWon(false)
    setCanFlip(true)
    onScoreChange(0)
  }, [onScoreChange])

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

  // Handle card click
  const handleCardClick = (cardId: number) => {
    if (!canFlip || !isStarted) return

    const card = cards.find(c => c.id === cardId)
    if (!card || card.isFlipped || card.isMatched) return

    // Flip the card
    setCards(prev =>
      prev.map(c => c.id === cardId ? { ...c, isFlipped: true } : c)
    )

    const newFlippedCards = [...flippedCards, cardId]
    setFlippedCards(newFlippedCards)

    if (newFlippedCards.length === 2) {
      setCanFlip(false)
      setMoves(prev => prev + 1)

      const [firstId, secondId] = newFlippedCards
      const firstCard = cards.find(c => c.id === firstId)
      const secondCard = cards.find(c => c.id === secondId)

      if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
        // Match found
        setTimeout(() => {
          setCards(prev =>
            prev.map(c =>
              c.id === firstId || c.id === secondId
                ? { ...c, isMatched: true }
                : c
            )
          )
          setFlippedCards([])
          setCanFlip(true)

          const newMatches = matches + 1
          setMatches(newMatches)

          const newScore = Math.max(0, 1000 - (moves + 1) * 10)
          onScoreChange(newScore)

          if (newMatches === CARD_PAIRS) {
            setGameWon(true)
          }
        }, 500)
      } else {
        // No match
        setTimeout(() => {
          setCards(prev =>
            prev.map(c =>
              c.id === firstId || c.id === secondId
                ? { ...c, isFlipped: false }
                : c
            )
          )
          setFlippedCards([])
          setCanFlip(true)
        }, 1000)
      }
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: 320, height: 320 }}>
        <div className="grid grid-cols-4 gap-3">
          {(isStarted ? cards : Array.from({ length: 16 })).map((card, index) => (
            <div
              key={isStarted && card ? (card as Card).id : index}
              onClick={() => isStarted && card && handleCardClick((card as Card).id)}
              className={`relative cursor-pointer ${
                isStarted && card && (card as Card).isMatched ? "opacity-50 pointer-events-none" : ""
              }`}
              style={{ width: 70, height: 70 }}
            >
              <div
                className={`absolute w-full h-full transition-all duration-500`}
                style={{
                  transformStyle: "preserve-3d",
                  transform: isStarted && card && ((card as Card).isFlipped || (card as Card).isMatched)
                    ? "rotateY(180deg)"
                    : "rotateY(0)",
                }}
              >
                {/* Card Back - Dark Theme */}
                <div
                  className="absolute w-full h-full bg-gradient-to-br from-[#3a3a3a] to-[#2a2a2a] rounded-lg flex items-center justify-center shadow-lg border border-[#4a4a4a]"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <span className="text-2xl text-gray-500">?</span>
                </div>

                {/* Card Front - Dark Theme */}
                <div
                  className="absolute w-full h-full bg-[#2a2a2a] rounded-lg flex items-center justify-center shadow-lg border border-[#4a4a4a]"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <span className="text-4xl">{isStarted && card ? (card as Card).emoji : ""}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Start overlay */}
        {!isStarted && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center rounded-lg">
            <p className="text-2xl font-bold text-white mb-4">Memory Match</p>
            <button
              onClick={handleStart}
              className="flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors"
            >
              <Play className="w-5 h-5" />
              Start Game
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-6 text-[var(--panel-text)]">
        <div>
          <span className="text-xs text-[var(--muted-text)]">Moves:</span>
          <span className="ml-2 font-semibold">{moves}</span>
        </div>
        <div>
          <span className="text-xs text-[var(--muted-text)]">Matches:</span>
          <span className="ml-2 font-semibold">{matches}/{CARD_PAIRS}</span>
        </div>
      </div>

      {gameWon && (
        <div className="text-center">
          <p className="text-xl font-bold text-green-500 mb-2">
            You Won in {moves} moves!
          </p>
          <button
            onClick={handleRestart}
            className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors"
          >
            Play Again
          </button>
        </div>
      )}

      <div className="text-[var(--muted-text)] text-sm text-center">
        <p>Click cards to flip them</p>
        <p>Match all pairs to win!</p>
      </div>
    </div>
  )
}
