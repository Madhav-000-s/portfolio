"use client"

import { navLinks, navIcons } from "@/constants"
import NavbarTime from "./NavbarTime"
import NavbarIcon from "./NavbarIcon"
import WifiPopover from "./popovers/WifiPopover"
import SearchPopover from "./popovers/SearchPopover"
import UserPopover from "./popovers/UserPopover"
import ModePopover from "./popovers/ModePopover"

export default function Navbar() {
  const getPopoverContent = (id: number) => {
    switch (id) {
      case 1:
        return <WifiPopover />
      case 2:
        return <SearchPopover />
      case 3:
        return <UserPopover />
      case 4:
        return <ModePopover />
      default:
        return null
    }
  }

  return (
    <nav>
      <div>
        <ul>
          {navLinks.map(({ id, name }) => (
            <li key={id}>
              <p>{name}</p>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <NavbarTime />
        <div className="flex items-center gap-2">
          {navIcons.map(({ id, img }) => (
            <NavbarIcon key={id} icon={img} popoverContent={getPopoverContent(id)} />
          ))}
        </div>
      </div>
    </nav>
  )
}