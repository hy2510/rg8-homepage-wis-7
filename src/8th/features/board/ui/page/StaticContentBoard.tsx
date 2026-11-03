'use client'

import BoardArticle, {
  BoardArticleLoading,
} from '@/8th/features/board/ui/component/BoardArticle'
import BoardList from '@/8th/features/board/ui/component/BoardList'
import { createContext, useContext, useEffect, useState } from 'react'
import ArticleIframe from '../component/ArticleIframe'

type StaticBoardItem = {
  id: string
  title: string
  url: string
  originUrl: string
}

const StaticContentBoardContext = createContext<
  { id?: string; setCurrentId: (id: string) => void } | undefined
>(undefined)

export default function StaticContentBoard({
  boards,
  recordPerPage = 10,
  children,
}: {
  boards: StaticBoardItem[]
  recordPerPage?: number
  children?: React.ReactNode
}) {
  const [currentPage, setCurrentPage] = useState(1)
  const [currentId, setCurrentId] = useState<string | undefined>(undefined)

  const maxPage = Math.ceil(boards.length / recordPerPage)
  const pageContents = boards.slice(
    (currentPage - 1) * recordPerPage,
    currentPage * recordPerPage,
  )

  const currentItem = boards.find((item) => item.id === currentId)

  const onPageClick = (page: number) => {
    if (page !== currentPage) {
      const pageContents = boards.slice(
        (page - 1) * recordPerPage,
        page * recordPerPage,
      )
      if (pageContents.length > 0) {
        setCurrentPage(page)
      }
    }
  }

  return (
    <StaticContentBoardContext.Provider value={{ id: currentId, setCurrentId }}>
      <StaticBoardView
        currentId={currentId}
        currentItem={currentItem}
        contents={pageContents}
        page={currentPage}
        maxPage={maxPage}
        onPageClick={onPageClick}
      />
      {children}
    </StaticContentBoardContext.Provider>
  )
}

export function CurrentContentUpdater({ id }: { id: string }) {
  const setCurrentId = useUpdateCurrentId()
  useEffect(() => {
    setCurrentId(id)
  }, [setCurrentId, id])
  return null
}

function useUpdateCurrentId() {
  const context = useContext(StaticContentBoardContext)
  if (!context) {
    throw new Error(
      'useStaticContentBoard must be used within a StaticContentBoard',
    )
  }
  return context.setCurrentId
}

function StaticBoardView({
  currentId,
  currentItem,
  contents,
  page,
  maxPage,
  onPageClick,
}: {
  currentId?: string
  currentItem?: StaticBoardItem
  contents: StaticBoardItem[]
  page: number
  maxPage: number
  onPageClick?: (page: number) => void
}) {
  useEffect(() => {
    if (window && currentId) {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [currentId])

  const totalContents = contents.length

  return (
    <div className="board">
      {!currentItem && <BoardArticleLoading />}
      {!!currentItem && (
        <BoardArticle key={currentItem.id} title={currentItem?.title || ''}>
          <ArticleIframe url={currentItem.originUrl} initialHeight={600} />
        </BoardArticle>
      )}

      {totalContents > 0 && (
        <BoardList
          loading={false}
          page={page}
          maxPage={maxPage}
          currentContentId={currentId}
          contents={contents}
          onPageClick={onPageClick}
        />
      )}
    </div>
  )
}
