'use client'

import Link from 'next/link'
import BoardPagination from './BoardPagination'

export default function BoardList({
  loading,
  skeletonCount = 12,
  contents,
  currentContentId,
  page,
  maxPage,
  onPageClick,
}: {
  loading: boolean
  skeletonCount?: number
  currentContentId?: string
  page?: number
  maxPage?: number
  contents?: { id: string; title: string; url: string; date?: string }[]
  onPageClick?: (page: number) => void
}) {
  if (loading) {
    return (
      <div className="board-section">
        <ul className="news-list">
          <BoardTitleItemSkeleton size={skeletonCount} />
        </ul>
      </div>
    )
  }
  return (
    <div className="board-section">
      {/* News List */}
      <ul className="news-list">
        {contents?.map((content) => (
          <BoardTitleItem
            key={content.id}
            title={content.title}
            date={content.date}
            url={content.url}
            isCurrent={currentContentId === content.id}
          />
        ))}
      </ul>
      {!!maxPage && maxPage > 1 && (
        <BoardPagination
          page={page ?? 1}
          maxPage={maxPage}
          onPageClick={(page) => {
            if (onPageClick) {
              onPageClick(page)
            }
          }}
        />
      )}
    </div>
  )
}

function BoardTitleItemSkeleton({ size }: { size: number }) {
  return (
    <>
      {Array.from({ length: size }).map((_, index) => (
        <div className="skeleton-row" key={index}>
          <span className="title" />
          <span className="date" />
        </div>
      ))}
    </>
  )
}

function BoardTitleItem({
  title,
  date,
  url,
  isCurrent,
}: {
  url: string
  title: string
  date?: string
  isCurrent?: boolean
}) {
  return (
    <li>
      <Link className={`news-item${isCurrent ? ' is-current' : ''}`} href={url}>
        <span className="title">{title}</span>
        <span className="date">{date}</span>
      </Link>
    </li>
  )
}
