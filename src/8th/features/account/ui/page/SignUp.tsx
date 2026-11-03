'use client'

import { useCustomerConfiguration } from '@/8th/application/context/CustomerContext'
import SignUpKR from './SignUpKR'
import SignUpVN from './SignUpVN'

export default function SignUp({ email }: { email?: string }) {
  const { country } = useCustomerConfiguration()

  if (country === 'vn') {
    return <SignUpVN email={email} />
  }
  return <SignUpKR email={email} />
}
