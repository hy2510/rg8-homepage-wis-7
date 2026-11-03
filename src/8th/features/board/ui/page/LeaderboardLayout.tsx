'use client'

import { useCustomerConfiguration } from '@/8th/application/context/CustomerContext'
import LibraryTabBar from '@/8th/features/library/ui/component/LibraryTabBar'
import { HpLeaderboardStyled } from '@/8th/shared/styled/HpFeaturesStyled'
import { Gap } from '@/8th/shared/ui/Misc'
import SITE_PATH from '@/app/site-path'
import useTranslation from '@/localization/client/useTranslations'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

export default function LeaderboardLayout({
  children,
}: {
  children?: React.ReactNode
}) {
  const pathname = usePathname()
  // @language 'common'
  const { t } = useTranslation()

  const {
    home: { leaderboard: menu },
  } = useCustomerConfiguration()

  const tabs: { href: string; label: string }[] = useMemo(() => {
    const tabs = []
    if (menu.race.open) {
      tabs.push({
        href: SITE_PATH.HOME_8TH.RG_RACE,
        label: t('t8th0144'),
      })
    }
    if (menu.hallOfFame.open) {
      tabs.push({
        href: SITE_PATH.HOME_8TH.HALL_OF_FAME,
        label: t('t8th0145'),
      })
    }
    if (menu.studentReview.open) {
      tabs.push({
        href: SITE_PATH.HOME_8TH.STUDENT_REVIEW,
        label: t('t8th0146'),
      })
    }
    if (menu.parentReview.open) {
      tabs.push({
        href: SITE_PATH.HOME_8TH.PARENT_REVIEW,
        label: t('t8th0147'),
      })
    }
    return tabs
  }, [
    t,
    menu.race.open,
    menu.hallOfFame.open,
    menu.studentReview.open,
    menu.parentReview.open,
  ])

  const activeHref = tabs
    .filter(
      (tab) => pathname.endsWith(tab.href) || pathname.includes(`${tab.href}/`),
    )
    .sort((a, b) => b.href.length - a.href.length)[0]?.href

  return (
    <HpLeaderboardStyled>
      <div className="tabs-wrap">
        <Gap size={20} />
        <LibraryTabBar
          items={tabs.map((tab) => ({
            ...tab,
            active: tab.href === activeHref,
          }))}
        />
      </div>
      {children}
    </HpLeaderboardStyled>
  )
}
