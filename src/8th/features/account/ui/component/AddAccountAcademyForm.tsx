'use client'

import useTranslation from '@/localization/client/useTranslations'
import Link from 'next/link'
import { useRef, useState } from 'react'
import AccountSignInInput from './AccountSignInInput'
import SignInOption from './SignInOption'

export default function AddAccountAcademyForm({
  customer,
  findPasswordHref,
  onSignIn,
}: {
  customer: { name: string }
  findPasswordHref: string
  onSignIn: (
    loginId: string,
    password: string,
    isOnetimeLogin: boolean,
    isSavePassword: boolean,
  ) => void
}) {
  // @language 'common'
  const { t } = useTranslation()

  const [loginId, setLoginId] = useState('')
  const [password, setPassword] = useState('')
  const [isSavePassword, setIsSavePassword] = useState(false)

  const loginIdRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  const handleLogin = () => {
    onSignIn(loginId, password, true, isSavePassword)
  }

  return (
    <div className="body is-enter">
      <div className="enter">
        <div className="group-enter-head">
          <h1>{t('t8th0075')}</h1>
          <p>{customer.name}</p>
        </div>

        <div className="group-enter-fields">
          <AccountSignInInput
            ref={loginIdRef}
            value={loginId}
            onChange={(text) => setLoginId(text)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleLogin()
              }
            }}
            placeholder={t('t8th0076')}
            autoComplete="username"
            aria-label={t('t8th0076')}
          />
          <AccountSignInInput
            ref={passwordRef}
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
        </div>

        <SignInOption
          isSavePassword={isSavePassword}
          setIsSavePassword={setIsSavePassword}
        />

        <Link className="enter-find" href={findPasswordHref}>
          {t('t8th0057')}
        </Link>
      </div>
    </div>
  )
}
