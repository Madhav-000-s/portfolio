"use client"

import { Check } from "lucide-react"
import { techStack } from "@/constants"
import useWindowStore from "@/store/useWindowStore"

const Terminal = () => {
  const { closewindow, minimizewindow } = useWindowStore()

  return (
    <div id="terminal">
      {/* Window Header */}
      <div id="window-header">
        <h2>Skills</h2>
        <div id="window-controls">
          <div className="minimize" onClick={() => minimizewindow("terminal")} />
          <div className="maximize" />
          <div className="close" onClick={() => closewindow("terminal")} />
        </div>
      </div>

      {/* Terminal Content */}
      <div className="techstack">
        {/* Header */}
        <div className="label">
          <span className="text-[#00A154]">~</span>
          <span className="text-gray-600 ml-2">madhav@portfolio</span>
          <span className="text-gray-400 ml-2">:</span>
          <span className="text-blue-600 ml-2">~/skills</span>
          <span className="text-gray-400 ml-2">$</span>
          <span className="text-gray-600 ml-2">cat tech-stack.txt</span>
        </div>

        {/* Tech Stack List */}
        <div className="content">
          {techStack.map((stack, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="check" />
              <h3>{stack.category}</h3>
              <ul>
                {stack.items.map((item, idx) => (
                  <li key={idx} className="text-gray-700">
                    {item}
                    {idx < stack.items.length - 1 ? "," : ""}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </div>

        {/* Footer */}
        <div className="footnote">
          <p>
            <Check className="w-5" />
            <span>Total: {techStack.length} categories</span>
          </p>
          <p>
            <Check className="w-5" />
            <span>
              Technologies: {techStack.reduce((acc, s) => acc + s.items.length, 0)}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

Terminal.displayName = "Terminal"

export default Terminal
