'use client'

import { Assets } from '@/8th/assets/asset-library'
import useTranslation from '@/localization/client/useTranslations'
import { useThumbnailLoaded } from '@/8th/shared/hook/useThumbnailLoaded'
import Image from 'next/image'

export interface DubbingCardProps {
  order: number
  levelRoundId: string
  levelGrade: string
  levelName: string
  topicTitle: string
  studyImagePath: string
  soloStudy?: {
    studyId: string
    studentHistoryId: string
    bookPoint: number
    endDate: string
  }
  fullStudy?: {
    studyId: string
    studentHistoryId: string
    bookPoint: number
    endDate: string
  }
  onClickCard?: (levelRoundId: string) => void
  onClickMode?: (levelRoundId: string, mode: 'solo' | 'full') => void
}

export default function DubbingCard({
  levelRoundId,
  topicTitle,
  studyImagePath,
  soloStudy,
  fullStudy,
  onClickCard,
  onClickMode,
}: DubbingCardProps) {
  // @Language 'common'
  const { t } = useTranslation()
  const { loaded, markLoaded } = useThumbnailLoaded(studyImagePath)

  return (
    <div className="dubbing-card" aria-label={topicTitle}>
      <div
        className="dubbing-card-thumbnail"
        onClick={onClickCard ? () => onClickCard(levelRoundId) : undefined}>
        <div
          className={`thumbnail-skeleton${loaded ? ' is-done' : ''}`}
          aria-hidden
        />
        <Image
          src={studyImagePath}
          alt=""
          fill
          sizes="(max-width: 480px) 100vw, 50vw"
          className={`thumbnail-img${loaded ? ' is-loaded' : ''}`}
          onLoad={markLoaded}
          onError={markLoaded}
        />
      </div>

      <div className="dubbing-card-info">
        <ModeStatusRow
          label={t('t8thdf024')}
          endDate={fullStudy?.endDate}
          onClickMode={
            onClickMode ? () => onClickMode(levelRoundId, 'full') : undefined
          }
        />
        <ModeStatusRow
          label={t('t8thdf023')}
          endDate={soloStudy?.endDate}
          onClickMode={
            onClickMode ? () => onClickMode(levelRoundId, 'solo') : undefined
          }
        />
      </div>
    </div>
  )
}

function ModeStatusRow({
  label,
  endDate,
  onClickMode,
}: {
  label: string
  endDate?: string
  onClickMode?: () => void
}) {
  const isCompleted = !!endDate
  const completedDate = endDate ?? '--'
  return (
    <div className="dubbing-card-status-row">
      <div className="dubbing-card-status-label-row" onClick={onClickMode}>
        <Image
          src={Assets.Icon.Study.checkMarkGold}
          alt=""
          width={20}
          height={20}
          className={`dubbing-card-check-icon ${isCompleted ? 'completed' : ''}`}
        />
        <span className="dubbing-card-status-label">{label}</span>
      </div>
      <span className="dubbing-card-status-date">{completedDate}</span>
    </div>
  )
}
