import { Search } from "lucide-react"

export default function SearchPopover() {
  return (
    <div className="py-2">
      <div className="px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-text)]" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-[var(--hover-bg)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-[var(--panel-text)] placeholder:text-[var(--muted-text)]"
          />
        </div>
      </div>
      <div className="px-4 py-2">
        <p className="text-xs text-[var(--muted-text)] mb-2 font-medium">Quick Links</p>
        <div className="space-y-1">
          {["Projects", "Resume", "Contact"].map((item) => (
            <button
              key={item}
              className="w-full text-left px-3 py-2 hover:bg-[var(--hover-bg)] rounded text-sm text-[var(--panel-text)]"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
