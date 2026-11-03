'use client'

import useStudentBootstrap from '@/8th/shared/hook/useStudentBootstrap'
import { useEffect } from 'react'
import { useAuth } from './AuthContext'

export default function AuthBootstrap({
  children,
}: {
  children: React.ReactNode
}) {
  const d = useAuth()

  const { bootstrap: studentBootstrap, isLoading } = useStudentBootstrap()

  useEffect(() => {
    if (d.student === 'active') {
      const result = studentBootstrap().then()
    }
  }, [d.student, d.staff, studentBootstrap])

  return (
    <>
      {isLoading && <div>Loading...</div>}
      {children}
    </>
  )
}
