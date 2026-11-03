'use client'

import { useState } from 'react'
import Icon from './Icon'

export default function WorkbookPages({
  images,
  title,
}: {
  images: string[]
  title: string
}) {
  const [page, setPage] = useState(0)
  const [failedUrl, setFailedUrl] = useState<string | null>(null)
  const current = Math.min(page, Math.max(0, images.length - 1))
  const source = images[current]
  return (
    <div
      className="workbook-viewer"
      role="region"
      aria-label={`${title} pages`}>
      <div className="workbook-page-row">
        <button
          type="button"
          className="page-arrow"
          aria-label="Previous page"
          disabled={current === 0}
          onClick={() => setPage(current - 1)}>
          <Icon name="arrow" size={20} />
        </button>
        <div className="workbook-page">
          {source && failedUrl !== source ? (
            <img
              key={source}
              src={source}
              alt={`${title}, page ${current + 1}`}
              width={595}
              height={842}
              onError={() => setFailedUrl(source)}
            />
          ) : (
            <div className="workbook-placeholder">
              <strong>{title}</strong>
              <p>
                {source
                  ? 'Unable to load this page.'
                  : 'Pages will be available here.'}
              </p>
            </div>
          )}
        </div>
        <button
          type="button"
          className="page-arrow"
          aria-label="Next page"
          disabled={current >= images.length - 1}
          onClick={() => setPage(current + 1)}>
          <Icon name="arrow" size={20} />
        </button>
      </div>
      {images.length > 0 && (
        <nav
          className="workbook-pagination"
          aria-label={`${title} page selection`}>
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Page ${index + 1}`}
              aria-current={current === index ? 'page' : undefined}
              onClick={() => setPage(index)}>
              {index + 1}
            </button>
          ))}
        </nav>
      )}
      <span className="workbook-page-status" aria-live="polite">
        {images.length ? `${current + 1} / ${images.length}` : '0 / 0'}
      </span>
    </div>
  )
}
