"use client"

import { useRef } from "react"
import useWindowStore from "@/store/useWindowStore"

const WindowWrapper = (Component: any, windowKey: string) => {
  const Wrapped = (props: any) => {
    const { focuswindow, windows } = useWindowStore()
    const windowState = windows[windowKey]
    const { isOpen, zIndex } = windowState || { isOpen: false, zIndex: 1000 }
    const ref = useRef<HTMLElement>(null)

    console.log(`WindowWrapper [${windowKey}]:`, { isOpen, zIndex, windowState })

    if (!isOpen) {
      console.log(`Window ${windowKey} is closed, not rendering`)
      return null
    }

    console.log(`Rendering window ${windowKey}`)

    const handleClick = () => {
      focuswindow(windowKey)
    }

    return (
      <section
        id={windowKey}
        ref={ref}
        style={{ zIndex }}
        className="absolute"
        onClick={handleClick}
      >
        <Component {...props} />
      </section>
    )
  }

  Wrapped.displayName = `WindowWrapper(${Component.displayName || Component.name || "Component"})`
  return Wrapped
}

export default WindowWrapper