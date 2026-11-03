'use client'

import useTranslation from '@/localization/client/useTranslations'
import { useRef, useState } from 'react'

const PAY_METHODS = [
  { id: 'vcard', labelKey: 't8th0210' },
  { id: 'directbank', labelKey: 't8th0211' },
]

const PHONE_PATTERN = /^(010|011|012|016|017|019)[0-9]{7,8}$/i
const EMAIL_PATTERN = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i

export default function UnpaidPayModal({
  itemName,
  className,
  feeLabel,
  onCancel,
  onConfirm,
}: {
  itemName: string
  className: string
  feeLabel: string
  onCancel?: () => void
  onConfirm?: (value: {
    payMethod: string
    phone: string
    email: string
  }) => void
}) {
  // @language 'common'
  const { t } = useTranslation()

  const [payMethod, setPayMethod] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')
  const phoneRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)

  const onCancelListener = () => {
    if (onCancel) {
      onCancel()
    }
  }

  const onPay = () => {
    if (phoneNumber.length === 0) {
      phoneRef.current?.focus()
      return
    }
    if (!PHONE_PATTERN.test(phoneNumber)) {
      alert(t('t8th0294'))
      phoneRef.current?.focus()
      return
    }
    if (email.length === 0) {
      emailRef.current?.focus()
      return
    }
    if (!EMAIL_PATTERN.test(email)) {
      alert(t('t8th0295'))
      emailRef.current?.focus()
      return
    }
    if (onConfirm) {
      onConfirm({
        payMethod,
        phone: phoneNumber,
        email,
      })
    }
  }

  return (
    <div
      className="hp-modal-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) {
          onCancelListener()
        }
      }}>
      <section
        className="hp-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="unpaid-pay-title">
        <header className="hp-modal-header">
          <h2 id="unpaid-pay-title">{t('t8th095')}</h2>
          <button
            type="button"
            className="hp-modal-close"
            aria-label={t('t8th0155')}
            onClick={onCancelListener}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6 18 18M18 6 6 18" />
            </svg>
          </button>
        </header>
        <div className="hp-modal-body unpaid-pay">
          <p className="unpaid-pay-help">
            <strong>
              {itemName}
              {className ? ` · ${className}` : ''}
            </strong>
            <span>{feeLabel}</span>
          </p>
          <h3 className="ticket-result-title">{t('t8th0289')}</h3>
          <div className="pay-methods">
            {PAY_METHODS.map((method) => (
              <button
                type="button"
                key={method.id}
                className={`pay-method${payMethod === method.id ? ' is-active' : ''}`}
                onClick={() => setPayMethod(method.id)}>
                {t(method.labelKey)}
              </button>
            ))}
          </div>
          {payMethod ? (
            <>
              <p className="unpaid-pay-help">
                <span>{t('t8th0290')}</span>
                <span>{t('t8th0291')}</span>
              </p>
              <div className="unpaid-pay-fields">
                <input
                  ref={phoneRef}
                  inputMode="numeric"
                  autoComplete="tel"
                  maxLength={11}
                  placeholder={t('t8th0292')}
                  value={phoneNumber}
                  onChange={(event) =>
                    setPhoneNumber(event.target.value.replace(/[^0-9]/g, ''))
                  }
                  onKeyDown={(event) => {
                    if (
                      phoneNumber.length > 0 &&
                      event.key.toLowerCase() === 'enter'
                    ) {
                      onPay()
                    }
                  }}
                />
                <input
                  ref={emailRef}
                  type="email"
                  autoComplete="email"
                  placeholder={t('t8th0293')}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  onKeyDown={(event) => {
                    if (email.length > 0 && event.key.toLowerCase() === 'enter') {
                      onPay()
                    }
                  }}
                />
              </div>
              <button type="button" className="pay-button" onClick={onPay}>
                {t('t8th095')}
              </button>
            </>
          ) : null}
        </div>
      </section>
    </div>
  )
}
