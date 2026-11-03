'use client'

import { Assets } from '@/8th/assets/asset-library'
import { DailyRGNavBarStyle } from '@/8th/shared/styled/FeaturesStyled'
import DropdownMenu from '@/8th/shared/ui/Dropdowns'
import Image from 'next/image'
import { useMemo, useState } from 'react'

export default function PracticeLevelTabs({
  activeLevel,
  currentStageId,
  stages,
  onLevelChange,
  onStageChange,
}: {
  activeLevel: string
  currentStageId: string
  /** TO-DO: API — 스테이지(큰 레벨) 목록 */
  stages: {
    stageId: string
    stageName: string
    subText: string
    levels: { level: string; label?: string }[]
  }[]
  /** TO-DO: API — 하위 레벨 변경 시 단어 목록·집계 재조회 */
  onLevelChange: (level: string) => void
  /** TO-DO: API — 스테이지 변경 시 하위 레벨·데이터 재조회 */
  onStageChange: (stageId: string) => void
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const currentIndex = useMemo(
    () => stages.findIndex((stage) => stage.stageId === currentStageId),
    [currentStageId, stages],
  )

  const currentStage = currentIndex >= 0 ? stages[currentIndex] : stages[0]
  const levels = currentStage?.levels ?? []

  const stageItems = stages.map((stage) => ({
    text: stage.stageName,
    subText: stage.subText,
    onClick: () => {
      setIsDropdownOpen(false)
      if (stage.stageId !== currentStageId) {
        onStageChange(stage.stageId)
      }
    },
  }))

  return (
    <DailyRGNavBarStyle>
      <div className="level-box" role="tablist" aria-label="Level">
        {levels.map((lv) => (
          <div
            key={lv.level}
            role="tab"
            aria-selected={activeLevel === lv.level}
            className={`level-item ${activeLevel === lv.level ? 'current' : ''}`}
            onClick={() => {
              if (activeLevel === lv.level) {
                return
              }
              onLevelChange(lv.level)
            }}>
            {lv.label ? lv.label : lv.level}
          </div>
        ))}
      </div>
      <div className="more-button">
        <div
          className="more-button-trigger"
          onMouseDown={(e) => {
            e.stopPropagation()
          }}
          onClick={(e) => {
            e.stopPropagation()
            setIsDropdownOpen((open) => !open)
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setIsDropdownOpen((open) => !open)
            }
          }}>
          <Image
            src={Assets.Icon.moreHorizontalGray}
            alt="more"
            width={24}
            height={24}
          />
        </div>
        <DropdownMenu
          items={stageItems}
          isOpen={isDropdownOpen}
          onClose={() => setIsDropdownOpen(false)}
          showArrow={false}
          viewGrid={false}
          currentIndex={currentIndex}
          position="bottomRight"
        />
      </div>
    </DailyRGNavBarStyle>
  )
}
