'use client'

import { Assets } from '@/8th/assets/asset-library'
import Image from 'next/image'
import LanguageSelect from './LanguageSelect'

export default function AccountNav({
  onBack,
  locale,
  languages,
  onSelectLanguage,
}: {
  onBack?: () => void
  locale: string
  languages: { code: string; label: string }[]
  onSelectLanguage?: (locale: string) => void
}) {
  return (
    <header className="chrome">
      <button
        type="button"
        className="home-button"
        aria-label="Home"
        onClick={onBack}>
        <Image src={Assets.Icon.arrowLeftBlack} alt="" width={28} height={28} />
      </button>
      <LanguageSelect
        locale={locale}
        languages={languages}
        onSelectLanguage={onSelectLanguage}
      />
    </header>
  )
}
