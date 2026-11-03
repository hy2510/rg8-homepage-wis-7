'use client'

import { useCustomerInfo } from '@/8th/application/context/CustomerContext'
import SignInContextProvider, {
  useSignIn,
} from '@/8th/application/context/SignInContext'
import {
  useSignUpEmailCertify,
  useSignUpEmailConfirmKR,
} from '@/8th/features/account/service/signup-query'
import { useCountDown } from '@/8th/shared/hook/useCountDown'
import {
  isValidateEmail,
  isValidatePassword,
  isValidateStudentName,
} from '@/8th/shared/utils/validation'
import SITE_PATH from '@/app/site-path'
import useTranslation from '@/localization/client/useTranslations'
import Link from 'next/link'
import { useRef, useState } from 'react'
import PolicyModal from '../modal/PolicyModal'

export default function SignUpKR({ email }: { email?: string }) {
  const customer = useCustomerInfo()
  const customerId = customer.customerId
  const customerType = customer.customerUse

  const hasAllowed = !!customerId && customerType.toLowerCase() === 'private'

  if (!hasAllowed) {
    return (
      <div className="body is-add">
        <h1>Not allowed</h1>
        <Link href={SITE_PATH.ACCOUNT_8TH.SIGNIN}>
          <button type="button" className="enter-find">
            {'Return'}
          </button>
        </Link>
      </div>
    )
  }
  return (
    <SignInContextProvider>
      <SignUp email={email} />
    </SignInContextProvider>
  )
}

function SignUp({ email: inEmail }: { email?: string }) {
  // @language 'common'
  const { t } = useTranslation()

  const [step, setStep] = useState<'form' | 'email'>('form')

  const signIn = useSignIn()
  const certEmail = useSignUpEmailCertify({
    onSuccess: () => {
      countDown.reset()
      countDown.start()
      setStep('email')
    },
    onError: (error) => {
      if (error instanceof Error && 'code' in error && 'payload' in error) {
        const extra: { code: number; success: boolean } | undefined =
          'extra' in error
            ? (JSON.parse(error.extra as string) as {
                code: number
                success: boolean
              })
            : undefined
        if (extra?.code === 1) {
          alert(t('t8th0019'))
        } else if (extra?.code === 2) {
          alert(t('t8th0020'))
        }
      }
    },
  })
  const confirmEmail = useSignUpEmailConfirmKR({
    onSuccess: () => {
      countDown.stop()
      signIn(email, password, true, false, SITE_PATH.ACCOUNT_8TH.WELCOME)
    },
    onError: (error) => {
      if (error instanceof Error && 'code' in error && 'payload' in error) {
        const extra: { code: number; success: boolean } | undefined =
          'extra' in error
            ? (JSON.parse(error.extra as string) as {
                code: number
                success: boolean
              })
            : undefined
        if (extra?.code === 1) {
          alert(t('t8th0012'))
        } else if (extra?.code === 2) {
          alert(t('t8th0013'))
        } else if (extra?.code === 3) {
          alert(t('t8th0021'))
        }
      }
    },
  })
  const countDown = useCountDown({ timeset: 60 * 10 })

  const studentNameRef = useRef<HTMLInputElement>(null)
  const [studentName, setStudentName] = useState('')

  const emailRef = useRef<HTMLInputElement>(null)
  const [email, setEmail] = useState(inEmail || '')

  const passwordRef = useRef<HTMLInputElement>(null)
  const [password, setPassword] = useState('')

  const confirmPasswordRef = useRef<HTMLInputElement>(null)
  const [confirmPassword, setConfirmPassword] = useState('')

  const authCodeRef = useRef<HTMLInputElement>(null)
  const [authCode, setAuthCode] = useState('')

  const [policyModalInfo, setPolicyModalInfo] = useState<{
    title: string
    src: string
  } | null>(null)

  const [isAgreePrivacy, setIsAgreePrivacy] = useState(false)
  const [isAgreeTerms, setIsAgreeTerms] = useState(false)
  const [isAgreeCollect, setIsAgreeCollect] = useState(false)

  const [emailCertHash, setEmailCertHash] = useState('')

  const handleRequestEmailCertify = () => {
    if (studentName.trim() === '') {
      alert(t('t8th0000'))
      return
    }
    if (!isValidateStudentName(studentName, 'kr')) {
      alert(t('t8th0001'))
      return
    }
    if (email.trim() === '') {
      alert(t('t8th0015'))
      return
    }
    if (!isValidateEmail(email)) {
      alert(t('t8th0016'))
      return
    }
    if (password.trim() === '') {
      alert(t('t8th0004'))
      return
    }
    if (!isValidatePassword(password)) {
      alert(t('t8th0002', { num1: 8, num2: 20 }))
      return
    }
    if (confirmPassword.trim() === '') {
      alert(t('t8th0005'))
      return
    }
    if (password !== confirmPassword) {
      alert(t('t8th0006'))
      return
    }
    if (!isAgreeTerms) {
      alert(t('t8th0017'))
      return
    }
    if (!isAgreeCollect) {
      alert(t('t8th0022'))
      return
    }
    if (!isAgreePrivacy) {
      alert(t('t8th0018'))
      return
    }

    const newEmailCertHash = `${email}|${password}|${studentName}`
    setEmailCertHash(newEmailCertHash)
    certEmail.mutate({
      email: email,
      password: password,
      studentName: studentName,
    })
  }

  const handleConfirmEmail = () => {
    if (authCode.trim() === '') {
      alert(t('t8th0023'))
      return
    }
    confirmEmail.mutate({
      email: email,
      authCode: authCode,
    })
  }

  const canContinue =
    studentName.trim() !== '' &&
    email.trim() !== '' &&
    password.trim() !== '' &&
    confirmPassword.trim() !== '' &&
    isAgreeTerms &&
    isAgreeCollect &&
    isAgreePrivacy

  return (
    <div className="body is-add">
      {step === 'form' && (
        <>
          <h1>{t('t8th0026')}</h1>
          <section className="add-panel">
            <h2>{t('t8th0027')}</h2>
            <p>{t('t8th0028')}</p>
            <div className="add-fields">
              <div className="add-hint">
                <span className="required">{t('t8th0132')}</span>
                {t('t8th0134')}
              </div>
              <label className="add-field is-plain">
                <input
                  type="email"
                  placeholder={t('t8th0030')}
                  ref={emailRef}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <div className="add-hint">
                <span className="required">{t('t8th0132')}</span>
                {t('t8th0133')}
              </div>
              <label className="add-field is-plain">
                <input
                  type="text"
                  placeholder={t('t8th0029')}
                  ref={studentNameRef}
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                />
              </label>
              <div className="add-hint">
                <span className="required">{t('t8th0132')}</span>
                {t('t8th112', { num1: 8, num2: 20 })}
              </div>
              <label className="add-field is-plain">
                <input
                  type="password"
                  placeholder={t('t8th0031')}
                  ref={passwordRef}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
              <div className="add-hint">
                <span className="required">{t('t8th0132')}</span>
                {t('t8th122')}
              </div>
              <label className="add-field is-plain">
                <input
                  type="password"
                  placeholder={t('t8th0032')}
                  ref={confirmPasswordRef}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </label>
            </div>

            <AgreeCheck
              checked={isAgreeTerms}
              onToggle={() => setIsAgreeTerms(!isAgreeTerms)}
              title={t('t8th0033')}
              onOpen={() => {
                setPolicyModalInfo({
                  title: t('t8th0033'),
                  src: '/src/html/page-contents/pc/rg-membership/membership_04_terms_of_use.html',
                })
              }}
            />
            <AgreeCheck
              checked={isAgreeCollect}
              onToggle={() => setIsAgreeCollect(!isAgreeCollect)}
              title={t('t8th0034')}
              onOpen={() => {
                setPolicyModalInfo({
                  title: t('t8th0034'),
                  src: '/src/html/page-contents/pc/rg-membership/membership_07_private_privacy_collect.html',
                })
              }}
            />
            <AgreeCheck
              checked={isAgreePrivacy}
              onToggle={() => setIsAgreePrivacy(!isAgreePrivacy)}
              title={t('t8th0035')}
              onOpen={() => {
                setPolicyModalInfo({
                  title: t('t8th0035'),
                  src: '/src/html/page-contents/pc/rg-membership/membership_05_privacy_policy.html',
                })
              }}
            />

            <button
              type="button"
              className={`add-continue${canContinue ? ' is-ready' : ''}`}
              onClick={handleRequestEmailCertify}>
              <span>{t('t8th0036')}</span>
              <span className="add-continue-icon" aria-hidden="true">
                <GoArrow />
              </span>
            </button>
          </section>
        </>
      )}

      {step === 'email' && (
        <>
          <h1>{t('t8th0037')}</h1>
          <section className="add-panel">
            <h2>{t('t8th0038')}</h2>
            <p>{t('t8th0039', { email })}</p>
            <div className="add-field">
              <input
                type="text"
                inputMode="numeric"
                placeholder={t('t8th0038')}
                ref={authCodeRef}
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
              />
              <span className="add-timer">{countDown.timeText}</span>
              <button
                type="button"
                className={`add-go${authCode.trim() ? ' is-ready' : ''}`}
                onClick={handleConfirmEmail}
                aria-label={t('t8th0040')}>
                <GoArrow />
              </button>
            </div>
            <button
              type="button"
              className={`add-find${countDown.currentTime >= 360 ? ' is-disabled' : ''}`}
              onClick={() => {
                if (countDown.currentTime >= 360) {
                  alert(t('t8th0131'))
                  return
                }
                handleRequestEmailCertify()
              }}>
              {t('t8th0041')}
            </button>
            <button
              type="button"
              className="add-find"
              onClick={() => setStep('form')}>
              {t('t8th0042')}
            </button>
          </section>
        </>
      )}

      {policyModalInfo && (
        <PolicyModal
          title={policyModalInfo.title}
          src={policyModalInfo.src}
          onClose={() => {
            setPolicyModalInfo(null)
          }}
        />
      )}
    </div>
  )
}

function AgreeCheck({
  checked,
  onToggle,
  title,
  onOpen,
}: {
  checked: boolean
  onToggle: () => void
  title: string
  onOpen: () => void
}) {
  // @language 'common'
  const { t } = useTranslation()

  return (
    <label className={checked ? 'review-consent is-on' : 'review-consent'}>
      <input type="checkbox" checked={checked} onChange={onToggle} />
      <span>
        <button
          type="button"
          className="review-detail"
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            onOpen()
          }}>
          <span style={{ color: 'var(--font-color-light-blue)' }}>{title}</span>
        </button>
        {` ${t('t8th0050')}`}
      </span>
    </label>
  )
}

function GoArrow() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true">
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
