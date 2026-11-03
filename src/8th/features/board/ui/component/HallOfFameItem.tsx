'use client'

import { Assets } from '@/8th/assets/asset-library'
import { AvatarImage } from '@/8th/shared/ui/Avatar'
import useTranslation from '@/localization/client/useTranslations'
import Image from 'next/image'

export type HallOfFameLeaderProps = {
  rank: number
  name: string
  school: string
  point: number
  books: number
  medal: 'bronze' | 'silver' | 'gold' | 'platinum' | 'titanium'
  date: string
  avatar: string
}

export default function HallOfFameItem({
  row,
  highlight,
  showMedal,
}: {
  row: HallOfFameLeaderProps
  highlight?: boolean
  showMedal?: boolean
}) {
  // @Language 'common'
  const { t } = useTranslation()

  const rankIcon =
    showMedal && row.rank === 1
      ? Assets.Icon.Ranking.rank1Bg
      : showMedal && row.rank === 2
        ? Assets.Icon.Ranking.rank2Bg
        : showMedal && row.rank === 3
          ? Assets.Icon.Ranking.rank3Bg
          : undefined

  return (
    <div className={`hof-row${highlight ? ' is-me' : ''}`}>
      <span className="rank">
        {rankIcon ? (
          <Image
            src={rankIcon}
            alt={t('t8th0174', { num: row.rank })}
            width={36}
            height={36}
          />
        ) : (
          `#${row.rank}`
        )}
      </span>
      <div className="who">
        <div style={{ width: 52, height: 52 }}>
          <AvatarImage avatarId={row.avatar} size="small" />
        </div>
        <div>
          <strong>{row.name}</strong>
          <span>{row.school}</span>
        </div>
      </div>
      <span className="hof-date">{formatHallOfFameDate(row.date)}</span>
      <span className="hof-books">{row.books.toLocaleString()}</span>
      <span className="points">{row.point.toLocaleString()}P</span>
    </div>
  )
}

function formatHallOfFameDate(value: string) {
  const normalized = value.includes('T') ? value : value.replaceAll('.', '-')
  const date = new Date(normalized)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
