'use client'

import { useLockBodyScroll } from '@/8th/application/context/ScrollLockContext'
import CurrencyFormat from '@/localization/currency-format'
import useTranslation from '@/localization/client/useTranslations'

export default function ProductDetailModal({
  name,
  days,
  fee,
  totalFee,
  discounts,
  discountRate,
  purchaseEvent,
  currency,
  onClose,
  onPurchase,
}: {
  name: string
  days: number
  fee: number
  totalFee: number
  discounts?: { type: string; name: string; fee: number }[]
  discountRate: number
  purchaseEvent?: {
    discountfee: number
    name: string
    gift?: string
  }
  currency: string
  onClose: () => void
  onPurchase: () => void
}) {
  useLockBodyScroll()
  // @language 'common'
  const { t } = useTranslation()

  const isIncludeWorkbookItem = purchaseEvent?.gift
    ?.toLowerCase()
    .includes('workbook')

  return (
    <div
      className="hp-modal-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose()
      }}>
      <section
        className="hp-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-detail-title">
        <header className="hp-modal-header">
          <h2 id="product-detail-title">{t('t8th0246')}</h2>
          <button
            type="button"
            className="hp-modal-close"
            aria-label={t('t8th0155')}
            onClick={onClose}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6 18 18M18 6 6 18" />
            </svg>
          </button>
        </header>
        <div className="hp-modal-body">
          <div className="product-detail-hero">
            <span className="product-detail-eyebrow">{t('t8th0247')}</span>
            <h3>{name}</h3>
            <span className="product-detail-period">
              {t('t8th0248', { num: days })}
            </span>
          </div>

          <div className="product-detail-price">
            <div className="price-section-title">
              <strong>{t('t8th0249')}</strong>
              {discountRate > 0 ? (
                <span>{t('t8th0277', { num: discountRate })}</span>
              ) : null}
            </div>
            <dl>
              {fee > totalFee && (
                <>
                  <div>
                    <dt>{t('t8th0215')}</dt>
                    <dd className="original-price">
                      {CurrencyFormat.toNumberMoneyString(fee, currency)}
                    </dd>
                  </div>
                  {discounts && discounts.length > 0 && (
                    <>
                      {discounts.map((discount) => {
                        return (
                          <div key={discount.type}>
                            <dt>{discount.name}</dt>
                            <dd className="discount-price">
                              -
                              {CurrencyFormat.toNumberMoneyString(
                                discount.fee,
                                currency,
                              )}
                            </dd>
                          </div>
                        )
                      })}
                    </>
                  )}
                </>
              )}

              <div className="total-price-row">
                <dt>{t('t8th0250')}</dt>
                <dd>
                  {CurrencyFormat.toNumberMoneyString(totalFee, currency)}
                </dd>
              </div>
            </dl>
          </div>
          {purchaseEvent && !!purchaseEvent.gift && (
            <div className="product-detail-benefit">
              <span aria-hidden="true">🎁</span>
              <div>
                <strong>{t('t8th0216')}</strong>
                <p>{purchaseEvent.gift}</p>
              </div>
            </div>
          )}
          {isIncludeWorkbookItem && (
            <div className="product-detail-notice">
              <span aria-hidden="true">✓</span>
              <p>{t('t8th0217')}</p>
            </div>
          )}
          <div className="product-detail-notice">
            <span aria-hidden="true">✓</span>
            <p>{t('t8th0251')}</p>
          </div>
        </div>

        <footer className="hp-modal-footer">
          <button
            type="button"
            className="modal-secondary-button"
            onClick={onClose}>
            {t('t8th0155')}
          </button>
          <button
            type="button"
            className="modal-primary-button"
            onClick={onPurchase}>
            {t('t8th0252')}
          </button>
        </footer>
      </section>
    </div>
  )
}
