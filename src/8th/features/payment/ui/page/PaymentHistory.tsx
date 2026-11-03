'use client'

import { useCustomerConfiguration } from '@/8th/application/context/CustomerContext'
import { usePaymentHistoryList } from '@/8th/features/payment/service/payment-query'
import CurrencyFormat from '@/localization/currency-format'
import useTranslation from '@/localization/client/useTranslations'

export default function PaymentHistory() {
  // @language 'common'
  const { t } = useTranslation()

  const { country } = useCustomerConfiguration()
  const { data: historyList, isLoading } = usePaymentHistoryList()
  const currency = country === 'vn' ? 'VND' : 'KRW'
  const rows =
    historyList?.history?.map((item) => ({
      memo: item.memo,
      receiptFee: CurrencyFormat.toNumberMoneyString(item.receiptFee, currency),
      receiptDate: item.receiptDate,
      receiptTypeName: item.receiptTypeName,
    })) || []
  const empty = !isLoading && rows.length === 0

  return (
    <div className="board">
      <section>
        <h2 className="section-title">{t('t8th0191')}</h2>
        {isLoading ? (
          <p className="status">{t('t8th0271')}</p>
        ) : empty ? (
          <p className="status">{t('t8th0272')}</p>
        ) : (
          <div className="history-table">
            <div className="history-head" aria-hidden>
              <span>{t('t8th0273')}</span>
              <span>{t('t8th0201')}</span>
              <span>{t('t8th0274')}</span>
              <span>{t('t8th0275')}</span>
            </div>
            <ul>
              {rows.map((row, index) => (
                <li key={`${row.memo}-${index}`}>
                  <span>{row.memo}</span>
                  <span>{row.receiptFee}</span>
                  <span>{row.receiptDate}</span>
                  <span>{row.receiptTypeName}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  )
}
