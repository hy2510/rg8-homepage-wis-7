'use client'

import { Assets } from '@/8th/assets/asset-library'
import Image from 'next/image'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  DropdownContainerStyle,
  DropdownContainerStyleProps,
  DropdownItemStyle,
} from '../styled/SharedStyled'
import { BoxStyle } from './Misc'

/**
 * 드롭다운 메뉴
 */

interface DropdownMenuProps extends Pick<
  DropdownContainerStyleProps,
  'position' | 'viewGrid'
> {
  items: {
    text: string
    subText?: string
    onClick?: () => void
  }[]
  isOpen?: boolean
  onClose?: () => void
  showArrow?: boolean
  currentIndex?: number
}

const VIEWPORT_PADDING = 10
const MIN_DROPDOWN_HEIGHT = 120
const TOP_RIGHT_MARGIN = 74

function getMeasuredLayout(
  position: DropdownContainerStyleProps['position'],
  triggerRect: DOMRect,
  contentHeight: number,
): React.CSSProperties | undefined {
  if (position === 'rightCenter') {
    const centerY = triggerRect.top + triggerRect.height / 2
    const centeredAvailableHeight =
      2 *
      Math.min(
        centerY - VIEWPORT_PADDING,
        window.innerHeight - VIEWPORT_PADDING - centerY,
      )

    if (contentHeight <= centeredAvailableHeight) {
      return undefined
    }

    const maxHeight = window.innerHeight - VIEWPORT_PADDING * 2
    const top = VIEWPORT_PADDING - triggerRect.top

    return {
      top: `${top}px`,
      bottom: 'auto',
      transform: 'none',
      maxHeight: `${Math.max(maxHeight, MIN_DROPDOWN_HEIGHT)}px`,
      overflowY: 'auto',
    }
  }

  if (position === 'topRight') {
    const availableHeight =
      triggerRect.top - VIEWPORT_PADDING - TOP_RIGHT_MARGIN

    if (contentHeight <= availableHeight) {
      return undefined
    }

    return {
      maxHeight: `${Math.max(availableHeight, MIN_DROPDOWN_HEIGHT)}px`,
      overflowY: 'auto',
    }
  }

  return undefined
}

export default function GlobalNavDropdowns({
  items,
  isOpen = false,
  onClose,
  position = 'bottomLeft',
  showArrow = true,
  viewGrid = false,
  currentIndex,
}: DropdownMenuProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [measuredStyle, setMeasuredStyle] = useState<
    React.CSSProperties | undefined
  >()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose?.()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  useLayoutEffect(() => {
    if (!isOpen) {
      setMeasuredStyle(undefined)
      return
    }

    const updateLayout = () => {
      if (!dropdownRef.current) return

      const trigger = dropdownRef.current.offsetParent as HTMLElement | null
      if (!trigger) return

      setMeasuredStyle(
        getMeasuredLayout(
          position,
          trigger.getBoundingClientRect(),
          dropdownRef.current.scrollHeight,
        ),
      )
    }

    updateLayout()
    window.addEventListener('resize', updateLayout)

    return () => {
      window.removeEventListener('resize', updateLayout)
    }
  }, [isOpen, position, items.length])

  if (!isOpen) return null

  return (
    <DropdownContainerStyle
      position={position}
      ref={dropdownRef}
      viewGrid={viewGrid}
      style={measuredStyle}>
      {items.map((item, index) => {
        const textLines = item.text
          .split('\n')
          .filter((line) => line.trim() !== '')

        return (
          <DropdownItemStyle
            key={index}
            onClick={item.onClick}
            viewGrid={viewGrid}>
            <BoxStyle
              display="flex"
              flexDirection="column"
              alignItems="flex-start">
              <div className="link-text">
                {textLines.map((text, i) => {
                  if (i > 0) {
                    return (
                      <React.Fragment key={text}>
                        <br />
                        {text}
                      </React.Fragment>
                    )
                  }
                  return <React.Fragment key={text}>{text}</React.Fragment>
                })}
              </div>
              <div className="sub-text">{item.subText}</div>
            </BoxStyle>
            {showArrow && (
              <div className="icon">
                <Image
                  src={Assets.Icon.arrowUpRightGray}
                  alt="arrow up right"
                  width={10}
                  height={10}
                />
              </div>
            )}
            {index === currentIndex && (
              <div className="current">
                <Image
                  src={Assets.Icon.checkLightBlue}
                  alt="check"
                  width={16}
                  height={16}
                />
              </div>
            )}
          </DropdownItemStyle>
        )
      })}
    </DropdownContainerStyle>
  )
}
