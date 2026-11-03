'use client'

import { useCustomerConfiguration } from '@/8th/application/context/CustomerContext'
import SITE_PATH from '@/app/site-path'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  const { menu } = useCustomerConfiguration()

  if (menu.wordPractice.eb.open) {
    router.replace(`${SITE_PATH.STUDENT_8TH.WORD_PRACTICE_EB}`)
  } else if (menu.wordPractice.pb.open) {
    router.replace(`${SITE_PATH.STUDENT_8TH.WORD_PRACTICE_PB}`)
  } else {
    return <div>Word Practice is not open</div>
  }
  return null
}
