'use client'

import { useApplicationType } from '@/8th/application/context/ApplicationContext'
import { useLogout } from '@/8th/features/account/service/account-query'
import { useChangeAuthStatus } from '@/8th/shared/auth/AuthContext'
import SITE_PATH from '@/app/site-path'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function SignoutPage() {
  const changeAuthStatus = useChangeAuthStatus()
  const router = useRouter()

  const appType = useApplicationType()

  const { mutate: logout } = useLogout({
    onMutate: () => {
      changeAuthStatus({ student: 'inactive', staff: 'inactive' })
    },
    onSuccess() {
      router.replace(
        appType === 'app'
          ? SITE_PATH.ACCOUNT_8TH.HOME
          : SITE_PATH.HOME_8TH.HOME,
      )
    },
  })
  useEffect(() => {
    logout({})
  }, [logout])

  return <></>
}
