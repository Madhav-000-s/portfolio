"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import { GITHUB_USERNAME } from "@/constants"

interface MarkdownContentProps {
  content: string
  repoName?: string
}

// GitHub-flavored markdown renderer shared by the desktop txtfile window and
// the mobile About app. Pair with a `.markdown-body` wrapper for styling.
export default function MarkdownContent({ content, repoName }: MarkdownContentProps) {
  // Transform relative image paths to GitHub raw URLs
  const components = {
    img: ({ src, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => {
      let imageSrc = typeof src === "string" ? src : undefined
      if (imageSrc && !imageSrc.startsWith("http") && repoName) {
        // Remove leading ./ or /
        const cleanPath = imageSrc.replace(/^\.?\//, "")
        imageSrc = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${repoName}/main/${cleanPath}`
      }
      // eslint-disable-next-line @next/next/no-img-element -- arbitrary remote markdown images can't use next/image
      return <img src={imageSrc} alt={alt || ""} {...props} />
    },
  }

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={components}
    >
      {content}
    </ReactMarkdown>
  )
}
