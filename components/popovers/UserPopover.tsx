import { User, Settings, LogOut } from "lucide-react"

export default function UserPopover() {
  return (
    <div className="py-2">
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-sm">Guest User</p>
            <p className="text-xs text-gray-500">guest@portfolio.dev</p>
          </div>
        </div>
      </div>
      <div className="py-1">
        {[
          { icon: User, label: "Profile" },
          { icon: Settings, label: "Settings" },
          { icon: LogOut, label: "Sign Out" },
        ].map(({ icon: Icon, label }) => (
          <button
            key={label}
            className="w-full px-4 py-2 hover:bg-gray-100 transition-colors flex items-center gap-3"
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm">{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
