'use client'

import { useDevicePlatform } from '@/8th/application/context/ApplicationContext'
import {
  useCustomerConfiguration,
  useCustomerInfo,
} from '@/8th/application/context/CustomerContext'
import { AvatarExpression } from '@/8th/assets/avatar'
import { useAccountList } from '@/8th/features/account/service/account-query'
import { getTier } from '@/8th/features/board/ui/util/hall-of-fame-util'
import HomeFooter from '@/8th/features/home/ui/component/HomeFooter'
import HomeGNB from '@/8th/features/home/ui/component/HomeGNB'
import {
  useStudentDailyLearning,
  useTodayStudyLearning,
} from '@/8th/features/student/service/learning-query'
import { useStudentAvatarList } from '@/8th/features/student/service/setting-query'
import { useStudent } from '@/8th/features/student/service/student-query'
import { useAuth } from '@/8th/shared/auth/AuthContext'
import { HpBaseStyled } from '@/8th/shared/styled/HpFeaturesStyled'
import { AvatarSyncContextProvider } from '@/8th/shared/ui/Avatar'
import useTranslation from '@/localization/client/useTranslations'
import { ENGLISH, KOREAN, VIETNAMESE } from '@/localization/localize-config'
import { useParams, usePathname } from 'next/navigation'
import React, { useState } from 'react'

export default function HomeLayout({
  children,
}: {
  children?: React.ReactNode
}) {
  // @language 'common'
  const { t } = useTranslation()
  const { accessRG, accessDNF, logo } = useCustomerConfiguration()

  const { student, staff } = useAuth()
  const isStudentLogin = student === 'active'
  const isStaffLogin = staff === 'active'

  const languages = [
    { code: KOREAN, label: '한국어' },
    { code: ENGLISH, label: 'English' },
    { code: VIETNAMESE, label: 'Tiếng Việt' },
  ]

  const hasLoginHistory = useAccountList().length > 0
  const accountLabel = hasLoginHistory ? t('t8th0077') : t('t8th0326')
  const avatar = useStudentAvatarList({
    enabled: isStudentLogin,
  })
  const myAvatar = avatar.data?.list.find(
    (item) => item.avatarId === avatar.data?.avatarId,
  )
  const studentInfo = useStudent({ enabled: isStudentLogin })
  const todayLearning = useTodayStudyLearning({ enabled: isStudentLogin })
  const dailyLearning = useStudentDailyLearning({ enabled: isStudentLogin })

  const medalName = getTier(studentInfo.data?.student?.rgPoint ?? 0)
  const studentName = studentInfo.data?.student?.name

  const { target, country, setting } = useCustomerConfiguration()
  const customer = useCustomerInfo()
  const deviceType = useDevicePlatform()
  const isApp = deviceType === 'Android' || deviceType === 'iOS'
  const footerInfo = {
    customerName: customer?.name || t('t8th0298'),
    address: customer?.address || '',
    tel: customer?.telephone || '',
  }

  const [staffSignature, setStaffSignature] = useState<
    StaffSignature | undefined
  >(undefined)

  const pathname = usePathname()
  const params = useParams<{ locale?: string }>()
  const locale = params.locale || 'ko'

  const handleSelectLanguage = (locale: string) => {
    const parts = pathname.split('/').filter(Boolean)
    if (languages.find((language) => language.code === parts[0])) {
      parts[0] = locale
    } else {
      parts.unshift(locale)
    }
    const query = window.location.search
    window.location.replace(`/${parts.join('/')}${query}`)
  }

  const dailyType = (dailyLearning.data?.settingType || 'Points') as
    | 'Points'
    | 'Books'
  const dailyValue =
    (dailyType === 'Points'
      ? todayLearning.data?.point
      : todayLearning.data?.books) || 0
  const dailyGoalValue =
    (dailyType === 'Points'
      ? dailyLearning.data?.point
      : dailyLearning.data?.books) || 0

  let avatarExpression = AvatarExpression.DEFAULT
  if (dailyValue > 0 && dailyValue >= dailyGoalValue) {
    avatarExpression = AvatarExpression.EXCITED
  } else if (dailyValue <= 0) {
    avatarExpression = AvatarExpression.DISAPPOINTED
  }

  const handleGoAdminConsole = async () => {
    if (!isStaffLogin) return

    if (!staffSignature) {
      const signature = await requestStaffSignature()
      if (signature) {
        setStaffSignature(signature)
        window.location.replace(
          `${signature.host}?code=${signature.code}&i=${signature.i}`,
        )
      }
    }
  }

  return (
    <HpBaseStyled>
      <AvatarSyncContextProvider
        avatarId={myAvatar?.avatarId}
        expression={avatarExpression}>
        <HomeGNB
          isApp={isApp}
          customLogo={logo}
          isLogin={isStudentLogin}
          isStaffLogin={isStaffLogin}
          accountLabel={accountLabel}
          avatarSrc={myAvatar?.imageCircle}
          medalName={medalName}
          studentName={studentName}
          target={target}
          country={country}
          locale={locale}
          languages={languages}
          introUse={{ rg: accessRG, dnf: accessDNF }}
          accessDNF={accessDNF}
          isPaymentable={setting.paymentable}
          onSelectLanguage={handleSelectLanguage}
          onGoAdminConsole={isStaffLogin ? handleGoAdminConsole : undefined}
        />
        <div className="page-slot">{children}</div>
        <HomeFooter
          isLogin={isStudentLogin}
          isApp={isApp}
          info={footerInfo}
          target={target}
          country={country}
        />
      </AvatarSyncContextProvider>
    </HpBaseStyled>
  )
}

type StaffSignature = {
  host: string
  code: string
  i: number
}

async function requestStaffSignature(): Promise<StaffSignature | undefined> {
  let result: StaffSignature | undefined = undefined

  try {
    const dataFetch = await fetch(`/api/staff`, {
      method: 'get',
    })
    if (dataFetch.ok) {
      const data = await dataFetch.json()
      result = data
    }
  } catch (error) {}

  return result
}
