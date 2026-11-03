'use client'

import { useCustomerInfo } from '@/8th/application/context/CustomerContext'
import {
  useChangePasswordWithPin,
  useVerifyRecoveryPin,
} from '@/8th/features/account/service/account-query'
import AccountForceChangePassword from '@/8th/features/account/ui/component/AccountForceChangePassword'
import AccountSignInInput from '@/8th/features/account/ui/component/AccountSignInInput'
import InputRecoveryPIN from '@/8th/features/account/ui/component/InputRecoveryPIN'
import SITE_PATH from '@/app/site-path'
import useTranslation from '@/localization/client/useTranslations'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'

export default function FindPasswordKrSchoolAcademy() {
  // @language 'common'
  const { t } = useTranslation()

  const router = useRouter()

  const customer = useCustomerInfo()
  const customerId = customer.customerId
  const customerType = customer.customerUse
  const country = customer.countryCode.toLocaleLowerCase()

  const hasAllowed =
    !!customerId && customerType.toLowerCase() !== 'private' && country === 'kr'

  const [view, setView] = useState<'validate' | 'change-password'>('validate')
  const [identifyInfo, setIdentifyInfo] = useState<
    { loginId: string; pin: string } | undefined
  >(undefined)

  if (!hasAllowed) {
    return (
      <div className="body is-add">
        <h1>{t('t8th0496')}</h1>
        <Link href={SITE_PATH.ACCOUNT_8TH.SIGNIN}>
          <button type="button" className="enter-find">
            {t('t8th0042')}
          </button>
        </Link>
      </div>
    )
  }

  return (
    <>
      {view === 'validate' && (
        <RecoveryCodeCheck
          onSuccessPinCheck={(loginId, pin) => {
            setIdentifyInfo({ loginId, pin })
            setView('change-password')
          }}
        />
      )}
      {view === 'change-password' && !!identifyInfo && (
        <ChangePassword
          identifyInfo={identifyInfo!}
          onBack={() => setView('validate')}
          onComplete={() => {
            router.replace(SITE_PATH.ACCOUNT_8TH.SIGNIN)
          }}
        />
      )}
    </>
  )
}

function RecoveryCodeCheck({
  onSuccessPinCheck,
}: {
  onSuccessPinCheck: (loginId: string, pin: string) => void
}) {
  // @language 'common'
  const { t } = useTranslation()

  const router = useRouter()

  const { mutate: verifyRecoveryPin } = useVerifyRecoveryPin({
    onSuccess: (data, variables) => {
      onSuccessPinCheck(variables.id, variables.pin)
    },
    onError: (error) => {
      const code = (error as unknown as { code: number }).code
      if (code === 1002 || code === 1003) {
        alert(t('t8th0493'))
      } else if (code === 1004) {
        alert(t('t8th0494'))
        setPin('')
      } else if (code === 1005) {
        alert(t('t8th0495', { num: 1 }))
      } else {
        alert(t('t8th107'))
      }
    },
  })

  const userIdRef = useRef<HTMLInputElement>(null)
  const [userId, setUserId] = useState<string>('')
  const [pin, setPin] = useState('')

  return (
    <div className="body is-add">
      <h1>{t('t8th0057')}</h1>
      <section className="add-panel recovery-panel">
        <div className="recovery-form">
          <h2>{t('t8th0479')}</h2>
          <p>{t('t8th0480')}</p>
          <AccountSignInInput
            type="text"
            placeholder={t('t8th0481')}
            value={userId}
            autoComplete="off"
            onChange={(value) => setUserId(value)}
            ref={userIdRef}
          />
          <InputRecoveryPIN
            label={t('t8th0475', { num: 4 })}
            disabled={userId.length === 0}
            length={4}
            value={pin}
            onChange={setPin}
            enableResetButton
          />
          <button
            type="button"
            className="recovery-submit"
            disabled={pin.length !== 4 || userId.length === 0}
            onClick={() => {
              verifyRecoveryPin({ id: userId, pin })
            }}>
            {t('t8th0476')}
          </button>
          <p className="recovery-help">{t('t8th0482')}</p>
        </div>
      </section>

      <button type="button" className="add-find" onClick={() => router.back()}>
        {t('t8th0042')}
      </button>
    </div>
  )
}

function ChangePassword({
  identifyInfo,
  onBack,
  onComplete,
}: {
  identifyInfo: { loginId: string; pin: string }
  onBack: () => void
  onComplete: () => void
}) {
  // @language 'common'
  const { t } = useTranslation()

  const { mutate: changePassword } = useChangePasswordWithPin({
    onSuccess: (data) => {
      if (data.success) {
        alert(t('t8th114'))
        onComplete()
      } else {
        alert(t('t8th107'))
      }
    },
    onError: (error) => {
      const code = (error as unknown as { code: number }).code
      if (code === 1004) {
        alert(t('t8th0494'))
        onBack()
      } else if (code === 1005) {
        alert(t('t8th0495', { num: 1 }))
        onComplete()
      } else {
        alert(t('t8th107'))
      }
    },
  })

  if (true) {
    return (
      <AccountForceChangePassword
        target={'kr'}
        onChangePassword={(password) => {
          changePassword({
            ...identifyInfo,
            newPassword: password,
          })
        }}
      />
    )
  }
  return (
    <div className="body is-add">
      <h1>{t('t8th0057')}</h1>
      <section className="add-panel recovery-panel">
        <div className="recovery-form">
          <h2>{t('t8th0479')}</h2>
          <p>{t('t8th0480')}</p>

          <p className="recovery-help">{t('t8th0482')}</p>
        </div>
      </section>

      <button type="button" className="add-find" onClick={onBack}>
        {t('t8th0042')}
      </button>
    </div>
  )
}
