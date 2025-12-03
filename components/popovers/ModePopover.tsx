import { Sun, Moon, Monitor } from "lucide-react"

export default function ModePopover() {
  const modes = [
    { icon: Sun, label: "Light", active: false },
    { icon: Moon, label: "Dark", active: false },
    { icon: Monitor, label: "System", active: true },
  ]

  return (
    <div className="py-2">
      <div className="px-4 py-2 border-b border-gray-200">
        <h3 className="font-semibold text-sm">Appearance</h3>
      </div>
      <div className="py-1">
        {modes.map(({ icon: Icon, label, active }) => (
          <button
            key={label}
            className={`w-full px-4 py-2 hover:bg-gray-100 transition-colors flex items-center justify-between ${
              active ? "bg-blue-50" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon className="w-4 h-4" />
              <span className="text-sm">{label}</span>
            </div>
            {active && (
              <div className="w-2 h-2 rounded-full bg-blue-600" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
