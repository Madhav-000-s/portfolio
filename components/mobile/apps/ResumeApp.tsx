"use client"

import { useEffect, useRef, useState } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { ChevronLeft, ChevronRight, Download, Loader2 } from "lucide-react"

// Configure PDF.js worker (same CDN setup as the desktop viewer)
if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`
}

export default function ResumeApp() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [numPages, setNumPages] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)
  const [pageWidth, setPageWidth] = useState(0)

  // Fit the PDF page to the container width
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setPageWidth(containerRef.current.clientWidth - 16)
      }
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [])

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
    setPageNumber(1)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 bg-[#2b2b2b] border-b border-[#3d3d3d] shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPageNumber((p) => Math.max(p - 1, 1))}
            disabled={pageNumber <= 1}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-300 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs text-gray-400">
            {numPages ? `${pageNumber} / ${numPages}` : ""}
          </span>
          <button
            onClick={() => setPageNumber((p) => Math.min(p + 1, numPages))}
            disabled={pageNumber >= numPages}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-300 disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <a
          href="/files/resume.pdf"
          download="resume.pdf"
          className="flex items-center gap-1.5 text-xs text-white bg-[#0078d4] px-3 py-1.5 rounded-full active:scale-95 transition-transform"
        >
          <Download className="w-3.5 h-3.5" />
          Download
        </a>
      </div>

      <div ref={containerRef} className="flex-1 overflow-y-auto overscroll-contain p-2 bg-[#323232]">
        <Document
          file="/files/resume.pdf"
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex items-center justify-center h-40 text-gray-400 gap-2 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading PDF...
            </div>
          }
          error={
            <p className="p-6 text-center text-sm text-red-400">
              Failed to load PDF.{" "}
              <a href="/files/resume.pdf" className="underline" target="_blank" rel="noopener noreferrer">
                Open it directly
              </a>
            </p>
          }
        >
          {pageWidth > 0 && (
            <Page
              pageNumber={pageNumber}
              width={pageWidth}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          )}
        </Document>
      </div>
    </div>
  )
}
