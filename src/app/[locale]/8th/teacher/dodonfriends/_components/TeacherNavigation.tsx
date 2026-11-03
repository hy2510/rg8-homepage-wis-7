'use client'

import { Assets } from '@/8th/assets/asset-library'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import useTranslation, {
  ENGLISH,
  KOREAN,
  VIETNAMESE,
} from '../_i18n/useTranslation'
import { TEACHER } from '../site-path'

export default function TeacherNavigation({
  active,
}: {
  active: 'lessons' | 'resources'
}) {
  const { locale } = useParams<{ locale: string }>()
  const pathname = usePathname()

  const languages = [
    { code: KOREAN, label: '한국어' },
    { code: ENGLISH, label: 'English' },
    { code: VIETNAMESE, label: 'Tiếng Việt' },
  ]

  const tabs = [
    { id: 'lessons', label: 'All Lessons', href: TEACHER.HOME },
    {
      id: 'resources',
      label: 'Resources',
      href: TEACHER.RESOURCES,
    },
  ]

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
    <nav
      className="utilities teacher-navigation"
      aria-label="Teacher navigation">
      {tabs.map((tab) => (
        <Link
          key={tab.id}
          className="utility"
          href={tab.href}
          aria-current={active === tab.id ? 'page' : undefined}>
          {tab.label}
        </Link>
      ))}
      <LanguageSelect
        locale={locale}
        languages={languages}
        onSelectLanguage={handleSelectLanguage}
      />
    </nav>
  )
}

function LanguageSelect({
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
  // @language 'teacher'
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
        aria-label={t('tch047')}
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
