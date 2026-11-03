'use client'

import { AvatarExpression, getAvatar } from '@/8th/assets/avatar'
import Image from 'next/image'
import { createContext, useContext } from 'react'

export function AvatarImage({
  fallbackCommonImage = true,
  avatarId,
  expression = AvatarExpression.DEFAULT,
  size = 'normal',
}: {
  fallbackCommonImage?: boolean
  avatarId?: string
  expression?: AvatarExpression
  size?: 'large' | 'normal' | 'small'
}) {
  const avatar = getAvatar(avatarId, fallbackCommonImage)

  return (
    <span
      style={{
        position: 'relative',
        display: 'block',
        width: '100%',
        aspectRatio: '1 / 1',
        overflow: 'hidden',
        borderRadius: '50%',
        backgroundColor: avatar.color,
      }}>
      <Image
        src={avatar.images[expression][size]}
        alt={avatar.name}
        fill
        style={{ objectFit: 'contain' }}
      />
    </span>
  )
}

export function AvatarSync({
  size = 'normal',
}: {
  size?: 'large' | 'normal' | 'small'
}) {
  const { avatarId, expression } = useAvatarState()

  return <AvatarImage avatarId={avatarId} expression={expression} size={size} />
}

const AvatarSyncContext = createContext<{
  avatarId: string
  expression: AvatarExpression
} | null>(null)

export function AvatarSyncContextProvider({
  avatarId: _avatarId,
  expression: _expression = AvatarExpression.DEFAULT,
  children,
}: {
  avatarId?: string
  expression?: AvatarExpression
  children: React.ReactNode
}) {
  const avatarId = _avatarId ?? '097971'
  const expression = _expression

  return (
    <AvatarSyncContext.Provider value={{ avatarId, expression }}>
      {children}
    </AvatarSyncContext.Provider>
  )
}

export function useAvatarState() {
  const context = useContext(AvatarSyncContext)
  if (!context) {
    throw new Error(
      'useAvatarState must be used within a AvatarSyncContextProvider',
    )
  }
  return context
}
