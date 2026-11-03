'use client'

import { Assets } from '@/8th/assets/asset-library'
import {
  useBoardCustomerReviewDetail,
  useBoardCustomerReviewListInfinite,
} from '@/8th/features/board/service/board-query'
import useTranslation from '@/localization/client/useTranslations'
import Image from 'next/image'
import { useCallback, useState } from 'react'

type WriteType = 'student' | 'parent'

function reviewTitle(
  item: { title: string; topYn: boolean },
  featuredLabel: string,
) {
  return `${item.topYn ? `${featuredLabel} ` : ''}${item.title}`
}

export default function CustomerReviewBoard({
  writeType,
}: {
  writeType: WriteType
}) {
  // @Language 'common'
  const { t } = useTranslation()

  const heading = writeType === 'student' ? t('t8th0149') : t('t8th0150')
  const modalLabel = writeType === 'student' ? t('t8th0146') : t('t8th0147')
  const featuredLabel = t('t8th0148')

  const reviewList = useBoardCustomerReviewListInfinite({ writeType })
  const lists = reviewList.data?.pages.flatMap((page) => page.board || []) ?? []

  const [selectedReview, setSelectedReview] = useState<string | undefined>(
    undefined,
  )
  const reviewDetail = useBoardCustomerReviewDetail(
    { writeType, id: selectedReview ?? '' },
    { enabled: !!selectedReview },
  )

  const closeModal = useCallback(() => {
    setSelectedReview(undefined)
  }, [])

  const onMoreClick = () => {
    reviewList.fetchNextPage()
  }

  if (reviewList.isError) {
    return (
      <div className="board">
        <h1 className="page-title">{heading}</h1>
        <div className="review-status">{t('t8th0151')}</div>
      </div>
    )
  }

  return (
    <div className="board">
      <h1 className="page-title">{heading}</h1>

      {reviewList.isLoading ? (
        <div className="review-status">{t('t8th0152')}</div>
      ) : (
        <ul className="review-list">
          {lists.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className="review-card"
                onClick={() => setSelectedReview(item.id)}>
                <h2>{reviewTitle(item, featuredLabel)}</h2>
                {/* {item.preview ? <p>{item.preview}</p> : null} */}
                <div className="review-meta">
                  <span>{item.writer}</span>
                  <time>{item.regDate.split('T')[0]}</time>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      {reviewList.hasNextPage && (
        <button
          type="button"
          className="more-button"
          disabled={reviewList.isFetching}
          onClick={onMoreClick}>
          {reviewList.isFetching ? t('t8th0153') : t('t8th0154')}
        </button>
      )}

      {selectedReview && (
        <div
          className="review-overlay"
          role="presentation"
          onClick={closeModal}>
          <div
            className="review-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="review-modal-title"
            onClick={(event) => event.stopPropagation()}>
            <div className="review-dialog-head">
              <div className="title" id="review-modal-title">
                {modalLabel}
              </div>
              <button
                type="button"
                className="btn-close"
                aria-label={t('t8th0155')}
                onClick={closeModal}>
                <Image
                  src={Assets.Icon.deleteBlack}
                  alt=""
                  width={24}
                  height={24}
                />
              </button>
            </div>
            <div className="review-dialog-body">
              <h2 className="review-article-title">
                {reviewTitle(
                  {
                    title: reviewDetail.data?.title || '',
                    topYn: reviewDetail.data?.topYn || false,
                  },
                  featuredLabel,
                )}
              </h2>
              <div className="review-article-meta">
                <span>{reviewDetail.data?.writer || ''}</span>
                <time>{reviewDetail.data?.regDate?.split('T')[0] || ''}</time>
              </div>
              {reviewDetail.isFetching && (
                <p className="review-status">{t('t8th0156')}</p>
              )}
              {reviewDetail.isError && (
                <p className="review-status">{t('t8th0157')}</p>
              )}
              <div
                className="review-html"
                dangerouslySetInnerHTML={{
                  __html: reviewDetail.data?.content || '',
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
