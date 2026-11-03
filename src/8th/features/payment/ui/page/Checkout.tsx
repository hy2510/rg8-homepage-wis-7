'use client'

import { useDevicePlatform } from '@/8th/application/context/ApplicationContext'
import { useCustomerConfiguration } from '@/8th/application/context/CustomerContext'
import { Assets } from '@/8th/assets/asset-library'
import { usePurchaseProductList } from '@/8th/features/payment/service/payment-query'
import { useStudent } from '@/8th/features/student/service/student-query'
import useTranslation from '@/localization/client/useTranslations'
import Image from 'next/image'
import ProductBuyInApp from './ProductBuyInApp'
import ProductBuyKR from './ProductBuyKR'
import ProductBuyVN from './ProductBuyVN'

export default function Checkout({
  productId,
  onBack,
}: {
  productId: string
  onBack?: () => void
}) {
  // @language 'common'
  const { t } = useTranslation()
  const { country, setting } = useCustomerConfiguration()
  const isPaymentable = setting.paymentable
  const platform = useDevicePlatform().toLowerCase()

  const student = useStudent()

  if (!isPaymentable) {
    return <WrapBackMessage onBack={onBack}>{t('t8th0206')}</WrapBackMessage>
  }
  if (!student) {
    return <WrapBackMessage onBack={onBack}>{t('t8th0207')}</WrapBackMessage>
  }

  let purchaseType: 'direct' | 'directvn' | 'ios' | 'android' = 'direct'
  if (platform === 'ios' || platform === 'android') {
    purchaseType = platform
  } else if (country === 'vn') {
    purchaseType = 'directvn'
  }
  return (
    <FindProduct
      productId={productId}
      purchaseType={purchaseType}
      onBack={onBack}
    />
  )
}

function FindProduct({
  productId,
  purchaseType,
  onBack,
}: {
  productId: string
  purchaseType: 'direct' | 'directvn' | 'ios' | 'android'
  onBack?: () => void
}) {
  // @language 'common'
  const { t } = useTranslation()
  const { data: product } = usePurchaseProductList({ type: purchaseType })

  const targetProduct = product?.product?.find((p) => p.id === productId)
  if (!targetProduct) {
    return <WrapBackMessage onBack={onBack}>{t('t8th0208')}</WrapBackMessage>
  }

  const allPayTypes =
    product?.payType?.map((p) => {
      let id = p
      let name = 'none'
      switch (id) {
        case 'kakao':
          name = t('t8th0209')
          break
        case 'vcard':
          name = t('t8th0210')
          break

        case 'directbank':
          name = t('t8th0211')
          break
        case 'vbank':
          name = t('t8th0212')
          break
        case 'paypal':
          name = t('t8th0296')
          break
        case 'vnpay':
          name = t('t8th0297')
          break
      }
      if (name === 'none') {
        id = 'none'
        name = t('t8th0213')
      }
      return {
        id,
        name,
      }
    }) || []

  if (purchaseType === 'direct') {
    const payTypes =
      allPayTypes.filter((p) => p.id !== 'paypal' && p.id !== 'vbank') || []
    return (
      <ProductBuyKR
        currency={product?.currency || 'KRW'}
        id={targetProduct.id}
        name={targetProduct.name}
        value={targetProduct.value}
        fee={targetProduct.fee}
        totalFee={targetProduct.totalFee}
        discount={targetProduct.discount}
        payTypes={payTypes}
        event={targetProduct.event}
        onBack={onBack}
      />
    )
  } else if (purchaseType === 'directvn') {
    const payTypes =
      allPayTypes.filter((p) => p.id !== 'paypal' && p.id !== 'vbank') || []

    return (
      <ProductBuyVN
        currency={product?.currency || 'VND'}
        id={targetProduct.id}
        name={targetProduct.name}
        value={targetProduct.value}
        fee={targetProduct.fee}
        totalFee={targetProduct.totalFee}
        discount={targetProduct.discount}
        payTypes={payTypes}
        event={targetProduct.event}
        onBack={onBack}
      />
    )
  }
  return (
    <ProductBuyInApp
      platform={purchaseType}
      currency={product?.currency || 'KRW'}
      id={targetProduct.id}
      name={targetProduct.name}
      value={targetProduct.value}
      fee={targetProduct.fee}
      totalFee={targetProduct.totalFee}
      discount={targetProduct.discount}
      event={targetProduct.event}
      onBack={onBack}
    />
  )
}

function WrapBackMessage({
  onBack,
  children,
}: {
  onBack?: () => void
  children?: React.ReactNode
}) {
  // @language 'common'
  const { t } = useTranslation()
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
      {children}
    </div>
  )
}
