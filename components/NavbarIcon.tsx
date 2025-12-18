"use client"

import Image from "next/image"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface NavbarIconProps {
  icon: string
  popoverContent: React.ReactNode
}

export default function NavbarIcon({ icon, popoverContent }: NavbarIconProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="icon transition-all">
          <Image src={icon} alt="icon" width={20} height={20} />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-80 bg-[var(--popover-bg)] backdrop-blur-xl border-[var(--popover-border)] shadow-2xl rounded-xl"
      >
        {popoverContent}
      </PopoverContent>
    </Popover>
  )
}
