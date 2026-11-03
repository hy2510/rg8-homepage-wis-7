'use client'

import useTranslation from '@/localization/client/useTranslations'
import { type ChangeEvent, type KeyboardEvent, type Ref, useState } from 'react'

function keepCaretAtEnd(input: HTMLInputElement) {
  const end = input.value.length
  if (input.selectionStart === end && input.selectionEnd === end) return
  input.setSelectionRange(end, end)
}

export default function InputRecoveryPIN({
  ref,
  enableResetButton,
  disabled = false,
  invalid,
  label,
  length = 4,
  value,
  onChange,
  onKeyDown,
}: {
  ref?: Ref<HTMLInputElement | null>
  enableResetButton?: boolean
  disabled?: boolean
  invalid?: boolean
  label?: string
  length?: number
  value?: string
  onChange?: (value: string) => void
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void
}) {
  // @language 'common'
  const { t } = useTranslation()

  const [innerValue, setInnerValue] = useState('')
  const [focused, setFocused] = useState(false)
  const pin = (value ?? innerValue).replace(/\D/g, '').slice(0, length)
  const cursor = pin.length < length ? pin.length : length - 1

  const update = (next: string) => {
    const digits = next.replace(/\D/g, '').slice(0, length)
    if (value === undefined) setInnerValue(digits)
    onChange?.(digits)
  }

  const applyInput = (event: ChangeEvent<HTMLInputElement>) => {
    const native = event.nativeEvent as InputEvent
    const incoming = event.target.value.replace(/\D/g, '')
    if (native.inputType?.startsWith('delete')) {
      update(pin.slice(0, incoming.length))
      return
    }
    if (incoming.startsWith(pin)) {
      update(incoming)
      return
    }
    update(pin + (native.data ?? ''))
  }

  return (
    <fieldset className="recovery-digits">
      {label ? <legend>{label}</legend> : null}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          width: 'fit-content',
          margin: '0 auto',
        }}>
        <div
          className="recovery-digit-row"
          style={{
            position: 'relative',
            gridTemplateColumns: `repeat(${length}, minmax(0, 52px))`,
          }}>
          {Array.from({ length }, (_, index) => (
            <input
              key={index}
              type="text"
              readOnly
              tabIndex={-1}
              aria-hidden
              value={pin[index] ? '•' : ''}
              aria-invalid={invalid}
              onMouseDown={(event) => event.preventDefault()}
              style={{
                pointerEvents: 'none',
                ...(disabled ? { opacity: 0.45 } : undefined),
                ...(focused && !disabled && index === cursor
                  ? {
                      outline: '2px solid var(--font-color-light-blue)',
                      outlineOffset: '3px',
                      borderColor: 'var(--font-color-light-blue)',
                    }
                  : undefined),
              }}
            />
          ))}
          <input
            ref={ref}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            maxLength={length}
            value={pin}
            disabled={disabled}
            aria-label={label || t('t8th0466')}
            aria-invalid={invalid}
            aria-describedby={invalid ? 'error' : undefined}
            onFocus={(event) => {
              setFocused(true)
              keepCaretAtEnd(event.currentTarget)
            }}
            onBlur={() => setFocused(false)}
            onSelect={(event) => keepCaretAtEnd(event.currentTarget)}
            onKeyDown={(event) => {
              if (
                event.key === 'ArrowLeft' ||
                event.key === 'ArrowRight' ||
                event.key === 'ArrowUp' ||
                event.key === 'ArrowDown' ||
                event.key === 'Home' ||
                event.key === 'End'
              ) {
                event.preventDefault()
              }
              keepCaretAtEnd(event.currentTarget)
              onKeyDown?.(event)
            }}
            onChange={applyInput}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0,
              caretColor: 'transparent',
            }}
          />
        </div>
        {enableResetButton && (
          <button
            type="button"
            aria-label={t('t8th0467')}
            aria-hidden={pin.length === 0}
            tabIndex={pin.length > 0 ? 0 : -1}
            disabled={pin.length === 0}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              update('')
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
            <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
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
            {t('t8th0467')}
          </button>
        )}
      </div>
    </fieldset>
  )
}
