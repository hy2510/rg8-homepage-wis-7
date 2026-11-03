'use client'

import { Login } from '@/8th/features/account/model/login'
import {
  useLogin,
  useLoginWithSSO,
  useRegistRecoveryPin as useRegistRecoveryPinQuery,
  useTemporaryChangePassword as useTemporaryChangePasswordQuery,
} from '@/8th/features/account/service/account-query'
import AccountForceChangePassword from '@/8th/features/account/ui/component/AccountForceChangePassword'
import RegistRecoveryPIN from '@/8th/features/account/ui/component/RegistRecoveryPIN'
import { useAuth, useChangeAuthStatus } from '@/8th/shared/auth/AuthContext'
import SITE_PATH from '@/app/site-path'
import LottiePlayer from '@/external/lottie/component/LottiePlayer'
import useTranslation from '@/localization/client/useTranslations'
import { useRouter } from 'next/navigation'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useApplicationType, useDevicePlatformInfo } from './ApplicationContext'
import { useCustomerConfiguration, useCustomerInfo } from './CustomerContext'

type SignInStep = 'login' | 'change-password' | 'regist-recovery-pin' | 'finish'
type SignInRequest = {
  type: 'id' | 'token'
  customerId: string
  id?: string
  password?: string
  token?: string
  i?: number
  isSaveHistory?: boolean
  isSavePassword?: boolean
  destination?: string
}
type SignInStatus = {
  isLoading: boolean
  isSuccess: boolean
  message: string
  step: SignInStep
  signInType: 'guest' | 'student' | 'staff'
  hash?: string
}

const SignInContext = createContext<
  | {
      signIn: (
        id: string,
        password: string,
        isSaveHistory?: boolean,
        isSavePassword?: boolean,
        goto?: string,
      ) => void
      signInSSO: (token: string, i: number) => void
      changeTemporaryPassword: (newPassword: string) => void
      registRecoveryPin: (pin: string) => void
      clearMessage: () => void
      reset: () => void
      isLoading: boolean
      isSuccess: boolean
      message: string
      step: SignInStep
      signInType: 'guest' | 'student' | 'staff'
    }
  | undefined
>(undefined)

export default function SignInContextProvider({
  disableDefaultUI = {
    loading: false,
    changePassword: false,
    registPin: false,
    message: false,
  },
  children,
}: {
  disableDefaultUI?: {
    loading?: boolean
    changePassword?: boolean
    registPin?: boolean
    message?: boolean
  }
  children: React.ReactNode
}) {
  // @language 'common'
  const { t } = useTranslation()

  const { customerId, name: customerName } = useCustomerInfo()
  const { country } = useCustomerConfiguration()

  const deviceType = useDevicePlatformInfo()
  const appType = useApplicationType()
  const changeAuthStatus = useChangeAuthStatus()

  const loginState = useAuth()
  const router = useRouter()

  const [signInRequest, setSignInRequest] = useState<SignInRequest | undefined>(
    undefined,
  )
  const [signInState, setSignInStatus] = useState<SignInStatus>({
    isLoading: false,
    isSuccess: false,
    message: '',
    step: 'login',
    signInType: 'guest',
  })

  useEffect(() => {
    let nextPath = SITE_PATH.ACCOUNT_8TH.FORWARDER
    if (loginState.student === 'active' || loginState.staff === 'active') {
      if (signInRequest?.destination) {
        nextPath = signInRequest.destination
      }
      router.push(nextPath)
    }
  }, [loginState.student, loginState.staff, signInRequest?.destination, router])

  const onSignInSuccess = useCallback(
    (data: Login) => {
      setSignInStatus({
        isLoading: false,
        isSuccess: true,
        message: '',
        step: 'finish',
        signInType: data.student ? 'student' : 'staff',
      })
      changeAuthStatus({
        student: data.student ? 'active' : 'inactive',
        staff: data.staff ? 'active' : 'inactive',
      })
    },
    [changeAuthStatus],
  )
  const onSignInError = useCallback(
    (error: Error | null) => {
      if (error instanceof Error && 'code' in error && 'payload' in error) {
        const code = error.code as number
        const message = getErrorMessage(t, code)
        const extra =
          'extra' in error ? (error.extra as { hash: string }) : undefined
        if (code === 2001 && extra?.hash) {
          setSignInStatus({
            isLoading: false,
            isSuccess: false,
            message: message,
            step: 'change-password',
            signInType: 'guest',
            hash: extra.hash,
          })
        } else if (code === 2003 && extra?.hash) {
          setSignInStatus({
            isLoading: false,
            isSuccess: false,
            message: message,
            step: 'regist-recovery-pin',
            signInType: 'guest',
            hash: extra.hash,
          })
        } else {
          setSignInStatus({
            isLoading: false,
            isSuccess: false,
            message: message,
            step: 'login',
            signInType: 'guest',
          })
        }
      }
    },
    [t],
  )

  const { mutate: login } = useLogin({
    onSuccess(data) {
      if (signInRequest?.isSaveHistory) {
      }
      onSignInSuccess(data)
    },
    onError: (error) => {
      onSignInError(error)
    },
  })
  const { mutate: loginWithSSO } = useLoginWithSSO({
    onSuccess: (data) => {
      onSignInSuccess(data)
    },
    onError: (error) => {
      onSignInError(error)
    },
  })
  const { mutate: changeTemporaryPasswordMutate } =
    useTemporaryChangePasswordQuery({
      onSuccess: (data) => {
        setSignInStatus({
          isLoading: false,
          isSuccess: true,
          message: '',
          step: 'finish',
          signInType: 'student',
        })
        changeAuthStatus({
          student: 'active',
          staff: 'inactive',
        })
      },
      onError: (error) => {
        setSignInStatus({
          isLoading: false,
          isSuccess: false,
          message: error?.message || '',
          step: 'login',
          signInType: 'guest',
        })
      },
    })
  const { mutate: registRecoveryPinMutate } = useRegistRecoveryPinQuery({
    onSuccess: (data) => {
      setSignInStatus({
        isLoading: false,
        isSuccess: true,
        message: '',
        step: 'finish',
        signInType: 'student',
      })
      changeAuthStatus({
        student: 'active',
        staff: 'inactive',
      })
    },
    onError: (error) => {
      setSignInStatus({
        isLoading: false,
        isSuccess: false,
        message: error?.message || '',
        step: 'login',
        signInType: 'guest',
      })
    },
  })

  const signIn = useCallback(
    (
      id: string,
      password: string,
      isSaveHistory?: boolean,
      isSavePassword?: boolean,
      destination?: string,
    ) => {
      setSignInRequest({
        type: 'id',
        customerId,
        id,
        password,
        isSaveHistory,
        isSavePassword,
        destination,
      })
      setSignInStatus({
        isSuccess: false,
        isLoading: true,
        message: '',
        step: 'login',
        signInType: 'guest',
      })
      login({
        type: 'id',
        customerId,
        customerName,
        id,
        password,
        isSaveHistory,
        isSavePassword,
        deviceType,
        loginType: appType === 'app' ? 'student' : 'all',
      })
    },
    [login, customerId, deviceType, appType, customerName],
  )
  const signInSSO = useCallback(
    (token: string, i: number, destination?: string) => {
      setSignInRequest({
        type: 'token',
        customerId,
        token,
        i,
        destination,
      })
      loginWithSSO({
        code: token,
        i,
        deviceType,
        loginType: appType === 'app' ? 'student' : 'all',
      })
    },
    [loginWithSSO, customerId, deviceType, appType],
  )
  const changeTemporaryPassword = useCallback(
    (newPassword: string) => {
      if (!signInRequest?.id) {
        return
      }
      const hash = signInState.hash
      if (!hash) {
        return
      }
      setSignInStatus({
        isLoading: true,
        isSuccess: false,
        message: '',
        step: 'change-password',
        signInType: 'guest',
        hash,
      })
      changeTemporaryPasswordMutate({
        customerId,
        customerName,
        id: signInRequest.id,
        isSaveHistory: signInRequest.isSaveHistory,
        isSavePassword: signInRequest.isSavePassword,
        hash,
        newPassword,
      })
    },
    [
      changeTemporaryPasswordMutate,
      signInState.hash,
      customerId,
      customerName,
      signInRequest?.id,
      signInRequest?.isSaveHistory,
      signInRequest?.isSavePassword,
    ],
  )

  const registRecoveryPin = useCallback(
    (pin: string) => {
      if (!signInRequest?.id) {
        return
      }
      const hash = signInState.hash
      if (!hash) {
        return
      }
      setSignInStatus({
        isLoading: true,
        isSuccess: false,
        message: '',
        step: 'regist-recovery-pin',
        signInType: 'guest',
        hash,
      })
      registRecoveryPinMutate({
        customerId,
        customerName,
        id: signInRequest.id,
        isSaveHistory: signInRequest.isSaveHistory,
        isSavePassword: signInRequest.isSavePassword,
        hash,
        pin,
      })
    },
    [
      registRecoveryPinMutate,
      signInState.hash,
      customerId,
      customerName,
      signInRequest?.id,
      signInRequest?.isSaveHistory,
      signInRequest?.isSavePassword,
    ],
  )

  const clearMessage = useCallback(() => {
    setSignInStatus({
      ...signInState,
      message: '',
    })
  }, [signInState])

  const reset = useCallback(() => {
    setSignInRequest(undefined)
    setSignInStatus({
      isLoading: false,
      isSuccess: false,
      message: '',
      step: 'login',
      signInType: 'guest',
    })
  }, [])

  useEffect(() => {
    if (disableDefaultUI.message) {
      return
    }
    if (signInState.message) {
      alert(signInState.message)
      clearMessage()
    }
  }, [signInState.message, clearMessage, disableDefaultUI.message])

  return (
    <SignInContext.Provider
      value={{
        signIn,
        signInSSO,
        changeTemporaryPassword,
        registRecoveryPin,
        clearMessage,
        reset,
        isLoading: signInState.isLoading,
        isSuccess: signInState.isSuccess,
        message: signInState.message,
        step: signInState.step,
        signInType: signInState.signInType,
      }}>
      <SignInFormWrapper
        showLoading={!disableDefaultUI.loading && signInState.isLoading}>
        {signInState.step === 'change-password' &&
        !disableDefaultUI.changePassword ? (
          <AccountForceChangePassword
            target={country === 'kr' ? 'kr' : 'vn'}
            onChangePassword={changeTemporaryPassword}
          />
        ) : signInState.step === 'regist-recovery-pin' &&
          !disableDefaultUI.registPin ? (
          <RegistRecoveryPIN onBack={reset} onRegistPin={registRecoveryPin} />
        ) : (
          children
        )}
      </SignInFormWrapper>
      {!disableDefaultUI.loading && signInState.isLoading ? (
        <SignInLoading />
      ) : null}
    </SignInContext.Provider>
  )
}

function getErrorMessage(t: (id: string) => string, code: number) {
  if (code === 2000) {
    return t('t8th0462')
  }
  if (code === 3000 || code === 3001) {
    return t('t8th0463')
  }
  if (code === 2002) {
    return t('t8th0464')
  }
  if (code === 2001) {
    return t('t8th0465')
  }
  if (code === 2003) {
    return t('t8th0483')
  }
  if (code === 9998) {
    return ''
  }
  return t('t8th0461')
}

export function useSignIn() {
  const context = useContext(SignInContext)
  if (!context) {
    throw new Error('useSignIn must be used within a SignInContextProvider')
  }
  return context.signIn
}

export function useSignInMessage() {
  const context = useContext(SignInContext)
  if (!context) {
    throw new Error(
      'useSignInMessage must be used within a SignInContextProvider',
    )
  }
  return {
    message: context.message,
    clearMessage: context.clearMessage,
  }
}

export function useSignInStatus() {
  const context = useContext(SignInContext)
  if (!context) {
    throw new Error(
      'useSignInStatus must be used within a SignInContextProvider',
    )
  }
  return {
    isLoading: context.isLoading,
    isSuccess: context.isSuccess,
    message: context.message,
    step: context.step,
    signInType: context.signInType,
  }
}

export function useTemporaryChangePassword() {
  const context = useContext(SignInContext)
  if (!context) {
    throw new Error(
      'useTemporaryChangePassword must be used within a SignInContextProvider',
    )
  }
  return context.changeTemporaryPassword
}

export function useRegistRecoveryPin() {
  const context = useContext(SignInContext)
  if (!context) {
    throw new Error(
      'useRegistRecoveryPin must be used within a SignInContextProvider',
    )
  }
  return context.registRecoveryPin
}

function SignInFormWrapper({
  children,
  showLoading,
}: {
  children: React.ReactNode
  showLoading: boolean
}) {
  return (
    <div
      inert={showLoading ? true : undefined}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
      }}>
      {children}
    </div>
  )
}

function SignInLoading() {
  // @language 'common'
  const { t } = useTranslation()

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <div
        style={{
          width: '180px',
          height: '180px',
          backgroundColor: '#fff',
          borderRadius: '15px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          fontSize: '0.8em',
          fontWeight: '500',
          color: '#000',
          paddingTop: '10px',
        }}>
        <LottiePlayer
          path="/src/lottie/loading2.json"
          width={120}
          height={120}
        />
        <div>{t('t450')}</div>
      </div>
    </div>
  )
}
