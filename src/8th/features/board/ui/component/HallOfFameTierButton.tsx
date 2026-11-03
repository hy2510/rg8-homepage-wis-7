'use client'

import { Assets } from '@/8th/assets/asset-library'
import {
  HallOfFameTier,
  getTierNameCode,
  getTierPoint,
} from '@/8th/features/board/ui/util/hall-of-fame-util'
import useTranslation from '@/localization/client/useTranslations'
import Image from 'next/image'

export default function HallOfFameTierButton({
  onClick,
  active,
  tier,
  percent,
}: {
  onClick: () => void
  active: boolean
  tier: HallOfFameTier
  percent: number
}) {
  // @Language 'common'
  const { t } = useTranslation()

  const name = t(getTierNameCode(tier) || '')
  const point = getTierPoint(tier)

  return (
    <button
      type="button"
      className={`hof-tier hof-tier-${tier}${active ? ' is-active' : ''}`}
      onClick={onClick}>
      <Image
        src={Assets.HallOfFame.Badge[tier]}
        alt=""
        width={56}
        height={56}
      />
      <strong>{name}</strong>
      <span>
        {point.toLocaleString()}P | {t('t8th0489', { num: percent })}
      </span>
    </button>
  )
}
