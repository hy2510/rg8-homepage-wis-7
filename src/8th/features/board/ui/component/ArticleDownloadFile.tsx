'use client'

import { useEffect, useRef, useState } from 'react'

export default function ArticleDownloadFile({
  fileUrl,
  file,
}: {
  fileUrl: string
  file: string
}) {
  const [isDownloading, setDownloading] = useState(false)
  const fileBlobRef = useRef<{ blob: Blob | null; url: string } | null>(null)
  const hiddenLinkRef = useRef<HTMLAnchorElement>(null)

  let fileName = file
  if (file.length > 28) {
    fileName = `${file.substring(0, 9)}...${file.substring(file.length - 9)}`
  }

  useEffect(() => {
    return () => {
      if (fileBlobRef.current) {
        URL.revokeObjectURL(fileBlobRef.current.url)
        fileBlobRef.current.blob = null
        fileBlobRef.current = null
      }
    }
  }, [])

  const getFileBlob = async (): Promise<{
    blob: Blob | null
    url: string
  } | null> => {
    try {
      if (fileBlobRef.current === null) {
        const response = await fetch(fileUrl)
        if (response.ok) {
          const blob = await response.blob()
          fileBlobRef.current = {
            blob,
            url: URL.createObjectURL(blob),
          }
        }
      }
      return fileBlobRef.current
    } catch (error) {}
    return null
  }

  const onDownloadClick = async () => {
    if (isDownloading) return

    setDownloading(true)
    const blobData = await getFileBlob()
    if (blobData !== null && blobData.blob !== null) {
      if (hiddenLinkRef.current) {
        if (!hiddenLinkRef.current.href) {
          hiddenLinkRef.current.href = blobData.url
          hiddenLinkRef.current.download = file
        }
        hiddenLinkRef.current.click()
      }
    }
    setDownloading(false)
  }

  return (
    <>
      <a ref={hiddenLinkRef} style={{ display: 'none' }} />
      <a
        className="article-file"
        onClick={(e) => {
          e.preventDefault()
          onDownloadClick()
        }}>
        <DownloadIcon />
        <span>{fileName}</span>
      </a>
    </>
  )
}

function DownloadIcon() {
  return (
    <svg
      className="file-icon"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden>
      <path
        d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 10L12 15L17 10"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 15V3"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
