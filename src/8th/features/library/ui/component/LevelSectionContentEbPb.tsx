'use client'

import { Gap } from '@/8th/shared/ui/Misc'
import { LevelSectionType } from '../levelSectionData'
import LevelItem from './LevelSectionLevelItem'

// @deprecated - LevelSectionContentEbPb 는 사용하지 않음. 호환성 측면에서 일단 임시로 놔둠
// LevelSectionContainer에서 사용하도록 수정이 필요함.
export default function LevelSectionContentEbPb({
  section,
  gapSize = 0,
}: {
  section: LevelSectionType
  gapSize?: number
}) {
  const hasLevels = section.levels.length > 0

  if (!hasLevels) {
    return <></>
  }
  return (
    <>
      {section.levels.map((group, index) => {
        return (
          <LevelSectionBody
            key={`${section.section}-${index}`}
            gapSize={gapSize}>
            {group.items.map((level) => {
              return (
                <LevelItem
                  key={`${level.type}${level.level}-${level.title}`}
                  type={level.type}
                  level={level.level}
                  title={level.title}
                  bgColor={level.bgColor}
                  fontColor={level.fontColor}
                  completed={level.completed}
                  href={level.href}
                  imgSrc={level.imgSrc}
                  total={level.total}
                />
              )
            })}
          </LevelSectionBody>
        )
      })}
    </>
  )
}

function LevelSectionBody({
  children,
  gapSize = 0,
}: {
  children?: React.ReactNode
  gapSize?: number
}) {
  return (
    <>
      {gapSize > 0 && <Gap size={gapSize} />}
      <div className={'level-container'}>{children}</div>
      {gapSize > 0 && <Gap size={gapSize} />}
    </>
  )
}
