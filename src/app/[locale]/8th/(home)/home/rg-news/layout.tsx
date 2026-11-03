import NewsLayout from '@/8th/features/board/ui/page/NewsLayout'
import React from 'react'

export default function Layout({ children }: { children?: React.ReactNode }) {
  return <NewsLayout>{children}</NewsLayout>
}
