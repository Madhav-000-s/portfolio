"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function CalendarPopover() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const today = new Date()

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate()

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay()

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1))
  }

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    )
  }

  return (
    <div className="py-2">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--card-border)]">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-1 hover:bg-[var(--hover-bg)] rounded transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-[var(--panel-text)]" />
        </button>
        <h3 className="font-semibold text-sm text-[var(--panel-text)]">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <button
          onClick={() => navigateMonth(1)}
          className="p-1 hover:bg-[var(--hover-bg)] rounded transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-[var(--panel-text)]" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 px-2 py-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div key={day} className="text-center text-xs text-[var(--muted-text)] font-medium">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 px-2 pb-2">
        {/* Empty cells for days before month starts */}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="w-8 h-8" />
        ))}

        {/* Day cells */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          return (
            <button
              key={day}
              className={`
                w-8 h-8 text-sm rounded-full flex items-center justify-center
                transition-colors hover:bg-[var(--hover-bg)]
                ${isToday(day) ? "bg-[#0078d4] text-white hover:bg-[#0078d4]" : "text-[var(--panel-text)]"}
              `}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}
