import { create } from "zustand"
import { persist } from "zustand/middleware"

interface GameScores {
  snake: number
  game2048: number
  memory: number
  tictactoe: number
}

interface GameStore {
  highScores: GameScores
  setHighScore: (game: keyof GameScores, score: number) => void
  resetHighScores: () => void
}

const DEFAULT_SCORES: GameScores = {
  snake: 0,
  game2048: 0,
  memory: 0,
  tictactoe: 0,
}

const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      highScores: DEFAULT_SCORES,

      setHighScore: (game, score) =>
        set((state) => ({
          highScores: {
            ...state.highScores,
            [game]: Math.max(state.highScores[game], score),
          },
        })),

      resetHighScores: () =>
        set({ highScores: DEFAULT_SCORES }),
    }),
    {
      name: "game-scores",
    }
  )
)

export default useGameStore
