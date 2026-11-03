'use client'

import { useCustomerConfiguration } from '@/8th/application/context/CustomerContext'
import { useStudentHistoryList } from '@/8th/features/student/service/student-query'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function useMainLayoutTypeGuard(useType: 'rg' | 'dnf') {
  const router = useRouter()
  const { accessDNF, accessRG } = useCustomerConfiguration()

  const [notAccessibleFlag, setNotAccessibleFlag] = useState<
    boolean | 'unknown'
  >('unknown')
  const studentHistory = useStudentHistoryList()
  if (notAccessibleFlag === 'unknown') {
    if (!canAccess({ accessDNF, accessRG }, useType)) {
      setNotAccessibleFlag(true)
    } else {
      if (!studentHistory.isLoading && studentHistory.data?.list) {
        const isValid =
          studentHistory.data?.list.length === 0
            ? true
            : studentHistory.data.list.some((item) =>
                isValidProgramModelCode(useType, item.programModelCode),
              )
        setNotAccessibleFlag(!isValid)
      }
    }
  }

  useEffect(() => {
    if (notAccessibleFlag) {
      router.replace('/8th/forwarder')
    }
  }, [notAccessibleFlag, router])

  return {
    notAccessibleFlag,
  }
}

function canAccess(
  { accessRG, accessDNF }: { accessRG: boolean; accessDNF: boolean },
  useType: 'rg' | 'dnf',
) {
  if (useType === 'rg') {
    return accessRG
  } else {
    return accessDNF
  }
}

function isValidProgramModelCode(
  useType: 'rg' | 'dnf',
  programModelCode: string,
) {
  if (useType === 'rg') {
    return (
      programModelCode === '107001' ||
      programModelCode === '107002' ||
      programModelCode === ''
    )
  } else {
    return programModelCode === '107003'
  }
}
