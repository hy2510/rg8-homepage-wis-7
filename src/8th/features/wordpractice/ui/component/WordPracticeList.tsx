import { Assets } from '@/8th/assets/asset-library'
import { PracticeWordListSectionStyle } from '@/8th/shared/styled/FeaturesStyled'
import {
  DropdownButtonSmallContainerStyle,
  DropdownButtonSmallStyle,
  DropdownSmallItemStyle,
  DropdownSmallMenuStyle,
} from '@/8th/shared/styled/SharedStyled'
import { BoxStyle, TextStyle } from '@/8th/shared/ui/Misc'
import useTranslation from '@/localization/client/useTranslations'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { WordStatus, WordStatusColor } from '../wordStatusData'

export default function PracticeWordList({
  currentFilter,
  filters,
  onFilterChange,
  words,
  totalWords,
  playingWord,
  onPlayWord,
}: {
  currentFilter: string
  filters: { key: string; label: string }[]
  onFilterChange: (value: { key: string; label: string }) => void
  words: {
    word: string
    status: WordStatus
    audioUrl: string
  }[]
  totalWords: number
  playingWord?: string
  onPlayWord?: (word: { word: string; audioUrl: string }) => void
}) {
  //@language 'common'
  const { t } = useTranslation()

  const selectedFilter =
    filters.find((option) => option.key === currentFilter)?.label || ''

  return (
    <PracticeWordListSectionStyle>
      <div className="list-header">
        <span className="word-count-label">
          {`${totalWords} ${t('t8th365')}`}
        </span>
        <Dropdown
          className="practice-filter-dropdown"
          selectedValue={selectedFilter}
          options={filters}
          onChange={onFilterChange}
          menuPosition={'right'}
        />
      </div>
      <div className="word-list">
        {totalWords > 0 &&
          words.map((word) => (
            <div key={word.word} className="word-row">
              <button
                type="button"
                className="play-button"
                aria-label={`Play ${word.word}`}
                onClick={() => {
                  if (onPlayWord) {
                    onPlayWord({
                      word: word.word,
                      audioUrl: word.audioUrl,
                    })
                  }
                }}>
                <Image
                  src={Assets.Icon.playRed}
                  alt=""
                  width={28}
                  height={28}
                />
              </button>
              <span className="word-label">{word.word}</span>
              <span
                className="status-dot"
                style={{ backgroundColor: WordStatusColor[word.status] }}
              />
            </div>
          ))}
        {totalWords <= 0 && (
          <>
            {' '}
            <BoxStyle
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              gap={20}
              minHeight="200px">
              <TextStyle
                fontFamily="sans"
                fontSize="medium"
                fontColor="secondary">
                {t('t8th009')}
              </TextStyle>
            </BoxStyle>
          </>
        )}
      </div>
    </PracticeWordListSectionStyle>
  )
}

interface DropdownProps {
  selectedValue: string
  onChange: (value: { key: string; label: string }) => void
  options: { key: string; label: string }[]
  largeFont?: boolean
  mediumFont?: boolean
  placeholder?: string
  minWidth?: number
  menuPosition?: 'left' | 'right'
  className?: string
}

function Dropdown({
  selectedValue,
  onChange,
  options,
  largeFont = false,
  mediumFont = false,
  placeholder = 'Select',
  minWidth = 0,
  menuPosition = 'left',
  className,
}: DropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [isMenuOpen, setMenuOpen] = useState(false)
  const title = selectedValue || placeholder
  const hasSelection = !!selectedValue

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false)
      }
    }
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      if (isMenuOpen) {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isMenuOpen])

  return (
    <DropdownButtonSmallContainerStyle
      ref={dropdownRef}
      className={className}
      style={{ minWidth: minWidth ? `${minWidth}px` : undefined }}>
      <DropdownButtonSmallStyle onClick={() => setMenuOpen(!isMenuOpen)}>
        <div
          className={`link-text ${hasSelection ? 'black' : ''} ${largeFont ? 'large-text' : ''} ${mediumFont ? 'medium-text' : ''}`}>
          {title}
        </div>
        <div className="icon">
          <Image
            src={Assets.Icon.chevronDownGraySmall}
            alt=""
            width={14}
            height={14}
            style={{
              transform: isMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        </div>
      </DropdownButtonSmallStyle>
      {isMenuOpen && options.length > 0 && (
        <DropdownSmallMenuStyle
          position={menuPosition}
          style={{ right: '-10px' }}>
          {options.map((option) => {
            const isSelected = option.label === selectedValue
            return (
              <DropdownSmallItemStyle
                key={option.key}
                isSelected={isSelected}
                onClick={() => {
                  onChange(option)
                  setMenuOpen(false)
                }}>
                <div className="item-text">{option.label}</div>
                {isSelected && (
                  <Image
                    src={Assets.Icon.checkLightBlue}
                    alt=""
                    width={12}
                    height={12}
                  />
                )}
              </DropdownSmallItemStyle>
            )
          })}
        </DropdownSmallMenuStyle>
      )}
    </DropdownButtonSmallContainerStyle>
  )
}
