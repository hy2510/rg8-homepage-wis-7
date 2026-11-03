'use client'

import { Assets } from '@/8th/assets/asset-library'
import useTranslation from '@/localization/client/useTranslations'
import Image from 'next/image'

export default function BoardPagination({
  page,
  maxPage,
  onPageClick,
}: {
  page: number
  maxPage: number
  onPageClick: (page: number) => void
}) {
  // @language 'common'
  const { t } = useTranslation()
  const pages = Array.from({ length: maxPage }, (_, index) => index + 1)
  const pageSize = 5
  const start = Math.floor((page - 1) / pageSize) * pageSize
  const visiblePages = pages.slice(start, start + pageSize)
  return (
    <div className="pagination" aria-label={t('t8th0141')}>
      <button
        type="button"
        className="page-button"
        aria-label={t('t8th0142')}
        disabled={page === 1}
        onClick={() => onPageClick(page - 1)}>
        <Image
          src={Assets.Icon.chevronLeftGray}
          alt=""
          width={16}
          height={16}
        />
      </button>
      {visiblePages.map((pageNumber) => (
        <button
          type="button"
          className={`page-button${pageNumber === page ? ' is-active' : ''}`}
          aria-current={pageNumber === page ? 'page' : undefined}
          key={pageNumber}
          onClick={() => onPageClick(pageNumber)}>
          {pageNumber}
        </button>
      ))}
      <button
        type="button"
        className="page-button"
        aria-label={t('t8th0143')}
        disabled={page === maxPage}
        onClick={() => onPageClick(page + 1)}>
        <Image
          src={Assets.Icon.chevronRightGray}
          alt=""
          width={16}
          height={16}
        />
      </button>
    </div>
  )
}
