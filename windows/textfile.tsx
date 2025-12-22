"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import useWindowStore from "@/store/useWindowStore"
import { GITHUB_USERNAME } from "@/constants"

const TextFile = () => {
  const { closewindow } = useWindowStore()
  const txtfileData = useWindowStore((state) => state.windows.txtfile?.data)

  const title = txtfileData?.title || "README.md"
  const content = txtfileData?.content || "No content available"
  const repoName = txtfileData?.repoName
  const isMarkdown = title.endsWith(".md")

  // Custom components to transform relative image paths to GitHub raw URLs
  const components = {
    img: ({ src, alt, ...props }: any) => {
      let imageSrc = src
      if (src && !src.startsWith("http") && repoName) {
        // Remove leading ./ or /
        const cleanPath = src.replace(/^\.?\//, "")
        imageSrc = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${repoName}/main/${cleanPath}`
      }
      return <img src={imageSrc} alt={alt || ""} {...props} />
    },
  }

  return (
    <div id="txtfile">
      {/* Window Header */}
      <div id="window-header">
        <h2>{title}</h2>
        <div id="window-controls">
          <div className="minimize" />
          <div className="maximize" />
          <div className="close" onClick={() => closewindow("txtfile")} />
        </div>
      </div>

      <div className="txtfile-content">
        {isMarkdown ? (
          <div className="markdown-body">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={components}
            >
              {content}
            </ReactMarkdown>
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
