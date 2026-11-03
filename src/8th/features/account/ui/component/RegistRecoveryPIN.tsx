'use client'

import useTranslation from '@/localization/client/useTranslations'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import InputRecoveryPIN from './InputRecoveryPIN'

type InvalidPinState =
  | 'none'
  | 'input-pin'
  | 'input-pin-check'
  | 'invalid-pin'
  | 'valid'

export default function RegistRecoveryPIN({
  onBack,
  onRegistPin,
}: {
  onBack?: () => void
  onRegistPin?: (pin: string) => void
}) {
  // @language 'common'
  const { t } = useTranslation()

  const router = useRouter()

  const pinRef = useRef<HTMLInputElement>(null)
  const [pin, setPin] = useState('')

  const pinCheckRef = useRef<HTMLInputElement>(null)
  const [pinCheck, setPinCheck] = useState('')
  const previousPinLengthRef = useRef(pin.length)
  const pinCheckLengthRef = useRef(pinCheck.length)
  pinCheckLengthRef.current = pinCheck.length

  useEffect(() => {
    const previousPinLength = previousPinLengthRef.current
    previousPinLengthRef.current = pin.length
    if (
      previousPinLength < 4 &&
      pin.length === 4 &&
      pinCheckLengthRef.current === 0
    ) {
      pinCheckRef.current?.focus()
    }
  }, [pin])

  const getPinStateMessage = (
    invalidPinState: InvalidPinState,
  ): string | undefined => {
    switch (invalidPinState) {
      case 'input-pin':
        return t('t8th0468')
      case 'input-pin-check':
        return t('t8th0469')
      case 'invalid-pin':
        return t('t8th0470')
    }
    return undefined
  }
  const pinState = getPinState(pin, pinCheck)
  const pinStateMessage = getPinStateMessage(pinState)

  const onSuccessPinCheck = () => {
    if (pinState !== 'valid') {
      if (pinStateMessage) {
        alert(pinStateMessage)
      }
      return
    }
    if (onRegistPin) {
      onRegistPin(pin)
    }
  }

  return (
    <div className="body is-add">
      <h1>{t('t8th0471')}</h1>
      <section className="add-panel recovery-panel">
        <div className="recovery-form">
          <h2>{t('t8th0472')}</h2>
          <p>{t('t8th0473')}</p>
          <InputRecoveryPIN
            label={t('t8th0475', { num: 4 })}
            ref={pinRef}
            length={4}
            value={pin}
            onChange={(pin) => {
              setPin(pin)
              if (pin.length < 4) {
                setPinCheck('')
              }
            }}
          />
          <InputRecoveryPIN
            label={t('t8th0476')}
            ref={pinCheckRef}
            length={4}
            disabled={pin.length !== 4}
            value={pinCheck}
            onChange={setPinCheck}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                if (pinState === 'valid') {
                  onSuccessPinCheck()
                }
              }
            }}
          />
          <p className="recovery-help" style={{ minHeight: '1.6em' }}>
            {pinStateMessage || ' '}
            {pinState === 'invalid-pin' && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                }}>
                <button
                  type="button"
                  aria-label={t('t8th0477')}
                  onClick={() => {
                    setPin('')
                    setPinCheck('')
                    pinRef.current?.focus()
                  }}
                  style={{
                    alignSelf: 'center',
                    height: '32px',
                    marginTop: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    padding: '0 12px',
                    border: '1px solid #d6dfea',
                    borderRadius: '999px',
                    background: '#fff',
                    color: 'var(--font-color-primary)',
                    font: 'inherit',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: pin.length > 0 ? 'pointer' : 'default',
                    visibility: pin.length > 0 ? 'visible' : 'hidden',
                  }}>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    aria-hidden="true">
                    <path
                      d="M20 12a8 8 0 1 1-2.3-5.7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M20 4v5h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {t('t8th0477')}
                </button>
              </div>
            )}
          </p>
          <button
            type="button"
            className="recovery-submit"
            disabled={pinState !== 'valid'}
            onClick={onSuccessPinCheck}>
            {t('t8th0478')}
          </button>
        </div>
      </section>

      <button
        type="button"
        className="add-find"
        onClick={() => {
          if (onBack) {
            onBack()
            return
          }
          router.back()
        }}>
        {t('t8th0042')}
      </button>
    </div>
  )
}

function getPinState(pin: string, pinCheck: string): InvalidPinState {
  if (pin.length === 0) {
    return 'none'
  }
  if (pin.length < 4) {
    return 'input-pin'
  }
  if (pinCheck.length !== 4) {
    return 'input-pin-check'
  }
  if (pin !== pinCheck) {
    return 'invalid-pin'
  }
  return 'valid'
}
