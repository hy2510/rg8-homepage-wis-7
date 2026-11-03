import {
  StudentEditCardButton,
  StudentEditCardButtonContainer,
  StudentEditCardStyle,
  StudentEditPinCellStyle,
  StudentEditPinRowStyle,
} from '@/8th/shared/styled/FeaturesStyled'
import { TextStyle } from '@/8th/shared/ui/Misc'
import useTranslation from '@/localization/client/useTranslations'
import { type ChangeEvent, useEffect, useRef, useState } from 'react'

const PIN_LENGTH = 4

function keepCaretAtEnd(input: HTMLInputElement) {
  const end = input.value.length
  if (input.selectionStart === end && input.selectionEnd === end) return
  input.setSelectionRange(end, end)
}

export default function StudentEditInputPin({
  readOnly,
  isEdit,
  onEdit,
  onSaveRecoveryPin,
  onCancel,
}: {
  readOnly?: boolean
  isEdit?: boolean
  onEdit?: () => void
  onSaveRecoveryPin?: (
    password: string,
    newPin: string,
    confirmPin: string,
  ) => void
  onCancel?: () => void
}) {
  // @language 'common'
  const { t } = useTranslation()

  if (!isEdit) {
    return (
      <StudentEditCardStyle>
        <TextStyle fontSize="small" fontFamily="sans" fontColor="secondary">
          {t('t8th0484')}
        </TextStyle>
        <EditPinField value={'0000'} />
        <StudentEditCardButtonContainer>
          <StudentEditCardButton className="edit" onClick={onEdit}>
            {t('t8th096')}
          </StudentEditCardButton>
        </StudentEditCardButtonContainer>
      </StudentEditCardStyle>
    )
  }
  return (
    <PasswordFieldEdit
      onSaveRecoveryPin={onSaveRecoveryPin}
      onCancel={onCancel}
    />
  )
}

function PasswordFieldEdit({
  onSaveRecoveryPin,
  onCancel,
}: {
  onSaveRecoveryPin?: (
    password: string,
    pin: string,
    confirmPin: string,
  ) => void
  onCancel?: () => void
}) {
  // @language 'common'
  const { t } = useTranslation()

  const inputRef = useRef<HTMLInputElement>(null)

  const [password, setPassword] = useState('')
  const [newRecoveryPin, setNewRecoveryPin] = useState('')
  const [confirmRecoveryPin, setConfirmRecoveryPin] = useState('')

  const onSaveRecoveryPinClick = () => {
    if (onSaveRecoveryPin) {
      onSaveRecoveryPin(password, newRecoveryPin, confirmRecoveryPin)
    }
  }

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <>
      <StudentEditCardStyle>
        <TextStyle fontSize="small" fontFamily="sans" fontColor="secondary">
          {t('t8th102')}
        </TextStyle>
        <input
          ref={inputRef}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('t8th115')}
        />
      </StudentEditCardStyle>
      <StudentEditCardStyle>
        <TextStyle fontSize="small" fontFamily="sans" fontColor="secondary">
          {t('t8th0485', { num: PIN_LENGTH })}
        </TextStyle>
        <EditPinField
          value={newRecoveryPin}
          placeholder={t('t8th0486')}
          onChange={setNewRecoveryPin}
        />
      </StudentEditCardStyle>
      <StudentEditCardStyle>
        <TextStyle fontSize="small" fontFamily="sans" fontColor="secondary">
          {t('t8th0487')}
        </TextStyle>
        <EditPinField
          value={confirmRecoveryPin}
          placeholder={t('t8th0488')}
          onChange={setConfirmRecoveryPin}
        />
        <StudentEditCardButtonContainer>
          <StudentEditCardButton
            className="save"
            onClick={onSaveRecoveryPinClick}>
            {t('t8th091')}
          </StudentEditCardButton>
          <StudentEditCardButton className="cancel" onClick={onCancel}>
            {t('t8th078')}
          </StudentEditCardButton>
        </StudentEditCardButtonContainer>
      </StudentEditCardStyle>
    </>
  )
}

function EditPinField({
  value,
  placeholder,
  onChange,
}: {
  value: string
  placeholder?: string
  onChange?: (value: string) => void
}) {
  const [focused, setFocused] = useState(false)
  const pin = value.replace(/\D/g, '').slice(0, PIN_LENGTH)

  const update = (next: string) => {
    onChange?.(next.replace(/\D/g, '').slice(0, PIN_LENGTH))
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

  const cursor = pin.length < PIN_LENGTH ? pin.length : PIN_LENGTH - 1

  return (
    <StudentEditPinRowStyle>
      {Array.from({ length: PIN_LENGTH }, (_, index) => (
        <StudentEditPinCellStyle
          key={index}
          $active={focused && index === cursor}
          aria-hidden>
          {pin[index] ? '•' : null}
        </StudentEditPinCellStyle>
      ))}
      <input
        type="text"
        inputMode="numeric"
        autoComplete="off"
        maxLength={PIN_LENGTH}
        value={pin}
        aria-label={placeholder}
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
        }}
        onChange={applyInput}
      />
    </StudentEditPinRowStyle>
  )
}
