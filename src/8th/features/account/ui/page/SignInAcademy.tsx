'use client'

import { useCustomerInfo } from '@/8th/application/context/CustomerContext'
import SignInContextProvider, {
  useSignIn,
} from '@/8th/application/context/SignInContext'
import AddAccountAcademyForm from '@/8th/features/account/ui/component/AddAccountAcademyForm'
import SITE_PATH from '@/app/site-path'

export default function SignInAcademy() {
  return (
    <SignInContextProvider>
      <SignInView />
    </SignInContextProvider>
  )
}

function SignInView() {
  const customer = useCustomerInfo()

  const signIn = useSignIn()

  const handleSignIn = (
    loginId: string,
    password: string,
    isOnetimeLogin: boolean,
    isSavePassword: boolean,
  ) => {
    signIn(loginId, password, true, isSavePassword)
  }
  return (
    <>
      <AddAccountAcademyForm
        customer={{ name: customer.name }}
        findPasswordHref={SITE_PATH.ACCOUNT_8TH.FIND_PASSWORD}
        onSignIn={handleSignIn}
      />
    </>
  )
}
