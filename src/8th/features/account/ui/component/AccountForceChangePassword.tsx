'use client'

import { Target, isValidatePassword } from '@/8th/shared/utils/validation'
import useTranslation from '@/localization/client/useTranslations'
import { useRef, useState } from 'react'
import AccountSignInInput from './AccountSignInInput'

export default function AccountForceChangePassword({
  target,
  onChangePassword,
}: {
  target?: Target
  onChangePassword: (password: string) => void
}) {
  // @language 'common'
  const { t } = useTranslation()

  const passwordRef = useRef<HTMLInputElement>(null)
  const [password, setPassword] = useState('')

  const passwordConfirmRef = useRef<HTMLInputElement>(null)
  const [passwordConfirm, setPasswordConfirm] = useState('')

  const handleChangePassword = () => {
    if (password.trim() === '') {
      alert(t('t8th0004'))
      passwordRef.current?.focus()
      return
    }
    if (!isValidatePassword(password, target)) {
      alert(t('t8th0002', { num1: 8, num2: 20 }))
      passwordRef.current?.focus()
      return
    }
    if (passwordConfirm.trim() === '') {
      alert(t('t8th0005'))
      passwordConfirmRef.current?.focus()
      return
    }
    if (password !== passwordConfirm) {
      alert(t('t8th0006'))
      return
    }
    onChangePassword(passwordConfirm)
  }

  return (
    <div className="body is-add">
      <div className="add-head">
        <h1>{t('t8th0079')}</h1>
      </div>
      <section className="add-panel">
        <div className="add-hint">{t('t8th0002', { num1: 8, num2: 20 })}</div>
        <AccountSignInInput
          ref={passwordRef}
          type="password"
          value={password}
          onChange={(text) => setPassword(text)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              handleChangePassword()
            }
          }}
          placeholder={t('t8th0031')}
          autoComplete="current-password"
          aria-label={t('t8th0031')}
        />
        <div className="add-hint">{t('t8th122')}</div>
        <AccountSignInInput
          ref={passwordConfirmRef}
          type="password"
          value={passwordConfirm}
          onChange={(text) => setPasswordConfirm(text)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              handleChangePassword()
            }
          }}
          placeholder={t('t8th0032')}
          autoComplete="current-password"
          aria-label={t('t8th0032')}
          action={{
            disabled: passwordConfirm.length <= 2,
            onClick: () => {
              handleChangePassword()
            },
            ariaLabel: t('t8th0032'),
          }}
        />
      </section>
    </div>
  )
}
