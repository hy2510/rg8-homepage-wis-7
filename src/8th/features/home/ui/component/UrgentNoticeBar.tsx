'use client'

import { NoticeBanner } from '@/8th/features/board/model/home'
import Link from 'next/link'

export default function UrgentNoticeBar({ notice }: { notice: NoticeBanner }) {
  // 띠배너
  const bannerTime = Date.now()
  const bannerStartDate = getDate(notice.start)
  const bannerEndDate = getDate(notice.end)
  const bannerLink = notice.link
  const isBannerLinkExternal =
    bannerLink?.startsWith('http:') || bannerLink?.startsWith('https:')

  const isShowBanner =
    notice &&
    bannerTime - bannerStartDate.getTime() >= 0 &&
    bannerEndDate.getTime() - bannerTime >= 0

  if (!isShowBanner) {
    return null
  }

  const link = isBannerLinkExternal ? '#' : bannerLink ? bannerLink : ''
  const message = notice.message
  const bgColor = notice.bgColor

  const backgroundStyle = bgColor ? { backgroundColor: bgColor } : undefined
  return (
    <div className="notice" role="status" style={backgroundStyle}>
      <div className="notice-content">
        <Link href={link || ''}>
          <div
            style={{
              textAlign: 'center',
              borderRadius: '12px',
              minHeight: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <div
              dangerouslySetInnerHTML={{
                __html: message,
              }}
            />
          </div>
        </Link>
      </div>
    </div>
  )
}

function getDate(dateText?: string): Date {
  if (dateText && dateText.length >= 19) {
    const year = Number(dateText.substring(0, 4))
    const month = Number(dateText.substring(5, 7))
    const day = Number(dateText.substring(8, 10))
    const hour = Number(dateText.substring(11, 13))
    const minute = Number(dateText.substring(14, 16))
    const second = Number(dateText.substring(17, 19))
    return new Date(year, month - 1, day, hour, minute, second)
  }
  return new Date(0)
}
