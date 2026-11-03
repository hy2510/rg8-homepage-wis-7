'use client'

import { useParams } from 'next/navigation'
import en from './teacher.en.json'
import ko from './teacher.ko.json'
import vi from './teacher.vi.json'

export const KOREAN = 'ko'
export const ENGLISH = 'en'
export const VIETNAMESE = 'vi'

const messages = { en, ko, vi }
type Language = keyof typeof messages
type MessageKey = keyof typeof en

function languageOf(locale: string | string[] | undefined): Language {
  const value = Array.isArray(locale) ? locale[0] : locale
  if (value === 'ko' || value === 'vi') return value
  return 'en'
}

export default function useTranslation() {
  const { locale } = useParams<{ locale: string }>()
  const language = languageOf(locale)
  const t = (key: MessageKey, vars?: Record<string, string | number>) => {
    let text: string = messages[language][key] ?? en[key] ?? key
    if (!vars) return text
    for (const [name, value] of Object.entries(vars)) {
      text = text.replaceAll(`{{${name}}}`, String(value))
    }
    return text
  }
  return { t, i18n: { language } }
}
