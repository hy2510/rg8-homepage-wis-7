'use client'

import { Gap } from '@/8th/shared/ui/Misc'
import CurrencyFormat from '@/localization/currency-format'
import useTranslation from '@/localization/client/useTranslations'

export default function BuyProductInfo({
  productName,
  value,
  fee,
  totalFee,
  discountRate,
  currency,
  event,
}: {
  productName: string
  value: number
  fee: number
  totalFee: number
  discountRate: number
  currency: string
  event?: {
    name: string
    discountfee: number
    gift?: string
  }
}) {
  // @language 'common'
  const { t } = useTranslation()
  const isIncludeWorkbookItem = event?.gift?.toLowerCase().includes('workbook')

  return (
    <section>
      <h2 className="section-title">{t('t8th0214')}</h2>
      <article className="product-card">
        <h3>{productName}</h3>
        <dl>
          <div>
            <dt>{t('t8th0199')}</dt>
            <dd>{t('t8th0200', { num: value })}</dd>
          </div>
          {discountRate > 0 && (
            <div>
              <dt>{t('t8th0215')}</dt>
              <dd style={{ textDecoration: 'line-through' }}>
                {CurrencyFormat.toNumberMoneyString(fee, currency)}
              </dd>
            </div>
          )}
          <div>
            <dt>{t('t8th0201')}</dt>
            <dd>
              {CurrencyFormat.toNumberMoneyString(totalFee, currency)}
              {discountRate > 0 && (
                <em className="discount">
                  {' '}
                  {t('t8th0202', { num: discountRate })}
                </em>
              )}
            </dd>
          </div>
        </dl>
        {!!event && event.gift && (
          <>
            <Gap size={16} />
            <div className="product-detail-benefit">
              <span aria-hidden="true">🎁</span>
              <div>
                <strong>{t('t8th0216')}</strong>
                <p>{event?.gift}</p>
              </div>
            </div>

            {isIncludeWorkbookItem && (
              <>
                <Gap size={16} />
                <div className="product-detail-notice">
                  <span aria-hidden="true">✓</span>
                  <p>{t('t8th0217')}</p>
                </div>
              </>
            )}
          </>
        )}
      </article>
    </section>
  )
}
