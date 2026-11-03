'use client'

import { useCustomerInfo } from '@/8th/application/context/CustomerContext'
import AccountRoot from './AccountRoot'
import FindPasswordKrSchoolAcademy from './FindPasswordKrSchoolAcademy'
import FindPasswordPrivate from './FindPasswordPrivate'

export default function FindPassword({
  defaultType,
  hint,
}: {
  defaultType?: 'id' | 'email'
  hint?: string
}) {
  const customer = useCustomerInfo()
  const customerType = customer.customerUse?.toLowerCase()

  return (
    <AccountRoot>
      {customerType === 'school' || customerType === 'academy' ? (
        <FindPasswordKrSchoolAcademy />
      ) : (
        <FindPasswordPrivate defaultType={defaultType} hint={hint} />
      )}
    </AccountRoot>
  )
}
