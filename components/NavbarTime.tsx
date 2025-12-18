"use client"

import { useEffect, useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import CalendarPopover from "./popovers/CalendarPopover"

export default function NavbarTime() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <time className="cursor-pointer hover:bg-[var(--hover-bg)] px-2 py-1 rounded transition-colors">
          {formatDate(time)} {formatTime(time)}
        </time>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-72 bg-[var(--popover-bg)] backdrop-blur-xl border-[var(--popover-border)] shadow-2xl rounded-xl p-0"
      >
        <CalendarPopover />
      </PopoverContent>
    </Popover>
  )
}
