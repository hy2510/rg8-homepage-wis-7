'use client'

import { useDevicePlatform } from '@/8th/application/context/ApplicationContext'
import {
  useCustomerConfiguration,
  useCustomerInfo,
} from '@/8th/application/context/CustomerContext'
import { useAccountList } from '@/8th/features/account/service/account-query'
import { useHome } from '@/8th/features/board/service/board-query'
import ExperienceVideos from '@/8th/features/home/ui/component/ExperienceVideos'
import FloatingMenuKR from '@/8th/features/home/ui/component/FloatingMenuKR'
import FloatingMenuVN from '@/8th/features/home/ui/component/FloatingMenuVN'
import FooterEnterance from '@/8th/features/home/ui/component/FooterEnterance'
import HeaderEnterance from '@/8th/features/home/ui/component/HeaderEnterance'
import HomeBanner from '@/8th/features/home/ui/component/HomeBanner'
import LevelContents from '@/8th/features/home/ui/component/LevelContents'
import Partners from '@/8th/features/home/ui/component/Partners'
import UrgentNoticeBar from '@/8th/features/home/ui/component/UrgentNoticeBar'
import { useStudent } from '@/8th/features/student/service/student-query'
import { useAuth } from '@/8th/shared/auth/AuthContext'
import { HpMainStyled } from '@/8th/shared/styled/HpFeaturesStyled'
import { Gap } from '@/8th/shared/ui/Misc'
import SITE_PATH from '@/app/site-path'
import useTranslation from '@/localization/client/useTranslations'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import IntroduceDNF from './IntroduceDNF'

export default function IntroduceRG() {
  const { accessRG, accessDNF } = useCustomerConfiguration()
  const router = useRouter()

  useEffect(() => {
    if (!accessRG && accessDNF) {
      router.replace(SITE_PATH.HOME_8TH.HOME_DNF)
    }
  }, [router, accessRG, accessDNF])

  if (!accessRG) {
    return <IntroduceDNF />
  }
  return <IntroduceRGView />
}

function IntroduceRGView() {
  // @language 'common'
  const { t } = useTranslation()

  const { target, country } = useCustomerConfiguration()
  const device = useDevicePlatform()

  const router = useRouter()
  const { student } = useAuth()
  const isStudentLogin = student === 'active'

  const { customerId, name: customerName, customerUse } = useCustomerInfo()
  const studentInfo = useStudent()

  const hasLoginHistory = useAccountList().length > 0
  const { data: mainData } = useHome({
    template: target,
    platform: device,
    country: country,
  })

  let isShowTrialMessage = false
  let startButtonLabel = t('t8th0325')
  if (isStudentLogin) {
    startButtonLabel = t('t8th0325')
  } else if (target === 'private') {
    if (hasLoginHistory) {
      startButtonLabel = t('t8th0075')
    } else {
      isShowTrialMessage = true
      startButtonLabel = t('t8th0348')
    }
  } else {
    startButtonLabel = t('t8th0075')
  }

  const urgentNotice = mainData?.important || undefined
  const experienceVideos = mainData?.experienceVideos ?? []
  const partners = mainData?.partners ?? []
  const banners = (mainData?.slide ?? []).filter(
    (item: { image: string; link: string; self: boolean }) =>
      item?.image?.trim(),
  )
  const floatingMenuItems: { action: string; icon: string; name: string }[] =
    mainData?.floatingmenu?.map((menu) => {
      let name = 'menu'
      if (menu.action.includes('kakao.com')) {
        name = '카카오 상담'
      } else if (menu.action.includes('@click#chatbot')) {
        name = '챗봇 상담'
      } else {
        name = '외부 링크'
      }
      return { ...menu, name }
    }) ?? []

  const chatbotUser:
    | { loginId: string; studentId: string; studentName: string }
    | undefined = studentInfo.data?.student
    ? {
        loginId: studentInfo.data.student.loginId,
        studentId: studentInfo.data.student.studentId,
        studentName: studentInfo.data.student.name,
      }
    : undefined
  return (
    <HpMainStyled>
      {urgentNotice && <UrgentNoticeBar notice={urgentNotice} />}
      <HeaderEnterance
        startButtonLabel={startButtonLabel}
        onStartButtonClick={() => {
          router.push(SITE_PATH.ACCOUNT_8TH.HOME)
        }}
      />
      <Gap size={40} />
      {banners && <HomeBanner items={banners} />}
      <LevelContents
        isLogin={isStudentLogin}
        basePath={SITE_PATH.ACCOUNT_8TH.TRIAL}
      />
      <Gap size={80} />
      {experienceVideos && <ExperienceVideos videos={experienceVideos} />}
      {partners && <Partners partners={partners} />}
      <FooterEnterance
        showTrialMessage={isShowTrialMessage}
        startButtonLabel={startButtonLabel}
        onStartButtonClick={() => {
          router.push(SITE_PATH.ACCOUNT_8TH.HOME)
        }}
      />
      {country === 'kr' && (
        <FloatingMenuKR
          items={floatingMenuItems}
          customer={{ customerId, customerName, customerUse }}
          user={chatbotUser}
        />
      )}
      {country === 'vn' && target === 'private' && (
        <FloatingMenuVN targetScreen="vn-home" />
      )}
    </HpMainStyled>
  )
}
