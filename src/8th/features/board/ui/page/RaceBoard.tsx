'use client'

import { Assets } from '@/8th/assets/asset-library'
import { AvatarExpression } from '@/8th/assets/avatar'
import { RgRaceRank } from '@/8th/features/rank/model/rg-race-rank'
import { RgRaceStage } from '@/8th/features/rank/model/rg-race-stage'
import {
  useRgRaceRank,
  useRgRaceRankInfinite,
  useRgRaceStage,
} from '@/8th/features/rank/service/rank-query'
import { AvatarImage } from '@/8th/shared/ui/Avatar'
import useTranslation from '@/localization/client/useTranslations'
import NumberUtils from '@/util/number-utils'
import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'

export default function RaceBoard() {
  // @language 'common'
  const { t } = useTranslation()

  const {
    data: raceStageData,
    isLoading: raceStageLoading,
    isSuccess: raceStageSuccess,
  } = useRgRaceStage()

  let defaultRaceStageId = ''
  if (!!raceStageData?.list && raceStageData?.list?.length > 0) {
    if (raceStageData.list[0].studentRaceStageId !== '0') {
      const target = raceStageData.list[0].studentRaceStageId
      const isContain = raceStageData.list.some((item) => {
        if (item.raceStageId === target) {
          return true
        }
        return false
      })
      defaultRaceStageId = isContain ? target : ''
    }
    if (!defaultRaceStageId) {
      defaultRaceStageId = raceStageData.list[0].raceStageId
    }
  }

  const {
    data: meData,
    isLoading: meLoading,
    isSuccess: meSuccess,
  } = useRgRaceRank(
    { raceStageId: defaultRaceStageId },
    {
      enabled: raceStageSuccess && raceStageData?.list?.length > 0,
    },
  )

  if (
    raceStageLoading ||
    meLoading ||
    !defaultRaceStageId ||
    raceStageData?.list?.length === 0
  ) {
    return (
      <div className="board">
        <h1 className="page-title">{t('t8th0180')}</h1>
      </div>
    )
  }

  return (
    <RaceBoardView
      me={meData?.user}
      raceStageList={raceStageData?.list ?? []}
      defaultStageId={defaultRaceStageId}
    />
  )
}

function RaceBoardView({
  me,
  raceStageList: stageList,
  defaultStageId,
}: {
  me?: RgRaceRank
  raceStageList: RgRaceStage[]
  defaultStageId: string
}) {
  // @language 'common'
  const { t } = useTranslation()

  const [currentStageId, setCurrentStageId] = useState<string>(defaultStageId)
  const raceRank = useRgRaceRankInfinite({
    raceStageId: currentStageId ?? defaultStageId,
  })

  const raceRankData = useMemo(() => {
    return raceRank.data?.pages.flatMap((page) => page.list) ?? []
  }, [raceRank.data])

  const stageRowRef = useRef<HTMLDivElement>(null)
  const didCenterInitialStage = useRef(false)

  useEffect(() => {
    if (currentStageId == null || didCenterInitialStage.current) return
    if (!stageList?.length) return

    let cancelled = false
    let frame = 0
    let tries = 0

    const tick = () => {
      if (cancelled || didCenterInitialStage.current) return
      const row = stageRowRef.current
      const cards = row?.querySelectorAll<HTMLElement>('.stage-card')
      const ready =
        !!row &&
        !!cards &&
        cards.length === stageList.length &&
        Array.from(cards).every((card) => card.offsetWidth > 0)

      if (!ready && tries < 30) {
        tries += 1
        frame = requestAnimationFrame(tick)
        return
      }
      if (!row) return

      frame = requestAnimationFrame(() => {
        if (cancelled || didCenterInitialStage.current) return
        const currentRow = stageRowRef.current
        if (!currentRow) return
        stageList.find((item) => item.raceStageId === currentStageId)
        const moved = scrollStageToCenter(currentRow, currentStageId, 'smooth')
        if (moved) didCenterInitialStage.current = true
      })
    }

    frame = requestAnimationFrame(tick)
    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
    }
  }, [currentStageId, stageList])

  const scrollStages = (direction: -1 | 1) => {
    const row = stageRowRef.current
    if (!row) return
    row.scrollBy({
      left: direction * Math.max(row.clientWidth * 0.75, 240),
      behavior: 'smooth',
    })
  }

  const currentStageInfoIndex = stageList.findIndex(
    (item) => item.raceStageId === currentStageId,
  )
  const currentStageInfo =
    stageList.length > currentStageInfoIndex
      ? stageList[currentStageInfoIndex]
      : undefined
  const nextStageInfo =
    stageList.length > currentStageInfoIndex + 1
      ? stageList[currentStageInfoIndex + 1]
      : undefined

  return (
    <div className="board">
      <h1 className="page-title">{t('t8th0180')}</h1>

      <div className="stage-carousel">
        <button
          type="button"
          className="stage-scroll-button is-prev"
          aria-label={t('t8th0181')}
          onClick={() => scrollStages(-1)}>
          <CarouselArrowIcon />
        </button>
        <div className="stage-row" ref={stageRowRef}>
          {stageList.map((item, index) => (
            <button
              type="button"
              key={item.raceStageId}
              data-stage-id={item.raceStageId}
              className={`stage-card${item.raceStageId === currentStageId ? ' is-active' : ''}`}
              onClick={() => {
                const row = stageRowRef.current
                if (row) scrollStageToCenter(row, item.raceStageId, 'smooth')
                console.log('item.raceStageId', item.raceStageId)
                setCurrentStageId(item.raceStageId)
              }}>
              <Image
                src={RGRaceStageIcon[index]}
                alt={item.stageName}
                width={80}
                height={80}
                style={{
                  filter:
                    !me || me.rgPoint > item.minRgPoint
                      ? undefined
                      : 'grayscale(100%) brightness(1.1)',
                }}
              />
              <strong>{item.stageName}</strong>
              <span>
                {item.minRgPoint} ~ {item.maxRgPoint}P
              </span>
            </button>
          ))}
        </div>
        <button
          type="button"
          className="stage-scroll-button is-next"
          aria-label={t('t8th0183')}
          onClick={() => scrollStages(1)}>
          <CarouselArrowIcon />
        </button>
      </div>

      {me && me.raceStageId === currentStageId && (
        <MyInfo
          myInfo={me}
          minPoint={currentStageInfo?.minRgPoint ?? 0}
          maxPoint={currentStageInfo?.maxRgPoint ?? 0}
          nextStep={nextStageInfo?.stageName}
        />
      )}

      <LeaderList
        title={t('t8th0185')}
        caption={t('t8th0186')}
        rows={raceRankData}
        maxPoint={currentStageInfo?.maxRgPoint ?? 0}
        canMore={raceRank.hasNextPage}
        onMore={() => {
          raceRank.fetchNextPage()
        }}
      />
    </div>
  )
}

function MyInfo({
  myInfo,
  minPoint,
  maxPoint,
  nextStep,
}: {
  myInfo: RgRaceRank
  minPoint: number
  maxPoint: number
  nextStep?: string
}) {
  // @language 'common'
  const { t } = useTranslation()

  return (
    <section className="my-info">
      <h2>{t('t8th0172')}</h2>
      <p className="my-progress">
        <svg
          className="my-progress-icon"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden>
          <circle
            cx="12"
            cy="12"
            r="10"
            fill="#EAF9FC"
            stroke="#58CBE3"
            strokeWidth="1.5"
          />
          <path
            d="M12 10.7V16"
            stroke="#0089AD"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <circle cx="12" cy="7.7" r="1.25" fill="#0089AD" />
        </svg>
        {nextStep
          ? t('t8th0184', {
              num: NumberUtils.toRgDecimalPoint(maxPoint - myInfo.rgPoint),
              name: nextStep,
            })
          : null}
      </p>

      <div className="my-card">
        <span className="rank">#{myInfo.stageRank}</span>
        <div className="who">
          <div style={{ width: 52, height: 52 }}>
            <AvatarImage avatarId={myInfo.avatarId} size="small" />
          </div>
          <div>
            <strong>{myInfo.studentName}</strong>
            <span>{myInfo.customerName}</span>
          </div>
        </div>
        <span className="points">
          {`${NumberUtils.toRgDecimalPoint(myInfo.rgPoint)}/${maxPoint}P`}
        </span>
      </div>
    </section>
  )
}

function LeaderList({
  title,
  caption,
  rows,
  maxPoint,
  canMore,
  onMore,
}: {
  title: string
  caption: string
  rows: RgRaceRank[]
  maxPoint: number
  canMore: boolean
  onMore: () => void
}) {
  // @language 'common'
  const { t } = useTranslation()

  return (
    <section className="leader-list">
      <div className="list-head">
        <h2>{title}</h2>
        <p>{caption}</p>
      </div>
      <div className="table-head" aria-hidden>
        <span>{t('t8th0187')}</span>
        <span>{t('t8th0188')}</span>
        <span>{t('t8th248')}</span>
      </div>
      <ol>
        {rows.map((row) => (
          <li key={`${row.raceStageId}-${row.studentId}`}>
            <div className="leader-row">
              <span className="rank">#{row.stageRank}</span>
              <div className="who">
                <div className="avatar-wrap">
                  {row.stageRank <= 3 && (
                    <span className="crown" aria-hidden>
                      <CrownIcon />
                    </span>
                  )}

                  <div style={{ width: 52, height: 52 }}>
                    <AvatarImage
                      avatarId={row.avatarId}
                      size="small"
                      expression={
                        row.stageRank <= 3
                          ? AvatarExpression.EXCITED
                          : AvatarExpression.DEFAULT
                      }
                    />
                  </div>
                </div>
                <div>
                  <strong>{row.studentName}</strong>
                  <span>
                    {row.customerName}
                    {/* {row.stageChangedDate ? ` · ${row.stageChangedDate}` : ''} */}
                  </span>
                </div>
              </div>
              <span className="points">
                {`${NumberUtils.toRgDecimalPoint(row.rgPoint)}/${maxPoint}P`}
              </span>
            </div>
          </li>
        ))}
      </ol>
      {canMore && (
        <button type="button" className="more-button" onClick={onMore}>
          {t('t8th0154')}
        </button>
      )}
    </section>
  )
}

function CrownIcon() {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden>
      <path
        d="M1.2 10.5h13.6L13.2 4.2l-3.1 2.4L8 1.4 5.9 6.6 2.8 4.2 1.2 10.5Z"
        fill="#F4B942"
      />
      <path d="M2 10.5h12v1.2H2z" fill="#E39B20" />
    </svg>
  )
}

function CarouselArrowIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="m15 5-7 7 7 7"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function scrollStageToCenter(
  row: HTMLElement,
  stageId: string,
  behavior: ScrollBehavior,
) {
  const card = row.querySelector<HTMLElement>(`[data-stage-id="${stageId}"]`)
  if (!card) return false

  const rowRect = row.getBoundingClientRect()
  const cardRect = card.getBoundingClientRect()
  const delta =
    cardRect.left + cardRect.width / 2 - (rowRect.left + rowRect.width / 2)
  const maxScroll = Math.max(0, row.scrollWidth - row.clientWidth)
  const next = Math.min(Math.max(0, row.scrollLeft + delta), maxScroll)

  if (behavior === 'smooth') {
    row.scrollTo({ left: next, behavior: 'smooth' })
    return true
  }

  const previous = row.style.scrollBehavior
  row.style.scrollBehavior = 'auto'
  row.scrollLeft = next
  row.style.scrollBehavior = previous
  return true
}

const RGRaceStageIcon = [
  Assets.RgRace.apple,
  Assets.RgRace.banana,
  Assets.RgRace.grapes,
  Assets.RgRace.peach,

  Assets.RgRace.fish,
  Assets.RgRace.turtle,
  Assets.RgRace.octopus,
  Assets.RgRace.orca,

  Assets.RgRace.rabbit,
  Assets.RgRace.fox,
  Assets.RgRace.deer,
  Assets.RgRace.tiger,

  Assets.RgRace.virgo,
  Assets.RgRace.libra,
  Assets.RgRace.sagittarius,
  Assets.RgRace.pisces,
]
