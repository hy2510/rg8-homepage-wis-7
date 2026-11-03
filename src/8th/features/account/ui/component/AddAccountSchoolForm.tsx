'use client'

import useTranslation from '@/localization/client/useTranslations'
import Link from 'next/link'
import { useRef, useState } from 'react'
import AccountSignInInput from './AccountSignInInput'
import SignInOption from './SignInOption'

export default function AddAccountSchoolForm({
  gradeList = [],
  classList = [],
  onSelectGrade,
  hasClassLogin,
  customer,
  findPasswordHref,
  onSignIn,
}: {
  gradeList?: { key: string; label: string }[]
  classList?: { key: string; label: string }[]
  onSelectGrade?: (key: string) => void
  hasClassLogin: boolean
  customer: { name: string }
  findPasswordHref: string
  onSignIn: (params: {
    classId?: string
    userName?: string
    loginId?: string
    password: string
    isOnetimeLogin: boolean
    isSavePassword: boolean
  }) => void
}) {
  // @language 'common'
  const { t } = useTranslation()

  const [tab, setTab] = useState<'Id' | 'Class'>('Id')

  const [grade, setGrade] = useState<string | undefined>(undefined)
  const [classOne, setClassOne] = useState<string | undefined>(undefined)

  const [userName, setUserName] = useState('')
  const [loginId, setLoginId] = useState('')
  const [password, setPassword] = useState('')
  const [isSavePassword, setIsSavePassword] = useState(false)

  const userNameRef = useRef<HTMLInputElement>(null)
  const loginIdRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  const handleLogin = () => {
    if (tab === 'Class') {
      // onSignIn({
      //   classId: classId,
      //   studentName: studentName,
      //   password: password,
      //   isOnetimeLogin: true,
      //   isSavePassword: isSavePassword,
      // })
    } else {
      onSignIn({
        loginId: loginId,
        password: password,
        isOnetimeLogin: true,
        isSavePassword: isSavePassword,
      })
    }
  }

  return (
    <div className="body is-group-enter">
      <div className="enter">
        <div className="group-enter-head">
          <h1>{t('t8th0075')}</h1>
          <p>{customer.name}</p>
        </div>

        <div className="group-enter-fields">
          {tab === 'Class' ? (
            <>
              <div className="group-enter-row">
                <select
                  className="group-enter-select"
                  value={grade || ''}
                  onChange={(event) => {
                    const gradeVal = event.target.value
                    setGrade(gradeVal)
                    setClassOne(undefined)
                    if (onSelectGrade) {
                      onSelectGrade(gradeVal)
                    }
                  }}
                  aria-label={t('t8th0093')}>
                  <option value="" disabled>
                    {t('t8th0093')}
                  </option>
                  {gradeList.map((grade) => (
                    <option key={grade.key} value={grade.key}>
                      {grade.label}
                    </option>
                  ))}
                </select>
                <select
                  className="group-enter-select"
                  value={classOne || ''}
                  onChange={(event) => setClassOne(event.target.value)}
                  aria-label={t('t8th0094')}>
                  <option value="" disabled>
                    {t('t8th0094')}
                  </option>
                  {classList.map((item) => (
                    <option key={item.key} value={item.key}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
              <AccountSignInInput
                ref={userNameRef}
                value={userName}
                onChange={(text) => setUserName(text)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    passwordRef.current?.focus()
                  }
                }}
                placeholder={t('t8th0029')}
                aria-label={t('t8th0029')}
              />
            </>
          ) : (
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
          )}

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

        <div className="group-enter-links">
          {hasClassLogin && (
            <button
              type="button"
              onClick={() => setTab(tab === 'Id' ? 'Class' : 'Id')}>
              {tab === 'Id' ? t('t8th0095') : t('t8th0096')}
            </button>
          )}

          {findPasswordHref && (
            <Link href={findPasswordHref}>{t('t8th0057')}</Link>
          )}
        </div>
      </div>
    </div>
  )
}
