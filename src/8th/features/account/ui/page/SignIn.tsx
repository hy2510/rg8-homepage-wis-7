'use client'

import { useApplicationType } from '@/8th/application/context/ApplicationContext'
import AccountRoot from './AccountRoot'
import SignInAcademy from './SignInAcademy'
import SignInApplication from './SignInApplication'
import SignInPrivate from './SignInPrivate'
import SignInSchool from './SignInSchool'
import SignInApplicationDemo from './demo/SignInApplication'

const ISDEMO = true
export default function SignIn() {
  const appType = useApplicationType()
  if (appType === 'app') {
    if (ISDEMO) {
      return (
        <AccountRoot>
          <SignInApplicationDemo />
        </AccountRoot>
      )
    }
    return (
      <AccountRoot>
        <SignInApplication />
      </AccountRoot>
    )
  } else if (appType === 'private') {
    return (
      <AccountRoot>
        <SignInPrivate />
      </AccountRoot>
    )
  } else if (appType === 'school') {
    return <SignInSchool />
  } else if (appType === 'academy') {
    return <SignInAcademy />
  }
  return <>Type not supported</>
}
