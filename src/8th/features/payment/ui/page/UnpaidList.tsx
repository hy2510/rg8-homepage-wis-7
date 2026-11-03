'use client'

import { useCustomerInfo } from '@/8th/application/context/CustomerContext'
import { UnpaidBalance } from '@/8th/features/payment/model/unpaid-balance'
import {
  usePurchaseSuccessRefresh,
  useUnpaidBalanceList,
} from '@/8th/features/payment/service/payment-query'
import PurchaseProcessModal, {
  PurchaseRequest,
} from '@/8th/features/payment/ui/modal/PurchaseProcessModal'
import UnpaidPayModal from '@/8th/features/payment/ui/modal/UnpaidPayModal'
import { useStudent } from '@/8th/features/student/service/student-query'
import SITE_PATH from '@/app/site-path'
import useTranslation from '@/localization/client/useTranslations'
import CurrencyFormat from '@/localization/currency-format'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function UnpaidList() {
  const currency = 'KRW'

  const router = useRouter()

  // @language 'common'
  const { t } = useTranslation()

  const studentInfo = useStudent()
  const customerInfo = useCustomerInfo()

  const studentId = studentInfo?.data?.student.studentId || ''
  const customerId = customerInfo.customerId

  const unpaidList = useUnpaidBalanceList()

  const rows = unpaidList.data?.list ?? []
  const empty = !unpaidList.isLoading && rows.length === 0
  const [payTarget, setPayTarget] = useState<UnpaidBalance | undefined>(
    undefined,
  )

  const [paymentInfo, setPaymentInfo] = useState<PurchaseRequest | undefined>(
    undefined,
  )
  const { mutate: studentRefresh } = usePurchaseSuccessRefresh({
    onSuccess: () => {
      alert(t('t8th0220'))
      router.replace(SITE_PATH.HOME_8TH.PAYMENT_UNPAID_HISTORY)
    },
    onError: () => {
      setPaymentInfo(undefined)
      alert(t('t8th0221'))
    },
  })

  const onPurchaseRequest = (value: {
    payMethod: string
    phone: string
    email: string
  }) => {
    const item = unpaidList.data?.list?.find(
      (p) => p.requestId === payTarget?.requestId,
    )
    if (item) {
      const name = item.requestTypeName
      const price = item.fee
      const param = {
        customerId,
        studentId,
        payMethod: value.payMethod,
        productName: name,
        price,
        email: value.email,
        phone: value.phone,
        requestId: item.requestId,
        // mobileYn: isMobile ? 'Y' : 'N',
        mobileYn: 'N',
      }
      setPaymentInfo(param)
      setPayTarget(undefined)
    }
  }
  const onPurchaseResult = ({
    isSuccess,
    code,
    message: resultMessage,
  }: {
    isSuccess: boolean
    code: number
    message: string
  }) => {
    if (isSuccess) {
      studentRefresh({})
    } else {
      setPaymentInfo(undefined)
      alert(resultMessage || t('t8th0225'))
    }
  }

  return (
    <>
      <div className="board">
        <section>
          <h2 className="section-title">{t('t8th0193')}</h2>
          {unpaidList.isLoading ? (
            <p className="status">{t('t8th0288')}</p>
          ) : empty ? (
            <p className="status">{t('t8th0287')}</p>
          ) : (
            <div className="history-table is-unpaid">
              <div className="history-head" aria-hidden>
                <span>{t('t8th0273')}</span>
                <span>{t('t8th0285')}</span>
                <span>{t('t8th0201')}</span>
                <span>{t('t8th0286')}</span>
                <span />
              </div>
              <ul>
                {rows.map((row) => (
                  <li key={row.requestId}>
                    <span>{row.requestTypeName}</span>
                    <span>{row.className}</span>
                    <span>
                      {CurrencyFormat.toNumberMoneyString(row.fee, 'KRW')}
                    </span>
                    <span>{row.startDate}</span>
                    <span>
                      <button
                        type="button"
                        className="history-pay"
                        onClick={() => setPayTarget(row)}>
                        {t('t8th0253')}
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>
      {payTarget ? (
        <UnpaidPayModal
          itemName={payTarget.requestTypeName}
          className={payTarget.className}
          feeLabel={CurrencyFormat.toNumberMoneyString(payTarget.fee, currency)}
          onCancel={() => setPayTarget(undefined)}
          onConfirm={onPurchaseRequest}
        />
      ) : null}

      {paymentInfo && (
        <PurchaseProcessModal
          request={paymentInfo}
          currency={currency}
          onPurchaseResult={onPurchaseResult}
          onCancel={() => {
            setPaymentInfo(undefined)
          }}
        />
      )}
    </>
  )
}
