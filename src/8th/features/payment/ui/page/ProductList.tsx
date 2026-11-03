'use client'

import { useDevicePlatform } from '@/8th/application/context/ApplicationContext'
import { useCustomerConfiguration } from '@/8th/application/context/CustomerContext'
import { Product } from '@/8th/features/payment/model/purchase-product'
import { usePurchaseProductList } from '@/8th/features/payment/service/payment-query'
import PurchaseStudentInfo from '@/8th/features/payment/ui/component/PurchaseStudentInfo'
import ProductDetailModal from '@/8th/features/payment/ui/modal/ProductDetailModal'
import { useStudent } from '@/8th/features/student/service/student-query'
import useTranslation from '@/localization/client/useTranslations'
import CurrencyFormat from '@/localization/currency-format'
import Image from 'next/image'
import { useMemo, useState } from 'react'
import Checkout from './Checkout'

export default function ProductList() {
  // @language 'common'
  const { t } = useTranslation()
  const { country, setting } = useCustomerConfiguration()
  const isPaymentable = setting.paymentable
  const platform = useDevicePlatform().toLowerCase()

  if (!isPaymentable) {
    return <div>{t('t8th0206')}</div>
  }

  if (platform === 'ios' || platform === 'android') {
    return <PurchaseView purchaseType={platform} />
  } else if (country === 'vn') {
    return <PurchaseView purchaseType="directvn" />
  }
  return <PurchaseView purchaseType="direct" />
}

function PurchaseView({
  purchaseType,
}: {
  purchaseType: 'direct' | 'directvn' | 'ios' | 'android'
}) {
  // @language 'common'
  const { t } = useTranslation()

  const studentInfo = useStudent()
  const student = studentInfo.data?.student
  const loginId = student?.loginId ?? ''
  const studyEndDay = student?.studyEndDay ?? 0

  const products = usePurchaseProductList({ type: purchaseType })

  const [selectedId, setSelectedId] = useState<string | undefined>(undefined)
  const [isShowDetails, setIsShowDetails] = useState<boolean>(false)
  const [isShowCheckout, setIsShowCheckout] = useState<boolean>(false)

  const loading = products.isLoading
  const currency = products.data?.currency || 'KRW'

  const productList = useMemo(() => {
    const list: (Product & { featured: boolean; rate: number })[] = []
    if (products.data?.product) {
      products.data.product.forEach((product) => {
        let discountRate = 0
        let basicDiscountFeeSum = 0
        let addDiscountFeeSum = 0
        if (product.discount.length > 0) {
          product.discount.forEach((discount) => {
            if (discount.type === 'basic') {
              basicDiscountFeeSum += discount.fee
            } else if (discount.type === 'add') {
              addDiscountFeeSum += discount.fee
            }
          })
        }
        discountRate =
          basicDiscountFeeSum + addDiscountFeeSum > 0
            ? Math.floor(
                ((basicDiscountFeeSum + addDiscountFeeSum) / product.fee) * 100,
              )
            : 0

        list.push({
          ...product,
          featured: false,
          rate: discountRate,
        })
      })
      if (list.length > 0) {
        list[0].featured = true
        let bestProduct = list[0]
        list.forEach((product) => {
          if (bestProduct.id !== product.id) {
            product.featured =
              product.rate > 0 && product.rate > bestProduct.rate
            if (product.featured) {
              bestProduct = product
            }
          }
        })
      }
    }
    return list
  }, [products.data])

  const onShowDetails = (productId: string) => {
    setSelectedId(productId)
    setIsShowDetails(true)
    setIsShowCheckout(false)
  }

  const onShowCheckout = (productId: string) => {
    setSelectedId(productId)
    setIsShowDetails(false)
    setIsShowCheckout(true)
    if (window) {
      window.scrollTo(0, 0)
    }
  }
  const selectProduct = productList.find((product) => product.id === selectedId)

  if (selectProduct && isShowCheckout) {
    return (
      <Checkout
        productId={selectProduct.id}
        onBack={() => setIsShowCheckout(false)}
      />
    )
  }
  return (
    <div className="board">
      <PurchaseStudentInfo loginId={loginId} studyEndDay={studyEndDay} />
      <section>
        <h2 className="section-title">{t('t8th0195')}</h2>
        {loading ? (
          <p className="status">{t('t8th0196')}</p>
        ) : productList.length === 0 ? (
          <p className="status">{t('t8th0197')}</p>
        ) : (
          <div className="product-list">
            {productList.map((product) => {
              const selected = selectedId === product.id
              return (
                <article
                  key={product.id}
                  className={`product-card${product.featured ? ' is-featured' : ''}${selected ? ' is-selected' : ''}${product.event ? ' has-event' : ''}`}>
                  {product.event ? (
                    <span className="product-event-badge" aria-hidden="true">
                      <Image
                        src="/src/images/@rg-membership/img-vn_discount_label.png"
                        alt={product.event.name}
                        width={112}
                        height={90}
                      />
                    </span>
                  ) : null}
                  <div className="product-title-row">
                    <h3>{product.name}</h3>
                    {product.featured ? (
                      <p className="best-badge">{t('t8th0198')}</p>
                    ) : null}
                  </div>
                  <dl>
                    <div>
                      <dt>{t('t8th0199')}</dt>
                      <dd>{t('t8th0200', { num: product.value })}</dd>
                    </div>
                    <div>
                      <dt>{t('t8th0201')}</dt>
                      <dd>
                        {CurrencyFormat.toNumberMoneyString(
                          product.totalFee,
                          currency,
                        )}
                        {product.rate > 0 ? (
                          <em className="discount">
                            {' '}
                            {t('t8th0202', { num: product.rate })}
                          </em>
                        ) : null}
                      </dd>
                    </div>
                  </dl>
                  <p
                    className="gift-label"
                    aria-hidden={product.event?.gift ? undefined : true}>
                    {product.event?.gift ? (
                      <>
                        <span aria-hidden="true">🎁</span>
                        {t('t8th0203')}
                      </>
                    ) : null}
                  </p>
                  <div className="product-actions">
                    <button
                      type="button"
                      className="detail-link"
                      onClick={() => onShowDetails(product.id)}>
                      {t('t8th0204')}
                    </button>
                    <button
                      type="button"
                      className="select-button"
                      onClick={() => onShowCheckout(product.id)}>
                      {t('t8th0205')}
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

      {selectProduct && isShowDetails && (
        <ProductDetailModal
          name={selectProduct.name}
          days={selectProduct.value}
          fee={selectProduct.fee}
          totalFee={selectProduct.totalFee}
          discounts={selectProduct.discount}
          discountRate={selectProduct.rate}
          purchaseEvent={selectProduct.event}
          currency={currency}
          onClose={() => setIsShowDetails(false)}
          onPurchase={() => onShowCheckout(selectProduct.id)}
        />
      )}
    </div>
  )
}
