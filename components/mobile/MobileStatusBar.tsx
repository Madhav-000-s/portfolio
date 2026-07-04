"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

export default function MobileStatusBar() {
  const [time, setTime] = useState<Date | null>(null)

  useEffect(() => {
    setTime(new Date())
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })

  return (
    <div className="mobile-status-bar flex items-center justify-between px-4 py-2 text-white text-xs font-medium select-none">
      <span>{time ? formatTime(time) : ""}</span>
      <div className="flex items-center gap-2 text-gray-300">
        <span>{time ? formatDate(time) : ""}</span>
        <Image src="/icons/wifi.svg" alt="" width={14} height={14} className="opacity-80" />
      </div>
    </div>
  )
}
