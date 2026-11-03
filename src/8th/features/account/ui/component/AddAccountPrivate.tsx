'use client'

import { Assets } from '@/8th/assets/asset-library'
import useTranslation from '@/localization/client/useTranslations'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

///// 현재 사용 안함, 기획과 기능에 갭이 존재해서 추가 개발요소가 포함되어 있음.
export default function AddAccountPrivate({
  forgotHref,
  groupHref,
  checkMessage,
  checking,
  nations,
  onSubmit,
}: {
  forgotHref: string
  groupHref: string
  checkMessage?: string
  checking?: boolean
  nations: { key: string; label: string }[]
  onSubmit: (loginId: string) => void
}) {
  // @language 'common'
  const { t } = useTranslation()

  const [loginId, setLoginId] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = () => {
    onSubmit(loginId)
  }

  return (
    <div className="body is-add">
      <div className="add-head">
        <h1>{t('t8th0097')}</h1>
        {nations.length > 0 ? <CountrySelect options={nations} /> : null}
      </div>
      <section className="add-panel">
        <h2>{t('t8th0098')}</h2>
        <p>{t('t8th0099')}</p>
        <div className="add-field">
          <input
            ref={inputRef}
            type="text"
            value={loginId}
            onChange={(event) => setLoginId(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleSubmit()
              }
            }}
            placeholder={t('t8th0100')}
            autoComplete="username"
            aria-label={t('t8th0101')}
            disabled={checking}
          />
          <button
            type="button"
            className={`add-go${loginId.trim() ? ' is-ready' : ''}`}
            onClick={handleSubmit}
            aria-label={t('t8th0102')}
            disabled={checking}
          >
            <GoArrow />
          </button>
        </div>
        <Link className="add-find" href={forgotHref}>
          {t('t8th0083')}
        </Link>
        {checkMessage ? <p className="add-check-msg">{checkMessage}</p> : null}
      </section>

      <p className="add-or">{t('t8th0103')}</p>

      <Link className="add-panel add-group" href={groupHref}>
        <span className="add-group-copy">
          <h2>{t('t8th0070')}</h2>
          <p>{t('t8th0104')}</p>
        </span>
        <Image
          src={Assets.Icon.arrowUpRightBlack}
          alt=""
          width={12}
          height={12}
        />
      </Link>
    </div>
  )
}

function GoArrow() {
  return (
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
  )
}

function CountrySelect({
  options,
}: {
  options: { key: string; label: string }[]
}) {
  // @language 'common'
  const { t } = useTranslation()

  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const [selectedKey, setSelectedKey] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
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

  let selected = undefined
  if (selectedKey) {
    selected = options.find((item) => item.key === selectedKey)
  } else if (options.length > 0) {
    selected = options[0]
  }
  if (!selected) return null

  return (
    <div className={`country-select${open ? ' is-open' : ''}`} ref={rootRef}>
      <button
        type="button"
        className="country-button"
        aria-label={t('t8th0105', { name: selected.label })}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((current) => !current)}
      >
        <span>{t('t8th0106', { name: selected.label })}</span>
        <Image
          src={Assets.Icon.chevronDownGray}
          alt=""
          width={16}
          height={16}
        />
      </button>
      {open ? (
        <ul className="country-menu" role="listbox">
          {options.map((option) => (
            <li key={option.key}>
              <button
                type="button"
                role="option"
                aria-selected={option.key === selected.key}
                className={
                  option.key === selected.key ? 'is-active' : undefined
                }
                onClick={() => {
                  setSelectedKey(option.key)
                  setOpen(false)
                }}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
