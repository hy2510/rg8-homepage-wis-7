'use client'

import { AvatarImage } from '@/8th/shared/ui/Avatar'
import useTranslation from '@/localization/client/useTranslations'
import Link from 'next/link'
import { useState } from 'react'
import AccountSignInInput from './AccountSignInInput'
import SignInOption from './SignInOption'

export default function AccountEnterForm({
  state,
  customerId,
  customerName,
  studentName,
  loginId,
  avatar,
  forgotPasswordHref = '',
  onSubmit,
}: {
  state: 'loading' | 'login' | 'input'
  customerId: string
  customerName: string
  studentName: string
  loginId: string
  avatar: string
  onSubmit: (password: string, isSavePassword: boolean) => void
  forgotPasswordHref: string
}) {
  // @language 'common'
  const { t } = useTranslation()

  const [password, setPassword] = useState('')
  const [isSavePassword, setIsSavePassword] = useState(false)

  const handleLogin = () => {
    if (password.length <= 0) {
      return
    }
    onSubmit(password, isSavePassword)
  }

  return (
    <div className="body is-enter">
      <div className="enter" style={{ minHeight: '460px' }}>
        <h1>{t('t8th0075')}</h1>
        <div className="enter-profile">
          <span className="enter-avatar">
            <AvatarImage avatarId={avatar} />
          </span>
          <strong>{studentName}</strong>
          <span className="enter-id">{loginId}</span>
        </div>
        <AccountSignInInput
          type="password"
          value={password}
          onChange={(text) => setPassword(text)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              handleLogin()
            }
          }}
          placeholder={t('t8th0031')}
          autoComplete="current-password"
          aria-label={t('t8th0031')}
          action={{
            disabled: password.length <= 0,
            onClick: handleLogin,
            ariaLabel: t('t8th0077'),
          }}
        />

        <SignInOption
          isSavePassword={isSavePassword}
          setIsSavePassword={setIsSavePassword}
        />
        {forgotPasswordHref && (
          <Link className="enter-find" href={forgotPasswordHref}>
            {t('t8th0057')}
          </Link>
        )}
      </div>
    </div>
  )
}
