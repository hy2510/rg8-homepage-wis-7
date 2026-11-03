'use client'

import useTranslation from '@/localization/client/useTranslations'
import Image from 'next/image'

export default function SignInOption({
  isSavePassword,
  setIsSavePassword,
}: {
  isSavePassword: boolean
  setIsSavePassword: (isSavePassword: boolean) => void
}) {
  // @language 'common'
  const { t } = useTranslation()

  const isOnetimeLogin = !isSavePassword

  return (
    <div className="enter-options" role="radiogroup" aria-label={t('t8th0051')}>
      <RadioItem
        label={t('t8th0078')}
        isChecked={isOnetimeLogin}
        onClick={() => setIsSavePassword(false)}
      />
      <RadioItem
        label={t('t8th0079')}
        isChecked={isSavePassword}
        onClick={() => setIsSavePassword(true)}
      />
    </div>
  )
}

function RadioItem({
  label,
  isChecked,
  onClick,
}: {
  label: string
  isChecked: boolean
  onClick: () => void
}) {
  return (
    <label className={isChecked ? 'is-on' : undefined}>
      <input
        type="radio"
        name="enter-login-mode"
        checked={isChecked}
        onChange={(event) => {}}
        onClick={onClick}
      />
      <Image
        src={
          isChecked
            ? '/src/images/radio-icons/radio_on.svg'
            : '/src/images/radio-icons/radio_off.svg'
        }
        alt=""
        width={20}
        height={20}
      />
      {label}
    </label>
  )
}
