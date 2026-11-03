import StudentMainLayout from '@/8th/application/student/StudentMainLayout'
import React from 'react'

export default function Layout({ children }: { children?: React.ReactNode }) {
  return <StudentMainLayout>{children}</StudentMainLayout>
}
