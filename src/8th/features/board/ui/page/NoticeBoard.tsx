'use client'

import {
  useBoardNoticeDetail,
  useBoardNoticeList,
} from '@/8th/features/board/service/board-query'
import ArticleHtmlViewer from '@/8th/features/board/ui/component/ArticleHtmlViewer'
import BoardArticle, {
  BoardArticleLoading,
} from '@/8th/features/board/ui/component/BoardArticle'
import BoardList from '@/8th/features/board/ui/component/BoardList'
import { useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const NoticeBoardContext = createContext<
  { id?: string; setCurrentId: (id: string) => void } | undefined
>(undefined)

export default function NoticeBoard({
  basicPath,
  children,
}: {
  basicPath: string
  children: React.ReactNode
}) {
  const router = useRouter()

  const [currentPage, setCurrentPage] = useState(1)
  const [currentId, setCurrentId] = useState<string | undefined>(undefined)

  const notice = useBoardNoticeList({ page: currentPage })
  const noticeDetail = useBoardNoticeDetail(
    { notifyId: currentId || '' },
    {
      enabled: !!currentId,
    },
  )

  const board = useMemo(() => {
    return (
      notice.data?.board.map((board) => ({
        id: board.notifyId,
        title: board.title,
        date: board.registDate.split('T')[0],
        url: `${basicPath}/${board.notifyId}`,
      })) || []
    )
  }, [notice.data?.board, basicPath])

  useEffect(() => {
    if (
      !notice.isLoading &&
      !notice.isFetching &&
      board.length > 0 &&
      !currentId
    ) {
      router.replace(`${basicPath}/${board[0].id}`)
    }
  }, [notice.isLoading, notice.isFetching, board, router, currentId, basicPath])

  useEffect(() => {
    if (window && currentId) {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [currentId])

  const isLoading = notice.isLoading
  const isDetailLoading =
    isLoading || noticeDetail.isLoading || noticeDetail.isFetching
  const maxPage = notice.data?.page?.totalPages || 0

  const html = noticeDetail.data
    ? {
        content: noticeDetail.data.content || '',
        image: noticeDetail.data.attachImagePath || '',
      }
    : undefined
  const file = noticeDetail.data?.attachFilePath
    ? {
        url: noticeDetail.data.attachFilePath,
        name: noticeDetail.data.attachOriginFileName,
      }
    : undefined

  return (
    <NoticeBoardContext.Provider value={{ id: currentId, setCurrentId }}>
      <NoticeBoardView
        isLoading={isLoading}
        isArticleLoading={isDetailLoading}
        title={noticeDetail.data?.title}
        date={noticeDetail.data?.registDate.split('T')[0]}
        file={file}
        html={html}
        page={currentPage}
        maxPage={maxPage}
        currrentId={currentId}
        boardList={board}
        onPageClick={(page) => {
          if (currentPage !== page) {
            setCurrentPage(page)
          }
        }}
      />
      {children}
    </NoticeBoardContext.Provider>
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
  const context = useContext(NoticeBoardContext)
  if (!context) {
    throw new Error('useNoticeBoard must be used within a NoticeBoard')
  }
  return context.setCurrentId
}

function NoticeBoardView({
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
          <ArticleHtmlViewer html={html.content} image={html.image} />
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
