'use client'

import { Assets } from '@/8th/assets/asset-library'
import { useLanguagePackContext } from '@/localization/client/LanguagePackContext'
import useTranslation from '@/localization/client/useTranslations'
import { ENGLISH, KOREAN, VIETNAMESE } from '@/localization/localize-config'
import Image from 'next/image'
import { usePathname, useSearchParams } from 'next/navigation'
import { useMemo, useState } from 'react'
import { AccountPageHeaderStyle } from '../../../styled/SharedStyled'
import DropdownMenu from '../../Dropdowns'
import { TextStyle } from '../../Misc'

const LANGUAGE_OPTIONS = [
  { code: KOREAN, labelKey: 'korean' },
  { code: ENGLISH, labelKey: 'english' },
  { code: VIETNAMESE, labelKey: 'vietnamese' },
] as const

export default function AccountPageHeader() {
  return (
    <AccountPageHeaderStyle>
      <GoBackButton />
      <LanguageSwitcher />
    </AccountPageHeaderStyle>
  )
}

function GoBackButton() {
  return (
    <div className="go-back-button">
      <Image
        src={Assets.Icon.arrowLeftBlack}
        alt="back"
        width={24}
        height={24}
      />
    </div>
  )
}

function LanguageSwitcher() {
  // @Language 'common'
  const { t } = useTranslation()
  const { language } = useLanguagePackContext()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const currentIndex = LANGUAGE_OPTIONS.findIndex(
    (option) => option.code === language,
  )

  const currentLabel = useMemo(() => {
    const option = LANGUAGE_OPTIONS.find((item) => item.code === language)
    return option ? t(option.labelKey) : t('korean')
  }, [language, t])

  const changeLanguage = (nextLanguage: string) => {
    const paths = pathname.split('/').filter(Boolean)
    let sitepath = `/${nextLanguage}`
    paths.forEach((path, index) => {
      if (index > 0) {
        sitepath += `/${path}`
      }
    })

    const queryString = searchParams.toString()
    if (queryString) {
      sitepath += `?${queryString}`
    }

    window.location.replace(sitepath)
  }

  const dropdownItems = LANGUAGE_OPTIONS.map((option) => ({
    text: t(option.labelKey),
    onClick: () => changeLanguage(option.code),
  }))

  return (
    <div className="language-switcher">
      <div
        className="language-switcher-trigger"
        onMouseDown={(e) => {
          e.stopPropagation()
        }}
        onClick={(e) => {
          e.stopPropagation()
          setIsDropdownOpen((open) => !open)
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setIsDropdownOpen((open) => !open)
          }
        }}>
        <Image
          src={Assets.Icon.globeBlack}
          alt="globe"
          width={24}
          height={24}
        />
        <TextStyle fontFamily="sans" fontWeight={700} fontColor="primary">
          {currentLabel}
        </TextStyle>
      </div>
      <DropdownMenu
        items={dropdownItems}
        isOpen={isDropdownOpen}
        onClose={() => setIsDropdownOpen(false)}
        showArrow={false}
        currentIndex={currentIndex}
        position="bottomRight"
      />
    </div>
  )
}
