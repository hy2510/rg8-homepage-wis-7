import StaticContentBoard from '@/8th/features/board/ui/page/StaticContentBoard'
import React from 'react'
import { getStaticBoardData } from './board-data'

export default async function Layout({
  children,
}: {
  children?: React.ReactNode
}) {
  const post = await getStaticBoardData()
  return <StaticContentBoard boards={post}>{children}</StaticContentBoard>
}
