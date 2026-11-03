'use client'

import { useApplicationType } from '@/8th/application/context/ApplicationContext'
import {
  useChangeCustomerId,
  useCustomerInfo,
} from '@/8th/application/context/CustomerContext'
import SignInContextProvider, {
  useSignIn,
} from '@/8th/application/context/SignInContext'
import {
  useAccountList,
  useDeleteAccountItem,
  useUpdateAccountItem,
} from '@/8th/features/account/service/account-query'
import AccountList from '@/8th/features/account/ui/component/AccountList'
import {
  useAccountNavigationBack,
  useAccountNavigationVisibleController,
} from '@/8th/features/account/ui/component/AccountNavigation'
import SITE_PATH from '@/app/site-path'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import AccountEnterForm from '../component/AccountEnterForm'
import AccountRoot from './AccountRoot'

type Account = {
  customerId: string
  studentId: string
  customerName: string
  studentName: string
  loginId: string
  avatar: string
  password?: string
}

export default function Accounts() {
  const [, setRefresh] = useState(0)
  const [selectedAccount, setSelectedAccount] = useState<Account | undefined>(
    undefined,
  )
  const accountList = useAccountList().map(
    (account): Account => ({
      customerId: account.customerId,
      studentId: account.studentId,
      customerName: account.customerName,
      studentName: account.studentName,
      loginId: account.loginId,
      avatar: account.avatar,
      password: account.password,
    }),
  )

  const updateAccount = useUpdateAccountItem()
  const deleteAccount = useDeleteAccountItem()

  return (
    <AccountRoot>
      {selectedAccount === undefined && (
        <AccountListView
          accounts={accountList}
          onSelectAccount={(account) => {
            setSelectedAccount(account)
          }}
          onRemovePassword={(account) => {
            updateAccount({
              ...account,
              password: '',
              isReSort: false,
            })
            setRefresh(Date.now())
          }}
          onDeleteAccount={(account) => {
            deleteAccount({
              customerId: account.customerId,
              studentId: account.studentId,
            })
            setRefresh(Date.now())
          }}
        />
      )}
      {selectedAccount !== undefined && (
        <SignInContextProvider>
          <SignInView
            account={selectedAccount}
            onCancel={() => setSelectedAccount(undefined)}
          />
        </SignInContextProvider>
      )}
    </AccountRoot>
  )
}

function AccountListView({
  accounts,
  onSelectAccount,
  onRemovePassword,
  onDeleteAccount,
}: {
  accounts: Account[]
  onSelectAccount: (account: Account) => void
  onRemovePassword: (account: Account) => void
  onDeleteAccount: (account: Account) => void
}) {
  const appType = useApplicationType()

  const { show: showBack, hide: hideBack } =
    useAccountNavigationVisibleController()
  useEffect(() => {
    if (appType === 'app') {
      hideBack()
    }
    return () => {
      if (appType === 'app') {
        showBack()
      }
    }
  }, [hideBack, showBack, appType])
  return (
    <AccountList
      accounts={accounts}
      signInHref={SITE_PATH.ACCOUNT_8TH.SIGNIN}
      trialAccountHref={SITE_PATH.ACCOUNT_8TH.TRIAL}
      onSelectAccount={onSelectAccount}
      onRemovePassword={onRemovePassword}
      onDeleteAccount={onDeleteAccount}
    />
  )
}

function SignInView({
  account,
  onCancel,
}: {
  account: Account
  onCancel: () => void
}) {
  const params = useSearchParams()
  const to = params.get('to')

  const customerId = useCustomerInfo().customerId
  const changeCustomerId = useChangeCustomerId()
  const isSignInAvailable = !!customerId && customerId === account.customerId

  useAccountNavigationBack('sign-in-view', onCancel)

  const signIn = useSignIn()

  useEffect(() => {
    if (!isSignInAvailable) {
      changeCustomerId(account.customerId)
    }
  }, [account.customerId, changeCustomerId, isSignInAvailable])

  const isAutoLogin = isSignInAvailable && !!account.password
  useEffect(() => {
    if (isAutoLogin) {
      signIn(account.loginId, account.password!, true, true, to || undefined)
    }
  }, [signIn, account.loginId, account.password, isAutoLogin, to])

  const handleSignIn = (
    loginId: string,
    password: string,
    isOnetimeLogin: boolean,
    isSavePassword: boolean,
    destination?: string,
  ) => {
    signIn(loginId, password, true, isSavePassword, destination)
  }

  return (
    <AccountEnterForm
      state="input"
      customerId={account.customerId}
      customerName={account.customerName}
      studentName={account.studentName}
      loginId={account.loginId}
      avatar={account.avatar}
      onSubmit={(password, isSavePassword) => {
        handleSignIn(
          account.loginId,
          password,
          false,
          isSavePassword,
          to || undefined,
        )
      }}
      forgotPasswordHref={`${SITE_PATH.ACCOUNT_8TH.FIND_PASSWORD}?type=id&hint=${account.loginId}`}
    />
  )
}
