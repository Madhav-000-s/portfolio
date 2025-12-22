import { create } from "zustand"

interface SplashStore {
  isComplete: boolean
  setComplete: () => void
  reset: () => void
}

const useSplashStore = create<SplashStore>()((set) => ({
  isComplete: false,
  setComplete: () => set({ isComplete: true }),
  reset: () => set({ isComplete: false }),
}))

export default useSplashStore
