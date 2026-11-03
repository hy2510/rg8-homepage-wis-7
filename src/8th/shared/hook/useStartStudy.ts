'use client'

import { useDevicePlatformInfo } from '@/8th/application/context/ApplicationContext'
import { useStudentEarnReadingUnit } from '@/8th/features/student/service/setting-query'
import { useStudent } from '@/8th/features/student/service/student-query'
import { useAuth } from '@/8th/shared/auth/AuthContext'
import {
  goToDubbing,
  goToLevelTest,
  goToStudy,
  goToWordPractice,
} from '@/8th/shared/utils/study-start-8th'
import SITE_PATH from '@/app/site-path'
import { useLanguagePackContext } from '@/localization/client/LanguagePackContext'
import { usePathname, useSearchParams } from 'next/navigation'

type StudyStartBookInfo = {
  studyId: string
  studentHistoryId: string
  bookCode: string
  levelRoundId: string
  bookLevel: string
}

export default function useStartStudy(
  mode: 'review' | 'quiz',
  target: 'rg' | 'dnf' = 'rg',
) {
  const path = usePathname()
  const searchParams = useSearchParams()

  const { language } = useLanguagePackContext()
  const device = useDevicePlatformInfo()
  const { staff: staffLoginStatus } = useAuth()

  const { data: student } = useStudent()
  const { data: readingUnitData } = useStudentEarnReadingUnit()

  const user: 'staff' | 'student' =
    staffLoginStatus === 'active' ? 'staff' : 'student'

  const onStartStudy = (
    bookInfo: StudyStartBookInfo,
    extra?: {
      isSpeak?: boolean
      isPreview?: boolean
    },
  ) => {
    const readingUnitId =
      readingUnitData?.list?.find(
        (item) =>
          student?.student?.studyReadingUnitId &&
          item.readingUnitId === student?.student?.studyReadingUnitId,
      )?.id || ''

    let refererUrl: string | undefined = undefined
    if (mode === 'quiz') {
      if (target === 'dnf') {
        const paramstr = searchParams.toString()
        if (paramstr) {
          refererUrl = `${path}?${paramstr}`
        } else {
          refererUrl = path
        }
      } else {
        if (path.includes(SITE_PATH.STUDENT_8TH.DAILY_RG)) {
          refererUrl = SITE_PATH.STUDENT_8TH.DAILY_RG
        } else if (bookInfo?.bookCode.startsWith('EB')) {
          const isPK = bookInfo?.bookCode?.startsWith('EB-PK')
          const bookRound = Number(bookInfo?.bookCode?.substring(6))
          if (isPK && bookRound > 0) {
            if (bookRound >= 1 && bookRound <= 26) {
              refererUrl = `${SITE_PATH.STUDENT_8TH.EB_PREK}/alphabet`
            } else if (bookRound >= 27 && bookRound <= 66) {
              refererUrl = `${SITE_PATH.STUDENT_8TH.EB_PREK}/story`
            } else if (bookRound >= 67 && bookRound <= 166) {
              refererUrl = `${SITE_PATH.STUDENT_8TH.EB_PREK}/phonics`
            } else if (bookRound >= 167 && bookRound <= 206) {
              refererUrl = `${SITE_PATH.STUDENT_8TH.EB_PREK}/word`
            } else if (bookRound >= 301 && bookRound <= 326) {
              refererUrl = `${SITE_PATH.STUDENT_8TH.EB_DODOABC}/alphabet`
            } else if (bookRound >= 401 && bookRound <= 427) {
              refererUrl = `${SITE_PATH.STUDENT_8TH.EB_DODOABC}/phonics1`
            } else if (bookRound >= 428 && bookRound <= 450) {
              refererUrl = `${SITE_PATH.STUDENT_8TH.EB_DODOABC}/phonics2`
            } else if (bookRound >= 501 && bookRound <= 530) {
              refererUrl = `${SITE_PATH.STUDENT_8TH.EB_DODOABC}/sightwords1`
            } else if (bookRound >= 531 && bookRound <= 560) {
              refererUrl = `${SITE_PATH.STUDENT_8TH.EB_DODOABC}/sightwords2`
            } else if (bookRound >= 601 && bookRound <= 615) {
              refererUrl = `${SITE_PATH.STUDENT_8TH.EB_DODOABC}/game-alphabet`
            } else if (bookRound >= 616 && bookRound <= 635) {
              refererUrl = `${SITE_PATH.STUDENT_8TH.EB_DODOABC}/game-phonics`
            } else if (bookRound >= 636 && bookRound <= 650) {
              refererUrl = `${SITE_PATH.STUDENT_8TH.EB_DODOABC}/game-sightwords1`
            } else if (bookRound >= 651 && bookRound <= 665) {
              refererUrl = `${SITE_PATH.STUDENT_8TH.EB_DODOABC}/game-sightwords2`
            } else if (bookRound >= 701 && bookRound <= 730) {
              refererUrl = `${SITE_PATH.STUDENT_8TH.EB_DODOABC}/nursery-rhyme`
            } else if (bookRound >= 751 && bookRound <= 776) {
              refererUrl = `${SITE_PATH.STUDENT_8TH.EB_DODOABC}/alphabet-chant`
            } else if (bookRound >= 801 && bookRound <= 850) {
              refererUrl = `${SITE_PATH.STUDENT_8TH.EB_DODOABC}/phonics-chant`
            }
          }
          if (!refererUrl) {
            refererUrl = SITE_PATH.STUDENT_8TH.EB
          }
        } else if (bookInfo?.bookCode.startsWith('PB')) {
          refererUrl = SITE_PATH.STUDENT_8TH.PB
        }
      }
    } else if (mode === 'review') {
      const paramstr = searchParams.toString()
      if (paramstr) {
        refererUrl = `${path}?${paramstr}`
      } else {
        refererUrl = path
      }
    }

    let exitUrl = refererUrl
    if (mode === 'quiz') {
      if (target === 'dnf') {
        exitUrl = SITE_PATH.DODON_FRIENDS.TODO
      } else {
        exitUrl = SITE_PATH.STUDENT_8TH.TODO
      }
    }
    const logoutUrl = '/8th/account'

    // 읽기 전용 모드인 경우, preview 모드(책만 보는 모드)로 변경
    const fixedMode = extra?.isPreview ? 'preview' : mode
    goToStudy({
      studyInfo: bookInfo!,
      mode: fixedMode,
      user,
      isStartSpeak: extra?.isSpeak,
      unit: readingUnitId,
      refererUrl,
      exitUrl,
      logoutUrl,
      language,
      device,
      isNB: target === 'dnf',
    })
  }

  return {
    onStartStudy,
    userType: user,
  }
}

export function useStartDubbing() {
  const path = usePathname()
  const searchParams = useSearchParams()

  const { language } = useLanguagePackContext()
  const device = useDevicePlatformInfo()
  const { staff: staffLoginStatus } = useAuth()

  const { data: student } = useStudent()
  const { data: readingUnitData } = useStudentEarnReadingUnit()

  const user = staffLoginStatus === 'active' ? 'staff' : 'student'

  const onStartDubbing = (dubbingInfo: {
    levelRoundId: string
    studentHistoryId: string
    levelName: string
    soloStudy?: {
      studyId: string
      studentHistoryId: string
      endDate: string
      bookPoint: number
    }
    fullStudy?: {
      studyId: string
      studentHistoryId: string
      endDate: string
      bookPoint: number
    }
  }) => {
    const readingUnitId =
      readingUnitData?.list?.find(
        (item) =>
          student?.student?.studyReadingUnitId &&
          item.readingUnitId === student?.student?.studyReadingUnitId,
      )?.id || ''

    let refererUrl: string | undefined = undefined
    const paramstr = searchParams.toString()
    if (paramstr) {
      refererUrl = `${path}?${paramstr}`
    } else {
      refererUrl = path
    }

    const logoutUrl = '/8th/account'

    goToDubbing({
      levelRoundId: dubbingInfo.levelRoundId,
      studentHistoryId: dubbingInfo.studentHistoryId,
      levelName: dubbingInfo.levelName,
      soloStudy: dubbingInfo.soloStudy,
      fullStudy: dubbingInfo.fullStudy,
      user: user,
      mode: 'quiz',
      unit: readingUnitId,
      language: language,
      device: device,
      refererUrl: refererUrl,
      exitUrl: refererUrl,
      logoutUrl: logoutUrl,
      isNB: true,
    })
  }
  return {
    onStartDubbing,
    userType: user,
  }
}

export function useStartTrial() {
  const { language } = useLanguagePackContext()
  const device = useDevicePlatformInfo()

  const onStartStudy = (studyInfo: {
    studyId: string
    studentHistoryId: string
    bookCode: string
    levelRoundId: string
    bookLevel: string
  }) => {
    const logoutUrl = '/8th/account'

    goToStudy({
      studyInfo: studyInfo,
      mode: 'trial',
      user: 'guest',
      isStartSpeak: false,
      unit: 'dodo',
      refererUrl: SITE_PATH.HOME_8TH.HOME,
      exitUrl: SITE_PATH.HOME_8TH.HOME,
      logoutUrl,
      language,
      device,
    })
  }

  return {
    onStartStudy,
  }
}

export function useStartLevelTest() {
  const { language } = useLanguagePackContext()
  return () =>
    goToLevelTest({ language, exitUrl: SITE_PATH.STUDENT_8TH.ACTIVITY })
}

export function useStartWordPractice() {
  const path = usePathname()
  const searchParams = useSearchParams()

  const { language } = useLanguagePackContext()
  const device = useDevicePlatformInfo()
  const { staff: staffLoginStatus } = useAuth()

  const { data: student } = useStudent()
  const { data: readingUnitData } = useStudentEarnReadingUnit()

  const user = staffLoginStatus === 'active' ? 'staff' : 'student'

  const onStartWordPractice = (wordPracticeInfo: {
    bookType: 'EB' | 'PB'
    level: string
  }) => {
    const readingUnitId =
      readingUnitData?.list?.find(
        (item) =>
          student?.student?.studyReadingUnitId &&
          item.readingUnitId === student?.student?.studyReadingUnitId,
      )?.id || ''

    let refererUrl: string | undefined = undefined
    const paramstr = searchParams.toString()
    if (paramstr) {
      refererUrl = `${path}?${paramstr}`
    } else {
      refererUrl = path
    }

    const logoutUrl = '/8th/account'
    goToWordPractice({
      bookType: wordPracticeInfo.bookType,
      level: wordPracticeInfo.level,
      user: user,
      mode: 'quiz',
      unit: readingUnitId,
      language: language,
      device: device,
      refererUrl: refererUrl,
      exitUrl: refererUrl,
      logoutUrl: logoutUrl,
    })
  }

  return {
    onStartWordPractice,
    userType: user,
  }
}
