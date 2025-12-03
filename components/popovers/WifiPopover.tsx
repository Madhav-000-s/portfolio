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
      <div className="px-4 py-2 border-b border-gray-200">
        <h3 className="font-semibold text-sm">WiFi Networks</h3>
      </div>
      <div className="max-h-60 overflow-auto">
        {wifiNetworks.map((network) => (
          <button
            key={network.name}
            className="w-full px-4 py-3 hover:bg-gray-100 transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Wifi className="w-4 h-4" />
              <span className="text-sm">{network.name}</span>
            </div>
            <div className="flex items-center gap-2">
              {network.connected && (
                <span className="text-xs text-blue-600 font-medium">Connected</span>
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
                        ? "bg-gray-800"
                        : "bg-gray-300"
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
