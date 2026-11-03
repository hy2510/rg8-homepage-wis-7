'use client'

import useTranslation from '@/localization/client/useTranslations'
import { useRef, useState } from 'react'

export default function ForgotId({
  useType,
  onTypeChange,
  onFind,
}: {
  useType: 'Email' | 'Phone'
  onTypeChange: (type: 'Email' | 'Phone') => void
  onFind: (keyword: string) => void
}) {
  // @language 'common'
  const { t } = useTranslation()

  const inputRef = useRef<HTMLInputElement>(null)
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const isEmail = useType === 'Email'

  const submit = () => {
    if (onFind) {
      onFind(isEmail ? email : phone)
    }
  }

  return (
    <div className="body is-add">
      <h1>{t('t8th0083')}</h1>
      <section className="add-panel">
        <h2>{isEmail ? t('t8th0085') : t('t8th0086')}</h2>
        <p>{isEmail ? t('t8th0087') : t('t8th0088')}</p>
        <div className="add-field">
          <input
            ref={inputRef}
            type={isEmail ? 'email' : 'tel'}
            inputMode={isEmail ? 'email' : 'numeric'}
            value={isEmail ? email : phone}
            onChange={(event) => {
              const value = event.target.value
              if (isEmail) setEmail(value)
              else setPhone(value.replace(/[^\d]/g, ''))
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                submit()
              }
            }}
            placeholder={isEmail ? t('t8th0030') : t('t8th0089')}
            autoComplete={isEmail ? 'email' : 'tel'}
            aria-label={isEmail ? t('t8th0030') : t('t8th0090')}
            disabled={false}
          />
          <button
            type="button"
            className={`add-go${!!email || !!phone ? ' is-ready' : ''}`}
            onClick={submit}
            aria-label={t('t8th0083')}
            disabled={false}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M5 12H19"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 5L19 12L12 19"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </section>
      <button
        type="button"
        className="add-find"
        onClick={() => {
          if (onTypeChange) {
            onTypeChange(isEmail ? 'Phone' : 'Email')
          }
        }}
      >
        {isEmail ? t('t8th0091') : t('t8th0092')}
      </button>
    </div>
  )
}
