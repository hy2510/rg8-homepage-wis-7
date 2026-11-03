'use client'

import { useCustomerInfo } from '@/8th/application/context/CustomerContext'
import SignInContextProvider, {
  useSignIn,
} from '@/8th/application/context/SignInContext'
import { useFindId } from '@/8th/features/account/service/account-query'
import { useAccountNavigationBack } from '@/8th/features/account/ui/component/AccountNavigation'
import AccountSignInInput from '@/8th/features/account/ui/component/AccountSignInInput'
import ForgotId from '@/8th/features/account/ui/component/ForgotId'
import ForgotIdResult from '@/8th/features/account/ui/component/ForgotIdResult'
import SignInOption from '@/8th/features/account/ui/component/SignInOption'
import AccountRoot from '@/8th/features/account/ui/page/AccountRoot'
import { AvatarImage } from '@/8th/shared/ui/Avatar'
import SITE_PATH from '@/app/site-path'
import useTranslation from '@/localization/client/useTranslations'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export default function FindId() {
  return (
    <AccountRoot>
      <FindIdView />
    </AccountRoot>
  )
}

function FindIdView() {
  // @language 'common'
  const { t } = useTranslation()

  const customer = useCustomerInfo()
  const customerId = customer.customerId
  const customerType = customer.customerUse

  const router = useRouter()

  const hasAllowed = !!customerId && customerType.toLowerCase() === 'private'

  const [step, setStep] = useState<'form' | 'result' | 'empty' | 'enter'>(
    'form',
  )
  const [useType, setUseType] = useState<'Email' | 'Phone'>('Email')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [enterStudent, setEnterStudent] = useState<{
    loginId: string
    studentName?: string
  } | null>(null)

  const findId = useFindId(
    { customerId, useType, keyword: searchKeyword },
    {
      enabled: hasAllowed && !!searchKeyword,
    },
  )

  useAccountNavigationBack('find-id', () => {
    if (step !== 'form') {
      setStep('form')
    } else {
      router.back()
    }
  })

  useEffect(() => {
    if (!searchKeyword || findId.isFetching) return
    if (findId.data?.list) {
      setStep('result')
      return
    }
    if (findId.isError) {
      setStep('empty')
    }
  }, [searchKeyword, findId.isFetching, findId.isError, findId.data])

  const backToForm = () => {
    setSearchKeyword('')
    setStep('form')
  }

  const goLogin = () => {
    router.push(SITE_PATH.ACCOUNT_8TH.SIGNIN)
  }

  if (!hasAllowed) {
    return (
      <div className="body is-add">
        <h1>Not allowed</h1>
        <Link href={SITE_PATH.ACCOUNT_8TH.SIGNIN}>
          <button type="button" className="enter-find">
            {'Return'}
          </button>
        </Link>
      </div>
    )
  }

  /* 
    MEMO :: 현재는 Backend API 응답 결과가 마스크 되어 있음. 
    ID 찾기 결과가 Mask 되므로 선택기능 비활성화, 스타일 클릭안되게 변경, 뒤로 돌아가는 버튼 추가
    RESULT_ID_MASKED 값에 따라 달라지고, API 마스킹 변경되면 해당 변수 지울 것
    원래 기획 의도는 false 값(마스킹 안함)에 해당 함.
  */
  const RESULT_ID_MASKED = true

  if (step === 'result' && findId.data?.list && RESULT_ID_MASKED) {
    return <ForgotIdResult list={findId.data.list} goLogin={goLogin} />
  } else if (step === 'result' && findId.data?.list && !RESULT_ID_MASKED) {
    return (
      <ForgotIdResult
        list={findId.data.list}
        onClick={(item) => {
          setEnterStudent({
            loginId: item.loginId,
            studentName: item.studentName,
          })
          setStep('enter')
        }}
      />
    )
  }

  if (step === 'empty') {
    return (
      <div className="body is-add">
        <h1>{t('t8th0083')}</h1>
        <p className="pick-copy">{t('t8th0130')}</p>
        <button type="button" className="add-find" onClick={backToForm}>
          {t('t8th0042')}
        </button>
      </div>
    )
  }

  if (step === 'enter' && enterStudent) {
    return (
      <SignInContextProvider>
        <EnterView
          loginId={enterStudent?.loginId}
          studentName={enterStudent?.studentName}
          onBack={backToForm}
        />
      </SignInContextProvider>
    )
  }

  return (
    <ForgotId
      useType={useType}
      onTypeChange={setUseType}
      onFind={(value) => {
        setSearchKeyword(value)
        if (value === searchKeyword && !findId.isFetching) {
          if (findId.data?.list) setStep('result')
          else if (findId.isError) setStep('empty')
        }
      }}
    />
  )
}

function EnterView({
  loginId,
  studentName,
  onBack,
}: {
  loginId: string
  studentName?: string
  onBack: () => void
}) {
  useAccountNavigationBack('add-account', onBack)

  // @language 'common'
  const { t } = useTranslation()

  const signIn = useSignIn()

  const handleSignIn = (
    loginId: string,
    password: string,
    isOnetimeLogin: boolean,
    isSavePassword: boolean,
  ) => {
    signIn(loginId, password, isOnetimeLogin, isSavePassword)
  }

  const passwordRef = useRef<HTMLInputElement>(null)
  const [password, setPassword] = useState('')
  const [notice, setNotice] = useState('')
  const [isSavePassword, setIsSavePassword] = useState(false)

  const handleLogin = () => {
    handleSignIn(loginId, password, true, isSavePassword)
  }

  return (
    <>
      <div className="body is-enter">
        <div className="enter">
          <h1>{t('t8th0075')}</h1>
          <div className="enter-profile">
            <span className="enter-avatar">
              <AvatarImage />
            </span>
            <strong>{studentName || ' '}</strong>
            <span className="enter-id">{loginId}</span>
          </div>
          <div className="group-enter-fields">
            <AccountSignInInput
              ref={passwordRef}
              type="password"
              value={password}
              onChange={(text) => setPassword(text)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleLogin()
                }
              }}
              placeholder={t('t8th0031')}
              autoComplete="current-password"
              aria-label={t('t8th0031')}
              action={{
                disabled: password.length <= 0,
                onClick: handleLogin,
                ariaLabel: t('t8th0077'),
              }}
            />
          </div>
          <SignInOption
            isSavePassword={isSavePassword}
            setIsSavePassword={setIsSavePassword}
          />
          <Link href={SITE_PATH.ACCOUNT_8TH.FIND_PASSWORD}>
            <button type="button" className="enter-find">
              {t('t8th0057')}
            </button>
          </Link>
          {notice ? <p className="add-check-msg">{notice}</p> : null}
        </div>
      </div>
    </>
  )
}
