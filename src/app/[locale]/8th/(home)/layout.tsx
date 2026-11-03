import HomeLayout from '@/8th/features/home/ui/page/HomeLayout'
import React from 'react'

export default function Layout({ children }: { children?: React.ReactNode }) {
  return <HomeLayout>{children}</HomeLayout>
}
