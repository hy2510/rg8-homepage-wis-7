'use client'

import useTranslation from '@/localization/client/useTranslations'

export default function SelectNation({
  nationCustomers,
  onSelect,
}: {
  nationCustomers: {
    customerId: string
    name: string
    label: string
    customerUseCode: string
  }[]
  onSelect: (customer: {
    customerId: string
    name: string
    customerUseCode: string
  }) => void
}) {
  // @language 'common'
  const { t } = useTranslation()

  return (
    <div className="body is-add">
      <h1>{t('t8th0080')}</h1>
      <p className="pick-copy">{t('t8th0081')}</p>
      <div className="member-list">
        {nationCustomers.map((customer) => (
          <button
            type="button"
            className="member-item"
            key={`${customer.customerId}-${customer.label}`}
            onClick={() => onSelect(customer)}>
            <strong>{customer.label}</strong>
          </button>
        ))}
      </div>
    </div>
  )
}
