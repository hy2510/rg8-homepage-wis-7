'use client'

import { useApplicationType } from '@/8th/application/context/ApplicationContext'
import { useCustomerConfiguration } from '@/8th/application/context/CustomerContext'
import { useAuth } from '@/8th/shared/auth/AuthContext'
import SITE_PATH from '@/app/site-path'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Page() {
  const router = useRouter()
  const appType = useApplicationType()

  const { student, staff } = useAuth()
  const { mainMode } = useCustomerConfiguration()

  useEffect(() => {
    if (student === 'unknown') {
      return
    }
    if (staff === 'active') {
      if (mainMode === 'DNF') {
        router.replace(SITE_PATH.HOME_8TH.HOME_DNF)
      } else {
        router.replace(SITE_PATH.HOME_8TH.HOME)
      }
      return
    }

    if (appType === 'app' && student !== 'active') {
      router.replace(SITE_PATH.ACCOUNT_8TH.HOME)
    } else {
      if (mainMode === 'DNF') {
        router.replace(SITE_PATH.HOME_8TH.HOME_DNF)
      } else {
        router.replace(SITE_PATH.HOME_8TH.HOME)
      }
    }
  }, [appType, student, staff, router, mainMode])

  return null
}
