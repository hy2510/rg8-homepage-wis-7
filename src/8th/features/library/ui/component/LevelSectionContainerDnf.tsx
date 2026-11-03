'use client'

import { LevelSectionStyle } from '@/8th/shared/styled/FeaturesStyled'
import { BoxStyle } from '@/8th/shared/ui/Misc'
import useTranslation from '@/localization/client/useTranslations'
import { LevelSectionType } from '../levelSectionData'
import LevelSectionContentEbPb from './LevelSectionContentEbPb'

export default function LevelSectionContainerDnf({
  levelSection,
}: {
  levelSection: LevelSectionType[]
}) {
  // @Language 'common'
  const { t } = useTranslation()

  return (
    <LevelSectionStyle>
      <BoxStyle className="title" display="flex" alignItems="center" gap={10}>
        <span>{`· ${t('t8th003')}`}</span>
      </BoxStyle>
      {levelSection.map((section) => (
        <LevelSectionContentEbPb key={section.section} section={section} />
      ))}
    </LevelSectionStyle>
  )
}
