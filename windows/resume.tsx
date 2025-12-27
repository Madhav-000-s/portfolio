"use client"

import { useState } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react"
import useWindowStore from "@/store/useWindowStore"

// Configure PDF.js worker
if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`
}

const Resume = () => {
  const { closewindow, minimizewindow } = useWindowStore()
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [scale, setScale] = useState<number>(1.0)

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
    setPageNumber(1)
  }

  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1))
  }

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages))
  }

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 2.0))
  }

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5))
  }

  return (
    <div id="resume">
      {/* Window Header */}
      <div id="window-header">
        <h2>Resume</h2>
        <div id="window-controls">
          <div className="minimize" onClick={() => minimizewindow("resume")} />
          <div className="maximize" />
          <div className="close" onClick={() => closewindow("resume")} />
        </div>
      </div>

      {/* PDF Controls */}
      <div className="pdf-controls">
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
            className="control-btn"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-600">
            Page {pageNumber} of {numPages}
          </span>
          <button
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
            className="control-btn"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={zoomOut} disabled={scale <= 0.5} className="control-btn">
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-600">{Math.round(scale * 100)}%</span>
          <button onClick={zoomIn} disabled={scale >= 2.0} className="control-btn">
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="pdf-container">
        <Document
          file="/files/resume.pdf"
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex items-center justify-center h-full text-gray-500">
              Loading PDF...
            </div>
          }
          error={
            <div className="flex items-center justify-center h-full text-red-500">
              Failed to load PDF. Please try again.
            </div>
          }
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>
      </div>
    </div>
  )
}

Resume.displayName = "Resume"

export default Resume
