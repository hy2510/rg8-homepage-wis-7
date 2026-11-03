'use client'

import { useCustomerInfo } from '@/8th/application/context/CustomerContext'
import SignInContextProvider, {
  useSignIn,
} from '@/8th/application/context/SignInContext'
import AddAccountPrivateForm from '@/8th/features/account/ui/component/AddAccountPrivateForm'
import SITE_PATH from '@/app/site-path'

export default function SignInPrivate() {
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
    signIn(loginId, password, isOnetimeLogin, isSavePassword)
  }

  return (
    <AddAccountPrivateForm
      customer={{ name: customer.name }}
      findIdHref={SITE_PATH.ACCOUNT_8TH.FIND_ID}
      findPasswordHref={SITE_PATH.ACCOUNT_8TH.FIND_PASSWORD}
      signUpHref={SITE_PATH.ACCOUNT_8TH.SIGNUP}
      onSignIn={handleSignIn}
    />
  )
}
