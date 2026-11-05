'use client'

import { Assets } from '@/8th/assets/asset-library'
import HallOfFameBenefit from '@/8th/features/board/ui/component/HallOfFameBenefit'
import HallOfFameItem, {
  HallOfFameLeaderProps,
} from '@/8th/features/board/ui/component/HallOfFameItem'
import HallOfFameMeItem from '@/8th/features/board/ui/component/HallOfFameMeItem'
import HallOfFameTierButton from '@/8th/features/board/ui/component/HallOfFameTierButton'
import {
  useHallOfFameInfo,
  useHallOfFameRank,
  useHallOfFameRankInfinite,
} from '@/8th/features/rank/service/rank-query'
import useTranslation from '@/localization/client/useTranslations'
import Image from 'next/image'
import { useState } from 'react'
import {
  HallOfFameTier,
  getTierInfo,
  getTierNameCode,
  toTier,
} from '../util/hall-of-fame-util'

type HallOfFameLeaderItem = HallOfFameLeaderProps & {
  id: string
  tierRank: number
}

export default function HallOfFameBoard() {
  // @language 'common'
  const { t } = useTranslation()

  const {
    data: tierInfoData,
    isLoading: tierInfoLoading,
    isSuccess: tierInfoSuccess,
  } = useHallOfFameInfo()

  let defaultGradeId = ''
  if (!!tierInfoData?.list && tierInfoData?.list?.length > 0) {
    if (tierInfoData.list[0].studentHallOfFameGradeId !== '0') {
      const target = tierInfoData?.list?.[0]?.studentHallOfFameGradeId
      const isContain = tierInfoData.list.some((item) => {
        if (item.hallOfFameGradeId === target) {
          return true
        }
        return false
      })
      defaultGradeId = isContain ? target : ''
    }
    if (!defaultGradeId) {
      defaultGradeId =
        tierInfoData.list[tierInfoData.list.length - 1].hallOfFameGradeId
    }
  }

  const { data: meData, isLoading: meLoading } = useHallOfFameRank(
    {
      hallOfFameGradeId: defaultGradeId,
      page: 1,
    },
    {
      enabled: tierInfoSuccess && tierInfoData?.list?.length > 0,
    },
  )

  const tierList =
    tierInfoData?.list
      ?.filter((item) => !!toTier(item.gradeNameEng))
      ?.map((item) => {
        // FIXME 하드코딩 데이터 defaultTierInfo
        const tier = toTier(item.gradeNameEng)
        const defaultTierInfo = getTierInfo().find((ditem) => ditem.id === tier)
        return {
          gradeId: item.hallOfFameGradeId,
          tier: tier!,
          percent: item.studentPercent,
          totalUserCount: item.totalStudentCount,
          benefits: defaultTierInfo?.benefits || [],
          note: defaultTierInfo?.note || '',
        }
      }) || []

  let me: HallOfFameLeaderItem | undefined = undefined
  if (meData?.user) {
    const dataUser = meData.user
    const medal = toTier(dataUser.hallOfFameGrade)
    if (medal) {
      me = {
        id: dataUser.studentId,
        rank: dataUser.totalRank,
        tierRank: dataUser.gradeRank,
        name: dataUser.studentName,
        school: dataUser.customerName || dataUser.gradeName,
        point: dataUser.rgPoint,
        books: dataUser.bookCount,
        medal,
        date: dataUser.registDate,
        avatar: dataUser.avatarId,
      }
    }
  }

  if (
    tierInfoLoading ||
    meLoading ||
    !defaultGradeId ||
    tierList.length === 0
  ) {
    return (
      <div className="board hof">
        <h1 className="page-title">{t('t8th0158')}</h1>

        <div className="hof-hero">
          <svg
            className="hof-waves"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 24 150 28"
            preserveAspectRatio="none"
            shapeRendering="auto"
            aria-hidden>
            <defs>
              <path
                id="hof-gentle-wave"
                d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
              />
            </defs>
            <g className="hof-parallax">
              <use href="#hof-gentle-wave" x="48" y="0" />
              <use href="#hof-gentle-wave" x="48" y="3" />
              <use href="#hof-gentle-wave" x="48" y="5" />
              <use href="#hof-gentle-wave" x="48" y="7" />
            </g>
          </svg>
          <Image
            src={Assets.Image.HallOfFameTitle}
            alt={t('t8th0145')}
            width={1024}
            height={391}
            priority
          />
        </div>

        <div className="hof-tiers"></div>

        <section className="leader-list">
          <div className="list-head">
            <h2>
              {t('t8th0159')}
              <span className="hof-grade-label">{` · `}</span>
            </h2>
            <p>{t('t8th0160')}</p>
          </div>
          <div className="hof-table-head" aria-hidden>
            <span>{t('t8th0161')}</span>
            <span>{t('t8th0162')}</span>
            <span>{t('t8th0163')}</span>
            <span>{t('t8th0164')}</span>
            <span>{t('t8th0165')}</span>
          </div>
          <p className="empty">{t('t8th0166')}</p>
        </section>
      </div>
    )
  }

  return (
    <HallOfFameBoardView
      me={me}
      defaultGradeId={defaultGradeId!}
      tierList={tierList}
    />
  )
}

function HallOfFameBoardView({
  me,
  defaultGradeId,
  tierList,
}: {
  me?: HallOfFameLeaderItem
  defaultGradeId: string
  tierList: {
    gradeId: string
    tier: HallOfFameTier
    totalUserCount: number
    percent: number
    benefits: string[]
    note: string
  }[]
}) {
  // @language 'common'
  const { t } = useTranslation()

  const [gradeId, setGradeId] = useState<string>(defaultGradeId)
  const [openBenefit, setOpenBenefit] = useState(false)

  const { data, isLoading, hasNextPage, fetchNextPage } =
    useHallOfFameRankInfinite({
      hallOfFameGradeId: gradeId,
    })

  const rows =
    data?.pages
      ?.flatMap((page) => page.list)
      .map((item, index) => ({
        rank: item.gradeRank,
        name: item.studentName,
        school: item.customerName || item.gradeName,
        point: item.rgPoint,
        books: item.bookCount,
        medal: toTier(item.hallOfFameGrade) || 'bronze',
        date: item.registDate,
        avatar: item.avatarId,
        tierRank: item.no,
        id: item.studentId,
      })) || []

  const currentTier = tierList.find((item) => item.gradeId === gradeId)
  const currentTierName = currentTier
    ? t(getTierNameCode(currentTier.tier)!)
    : undefined

  return (
    <div className="board hof">
      <h1 className="page-title">{t('t8th0158')}</h1>

      <div className="hof-hero">
        <svg
          className="hof-waves"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 24 150 28"
          preserveAspectRatio="none"
          shapeRendering="auto"
          aria-hidden>
          <defs>
            <path
              id="hof-gentle-wave"
              d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
            />
          </defs>
          <g className="hof-parallax">
            <use href="#hof-gentle-wave" x="48" y="0" />
            <use href="#hof-gentle-wave" x="48" y="3" />
            <use href="#hof-gentle-wave" x="48" y="5" />
            <use href="#hof-gentle-wave" x="48" y="7" />
          </g>
        </svg>
        <Image
          src={Assets.Image.HallOfFameTitle}
          alt={t('t8th0145')}
          width={1024}
          height={391}
          priority
        />
      </div>

      {me && me.medal === currentTier?.tier && <HallOfFameMeItem row={me} />}

      <div className="hof-tiers">
        {tierList.map((item) => (
          <HallOfFameTierButton
            key={item.gradeId}
            tier={item.tier}
            active={item.gradeId === gradeId}
            percent={item.percent}
            onClick={() => setGradeId(item.gradeId)}
          />
        ))}
      </div>

      {currentTier && (
        <HallOfFameBenefit
          tier={currentTier.tier}
          percent={currentTier.percent}
          totalUserCount={currentTier.totalUserCount}
          benefits={currentTier.benefits}
          note={currentTier.note}
          onClick={() => setOpenBenefit(true)}
        />
      )}

      <section className="leader-list">
        <div className="list-head">
          <h2>
            {t('t8th0159')}
            <span className="hof-grade-label">{` · ${currentTierName}`}</span>
          </h2>
          <p>{t('t8th0160')}</p>
        </div>
        <div className="hof-table-head" aria-hidden>
          <span>{t('t8th0161')}</span>
          <span>{t('t8th0162')}</span>
          <span>{t('t8th0163')}</span>
          <span>{t('t8th0164')}</span>
          <span>{t('t8th0165')}</span>
        </div>
        {isLoading && rows.length === 0 ? (
          <p className="empty">{t('t8th0166')}</p>
        ) : rows.length === 0 ? (
          <p className="empty">{t('t8th0167')}</p>
        ) : (
          <ol>
            {rows.map((row) => (
              <li key={`${row.medal}-${row.rank}-${row.name}`}>
                <HallOfFameItem row={row} showMedal />
              </li>
            ))}
          </ol>
        )}
        {hasNextPage && (
          <button
            type="button"
            className="more-button"
            onClick={() => {
              fetchNextPage()
            }}>
            {t('t8th0154')}
          </button>
        )}
      </section>

      {openBenefit && (
        <div className="hof-overlay" role="presentation">
          <div
            className="hof-dialog"
            role="dialog"
            aria-labelledby="hof-benefit-title">
            <div className="hof-dialog-head">
              <strong id="hof-benefit-title">{t('t8th0168')}</strong>
              <button type="button" onClick={() => setOpenBenefit(false)}>
                {t('t8th0155')}
              </button>
            </div>
            <iframe
              title={t('t8th0169')}
              src="/src/html/page-contents/pc/ranking/ranking_03_scholarship_benefits_pop.html"
            />
          </div>
        </div>
      )}
    </div>
  )
}
