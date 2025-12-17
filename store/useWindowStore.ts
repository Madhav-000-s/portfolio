import { INITIAL_Z_INDEX, WINDOW_CONFIG } from "@/constants"
import { create } from "zustand"
import { immer } from "zustand/middleware/immer"

interface WindowState {
  isOpen: boolean
  zIndex: number
  data: any
}

interface WindowStore {
  windows: Record<string, WindowState>
  nextZIndex: number
  openwindow: (windowKey: string, data?: any) => void
  closewindow: (windowKey: string) => void
  focuswindow: (windowKey: string) => void
}

const useWindowStore = create<WindowStore>()(
  immer((set) => ({
    windows: WINDOW_CONFIG,
    nextZIndex: INITIAL_Z_INDEX + 1,
    openwindow: (windowKey: string, data = null) =>
      set((state) => {
        console.log("Opening window:", windowKey, "Current state:", state.windows[windowKey])
        const win = state.windows[windowKey]
        if (win) {
          win.isOpen = true
          win.zIndex = state.nextZIndex
          win.data = data ?? win.data
          state.nextZIndex++
          console.log("After opening:", state.windows[windowKey])
        } else {
          console.error("Window not found:", windowKey)
        }
      }),
    closewindow: (windowKey: string) =>
      set((state) => {
        const win = state.windows[windowKey]
        if (win) {
          win.isOpen = false
          win.data = null
        }
      }),
    focuswindow: (windowKey: string) =>
      set((state) => {
        const win = state.windows[windowKey]
        if (win) {
          win.zIndex = state.nextZIndex++
        }
      }),
  }))
)

export default useWindowStore
