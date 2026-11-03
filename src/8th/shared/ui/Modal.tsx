'use client'

import { useLockBodyScroll } from '@/8th/application/context/ScrollLockContext'
import { BookInfoModalStyle } from '../styled/FeaturesStyled'
import {
  MiniModalContainerStyle,
  ModalContainerStyle,
} from '../styled/SharedStyled'
import ModalPortal from './ModalPortal'

export function ModalContainer({
  excludePortal = false,
  heightMode = 'auto',
  children,
}: {
  excludePortal?: boolean
  heightMode?: 'auto' | 'fill'
  children: React.ReactNode
}) {
  useLockBodyScroll()

  const ModalBase = (
    <BookInfoModalStyle>
      <ModalContainerStyle heightMode={heightMode}>
        {children}
      </ModalContainerStyle>
    </BookInfoModalStyle>
  )

  if (excludePortal) {
    return ModalBase
  }
  return <ModalPortal>{ModalBase}</ModalPortal>
}

export function MiniModalContainer({
  children,
  minHeight,
}: {
  minHeight?: string
  children: React.ReactNode
}) {
  useLockBodyScroll()

  return (
    <MiniModalContainerStyle minHeight={minHeight}>
      {children}
    </MiniModalContainerStyle>
  )
}
