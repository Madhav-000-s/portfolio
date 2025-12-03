import { Search } from "lucide-react"

export default function SearchPopover() {
  return (
    <div className="py-2">
      <div className="px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="px-4 py-2">
        <p className="text-xs text-gray-500 mb-2 font-medium">Quick Links</p>
        <div className="space-y-1">
          {["Projects", "Resume", "Contact"].map((item) => (
            <button
              key={item}
              className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
