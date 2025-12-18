import { User, Settings, LogOut } from "lucide-react"

export default function UserPopover() {
  return (
    <div className="py-2">
      <div className="px-4 py-3 border-b border-[var(--card-border)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-sm text-[var(--panel-text)]">Guest User</p>
            <p className="text-xs text-[var(--muted-text)]">guest@portfolio.dev</p>
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
            className="w-full px-4 py-2 hover:bg-[var(--hover-bg)] transition-colors flex items-center gap-3"
          >
            <Icon className="w-4 h-4 text-[var(--panel-text)]" />
            <span className="text-sm text-[var(--panel-text)]">{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
