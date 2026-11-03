import StudentMainLayoutDnf from '@/8th/application/student/StudentMainLayoutDnf'
import React from 'react'

export default function Layout({ children }: { children?: React.ReactNode }) {
  return <StudentMainLayoutDnf>{children}</StudentMainLayoutDnf>
}
