'use client'

import { getTierNameCode } from '@/8th/features/board/ui/util/hall-of-fame-util'
import useTranslation from '@/localization/client/useTranslations'
import HallOfFameItem, { HallOfFameLeaderProps } from './HallOfFameItem'

export default function HallOfFameMeItem({
  row,
}: {
  row: HallOfFameLeaderProps
}) {
  const tier = row.medal

  // @Language 'common'
  const { t } = useTranslation()

  const name = t(getTierNameCode(tier) || '')

  return (
    <section className="my-info">
      <h2>{t('t8th0172')}</h2>
      <p className="my-progress">
        <GradeInfoIcon />
        {t('t8th0173', { name, num: row.rank })}
      </p>
      <HallOfFameItem row={row} highlight />
    </section>
  )
}

function GradeInfoIcon() {
  return (
    <svg
      className="hof-progress-icon"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden>
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="#FFF8E6"
        stroke="#E2B84B"
        strokeWidth="1.5"
      />
      <path
        d="m12 6.6 1.55 3.14 3.46.5-2.5 2.44.59 3.44L12 14.5l-3.1 1.62.59-3.44-2.5-2.44 3.46-.5L12 6.6Z"
        fill="#D7A62D"
      />
    </svg>
  )
}
