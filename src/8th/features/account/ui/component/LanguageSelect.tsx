'use client'

import { Assets } from '@/8th/assets/asset-library'
import useTranslation from '@/localization/client/useTranslations'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

export default function LanguageSelect({
  locale,
  languages,
  isShowLabel = true,
  onSelectLanguage,
}: {
  locale: string
  languages: { code: string; label: string }[]
  isShowLabel?: boolean
  onSelectLanguage?: (locale: string) => void
}) {
  // @language 'common'
  const { t } = useTranslation()

  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const current =
    languages.find((language) => language.code === locale) || languages[0]

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div className={`language-select${open ? ' is-open' : ''}`} ref={rootRef}>
      <button
        type="button"
        className="language-button"
        aria-label={t('t8th0082')}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((currentOpen: boolean) => !currentOpen)}>
        <Image src={Assets.Icon.globeBlack} alt="" width={24} height={24} />
        {isShowLabel && <span>{current.label}</span>}
      </button>
      {open && (
        <ul className="language-menu" role="listbox">
          {languages.map((language) => (
            <li key={language.code}>
              <button
                type="button"
                role="option"
                aria-selected={language.code === locale}
                className={language.code === locale ? 'is-active' : undefined}
                onClick={() => {
                  if (onSelectLanguage) {
                    onSelectLanguage(language.code)
                  }
                }}>
                {language.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
