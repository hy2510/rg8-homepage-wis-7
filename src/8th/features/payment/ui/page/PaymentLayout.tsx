'use client'

import { useApplicationType } from '@/8th/application/context/ApplicationContext'
import { useCustomerConfiguration } from '@/8th/application/context/CustomerContext'
import LibraryTabBar from '@/8th/features/library/ui/component/LibraryTabBar'
import { HpMembershipStyled } from '@/8th/shared/styled/HpFeaturesStyled'
import { Gap } from '@/8th/shared/ui/Misc'
import SITE_PATH from '@/app/site-path'
import useTranslation from '@/localization/client/useTranslations'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

export default function PaymentLayout({
  children,
}: {
  children?: React.ReactNode
}) {
  const pathname = usePathname()
  // @language 'common'
  const { t } = useTranslation()

  const {
    home: { payment: menu },
  } = useCustomerConfiguration()
  const appType = useApplicationType()

  const tabs: { href: string; label: string }[] = useMemo(() => {
    const tabs = []
    if (menu.purchase.open) {
      tabs.push({
        href: SITE_PATH.HOME_8TH.PAYMENT_PURCHASE,
        label: t('t8th0189'),
      })
    }
    if (appType !== 'app' && menu.purchase.ticket.open) {
      tabs.push({
        href: SITE_PATH.HOME_8TH.PAYMENT_TICKET,
        label: t('t8th0190'),
      })
    }
    if (menu.purchase.open || menu.purchase.ticket.open) {
      tabs.push({
        href: SITE_PATH.HOME_8TH.PAYMENT_HISTORY,
        label: t('t8th0191'),
      })
      tabs.push({
        href: SITE_PATH.HOME_8TH.PAYMENT_REFUND_POLICY,
        label: t('t8th0192'),
      })
    }
    if (menu.invoice.open) {
      tabs.push({
        href: SITE_PATH.HOME_8TH.PAYMENT_UNPAID,
        label: t('t8th0193'),
      })
      tabs.push({
        href: SITE_PATH.HOME_8TH.PAYMENT_UNPAID_HISTORY,
        label: t('t8th0194'),
      })
    }

    return tabs
  }, [t, menu.purchase.open, menu.purchase.ticket.open, menu.invoice.open])

  const activeHref = tabs
    .filter(
      (tab) => pathname.endsWith(tab.href) || pathname.includes(`${tab.href}/`),
    )
    .sort((a, b) => b.href.length - a.href.length)[0]?.href

  return (
    <HpMembershipStyled>
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
    </HpMembershipStyled>
  )
}
