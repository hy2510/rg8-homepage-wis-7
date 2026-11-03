'use client'

import { useTrack } from '@/external/marketing-tracker/component/MarketingTrackerContext'
import useTranslation from '@/localization/client/useTranslations'
import { useEffect, useState } from 'react'

const PURCHASE_RESULT_ORIGIN = 'https://integratedpay.readinggate.com'
const PAYMENT_URL = 'https://integratedpay.readinggate.com/Payment/Payment'
// const PAYMENT_URL = 'https://integratedpay.readinggate.com/Payment/PaymentTest'
const REQUEST_WINDOW_TYPE: 'iframe' | 'opener' = 'opener'

export type PurchaseRequest = {
  customerId: string
  studentId: string
  productName: string
  price: number
  payMethod: string
  email?: string | undefined
  phone?: string | undefined
  requestId?: string | undefined
}

export default function PurchaseProcessModal({
  request,
  currency = 'KRW',
  onPurchaseResult,
  onCancel,
}: {
  request: PurchaseRequest
  currency?: string
  onPurchaseResult?: (result: {
    isSuccess: boolean
    code: number
    message: string
  }) => void
  onCancel?: () => void
}) {
  const {
    customerId,
    studentId,
    productName,
    price,
    payMethod,
    email,
    phone,
    requestId,
  } = request
  let paramSerial = `callType=${REQUEST_WINDOW_TYPE}&CustomerId=${customerId}&StudentId=${studentId}&GoodsName=${productName}&TotalPrice=${price}&PayMethod=${payMethod}`
  if (email) {
    paramSerial += `&Email=${email}`
  }
  if (phone) {
    paramSerial += `&PhoneNumber=${phone}`
  }
  if (requestId) {
    paramSerial += `&RequestId=${requestId}`
  }
  const payDataUrl = `${PAYMENT_URL}?${paramSerial}`

  // @language 'common'
  const { t } = useTranslation()

  const maketingEventTracker = useTrack()

  useEffect(() => {
    const messageHandler = (e: MessageEvent) => {
      if (e.origin === PURCHASE_RESULT_ORIGIN) {
        const data = JSON.parse(e.data) as { Status: string }

        let code = 0
        let message = ''
        if (data.Status !== 'Complete') {
          code = -1000
          message = t('t8th0225')
        }
        if (code === 0) {
          maketingEventTracker.eventAction('상품구매', {
            value: request.price,
            currency,
          })
          maketingEventTracker.eventAction('결제 완료', {
            product_name: request.productName,
            price: request.price,
            currency: currency,
            subscription_type: request.productName,
          })
        } else {
          maketingEventTracker.eventAction('구매 취소', {
            product_id: request.productName,
            cancel_reason: message,
          })
          maketingEventTracker.eventAction('결제 취소', {
            product_name: request.productName,
            price: request.price,
            currency: currency,
            subscription_type: request.productName,
            cancel_reason: message,
          })
        }
        if (onPurchaseResult) {
          onPurchaseResult({ isSuccess: code === 0, code, message })
        }
      }
    }
    window.addEventListener('message', messageHandler)
    return () => {
      window.removeEventListener('message', messageHandler)
    }
  }, [maketingEventTracker, request, currency, onPurchaseResult, t])
  const [isOpner, setOpener] = useState(false)
  useEffect(() => {
    if (!isOpner && REQUEST_WINDOW_TYPE === 'opener') {
      window.open(payDataUrl)
      setOpener(true)
    }
  }, [isOpner, payDataUrl])

  const onCancelListener = () => {
    if (onCancel) {
      if (
        confirm(
          t('t8th0254'),
        )
      ) {
        onCancel()
      }
    }
  }

  return (
    // 결제
    <div
      className="hp-modal-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) {
          if (onCancelListener) {
            onCancelListener()
          }
        }
      }}>
      <section
        className="hp-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="purchase-progress-title">
        <header className="hp-modal-header">
          <h2 id="purchase-progress-title">{t('t8th0253')}</h2>
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

        <div className="container">
          {REQUEST_WINDOW_TYPE === 'iframe' ? (
            <iframe
              src={payDataUrl}
              width={'100%'}
              frameBorder="0"
              style={{ height: '60vh', backgroundColor: 'transparent' }}
            />
          ) : (
            <div style={{ display: 'flex', padding: '20px' }}>
              {t('t8th0255')}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
