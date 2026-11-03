import LeaderboardLayout from '@/8th/features/board/ui/page/LeaderboardLayout'
import React from 'react'

export default function Layout({ children }: { children?: React.ReactNode }) {
  return <LeaderboardLayout>{children}</LeaderboardLayout>
}
