'use client'

import { Assets } from '@/8th/assets/asset-library'
import { AvatarImage } from '@/8th/shared/ui/Avatar'
import useTranslation from '@/localization/client/useTranslations'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

type Account = {
  customerId: string
  studentId: string
  customerName: string
  studentName: string
  loginId: string
  avatar: string
  password?: string
}

export default function AccountList({
  accounts,
  signInHref,
  trialAccountHref,
  onSelectAccount,
  onRemovePassword,
  onDeleteAccount,
}: {
  accounts: Account[]
  signInHref: string
  trialAccountHref: string
  onSelectAccount: (account: Account) => void
  onRemovePassword: (account: Account) => void
  onDeleteAccount: (account: Account) => void
}) {
  // @language 'common'
  const { t } = useTranslation()

  return (
    <div className="body">
      <h1>{t('t8th0107')}</h1>
      <div className="grid">
        {accounts.length > 0 &&
          accounts.map((account) => (
            <AccountCard
              key={account.customerName + account.studentName}
              customerName={account.customerName}
              studentName={account.studentName}
              loginId={account.loginId}
              avatar={account.avatar}
              isSavedPassword={!!account.password}
              onSelectAccount={() => onSelectAccount(account)}
              onRemovePassword={() => onRemovePassword(account)}
              onDeleteCard={() => onDeleteAccount(account)}
            />
          ))}
        <TraialAccountCard href={trialAccountHref} />
        <AddAccountCard href={signInHref} />
      </div>
    </div>
  )
}

function AccountCard({
  customerName,
  studentName,
  loginId,
  avatar,
  onSelectAccount,
  isSavedPassword = false,
  onRemovePassword,
  onDeleteCard,
}: {
  customerName: string
  studentName: string
  loginId: string
  avatar: string
  onSelectAccount: () => void
  isSavedPassword: boolean
  onRemovePassword: () => void
  onDeleteCard: () => void
}) {
  return (
    <div className="card">
      <button type="button" className="card-main" onClick={onSelectAccount}>
        <span className="avatar user">
          <AvatarImage avatarId={avatar} />
        </span>
        <span className="info">
          {customerName ? <span className="school">{customerName}</span> : null}
          <strong>{studentName}</strong>
          <span className="sub">{loginId}</span>
        </span>
      </button>
      <span className="card-actions">
        <MoreMenu
          isSavedPassword={isSavedPassword}
          onRemovePassword={onRemovePassword}
          onDelete={onDeleteCard}
        />
      </span>
    </div>
  )
}

function AddAccountCard({ href }: { href: string }) {
  // @language 'common'
  const { t } = useTranslation()

  return (
    <Link className="card" href={href}>
      <span className="avatar plus" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </span>
      <span className="info">
        <strong>{t('t8th0097')}</strong>
        <span className="sub">{t('t8th0108')}</span>
      </span>
    </Link>
  )
}

function TraialAccountCard({ href }: { href: string }) {
  // @language 'common'
  const { t } = useTranslation()

  return (
    <Link className="card" href={href}>
      <span className="avatar trial">
        <Image src={Assets.Icon.Homepage.Trial} alt="" fill sizes="88px" />
      </span>
      <span className="info">
        <strong>{t('t8th0109')}</strong>
        <span className="sub">{t('t8th0110')}</span>
      </span>
    </Link>
  )
}

function MoreMenu({
  isSavedPassword,
  onRemovePassword,
  onDelete,
}: {
  isSavedPassword: boolean
  onRemovePassword: () => void
  onDelete: () => void
}) {
  // @language 'common'
  const { t } = useTranslation()

  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const askPasswordOnEnter = !isSavedPassword

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [open])

  return (
    <div className="more" ref={rootRef}>
      <button
        type="button"
        className="icon-button"
        aria-label={t('t8th0111')}
        onClick={(event) => {
          event.stopPropagation()
          setOpen((current) => !current)
        }}>
        <Image
          src={Assets.Icon.moreVerticalGray}
          alt=""
          width={20}
          height={20}
        />
      </button>
      {open && (
        <ul className="more-menu">
          <li>
            <button
              type="button"
              className={askPasswordOnEnter ? 'is-muted' : undefined}
              onClick={(event) => {
                event.stopPropagation()
                if (isSavedPassword) {
                  onRemovePassword()
                }
                setOpen(false)
              }}>
              {t('t8th0112')}
              <Image
                src={
                  isSavedPassword
                    ? '/src/images/check-icons/check_box_on.svg'
                    : '/src/images/check-icons/check_box_off.svg'
                }
                alt=""
                width={24}
                height={24}
              />
            </button>
          </li>
          <li>
            <button
              type="button"
              className="is-muted"
              onClick={(event) => {
                event.stopPropagation()
                if (confirm(t('t8th0113'))) {
                  onDelete()
                }
                setOpen(false)
              }}>
              {t('t8th0114')}
            </button>
          </li>
        </ul>
      )}
    </div>
  )
}
