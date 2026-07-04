"use client"

import useWindowStore from "@/store/useWindowStore"
import MarkdownContent from "@/components/MarkdownContent"

const TextFile = () => {
  const { closewindow, minimizewindow } = useWindowStore()
  const txtfileData = useWindowStore((state) => state.windows.txtfile?.data)

  const title = txtfileData?.title || "README.md"
  const content = txtfileData?.content || "No content available"
  const repoName = txtfileData?.repoName
  const isMarkdown = title.endsWith(".md")

  return (
    <div id="txtfile">
      {/* Window Header */}
      <div id="window-header">
        <h2>{title}</h2>
        <div id="window-controls">
          <div className="minimize" onClick={() => minimizewindow("txtfile")} />
          <div className="maximize" />
          <div className="close" onClick={() => closewindow("txtfile")} />
        </div>
      </div>

      <div className="txtfile-content">
        {isMarkdown ? (
          <div className="markdown-body">
            <MarkdownContent content={content} repoName={repoName} />
          </div>
        ) : (
          <pre>{content}</pre>
        )}
      </div>
    </div>
  )
}

TextFile.displayName = "TextFile"

export default TextFile
