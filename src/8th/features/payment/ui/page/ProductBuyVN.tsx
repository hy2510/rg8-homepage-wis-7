'use client'

import { useCustomerInfo } from '@/8th/application/context/CustomerContext'
import { Assets } from '@/8th/assets/asset-library'
import { usePurchaseSuccessRefresh } from '@/8th/features/payment/service/payment-query'
import BuyProductInfo from '@/8th/features/payment/ui/component/BuyProductInfo'
import PayerInfo from '@/8th/features/payment/ui/component/PayerInfo'
import PurchaseProcessModal, {
  PurchaseRequest,
} from '@/8th/features/payment/ui/modal/PurchaseProcessModal'
import { useStudent } from '@/8th/features/student/service/student-query'
import SITE_PATH from '@/app/site-path'
import useTranslation from '@/localization/client/useTranslations'
import CurrencyFormat from '@/localization/currency-format'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ProductBuyVN({
  currency,
  id,
  name,
  value,
  fee,
  totalFee,
  discount,
  payTypes,
  event,
  onBack,
}: {
  currency: string
  id: string
  name: string
  value: number
  fee: number
  totalFee: number
  discount: { type: string; name: string; fee: number }[]
  event?: {
    name: string
    discountfee: number
    gift?: string | undefined
  }
  payTypes: { id: string; name: string }[]
  onBack?: () => void
}) {
  // const maketingEventTracker = useTrack()
  // useEffect(() => {
  //   if (payload && selectItem) {
  //     const filteredItem = payload?.product?.filter(
  //       (item) => item.id === selectItem,
  //     )
  //     if (filteredItem && filteredItem.length > 0) {
  //       maketingEventTracker.eventAction('이용권 상품 조회', {
  //         catagory_id:
  //           purchaseType === 'direct' || purchaseType === 'directvn'
  //             ? 'web'
  //             : purchaseType,
  //         product_id: filteredItem[0].name,
  //       })
  //     }
  //   }
  // }, [maketingEventTracker, payload, selectItem, purchaseType])

  const router = useRouter()

  // @language 'common'
  const { t } = useTranslation()

  const customerInfo = useCustomerInfo()
  const studentInfo = useStudent()
  const student = studentInfo?.data?.student

  let basicDiscountFeeSum = 0
  let addDiscountFeeSum = 0
  discount.forEach((discount) => {
    if (discount.type === 'basic') {
      basicDiscountFeeSum += discount.fee
    } else if (discount.type === 'add') {
      addDiscountFeeSum += discount.fee
    }
  })
  const discountFeeSum = basicDiscountFeeSum + addDiscountFeeSum
  const discountRate =
    discountFeeSum > 0 ? Math.floor((discountFeeSum / fee) * 100) : 0

  const [payMethod, setPayMethod] = useState<string | undefined>(undefined)

  const [paymentInfo, setPaymentInfo] = useState<PurchaseRequest | undefined>(
    undefined,
  )
  const [bindShowPaymentInfo, setBindShowPaymentInfo] = useState(false)

  useEffect(() => {
    if (
      !bindShowPaymentInfo &&
      payTypes.length === 1 &&
      student?.studentId &&
      customerInfo?.customerId
    ) {
      setPaymentInfo({
        customerId: customerInfo.customerId,
        studentId: student.studentId,
        productName: name,
        price: totalFee,
        payMethod: payTypes[0].id,
      })
      setPayMethod(payTypes[0].id)
      setBindShowPaymentInfo(true)
    }
  }, [
    payTypes,
    customerInfo?.customerId,
    student?.studentId,
    name,
    totalFee,
    setPayMethod,
    bindShowPaymentInfo,
  ])

  const { mutate: studentRefresh } = usePurchaseSuccessRefresh({
    onSuccess: () => {
      alert(t('t8th0220'))
      router.replace(SITE_PATH.HOME_8TH.PAYMENT_HISTORY)
    },
    onError: () => {
      setPaymentInfo(undefined)
      alert(t('t8th0221'))
    },
  })
  const onSetPaymentInfo = () => {
    if (!customerInfo?.customerId || !student?.studentId) {
      return
    }
    if (!payMethod) {
      alert(t('t8th0224'))
      return
    }

    // maketingEventTracker.eventAction('결제 시작', {
    //   product_id: name,
    //   total_price: totalFee,
    // })
    // maketingEventTracker.eventAction('이용권 결제하기 클릭', {
    //   catagory:
    //     purchaseType === 'direct' || purchaseType === 'directvn'
    //       ? 'web'
    //       : purchaseType,
    //   product_id: id,
    //   product_name: name,
    //   price: totalFee,
    //   currency: currency,
    //   subscription_type: name,
    // })

    setPaymentInfo({
      customerId: customerInfo!.customerId,
      studentId: student!.studentId,
      productName: name,
      price: totalFee,
      payMethod: payMethod,
    })
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

  const isShowBackNav = onBack !== undefined

  return (
    <div className="board checkout-board">
      {isShowBackNav && (
        <button type="button" className="back-nav" onClick={onBack}>
          <Image
            src={Assets.Icon.arrowLeftGray}
            alt=""
            width={24}
            height={24}
          />
          {t('t8th0069')}
        </button>
      )}

      <BuyProductInfo
        productName={name}
        value={value}
        fee={fee}
        totalFee={totalFee}
        discountRate={discountRate}
        currency={currency}
        event={event}
      />

      <PayerInfo
        loginId={student?.loginId || ''}
        phoneViewType={'none'}
        payAfterInfo={{
          currentDays: student?.studyEndDay || 0,
          currentEndDate: student?.studyEndDate || '',
          addDays: value,
        }}
      />

      <section>
        <h2 className="section-title">{t('t8th0226')}</h2>
        <div className="pay-methods">
          {payTypes.map((method) => (
            <button
              type="button"
              key={method.id}
              className={`pay-method${payMethod === method.id ? ' is-active' : ''}`}
              onClick={() => setPayMethod(method.id)}>
              {method.name}
            </button>
          ))}
        </div>
      </section>

      <section className="checkout-summary">
        <p className="checkout-total">
          {t('t8th0227', {
            txt: CurrencyFormat.toNumberMoneyString(totalFee, currency),
          })}
        </p>
        <div className="checkout-bill">
          <p>
            {t('t8th0228', {
              txt: CurrencyFormat.toNumberMoneyString(fee, currency),
            })}
          </p>
          {discountFeeSum > 0 && (
            <p>
              {t('t8th0229', {
                txt: CurrencyFormat.toNumberMoneyString(
                  discountFeeSum,
                  currency,
                ),
              })}
            </p>
          )}
          {/* <p>
              쿠폰 할인: {couponDiscount > 0 ? '-' : ''}
              {CurrencyFormat.toNumberMoneyString(couponDiscount, currency)}
            </p> */}
          {/* {(discountFeeSum > 0 || couponDiscount > 0) && (
              <>
                <div className="checkout-summary-line" />
                <p>
                  총 할인 금액: -
                  {CurrencyFormat.toNumberMoneyString(
                    productDiscount + couponDiscount,
                    currency,
                  )}
                </p>
              </>
            )} */}
        </div>
        <button type="button" className="pay-button" onClick={onSetPaymentInfo}>
          {t('t8th095')}
        </button>
      </section>

      {paymentInfo && (
        <PurchaseProcessModal
          request={paymentInfo}
          currency={currency}
          onPurchaseResult={onPurchaseResult}
          onCancel={() => {
            // maketingEventTracker.eventAction('구매 취소', {
            //   product_id: paymentInfo.productName,
            //   cancel_reason: '사용자 취소',
            // })
            // maketingEventTracker.eventAction('결제 취소', {
            //   product_name: paymentInfo.productName,
            //   price: paymentInfo.price,
            //   currency: currency,
            //   subscription_type: paymentInfo.productName,
            //   cancel_reason: '사용자 취소',
            // })
            setPaymentInfo(undefined)
          }}
        />
      )}
    </div>
  )
}
