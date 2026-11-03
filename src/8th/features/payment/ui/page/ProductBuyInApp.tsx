'use client'

import {
  useCustomerConfiguration,
  useCustomerInfo,
} from '@/8th/application/context/CustomerContext'
import { Assets } from '@/8th/assets/asset-library'
import BuyProductInfo from '@/8th/features/payment/ui/component/BuyProductInfo'
import PayerAgreement from '@/8th/features/payment/ui/component/PayerAgreement'
import PayerInfo from '@/8th/features/payment/ui/component/PayerInfo'
import { PurchaseRequest } from '@/8th/features/payment/ui/modal/PurchaseProcessModal'
import {
  useChangeSmsAgree,
  useRegistPhoneNumberCertificate,
  useRegistPhoneNumberRequest,
  useStudent,
} from '@/8th/features/student/service/student-query'
import { useCountDown } from '@/8th/shared/hook/useCountDown'
import SITE_PATH from '@/app/site-path'
import useTranslation from '@/localization/client/useTranslations'
import CurrencyFormat from '@/localization/currency-format'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import PurchaseInAppProcessModal from '../modal/PurchaseInAppProcessModal'

export default function ProductBuyInApp({
  platform,
  currency,
  id,
  name,
  value,
  fee,
  totalFee,
  discount,
  onBack,
}: {
  platform: 'android' | 'ios'
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

  const { country } = useCustomerConfiguration()
  const customerInfo = useCustomerInfo()
  const studentInfo = useStudent()
  const student = studentInfo?.data?.student

  const [modifyPhoneType, setModifyPhoneType] = useState<
    'default' | 'phone' | 'validate'
  >('default')
  const [phoneNumberErrorMessage, setPhoneNumberErrorMessage] = useState<
    string | undefined
  >(undefined)
  const [authErrorMessage, setAuthErrorMessage] = useState<string | undefined>(
    undefined,
  )
  const { mutate: requestPhoneAuth } = useRegistPhoneNumberRequest({
    onSuccess: () => {
      setModifyPhoneType('validate')
      setPhoneNumberErrorMessage('')
      phoneAuthCountDown.reset()
    },
    onError: () => {
      setPhoneNumberErrorMessage(t('t8th129'))
      phoneAuthCountDown.stop()
    },
  })
  const { mutate: validatePhoneAuth } = useRegistPhoneNumberCertificate({
    onSuccess: () => {
      setModifyPhoneType('default')
      setPhoneNumberErrorMessage('')
      setAuthErrorMessage('')
      phoneAuthCountDown.stop()
      alert(t('t8th132'))
    },
    onError: () => {
      setAuthErrorMessage(t('t8th131'))
    },
  })
  const phoneAuthCountDown = useCountDown({ timeset: 60 * 10 })
  const onPhoneAuthReset = () => {
    setModifyPhoneType('default')
    setPhoneNumberErrorMessage('')
    setAuthErrorMessage('')
    phoneAuthCountDown.stop()
  }
  const onPhoneAuthRequest = (phone: string) => {
    if (phone.length === 0) {
      setPhoneNumberErrorMessage(t('t8th134'))
      return
    }
    requestPhoneAuth({ phoneNumber: phone })
  }
  const onPhoneAuthValidate = (phoneNumber: string, authCode: string) => {
    if (authCode.length === 0) {
      setAuthErrorMessage(t('t8th131'))
      return
    }
    if (phoneNumber.length === 0) {
      setAuthErrorMessage(t('t8th130'))
      return
    }
    setAuthErrorMessage('')
    validatePhoneAuth({
      phoneNumber: phoneNumber,
      authCode: authCode,
    })
  }

  const [policyAgree, setPolicyAgree] = useState(false)
  const [notifyAgree, setNotifyAgree] = useState(false)
  const { mutate: changeSmsAgree } = useChangeSmsAgree({
    onSuccess: (data, variables) => {
      if (variables.isReceive) {
        alert(t('t8th124'))
      } else {
        alert(t('t8th125'))
      }
      setNotifyAgree(variables.isReceive)
    },
  })
  useEffect(() => {
    const isReceive = student?.smsEventInfomationYn || student?.smsStudyReportYn
    setNotifyAgree(!!isReceive)
  }, [student?.smsEventInfomationYn, student?.smsStudyReportYn])
  const onChangeNotifyAgree = (checked: boolean) => {
    setNotifyAgree(checked)
    changeSmsAgree({ isReceive: checked })
  }

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

  const [paymentInfo, setPaymentInfo] = useState<PurchaseRequest | undefined>(
    undefined,
  )

  const onSetPaymentInfo = () => {
    if (!customerInfo?.customerId || !student?.studentId) {
      return
    }
    if (country === 'kr') {
      if (!student?.parentCellPhone) {
        alert(t('t8th0222'))
        return
      }
      if (!policyAgree) {
        alert(t('t8th0223'))
        return
      }
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
      payMethod: 'inapp',
    })
  }

  const onPurchaseResult = useCallback(
    ({
      isSuccess,
      code,
      message: resultMessage,
    }: {
      isSuccess: boolean
      code: number
      message: string
    }) => {
      setPaymentInfo(undefined)
      if (isSuccess) {
        // 성공
        alert(t('t8th0220'))
        router.push(SITE_PATH.HOME_8TH.PAYMENT_HISTORY)
      } else {
        // 실패
        if (code === -10) {
          return
        }
        const message = `${t('t8th0225')}[${code}]`
        alert(message)
      }
    },
    [],
  )

  const [couponCode, setCouponCode] = useState('')
  const couponDiscount = 0

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
      />

      <PayerInfo
        loginId={student?.loginId || ''}
        savedPhone={student?.parentCellPhone || undefined}
        phoneViewType={country === 'kr' ? modifyPhoneType : 'none'}
        phoneErrorMessage={phoneNumberErrorMessage}
        authErrorMessage={authErrorMessage}
        timeText={phoneAuthCountDown.timeText}
        isReSendable={phoneAuthCountDown.currentTime < 360}
        payAfterInfo={{
          currentDays: student?.studyEndDay || 0,
          currentEndDate: student?.studyEndDate || '',
          addDays: value,
        }}
        onCancel={onPhoneAuthReset}
        onModifyPhone={() => setModifyPhoneType('phone')}
        onPhoneAuthRequest={onPhoneAuthRequest}
        onPhoneAuthValidate={onPhoneAuthValidate}
      />
      {country === 'kr' && (
        <PayerAgreement
          policyAgree={policyAgree}
          notifyAgree={notifyAgree}
          onPolicyAgreedChange={(checked) => setPolicyAgree(checked)}
          onNotifyChange={onChangeNotifyAgree}
        />
      )}

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
          {(discountFeeSum > 0 || couponDiscount > 0) && (
            <>
              <div className="checkout-summary-line" />
              <p>
                {t('t8th0230', {
                  txt: CurrencyFormat.toNumberMoneyString(
                    discountFeeSum + couponDiscount,
                    currency,
                  ),
                })}
              </p>
            </>
          )}
        </div>
        <button type="button" className="pay-button" onClick={onSetPaymentInfo}>
          {t('t8th095')}
        </button>
      </section>

      {paymentInfo && (
        <PurchaseInAppProcessModal
          platform={platform}
          productId={id}
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
