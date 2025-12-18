import { Wifi } from "lucide-react"

const wifiNetworks = [
  { name: "Home WiFi", signal: "full", connected: true },
  { name: "Office Network", signal: "good", connected: false },
  { name: "Starbucks WiFi", signal: "medium", connected: false },
  { name: "Guest Network", signal: "weak", connected: false },
]

export default function WifiPopover() {
  return (
    <div className="py-2">
      <div className="px-4 py-2 border-b border-[var(--card-border)]">
        <h3 className="font-semibold text-sm text-[var(--panel-text)]">WiFi Networks</h3>
      </div>
      <div className="max-h-60 overflow-auto">
        {wifiNetworks.map((network) => (
          <button
            key={network.name}
            className="w-full px-4 py-3 hover:bg-[var(--hover-bg)] transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Wifi className="w-4 h-4 text-[var(--panel-text)]" />
              <span className="text-sm text-[var(--panel-text)]">{network.name}</span>
            </div>
            <div className="flex items-center gap-2">
              {network.connected && (
                <span className="text-xs text-blue-500 font-medium">Connected</span>
              )}
              <div className="flex gap-0.5">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 ${
                      network.signal === "full" ||
                      (network.signal === "good" && i < 3) ||
                      (network.signal === "medium" && i < 2) ||
                      (network.signal === "weak" && i < 1)
                        ? "bg-[var(--panel-text)]"
                        : "bg-[var(--card-border)]"
                    }`}
                    style={{ height: `${(i + 1) * 3}px` }}
                  />
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
