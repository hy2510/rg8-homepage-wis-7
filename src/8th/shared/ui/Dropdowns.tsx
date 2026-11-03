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
const BOTTOM_OPEN_MARGIN = 10
const MOBILE_BOTTOM_NAV_FALLBACK = 72
const MOBILE_BOTTOM_NAV_BREAKPOINT = 1200

function isBottomOpeningPosition(
  position: DropdownContainerStyleProps['position'],
) {
  return position === 'bottomRight' || position === 'bottomLeft'
}

function getViewportHeight() {
  return window.visualViewport?.height ?? window.innerHeight
}

function findStickyAncestor(element: HTMLElement): HTMLElement | null {
  let current: HTMLElement | null = element.parentElement

  while (current) {
    if (window.getComputedStyle(current).position === 'sticky') {
      return current
    }
    current = current.parentElement
  }

  return null
}

function getEffectiveTriggerBottom(trigger: HTMLElement): number {
  const rect = trigger.getBoundingClientRect()
  const stickyAncestor = findStickyAncestor(trigger)

  if (!stickyAncestor) {
    return rect.bottom
  }

  const stickyStyle = window.getComputedStyle(stickyAncestor)
  const stickyTop = Number.parseFloat(stickyStyle.top)

  if (Number.isNaN(stickyTop)) {
    return rect.bottom
  }

  const stickyRect = stickyAncestor.getBoundingClientRect()
  const triggerBottomOffset = rect.bottom - stickyRect.top
  const pinnedTriggerBottom = stickyTop + triggerBottomOffset

  return Math.min(rect.bottom, pinnedTriggerBottom)
}

function getBottomViewportInset(): number {
  if (typeof document === 'undefined') return 0

  const viewportHeight = getViewportHeight()

  const bottomNav = document.querySelector('[data-bottom-fixed-nav]')
  if (bottomNav instanceof HTMLElement) {
    const navRect = bottomNav.getBoundingClientRect()
    if (navRect.height > 0) {
      return Math.max(0, viewportHeight - navRect.top)
    }
  }

  if (window.innerWidth <= MOBILE_BOTTOM_NAV_BREAKPOINT) {
    return MOBILE_BOTTOM_NAV_FALLBACK
  }

  return 0
}

function getBottomOpeningMeasuredLayout(
  trigger: HTMLElement,
  contentHeight: number,
): React.CSSProperties | undefined {
  const viewportHeight = getViewportHeight()
  const availableHeight =
    viewportHeight -
    getEffectiveTriggerBottom(trigger) -
    VIEWPORT_PADDING -
    BOTTOM_OPEN_MARGIN -
    getBottomViewportInset()

  if (contentHeight <= availableHeight) {
    return undefined
  }

  return {
    maxHeight: `${Math.max(availableHeight, 0)}px`,
    overflowY: 'auto',
  }
}

function useBottomOpeningMeasuredLayout(
  dropdownRef: React.RefObject<HTMLDivElement | null>,
  isOpen: boolean,
  position: DropdownContainerStyleProps['position'],
  itemCount: number,
) {
  const [measuredStyle, setMeasuredStyle] = useState<
    React.CSSProperties | undefined
  >()

  useLayoutEffect(() => {
    if (!isOpen || !isBottomOpeningPosition(position)) {
      setMeasuredStyle(undefined)
      return
    }

    let rafId = 0

    const updateLayout = () => {
      if (!dropdownRef.current) return

      const trigger = dropdownRef.current.offsetParent as HTMLElement | null
      if (!trigger) return

      setMeasuredStyle(
        getBottomOpeningMeasuredLayout(
          trigger,
          dropdownRef.current.scrollHeight,
        ),
      )
    }

    const scheduleUpdate = () => {
      window.cancelAnimationFrame(rafId)
      rafId = window.requestAnimationFrame(updateLayout)
    }

    scheduleUpdate()
    window.addEventListener('resize', scheduleUpdate)
    window.addEventListener('scroll', scheduleUpdate, true)
    window.visualViewport?.addEventListener('resize', scheduleUpdate)
    window.visualViewport?.addEventListener('scroll', scheduleUpdate)

    return () => {
      window.cancelAnimationFrame(rafId)
      window.removeEventListener('resize', scheduleUpdate)
      window.removeEventListener('scroll', scheduleUpdate, true)
      window.visualViewport?.removeEventListener('resize', scheduleUpdate)
      window.visualViewport?.removeEventListener('scroll', scheduleUpdate)
    }
  }, [dropdownRef, isOpen, itemCount, position])

  return measuredStyle
}

export default function DropdownMenu({
  items,
  isOpen = false,
  onClose,
  position = 'bottomLeft',
  showArrow = true,
  viewGrid = false,
  currentIndex,
}: DropdownMenuProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const measuredStyle = useBottomOpeningMeasuredLayout(
    dropdownRef,
    isOpen,
    position,
    items.length,
  )

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
