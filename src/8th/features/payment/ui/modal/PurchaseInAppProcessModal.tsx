'use client'

import { usePurchaseInapp } from '@/8th/features/payment/service/payment-query'
import useTranslation from '@/localization/client/useTranslations'
import { useCallback, useEffect, useRef, useState } from 'react'

export type PurchaseRequest = {
  itemId: string
}

export default function PurchaseInAppProcessModal({
  platform,
  productId,
  onPurchaseResult,
  onCancel,
}: {
  platform: 'android' | 'ios'
  productId: string
  onPurchaseResult?: (result: {
    isSuccess: boolean
    code: number
    message: string
  }) => void
  onCancel?: () => void
}) {
  // @language 'common'
  const { t } = useTranslation()

  // const maketingEventTracker = useTrack()

  const { mutate: purchaseInapp } = usePurchaseInapp({
    onSuccess: (data, variables) => {
      if (data.code === 0) {
        // 성공
        if (onPurchaseResult) {
          onPurchaseResult({
            isSuccess: true,
            code: 0,
            message: 'Purchase success',
          })
        }
      } else {
        // 상품 지급 실패
        if (onPurchaseResult) {
          onPurchaseResult({
            isSuccess: false,
            code: data.code,
            message: 'Purchase failed',
          })
        }
      }
    },
    onError: (error, variables) => {
      // 결제 실패
      if (onPurchaseResult) {
        onPurchaseResult({
          isSuccess: false,
          code: -3,
          message: 'Purchase failed',
        })
      }
    },
  })

  const [inappReady, setInappReady] = useState(false)
  const inappInterface = useRef<InAppInterface | null>(null)

  useEffect(() => {
    if (window) {
      const iap = new (window as any).RgIapInterface() as InAppInterface
      // FIXME : 테스트 코드 제거
      // const iap = {
      //   init: () => {},
      //   subscribe: (
      //     itemId: string,
      //     platform: 'android' | 'ios',
      //     callback: (result: InAppPurchaseResult) => void,
      //   ) => {
      //     return new Promise<InAppPurchaseResult>((resolve) => {
      //       setTimeout(() => {
      //         const result: InAppPurchaseResult = {
      //           result: true,
      //           productId: itemId,
      //           originalData: ['test_original_data'],
      //           purchaseToken: 'test_purchase_token',
      //           transactionId: 'test_transaction_id',
      //           receipt: 'test_receipt',
      //         }
      //         callback(result)
      //         resolve(result)
      //       }, 1000)
      //     })
      //   },
      //   buy: (
      //     itemId: string,
      //     platform: 'android' | 'ios',
      //     callback: (result: InAppPurchaseResult) => void,
      //   ) => {
      //     return new Promise<InAppPurchaseResult>((resolve, reject) => {
      //       setTimeout(() => {
      //         const result: InAppPurchaseResult = {
      //           result: false,
      //           productId: itemId,
      //           originalData: ['test_original_data'],
      //           purchaseToken: 'test_purchase_token',
      //           transactionId: 'test_transaction_id',
      //           receipt: 'test_receipt',
      //         }
      //         resolve(result)
      //         callback(result)
      //         // reject(new Error('test buy error'))
      //       }, 1000)
      //     })
      //   },
      // }

      iap.init()
      inappInterface.current = iap
      setInappReady(true)
    }
    return () => {
      inappInterface.current = null
    }
  }, [])

  const onPurchase = useCallback(async () => {
    if (!inappInterface.current) {
      return
    }
    if (platform === 'android') {
      try {
        const purchase = await promiseInappBuy({
          buy: inappInterface.current.buy,
          platform: 'android',
          itemId: productId,
        })

        const { result: isSuccess, originalData } = purchase
        if (
          isSuccess &&
          originalData &&
          Array.isArray(originalData) &&
          originalData.length > 0
        ) {
          purchaseInapp({
            platform,
            productId,
            receipt: JSON.stringify(originalData),
          })
        } else {
          // InApp Purchase 취소
          if (onPurchaseResult) {
            onPurchaseResult({
              isSuccess: false,
              code: -10,
              message: 'Purchase canceled',
            })
          }
        }
      } catch (error) {
        // 결제 실패
        if (onPurchaseResult) {
          onPurchaseResult({
            isSuccess: false,
            code: -100,
            message: 'Purchase failed',
          })
        }
      }
    } else if (platform === 'ios') {
      try {
        const purchase = await promiseInappSubscribe({
          subscribe: inappInterface.current.subscribe,
          platform: 'ios',
          itemId: productId,
        })

        const { result: isSuccess, transactionId, receipt } = purchase
        if (isSuccess) {
          purchaseInapp({
            platform,
            productId,
            receipt: JSON.stringify({
              receipt: receipt!,
              transactionId,
            }),
          })
        } else {
          // 결제 취소
          if (onPurchaseResult) {
            onPurchaseResult({
              isSuccess: false,
              code: -10,
              message: 'Purchase canceled',
            })
          }
        }
      } catch (error) {
        // 결제 실패
        if (onPurchaseResult) {
          onPurchaseResult({
            isSuccess: false,
            code: -100,
            message: 'Purchase failed',
          })
        }
      }
    }
    return
  }, [platform, productId, purchaseInapp, onPurchaseResult])

  useEffect(() => {
    if (inappReady) {
      onPurchase()
    }
  }, [inappReady, onPurchase])

  const onCancelListener = () => {
    if (onCancel) {
      if (confirm(t('t8th0254'))) {
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
          <div style={{ display: 'flex', padding: '20px' }}>
            {t('t8th0255')}
          </div>
        </div>
      </section>
    </div>
  )
}

type InAppPurchaseResult = {
  result: boolean
  originalData?: unknown[]
  purchaseToken?: string
  productId?: string
  receipt?: string
  transactionId?: string
}

type InAppInterface = {
  init: () => void
  subscribe: (
    itemId: string,
    platform: 'android' | 'ios',
    callback: (result: InAppPurchaseResult) => void,
  ) => Promise<InAppPurchaseResult>
  buy: (
    itemId: string,
    platform: 'android' | 'ios',
    callback: (result: InAppPurchaseResult) => void,
  ) => Promise<InAppPurchaseResult>
}

/**
 * 인앱 구독 상품을 구독한다.
 * @param param 인앱 요청 데이터
 * @returns 인앱 구독 결과
 */
function promiseInappSubscribe({
  subscribe,
  platform,
  itemId,
}: {
  subscribe: (
    itemId: string,
    platform: 'android' | 'ios',
    callback: (result: InAppPurchaseResult) => void,
  ) => Promise<InAppPurchaseResult>
  platform: 'android' | 'ios'
  itemId: string
}): Promise<InAppPurchaseResult> {
  const promise = new Promise<InAppPurchaseResult>((resolve, reject) => {
    subscribe(itemId, platform, (result: InAppPurchaseResult) => {
      resolve(result)
    }).catch(reject)
  })
  return promise
}

/**
 * 인앱 1회성 상품을 구매한다.
 * @param param 인앱 요청 데이터
 * @returns 인앱 구매 결과
 */
function promiseInappBuy({
  buy,
  platform,
  itemId,
}: {
  buy: (
    itemId: string,
    platform: 'android' | 'ios',
    callback: (result: InAppPurchaseResult) => void,
  ) => Promise<InAppPurchaseResult>
  platform: 'android' | 'ios'
  itemId: string
}): Promise<InAppPurchaseResult> {
  const promise = new Promise<InAppPurchaseResult>((resolve, reject) => {
    buy(itemId, platform, (result: InAppPurchaseResult) => {
      resolve(result)
    }).catch(reject)
  })
  return promise
}
