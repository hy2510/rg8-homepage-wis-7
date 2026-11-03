'use client'

import {
  getTierNameCode,
  getTierPoint,
} from '@/8th/features/board/ui/util/hall-of-fame-util'
import useTranslation from '@/localization/client/useTranslations'
import NumberUtils from '@/util/number-utils'

export default function HallOfFameBenefit({
  tier,
  benefits,
  totalUserCount,
  percent,
  note,
  onClick,
}: {
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'titanium'
  benefits: string[]
  totalUserCount: number
  percent: number
  note: string
  onClick: () => void
}) {
  // @Language 'common'
  const { t } = useTranslation()

  const name = t(getTierNameCode(tier) || '')
  const point = NumberUtils.toRgDecimalPoint(
    getTierPoint(tier),
  ).toLocaleString()

  return (
    <section className="hof-intro">
      <h2>{t('t8th0170', { name })}</h2>
      <p>
        {t('t8th0490', {
          tier: name,
          point,
          total: NumberUtils.toRgDecimalPoint(totalUserCount).toLocaleString(),
          percent,
        })}
      </p>
      <h3>{t('t8th0169')}</h3>
      <ol>
        {benefits.map((benefit) => (
          <li key={benefit}>{benefit}</li>
        ))}
      </ol>
      <p className="hof-note">{note}</p>
      <button type="button" className="hof-apply" onClick={onClick}>
        {t('t8th0171')}
      </button>
    </section>
  )
}
