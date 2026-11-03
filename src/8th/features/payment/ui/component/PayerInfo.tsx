'use client'

import useTranslation from '@/localization/client/useTranslations'
import DateUtils from '@/util/date-utils'
import { useEffect, useRef, useState } from 'react'

export default function PayerInfo({
  phoneViewType = 'none',
  loginId,
  savedPhone,
  phoneErrorMessage,
  authErrorMessage,
  timeText,
  isReSendable = false,
  payAfterInfo,
  onCancel,
  onModifyPhone,
  onPhoneAuthRequest,
  onPhoneAuthValidate,
}: {
  phoneViewType: 'default' | 'phone' | 'validate' | 'none'
  loginId: string
  savedPhone?: string
  phoneErrorMessage?: string
  authErrorMessage?: string
  timeText?: string
  isReSendable?: boolean
  payAfterInfo?: {
    currentDays: number
    currentEndDate: string
    addDays: number
  }
  onCancel?: () => void
  onModifyPhone?: () => void
  onPhoneAuthRequest?: (phone: string) => void
  onPhoneAuthValidate?: (phone: string, code: string) => void
}) {
  // @language 'common'
  const { t } = useTranslation()
  const phoneRef = useRef<HTMLInputElement>(null)
  const authCodeRef = useRef<HTMLInputElement>(null)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [authCode, setAuthCode] = useState('')

  const isPhoneView = phoneViewType !== 'none'
  useEffect(() => {
    if (phoneViewType === 'phone' && phoneRef.current) {
      phoneRef.current.focus()
    } else if (phoneViewType === 'validate' && authCodeRef.current) {
      authCodeRef.current.focus()
    }
  }, [phoneViewType])

  const onCancelModifyPhone = () => {
    if (onCancel) {
      onCancel()
    }
  }
  const onChangePhone = () => {
    setPhoneNumber('')
    setAuthCode('')
    if (onModifyPhone) {
      onModifyPhone()
    }
  }
  const onRequestAuthCode = () => {
    if (onPhoneAuthRequest) {
      onPhoneAuthRequest(phoneNumber)
    }
  }
  const onValidateAuthCode = () => {
    if (onPhoneAuthValidate) {
      onPhoneAuthValidate(phoneNumber, authCode)
    }
  }

  const remainingDate = payAfterInfo
    ? getRemainingDate(payAfterInfo.currentDays, payAfterInfo.addDays)
    : undefined
  const beforePeriod = remainingDate
    ? t('t8th0243', {
        num: payAfterInfo!.currentDays,
        txt: DateUtils.toStringDate(remainingDate.date, {
          divide: '.',
          digitfix: false,
        }),
      })
    : undefined
  const afterPeriod = remainingDate
    ? t('t8th0243', {
        num: payAfterInfo!.currentDays + payAfterInfo!.addDays,
        txt: DateUtils.toStringDate(remainingDate.afterDate, {
          divide: '.',
          digitfix: false,
        }),
      })
    : undefined

  return (
    <section>
      <h2 className="section-title">{t('t8th0231')}</h2>
      <div className="member-box">
        <div className="member-row">
          <span>{t('t8th0232')}</span>
          <strong>{loginId}</strong>
        </div>
        {isPhoneView && (
          <div className="member-row">
            <span>{t('t8th0233')}</span>
            <strong className="phone-value" style={{ lineHeight: '32px' }}>
              {savedPhone || t('t8th0234')}
              {phoneViewType === 'default' && (
                <button
                  type="button"
                  className="detail-link"
                  onClick={onChangePhone}>
                  {t('t8th0235')}
                </button>
              )}
            </strong>
          </div>
        )}
        {isPhoneView && phoneViewType !== 'default' && (
          <>
            <div className="phone-change">
              <div className="phone-change-head">
                <p className="phone-change-title">{t('t8th0236')}</p>
                <button
                  type="button"
                  className="detail-link"
                  onClick={onCancelModifyPhone}>
                  {t('t8th0237')}
                </button>
              </div>
              <div className="phone-pill">
                <input
                  ref={phoneRef}
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder={t('t8th0238')}
                  disabled={phoneViewType === 'validate'}
                  value={phoneNumber}
                  onKeyDown={(event) => {
                    if (phoneViewType === 'phone' && event.key === 'Enter') {
                      onRequestAuthCode()
                    }
                  }}
                  onChange={(event) => {
                    const next = event.target.value.replace(/[^0-9]/g, '')
                    setPhoneNumber(next)
                  }}
                />
                {phoneViewType === 'phone' && (
                  <button type="button" onClick={onRequestAuthCode}>
                    {t('t8th126')}
                  </button>
                )}
                {phoneViewType === 'validate' && (
                  <button type="button" onClick={onChangePhone}>
                    {t('t8th0239')}
                  </button>
                )}
              </div>

              {phoneViewType === 'phone' && !!phoneErrorMessage && (
                <p className="phone-note is-error">
                  *{` ${phoneErrorMessage}`}
                </p>
              )}

              {phoneViewType === 'validate' && (
                <>
                  <p className="phone-note">{t('t8th0240')}</p>
                  <div className="phone-pill">
                    <input
                      ref={authCodeRef}
                      type="tel"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      placeholder={t('t8th0241', { time: timeText })}
                      value={authCode}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          onValidateAuthCode()
                        }
                      }}
                      onChange={(event) => {
                        setAuthCode(event.target.value)
                      }}
                    />
                    {isReSendable && (
                      <button type="button" onClick={onRequestAuthCode}>
                        {t('t8th0041')}
                      </button>
                    )}
                    <button type="button" onClick={onValidateAuthCode}>
                      {t('t8th0242')}
                    </button>
                  </div>
                  {!!authErrorMessage && (
                    <p className="phone-note is-error">
                      *{` ${authErrorMessage}`}
                    </p>
                  )}
                </>
              )}
            </div>
          </>
        )}
        {!!beforePeriod && !!afterPeriod && (
          <>
            <div className="buyer-split" />
            <div className="period-group">
              <h3>Reading Gate</h3>
              <div className="member-row">
                <span>{t('t8th0244')}</span>
                <strong>{beforePeriod}</strong>
              </div>
              <div className="member-row">
                <span>{t('t8th0245')}</span>
                <strong>{afterPeriod}</strong>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

function getRemainingDate(
  day: number,
  afterDay: number,
): { date: Date; afterDate: Date } {
  const currentDate = new Date()
  currentDate.setDate(currentDate.getDate() + day - 1)
  const afterDate = new Date()
  afterDate.setDate(afterDate.getDate() + day + afterDay - 1)
  return {
    date: currentDate,
    afterDate: afterDate,
  }
}
