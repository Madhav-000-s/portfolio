"use client"

import { useEffect, useRef, useState } from "react"
import { X } from "lucide-react"
import gsap from "gsap"

interface MobileAppSheetProps {
  title: string
  onClose: () => void
  children: React.ReactNode
}

export default function MobileAppSheet({ title, onClose, children }: MobileAppSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    if (!sheetRef.current) return
    gsap.fromTo(
      sheetRef.current,
      { yPercent: 100 },
      { yPercent: 0, duration: 0.4, ease: "power3.out" }
    )
  }, [])

  const handleClose = () => {
    if (closing || !sheetRef.current) return
    setClosing(true)
    gsap.to(sheetRef.current, {
      yPercent: 100,
      duration: 0.35,
      ease: "power3.in",
      onComplete: onClose,
    })
  }

  return (
    <div
      ref={sheetRef}
      className="fixed inset-0 z-50 flex flex-col bg-[#1e1e1e]"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="flex items-center justify-between px-4 py-3 bg-[#2b2b2b] border-b border-[#3d3d3d] shrink-0">
        <h2 className="text-white text-sm font-bold">{title}</h2>
        <button
          onClick={handleClose}
          aria-label="Close"
          className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-300 active:scale-90 transition-transform"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain">{children}</div>
    </div>
  )
}
