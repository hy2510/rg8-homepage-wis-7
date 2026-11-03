'use client'

import {
  useBoardGalleryDetail,
  useBoardGalleryList,
} from '@/8th/features/board/service/board-query'
import BoardArticle, {
  BoardArticleLoading,
} from '@/8th/features/board/ui/component/BoardArticle'
import BoardList from '@/8th/features/board/ui/component/BoardList'
import { useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import ArticleHtmlViewer from '../component/ArticleHtmlViewer'

const GalleryBoardContext = createContext<
  { id?: string; setCurrentId: (id: string) => void } | undefined
>(undefined)

export default function GalleryBoard({
  basicPath,
  recordPerPage = 10,
  children,
}: {
  basicPath: string
  recordPerPage?: number
  children: React.ReactNode
}) {
  const router = useRouter()

  const [currentPage, setCurrentPage] = useState(1)
  const [currentId, setCurrentId] = useState<string | undefined>(undefined)

  const gallery = useBoardGalleryList({ page: 1 })
  const galleryDetail = useBoardGalleryDetail(
    { boardId: currentId || '' },
    {
      enabled: !!currentId,
    },
  )

  const boards = useMemo(() => {
    return (
      gallery.data?.board.map((board) => ({
        id: board.boardId,
        title: board.title,
        date: board.registDate.split('T')[0],
        url: `${basicPath}/${board.boardId}`,
      })) || []
    )
  }, [gallery.data?.board, basicPath])

  useEffect(() => {
    if (
      !gallery.isLoading &&
      !gallery.isFetching &&
      boards.length > 0 &&
      !currentId
    ) {
      router.replace(`${basicPath}/${boards[0].id}`)
    }
  }, [
    gallery.isLoading,
    gallery.isFetching,
    boards,
    router,
    currentId,
    basicPath,
  ])

  useEffect(() => {
    if (window && currentId) {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [currentId])

  const isLoading = gallery.isLoading
  const isDetailLoading =
    isLoading || galleryDetail.isLoading || galleryDetail.isFetching

  const maxPage = Math.ceil(boards.length / recordPerPage)
  const pageContents = boards.slice(
    (currentPage - 1) * recordPerPage,
    currentPage * recordPerPage,
  )

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

  const html = galleryDetail.data
    ? {
        content: galleryDetail.data.content || '',
        image: galleryDetail.data.attachImagePath || '',
      }
    : undefined

  return (
    <GalleryBoardContext.Provider value={{ id: currentId, setCurrentId }}>
      <GalleryBoardView
        isLoading={isLoading}
        isArticleLoading={isDetailLoading}
        title={galleryDetail.data?.title}
        date={galleryDetail.data?.registDate.split('T')[0]}
        html={html}
        page={currentPage}
        maxPage={maxPage}
        currrentId={currentId}
        boardList={pageContents}
        onPageClick={onPageClick}
      />
      {children}
    </GalleryBoardContext.Provider>
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
  const context = useContext(GalleryBoardContext)
  if (!context) {
    throw new Error('useGalleryBoard must be used within a GalleryBoard')
  }
  return context.setCurrentId
}

function GalleryBoardView({
  isLoading,
  isArticleLoading,
  currrentId,
  title,
  date,
  file,
  html,
  page,
  maxPage,
  boardList,
  onPageClick,
}: {
  isLoading: boolean
  isArticleLoading: boolean
  currrentId?: string
  title?: string
  date?: string
  file?: { url: string; name: string }
  html?: { content: string; image: string }
  page: number
  maxPage: number
  boardList: { id: string; title: string; url: string; date?: string }[]
  onPageClick?: (page: number) => void
}) {
  return (
    <div className="board">
      {isArticleLoading && <BoardArticleLoading />}
      {!!title && date && html && (
        <BoardArticle key={currrentId} title={title} date={date} file={file}>
          <ArticleHtmlViewer
            html={html.content}
            image={html.image}
            isImageFirst={true}
          />
        </BoardArticle>
      )}
      <BoardList
        loading={isLoading}
        page={page}
        maxPage={maxPage}
        currentContentId={currrentId}
        contents={boardList}
        onPageClick={onPageClick}
      />
    </div>
  )
}
