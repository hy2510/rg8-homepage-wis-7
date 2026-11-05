'use client'

import { useCustomerConfiguration } from '@/8th/application/context/CustomerContext'
import RankCategory, {
  RankCategoryItem,
} from '@/8th/features/rank/ui/component/RankCategory'
import { useReadingKingEventList } from '@/8th/features/readingking/service/readingking-query'
import { SubPageNavHeader } from '@/8th/shared/ui/SubPageNavHeader'
import SITE_PATH from '@/app/site-path'
import useTranslation from '@/localization/client/useTranslations'
import DateUtils from '@/util/date-utils'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import RankingChallenge from './layout/RankingChallenge'
import RankingHallOfFame from './layout/RankingHallOfFame'
import RankingLevelMaster from './layout/RankingLevelMaster'
import RankingMonth from './layout/RankingMonth'

type TabType =
  | 'earned-points-rank'
  | 'reading-king'
  | 'level-master'
  | 'hall-of-fame'
  | 'default'

export default function RankingRoot() {
  const { menu } = useCustomerConfiguration()
  const searchParams = useSearchParams()
  const isTotalPointsLink =
    searchParams.get('tab') === 'earned-points-rank' &&
    searchParams.get('period') === 'total' &&
    menu.rank.monthly.open

  // @Language 'common'
  const { t } = useTranslation()

  const tabs: RankCategoryItem[] = []
  if (menu.rank.monthly.open) {
    tabs.push({ label: t('t8th225'), value: 'earned-points-rank' })
  }
  if (menu.rank.readingking.open) {
    tabs.push({ label: t('t8th226'), value: 'reading-king' })
  }
  if (menu.rank.levelMaster.open) {
    tabs.push({ label: t('t8th227'), value: 'level-master' })
  }
  if (menu.rank.hallOfFame.open) {
    tabs.push({ label: t('t8th228'), value: 'hall-of-fame' })
  }

  const readingKingEvent = useReadingKingEventList({
    enabled: menu.rank.readingking.open,
  })
  let targetEventId = undefined
  if (readingKingEvent.data && readingKingEvent.data.list.length > 0) {
    const latestEvent = readingKingEvent.data.list[0]
    const dateRange = DateUtils.rangeDayCheck(
      DateUtils.createDate(latestEvent.startDate),
      DateUtils.createDate(latestEvent.endDate),
      new Date(),
    )
    if (-2 < dateRange && dateRange < 2) {
      targetEventId = latestEvent.eventId
    }
  }
  useEffect(() => {
    if (isTotalPointsLink) {
      setSelectedTab('earned-points-rank')
    } else if (!!targetEventId) {
      setSelectedTab('reading-king')
    }
  }, [targetEventId, isTotalPointsLink])

  const [selectedTab, setSelectedTab] = useState<TabType | undefined>(
    isTotalPointsLink
      ? 'earned-points-rank'
      : tabs.length > 0
        ? 'default'
        : undefined,
  )

  const currentTab = selectedTab === 'default' ? tabs[0].value : selectedTab

  return (
    <>
      <SubPageNavHeader
        title={t('t8th270')}
        parentPath={SITE_PATH.STUDENT_8TH.ACTIVITY}
      />
      {!!currentTab && (
        <RankCategory
          tabs={tabs}
          selectedTab={currentTab}
          setSelectedTab={(tab: string) => setSelectedTab(tab as TabType)}
        />
      )}

      {currentTab === 'earned-points-rank' && (
        <RankingMonth
          key={isTotalPointsLink ? 'total' : 'monthly'}
          initialPeriod={isTotalPointsLink ? 'total' : 'monthly'}
        />
      )}
      {currentTab === 'reading-king' && <RankingChallenge />}
      {currentTab === 'level-master' && <RankingLevelMaster />}
      {currentTab === 'hall-of-fame' && <RankingHallOfFame />}
    </>
  )
}
