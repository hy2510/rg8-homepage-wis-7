'use client'

import { useCustomerInfo } from '@/8th/application/context/CustomerContext'
import SignInContextProvider, {
  useSignIn,
} from '@/8th/application/context/SignInContext'
import {
  useClassGroupList,
  useClassList,
} from '@/8th/features/account/service/account-query'
import AddAccountSchoolForm from '@/8th/features/account/ui/component/AddAccountSchoolForm'
import SITE_PATH from '@/app/site-path'
import { useState } from 'react'

export default function SignInSchool() {
  return (
    <SignInContextProvider>
      <SignInView />
    </SignInContextProvider>
  )
}

function SignInView() {
  const customer = useCustomerInfo()

  const customerId = customer.customerId
  const hasClassLogin = customer.useStudentNoYn
  const signIn = useSignIn()

  const [classGroupId, setClassGroupId] = useState<string | undefined>(
    undefined,
  )

  const { data: gradeListData } = useClassGroupList(
    { customerId },
    {
      enabled: !!customerId && hasClassLogin,
    },
  )
  const { data: classListData } = useClassList(
    {
      customerId,
      classGroupId: classGroupId!,
    },
    {
      enabled: !!classGroupId,
    },
  )

  const handleSignIn = ({
    classId,
    userName,
    loginId,
    password,
    isOnetimeLogin,
    isSavePassword,
  }: {
    classId?: string
    userName?: string
    loginId?: string
    password: string
    isOnetimeLogin: boolean
    isSavePassword: boolean
  }) => {
    if (classId) {
    } else {
      signIn(loginId!, password, isOnetimeLogin, isSavePassword)
    }
  }

  const gradeList = gradeListData?.list?.map((item) => ({
    key: item.classGroupId,
    label: item.name,
  }))
  const classList = classListData?.list?.map((item) => ({
    key: item.classId,
    label: item.name,
  }))

  return (
    <>
      <AddAccountSchoolForm
        gradeList={gradeList}
        classList={classList}
        onSelectGrade={(key) => setClassGroupId(key)}
        hasClassLogin={hasClassLogin}
        customer={{ name: customer.name }}
        findPasswordHref={SITE_PATH.ACCOUNT_8TH.FIND_PASSWORD}
        onSignIn={handleSignIn}
      />
    </>
  )
}
