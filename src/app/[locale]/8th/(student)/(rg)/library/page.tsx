'use client'

import { useCustomerConfiguration } from '@/8th/application/context/CustomerContext'
import SITE_PATH from '@/app/site-path'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  const { menu } = useCustomerConfiguration()

  if (menu.eb.open) {
    router.replace(SITE_PATH.STUDENT_8TH.EB)
  } else if (menu.pb.open) {
    router.replace(SITE_PATH.STUDENT_8TH.PB)
  } else {
    return <div>Library is not open</div>
  }
  return null
}
