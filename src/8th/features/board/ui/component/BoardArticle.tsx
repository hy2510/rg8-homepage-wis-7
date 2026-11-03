'use client'

import ArticleDownloadFile from './ArticleDownloadFile'

export type BoardArticleProps = {
  title: string
  date?: string
  file?: {
    url: string
    name: string
  }
  iframe?: {
    url: string
    height?: number
  }
  html?: {
    content?: string
    image?: string
    isImageFirst?: boolean
  }
}

export function BoardArticleLoading() {
  return (
    <article className="article">
      <div className="article-head">
        <h1 className="title skeleton-row"></h1>
        <time className="date skeleton-row"></time>
      </div>
      <div className="article-body">
        <div className="skeleton-row"></div>
      </div>
    </article>
  )
}

export default function BoardArticle({
  title,
  date,
  file,
  children,
}: {
  title: string
  date?: string
  file?: {
    url: string
    name: string
  }
  children?: React.ReactNode
}) {
  return (
    <article className="article">
      <div className="article-head">
        <h1>{title}</h1>
        {date && <time dateTime={date.replaceAll('.', '-')}>{date}</time>}
      </div>
      {!!file && <ArticleDownloadFile fileUrl={file.url} file={file.name} />}
      {children}
    </article>
  )
}
