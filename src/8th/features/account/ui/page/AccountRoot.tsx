'use client'

import AccountNav from '@/8th/features/account/ui/component/AccountNavigation'
import { ENGLISH, KOREAN, VIETNAMESE } from '@/localization/localize-config'
import { useParams, usePathname, useRouter } from 'next/navigation'

export default function AccountRoot({
  children,
}: {
  children?: React.ReactNode
}) {
  const languages = [
    { code: KOREAN, label: '한국어' },
    { code: ENGLISH, label: 'English' },
    { code: VIETNAMESE, label: 'Tiếng Việt' },
  ]
  const router = useRouter()

  const pathname = usePathname()
  const params = useParams<{ locale?: string }>()
  const locale = params.locale || 'ko'

  const handleSelectLanguage = (locale: string) => {
    const parts = pathname.split('/').filter(Boolean)
    if (languages.find((language) => language.code === parts[0])) {
      parts[0] = locale
    } else {
      parts.unshift(locale)
    }
    const query = window.location.search
    window.location.replace(`/${parts.join('/')}${query}`)
  }

  return (
    <AccountNav
      locale={locale}
      languages={languages}
      onSelectLanguage={handleSelectLanguage}>
      {children}
    </AccountNav>
  )
}
