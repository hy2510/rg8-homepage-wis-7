'use client'

import { useCustomerInfo } from '@/8th/application/context/CustomerContext'
import {
  useFindPassword,
  useForgotPasswordConfirm,
} from '@/8th/features/account/service/account-query'
import { useCountDown } from '@/8th/shared/hook/useCountDown'
import { isValidateEmail } from '@/8th/shared/utils/validation'
import SITE_PATH from '@/app/site-path'
import useTranslation from '@/localization/client/useTranslations'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'

export default function FindPasswordPrivate({
  defaultType = 'email',
  hint = '',
}: {
  defaultType?: 'id' | 'email'
  hint?: string
}) {
  //@language 'common'
  const { t } = useTranslation()

  const router = useRouter()
  const customer = useCustomerInfo()
  const customerId = customer.customerId
  const customerType = customer.customerUse

  const [step, setStep] = useState<'form' | 'code' | 'done'>('form')
  const [findType, setFindType] = useState<'Email' | 'Id'>(
    defaultType === 'id' ? 'Id' : 'Email',
  )
  const [keyword, setKeyword] = useState('')
  const [sentEmail, setSentEmail] = useState('')

  const emailRef = useRef<HTMLInputElement>(null)
  const [email, setEmail] = useState(defaultType === 'email' ? hint : '')

  const idRef = useRef<HTMLInputElement>(null)
  const [id, setId] = useState(defaultType === 'id' ? hint : '')

  const authCodeRef = useRef<HTMLInputElement>(null)
  const [authCode, setAuthCode] = useState('')

  const countDown = useCountDown({ timeset: 60 * 10 })

  const findPasswordAuthCode = useFindPassword({
    onSuccess(data) {
      setSentEmail(data.email)
      countDown.reset()
      countDown.start()
      setStep('code')
    },
    onError(error) {
      if (error instanceof Error && 'code' in error && 'payload' in error) {
        const extra: { code: number; success: boolean } | undefined =
          'extra' in error
            ? (JSON.parse(error.extra as string) as {
                code: number
                success: boolean
              })
            : undefined
        let message = t('t8th0011')
        if (extra?.code === 1) {
          message = t('t8th0007')
        } else if (extra?.code === 2) {
          message = t('t8th0008')
        } else if (extra?.code === 3) {
          message = t('t8th0009')
        } else if (extra?.code === 4) {
          message = t('t8th0010')
        } else if (extra?.code === 9) {
          message = t('t8th0011')
        }
        alert(message)
      }
    },
  })
  const forgotPasswordConfirm = useForgotPasswordConfirm({
    onSuccess() {
      countDown.stop()
      setStep('done')
    },
    onError(error) {
      if (error instanceof Error && 'code' in error && 'payload' in error) {
        const extra: { code: number; success: boolean } | undefined =
          'extra' in error
            ? (JSON.parse(error.extra as string) as {
                code: number
                success: boolean
              })
            : undefined
        let message = t('t8th0011')
        if (extra?.code === 1) {
          message = t('t8th0012')
        } else if (extra?.code === 2) {
          message = t('t8th0013')
        } else if (extra?.code === 3) {
          message = t('t8th0014')
        }
        alert(message)
      }
    },
  })

  const handleRequestFindPasswordAuthCode = () => {
    if (findType === 'Email') {
      if (!email) {
        alert(t('t8th0053'))
        return
      }
      if (!isValidateEmail(email)) {
        alert(t('t8th0295'))
        return
      }
      setKeyword(email)
      findPasswordAuthCode.mutate({ type: 'Email', keyword: email })
    } else {
      if (!id) {
        alert(t('t8th0054'))
        return
      }
      setKeyword(id)
      findPasswordAuthCode.mutate({ type: 'Id', keyword: id })
    }
  }

  const handleConfirmForgotPassword = () => {
    if (countDown.currentTime <= 0) {
      alert(t('t8th0055'))
      return
    }
    if (!authCode) {
      alert(t('t8th0056'))
      return
    }
    forgotPasswordConfirm.mutate({ keyword, authCode })
  }

  const hasAllowed = !!customerId && customerType.toLowerCase() === 'private'
  const isEmail = findType === 'Email'
  const keywordValue = isEmail ? email : id

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

  if (step === 'done') {
    return (
      <div className="body is-add">
        <h1>{t('t8th0057')}</h1>
        <p className="pick-copy">{t('t8th0127', { email: sentEmail })}</p>
        <button
          type="button"
          className="add-find"
          onClick={() => {
            router.push(SITE_PATH.ACCOUNT_8TH.SIGNIN)
          }}>
          {t('t8th0077')}
        </button>
      </div>
    )
  }

  if (step === 'code') {
    return (
      <div className="body is-add">
        <h1>{t('t8th0057')}</h1>
        <section className="add-panel">
          <h2>{t('t8th0038')}</h2>
          <p>{t('t8th0039', { email: sentEmail })}</p>
          <div className="add-field">
            <input
              type="text"
              inputMode="numeric"
              placeholder={t('t8th0038')}
              ref={authCodeRef}
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') handleConfirmForgotPassword()
              }}
              aria-label={t('t8th0038')}
            />
            <span className="add-timer">{countDown.timeText}</span>
            <button
              type="button"
              className={`add-go${authCode.trim() ? ' is-ready' : ''}`}
              onClick={handleConfirmForgotPassword}
              aria-label={t('t8th0040')}>
              <GoArrow />
            </button>
          </div>
          <button
            type="button"
            className="add-find"
            onClick={handleRequestFindPasswordAuthCode}>
            {t('t8th0041')}
          </button>
          <button
            type="button"
            className="add-find"
            onClick={() => {
              countDown.stop()
              setStep('form')
            }}>
            {t('t8th0042')}
          </button>
        </section>
      </div>
    )
  }

  return (
    <div className="body is-add">
      <h1>{t('t8th0057')}</h1>
      <section className="add-panel">
        <h2>{isEmail ? t('t8th0058') : t('t8th0059')}</h2>
        <p>{isEmail ? t('t8th0124') : t('t8th0125')}</p>
        <div className="add-field">
          <input
            ref={isEmail ? emailRef : idRef}
            type={isEmail ? 'email' : 'text'}
            inputMode={isEmail ? 'email' : 'text'}
            value={keywordValue}
            onChange={(event) => {
              if (isEmail) setEmail(event.target.value)
              else setId(event.target.value)
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') handleRequestFindPasswordAuthCode()
            }}
            placeholder={isEmail ? t('t8th0030') : t('t8th0076')}
            autoComplete={isEmail ? 'email' : 'username'}
            aria-label={isEmail ? t('t8th0030') : t('t8th0076')}
          />
          <button
            type="button"
            className={`add-go${keywordValue.trim() ? ' is-ready' : ''}`}
            onClick={handleRequestFindPasswordAuthCode}
            aria-label={t('t8th0057')}>
            <GoArrow />
          </button>
        </div>
      </section>
      <button
        type="button"
        className="add-find"
        onClick={() => setFindType(isEmail ? 'Id' : 'Email')}>
        {isEmail ? t('t8th0126') : t('t8th0092')}
      </button>
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
