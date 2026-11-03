'use client'

import {
  useChangeCustomerId,
  useCustomerInfo,
} from '@/8th/application/context/CustomerContext'
import SignInContextProvider, {
  useSignIn,
} from '@/8th/application/context/SignInContext'
import { Assets } from '@/8th/assets/asset-library'
import { useCheckLoginId } from '@/8th/features/account/service/account-query'
import { useAccountNavigationBack } from '@/8th/features/account/ui/component/AccountNavigation'
import AccountSignInInput from '@/8th/features/account/ui/component/AccountSignInInput'
import SearchCustomers from '@/8th/features/account/ui/component/SearchCustomers'
import SignInOption from '@/8th/features/account/ui/component/SignInOption'
import SignInAcademy from '@/8th/features/account/ui/page/SignInAcademy'
import SignInSchool from '@/8th/features/account/ui/page/SignInSchool'
import { useSearchCustomer } from '@/8th/features/customer/service/customer-query'
import { AvatarImage } from '@/8th/shared/ui/Avatar'
import { isValidateEmail } from '@/8th/shared/utils/validation'
import SITE_PATH from '@/app/site-path'
import useTranslation from '@/localization/client/useTranslations'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'

type Step = 'addAccount' | 'pick' | 'enter' | 'signup'

const COUNTRY_ORDER = ['KR', 'VN']
function getNationLabel(countryCode: string, customerName: string) {
  if (customerName.toLowerCase() === 'other') {
    return 'Other Countries'
  }
  if (countryCode === 'KR') {
    return '대한민국'
  } else if (countryCode === 'ID') {
    return 'Indonesia'
  } else if (countryCode === 'VN') {
    return 'Việt Nam'
  }
  return ''
}

function getCustomerType(
  customerUseCode?: string,
): 'Private' | 'Academy' | 'School' | undefined {
  if (!customerUseCode) {
    return undefined
  }
  switch (customerUseCode) {
    case '008001':
    case '008002':
      return 'Academy'
    case '008003':
    case '008004':
      return 'School'
  }
  return 'Private'
}

export default function SignInApplication() {
  const [view, setView] = useState<'private' | 'group'>('private')

  const customerId = useCustomerInfo().customerId
  const changeCustomerId = useChangeCustomerId()
  const isSignInAvailable = customerId !== ''

  return (
    <>
      {view === 'private' ? (
        <AddAccount
          changeCustomerId={changeCustomerId}
          onChangeGroup={() => setView('group')}
        />
      ) : null}
      {view === 'group' ? (
        <GroupSearch
          isSignInAvailable={isSignInAvailable}
          onSelectCustomer={(customerId) => changeCustomerId(customerId)}
          onCancel={() => setView('private')}
        />
      ) : null}
    </>
  )
}

function AddAccount({
  changeCustomerId,
  onChangeGroup,
}: {
  onChangeGroup?: () => void
  changeCustomerId?: (customerId: string) => void
}) {
  // @language 'common'
  const { t } = useTranslation()

  const router = useRouter()
  const [step, setStep] = useState<Step>('addAccount')
  const [enterStudent, setEnterStudent] = useState<{
    loginId: string
    studentName?: string
  } | null>(null)

  const {
    mutate: checkLoginId,
    data: checkLoginIdData,
    reset: resetCheckLoginId,
  } = useCheckLoginId({
    onSuccess: (data) => {
      if (data.success) {
        if (data.next === 'pick') {
          setStep('pick')
        } else {
          setEnterStudent({
            loginId: data.keyword,
          })
          setStep('enter')
        }
      } else {
        if (confirm(t('t8th0452'))) {
          setStep('signup')
        }
      }
    },
  })

  useEffect(() => {
    if (step === 'signup') {
      let targetUrl = SITE_PATH.ACCOUNT_8TH.SIGNUP
      if (isValidateEmail(checkLoginIdData?.keyword || '')) {
        targetUrl += `?email=${checkLoginIdData?.keyword}`
      }
      router.push(targetUrl)
    }
  }, [step, checkLoginIdData?.keyword, router])

  return (
    <>
      {step === 'addAccount' && (
        <AddAccountView
          checkLoginId={checkLoginId}
          onGroupClick={onChangeGroup}
          changeCustomerId={changeCustomerId}
        />
      )}
      {step === 'pick' && (
        <PickFindIdList
          members={checkLoginIdData?.list || []}
          onBack={() => setStep('addAccount')}
          onSelect={(member) => {
            setEnterStudent({
              loginId: member.loginId,
              studentName: member.studentName,
            })
            setStep('enter')
          }}
        />
      )}
      {step === 'enter' && !!enterStudent && (
        <SignInContextProvider>
          <EnterView
            loginId={enterStudent?.loginId || ''}
            studentName={enterStudent?.studentName}
            onBack={() => setStep('addAccount')}
          />
        </SignInContextProvider>
      )}
      {/* {step === 'signup' && (
        <SignUpView
          loginId={checkLoginIdData?.keyword || ''}
          onBack={() => setStep('addAccount')}
        />
      )} */}
    </>
  )
}

function AddAccountView({
  checkLoginId,
  onGroupClick,
  changeCustomerId,
}: {
  checkLoginId: (input: { keyword: string; isRequestEmail: boolean }) => void
  onGroupClick?: () => void
  changeCustomerId?: (customerId: string) => void
}) {
  // @language 'common'
  const { t } = useTranslation()

  const [selectNation, setSelectNation] = useState<{
    customerId: string
    name: string
    label: string
    customerUseCode: string
  } | null>(null)

  const { data: customers, isFetching: isNationLoading } = useSearchCustomer({
    type: 'Private',
  })
  const nationCustomers = useMemo(() => {
    const customerList = []
    if (customers && customers.customers?.length > 0) {
      const orderCustomers = []
      orderCustomers.push(
        ...[...customers.customers].sort((a, b) => {
          const aIndex = COUNTRY_ORDER.indexOf(a.countryCode)
          const bIndex = COUNTRY_ORDER.indexOf(b.countryCode)

          return (
            (aIndex === -1 ? Infinity : aIndex) -
            (bIndex === -1 ? Infinity : bIndex)
          )
        }),
      )
      const krCountry = orderCustomers.find((item) => item.countryCode === 'KR')
      if (krCountry) {
        orderCustomers.push({ ...krCountry, name: 'Other' })
      }
      customerList.push(
        ...orderCustomers.map((customer) => ({
          customerId: customer.customerId,
          name: customer.name,
          label: getNationLabel(customer.countryCode, customer.name),
          customerUseCode: customer.customerUseCode,
        })),
      )
    }
    return customerList
  }, [customers])

  useEffect(() => {
    if (nationCustomers.length > 0) {
      setSelectNation(nationCustomers[0])
      if (changeCustomerId) {
        changeCustomerId(nationCustomers[0].customerId)
      }
    }
  }, [nationCustomers, changeCustomerId])

  const handleSelectNation = (nation: {
    customerId: string
    name: string
    label: string
    customerUseCode: string
  }) => {
    if (changeCustomerId) {
      changeCustomerId(nation.customerId)
    }
    setSelectNation(nation)
  }
  const [nationSelectOpen, setOpen] = useState(false)

  const countryRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!nationSelectOpen) return

    const closeOnOutside = (event: PointerEvent) => {
      if (!countryRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('pointerdown', closeOnOutside)
    return () => document.removeEventListener('pointerdown', closeOnOutside)
  }, [nationSelectOpen])

  const [loginId, setLoginId] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const [checkMessage, setCheckMessage] = useState('')

  const handleCheckLoginId = () => {
    if (loginId.trim().length < 1) {
      return
    }
    const isRequestEmail = isValidateEmail(loginId)
    checkLoginId({ keyword: loginId, isRequestEmail })
  }

  return (
    <div className="body is-add">
      <div className="add-head">
        <h1>{t('t8th0097')}</h1>
        <div
          className={`country-select${nationSelectOpen ? ' is-open' : ''}`}
          ref={countryRef}>
          <button
            type="button"
            className="country-button"
            aria-expanded={nationSelectOpen}
            onClick={() => setOpen((current) => !current)}>
            <span>{t('t8th0106', { name: selectNation?.label ?? '' })}</span>
            <Image
              src={Assets.Icon.chevronDownGray}
              alt=""
              width={16}
              height={16}
            />
          </button>
          {nationSelectOpen ? (
            <ul className="country-menu" role="listbox">
              {nationCustomers.map((nation) => (
                <li key={nation.customerId}>
                  <button
                    type="button"
                    className={
                      nation.name === selectNation?.name
                        ? 'is-active'
                        : undefined
                    }
                    onClick={() => {
                      handleSelectNation(nation)
                      setOpen(false)
                    }}>
                    {nation.label}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
      <section className="add-panel">
        <h2>{t('t8th0098')}</h2>
        <p>{t('t8th0099')}</p>
        <div className="add-field">
          <input
            ref={inputRef}
            type="text"
            value={loginId}
            onChange={(event) => {
              setLoginId(event.target.value)
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleCheckLoginId()
              }
            }}
            disabled={isNationLoading}
            placeholder={t('t8th0100')}
            aria-label={t('t8th0101')}
          />
          <button
            type="button"
            className={`add-go${loginId.trim().length > 1 ? ' is-ready' : ''}`}
            onClick={() => {
              handleCheckLoginId()
            }}
            aria-label={t('t8th0102')}>
            <GoArrow />
          </button>
        </div>
        <button type="button" className="add-find">
          {!isNationLoading && (
            <Link href={`${SITE_PATH.ACCOUNT_8TH.FIND_ID}`}>
              {t('t8th0083')}
            </Link>
          )}
        </button>
      </section>
      <p className="add-or">{t('t8th0103')}</p>
      <button
        type="button"
        className="add-panel add-group"
        onClick={onGroupClick}>
        <span className="add-group-copy">
          <h2>{t('t8th0070')}</h2>
          <p>{t('t8th0104')}</p>
        </span>
        <Image
          src={Assets.Icon.arrowUpRightBlack}
          alt=""
          width={12}
          height={12}
        />
      </button>
    </div>
  )
}

function PickFindIdList({
  members,
  onBack,
  onSelect,
}: {
  members: { loginId: string; studentName: string; registDate: string }[]
  onBack: () => void
  onSelect: (member: {
    loginId: string
    studentName: string
    registDate: string
  }) => void
}) {
  // @language 'common'
  const { t } = useTranslation()

  useAccountNavigationBack('pick-find-id-list', onBack)

  /* 
    MEMO :: 현재는 Backend API 응답 결과가 마스크 되어 있음. 
    ID 찾기 결과가 Mask 되므로 선택기능 비활성화, 스타일 클릭안되게 변경, 뒤로 돌아가는 버튼 추가
    RESULT_ID_MASKED 값에 따라 달라지고, API 마스킹 변경되면 해당 변수 지울 것
    원래 기획 의도는 false 값에 해당 함.
  */
  const RESULT_ID_MASKED = true

  return (
    <>
      <div className="body is-add">
        <h1>{t('t8th0454')}</h1>
        <p className="pick-copy">
          {RESULT_ID_MASKED ? t('t8th0453') : t('t8th0455')}
        </p>
        <div className="member-list">
          {members.map((member) => (
            <button
              type="button"
              className="member-item"
              key={`${member.loginId}-${member.registDate}`}
              onClick={RESULT_ID_MASKED ? undefined : () => onSelect(member)}
              style={RESULT_ID_MASKED ? { cursor: 'default' } : undefined}>
              <strong>{member.studentName}</strong>
              <span>{member.loginId}</span>
            </button>
          ))}
        </div>
        {RESULT_ID_MASKED && (
          <button className="add-find" onClick={onBack}>
            {t('t8th0077')}
          </button>
        )}
      </div>
    </>
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
          <Link
            href={`${SITE_PATH.ACCOUNT_8TH.FIND_PASSWORD}?type=id&hint=${loginId}`}>
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

function SignUpView({
  loginId,
  onBack,
}: {
  loginId: string
  onBack: () => void
}) {
  // @language 'common'
  const { t } = useTranslation()

  const router = useRouter()
  useAccountNavigationBack('review-screen', onBack)

  const inputRef = useRef<HTMLInputElement>(null)
  const [newLoginId, setNewLoginId] = useState(loginId)

  const [agreed, setAgreed] = useState(false)
  const [notice, setNotice] = useState('')

  const submit = () => {
    const id = newLoginId.trim()
    if (!id) return
    if (!isValidateEmail(id)) {
      alert(id)
      setNotice(t('t8th0295'))
      return
    }
    if (!agreed) {
      setNotice(t('t8th0456'))
      return
    }
    setNotice('')
    router.push(`${SITE_PATH.ACCOUNT_8TH.SIGNUP}?email=${id}`)
  }

  return (
    <>
      <div className="body is-add">
        <h1>{t('t8th0026')}</h1>
        <section className="add-panel">
          <h2>{t('t8th0457')}</h2>
          <p>{t('t8th0458')}</p>
          <div className="add-field">
            <input
              ref={inputRef}
              type="text"
              value={newLoginId}
              onChange={(event) => setNewLoginId(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') submit()
              }}
              placeholder={t('t8th0030')}
              aria-label={t('t8th0030')}
            />
            <button
              type="button"
              className={`add-go${newLoginId.trim() && agreed ? ' is-ready' : ''}`}
              onClick={submit}
              aria-label={t('t8th0459')}>
              <GoArrow />
            </button>
          </div>
          <label className={`review-consent${agreed ? ' is-on' : ''}`}>
            <input
              type="checkbox"
              checked={agreed}
              onChange={(event) => setAgreed(event.target.checked)}
            />
            <span>{t('t8th0460')}</span>
          </label>
          {notice ? <p className="add-check-msg">{notice}</p> : null}
        </section>
      </div>
    </>
  )
}

function GroupSearch({
  isSignInAvailable,
  onSelectCustomer,
  onCancel,
}: {
  isSignInAvailable: boolean
  onSelectCustomer: (customerId: string) => void
  onCancel: () => void
}) {
  // @language 'common'
  const { t } = useTranslation()

  const handleBack = () => {
    if (!selectCustomer) {
      onCancel()
    } else {
      setSelectCustomer(null)
    }
  }
  useAccountNavigationBack('group-search', handleBack)

  const [selectCustomer, setSelectCustomer] = useState<{
    customerId: string
    name: string
    customerUseCode: string
  } | null>(null)

  const [searchKeyword, setSearchKeyword] = useState<string>('')
  const searchCustomer = useSearchCustomer(
    {
      keyword: searchKeyword,
    },
    {
      enabled: !!searchKeyword,
    },
  )

  const isSearching = searchCustomer.isFetching || searchCustomer.isLoading
  const customers = searchCustomer.data?.customers || []
  const selectedCustomerType = getCustomerType(selectCustomer?.customerUseCode)

  return (
    <>
      {isSignInAvailable && selectCustomer && selectedCustomerType ? (
        selectedCustomerType === 'School' ? (
          <SignInSchool />
        ) : (
          <SignInAcademy />
        )
      ) : (
        <SearchCustomers
          searchKeyword={searchKeyword}
          isSearching={isSearching}
          isEmpty={!isSearching && !!searchKeyword && customers.length === 0}
          customers={customers}
          onSearch={(keyword) => {
            setSearchKeyword(keyword)
          }}
          onSelect={(customer) => {
            onSelectCustomer(customer.customerId)
            setSelectCustomer(customer)
          }}
        />
      )}
    </>
  )
}

function GoArrow() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true">
      <path
        d="M5 12H19"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 5L19 12L12 19"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
