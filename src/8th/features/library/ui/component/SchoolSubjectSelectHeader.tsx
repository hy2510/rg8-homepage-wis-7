import { Assets } from '@/8th/assets/asset-library'
import {
  DropdownButtonSmallContainerStyle,
  DropdownButtonSmallStyle,
  DropdownSmallItemStyle,
  DropdownSmallMenuStyle,
} from '@/8th/shared/styled/SharedStyled'
import { BoxStyle, TextStyle } from '@/8th/shared/ui/Misc'
import Image from 'next/image'
import { ReactNode, useEffect, useRef, useState } from 'react'

export type SchoolSubjectOption = {
  current: string
  options: { key: string; label: string }[]
  onChange: (value: { key: string; label: string }) => void
}
export function SchoolSubjectSelectHeader({
  grade,
  publisher,
  lesson,
  lessonTitle,
  onLessonInfoClick,
  actionBar,
}: {
  grade: SchoolSubjectOption
  publisher: SchoolSubjectOption
  lesson: SchoolSubjectOption
  lessonTitle?: string
  onLessonInfoClick?: () => void
  actionBar?: ReactNode
}) {
  const isActiveShowLessonInfo = !!lessonTitle && !!onLessonInfoClick
  return (
    <BoxStyle display="flex" flexDirection="column" gap={10}>
      <BoxStyle display="flex" gap={15} padding="10px">
        <Dropdown
          placeholder={'학년'}
          selectedValue={grade.current}
          onChange={(value) => grade.onChange(value)}
          options={grade.options}
          mediumFont
        />
        <Dropdown
          placeholder={'교과서'}
          selectedValue={publisher.current}
          onChange={(value) => publisher.onChange(value)}
          options={publisher.options}
          mediumFont
        />
        <Dropdown
          placeholder={'단원'}
          selectedValue={lesson.current}
          onChange={(value) => lesson.onChange(value)}
          options={lesson.options}
          mediumFont
        />
      </BoxStyle>
      {lessonTitle && (
        <BoxStyle
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          borderTop="1px solid var(--line-color-primary)"
          padding="10px 10px 0 10px">
          <TextStyle fontFamily="sans" fontSize="large" fontWeight={700}>
            {lessonTitle}
          </TextStyle>
          {isActiveShowLessonInfo && (
            <BoxStyle
              display="flex"
              alignItems="center"
              justifyContent="center"
              width="40px"
              height="40px"
              onClick={onLessonInfoClick}>
              <Image
                src={Assets.Icon.zoomInGray.src}
                alt="zoom-in"
                width={20}
                height={20}
              />
            </BoxStyle>
          )}
        </BoxStyle>
      )}
      {!!actionBar && actionBar}
    </BoxStyle>
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
}

export function Dropdown({
  selectedValue,
  onChange,
  options,
  largeFont = false,
  mediumFont = false,
  placeholder = 'Select',
  minWidth = 0,
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
        <DropdownSmallMenuStyle position="left">
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
