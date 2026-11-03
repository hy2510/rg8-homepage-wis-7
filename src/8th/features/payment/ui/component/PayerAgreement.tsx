'use client'

import useTranslation from '@/localization/client/useTranslations'

export default function PayerAgreement({
  policyAgree,
  notifyAgree,
  onPolicyAgreedChange,
  onNotifyChange,
}: {
  policyAgree: boolean
  notifyAgree: boolean
  onPolicyAgreedChange: (checked: boolean) => void
  onNotifyChange: (checked: boolean) => void
}) {
  // @language 'common'
  const { t } = useTranslation()

  return (
    <section className="agree-list">
      <label className={`agree-item${policyAgree ? ' is-checked' : ''}`}>
        <input
          type="checkbox"
          checked={policyAgree}
          onChange={(event) => onPolicyAgreedChange(event.target.checked)}
        />
        <span>{t('t8th0218')}</span>
      </label>
      <label className={`agree-item${notifyAgree ? ' is-checked' : ''}`}>
        <input
          type="checkbox"
          checked={notifyAgree}
          onChange={(event) => onNotifyChange(event.target.checked)}
        />
        <span>{t('t8th0219')}</span>
      </label>
    </section>
  )
}
