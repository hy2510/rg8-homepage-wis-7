'use client'

import { useCustomerConfiguration } from '@/8th/application/context/CustomerContext'
import LibraryTabBar from '@/8th/features/library/ui/component/LibraryTabBar'
import { HpNewsStyled } from '@/8th/shared/styled/HpFeaturesStyled'
import { Gap } from '@/8th/shared/ui/Misc'
import SITE_PATH from '@/app/site-path'
import useTranslation from '@/localization/client/useTranslations'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

export default function NewsLayout({
  children,
}: {
  children?: React.ReactNode
}) {
  const pathname = usePathname()
  // @language 'common'
  const { t } = useTranslation()

  const {
    home: { news: menu },
  } = useCustomerConfiguration()

  const tabs: { href: string; label: string }[] = useMemo(() => {
    const tabs = []
    if (menu.notice.open) {
      tabs.push({ href: SITE_PATH.HOME_8TH.NOTICE, label: t('t8th0135') })
    }
    if (menu.newBooks.open) {
      tabs.push({ href: SITE_PATH.HOME_8TH.NEW_BOOKS, label: t('t8th0138') })
    }
    if (menu.challenge.open) {
      tabs.push({ href: SITE_PATH.HOME_8TH.CHALLENGE, label: t('t8th0137') })
    }
    if (menu.infographic.open) {
      tabs.push({ href: SITE_PATH.HOME_8TH.INFOGRAPHIC, label: t('t8th0136') })
    }
    if (menu.campaign.open) {
      tabs.push({ href: SITE_PATH.HOME_8TH.CAMPAIGN, label: t('t8th0139') })
    }
    if (menu.gallery.open) {
      tabs.push({ href: SITE_PATH.HOME_8TH.GALLERY, label: t('t8th0140') })
    }
    return tabs
  }, [t, menu])

  const activeHref = tabs
    .filter(
      (tab) => pathname.endsWith(tab.href) || pathname.includes(`${tab.href}/`),
    )
    .sort((a, b) => b.href.length - a.href.length)[0]?.href

  return (
    <HpNewsStyled>
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
    </HpNewsStyled>
  )
}
