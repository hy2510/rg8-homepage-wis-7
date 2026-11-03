'use client'

import { useCustomerConfiguration } from '@/8th/application/context/CustomerContext'
import {
  useStudent,
  useStudentHistoryList,
} from '@/8th/features/student/service/student-query'
import SITE_PATH from '@/app/site-path'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

type Screen =
  | 'Library'
  | 'DailyRG'
  | 'eBook'
  | 'pBook'
  | 'Todo'
  | 'MyLesson'
  | 'D&F_Library'

export default function Page() {
  const router = useRouter()
  const student = useStudent()
  const studentHistory = useStudentHistoryList()
  const { target, accessRG, accessDNF } = useCustomerConfiguration()

  const startScreen = student.data?.student.startScreen
  const primaryStudentHistoryList = studentHistory.data?.list.find(
    (_, idx) => idx === 0,
  )

  let screen: Screen | undefined = undefined
  if (!student.isLoading && !studentHistory.isLoading) {
    if (
      primaryStudentHistoryList &&
      primaryStudentHistoryList.programModelCode === '107003'
    ) {
      screen = 'MyLesson'
    }
    if (!screen) {
      if (accessDNF && !accessRG) {
        screen = 'D&F_Library'
      } else {
        if (target === 'academy') {
          screen = 'Library'
        } else {
          screen = startScreen as Screen
        }
      }
    }
  }

  useEffect(() => {
    if (screen) {
      let screenPath = ''
      if (screen === 'Library') {
        screenPath = SITE_PATH.STUDENT_8TH.LIBRARY
      } else if (screen === 'DailyRG') {
        screenPath = SITE_PATH.STUDENT_8TH.DAILY_RG
      } else if (screen === 'eBook') {
        screenPath = SITE_PATH.STUDENT_8TH.EB
      } else if (screen === 'pBook') {
        screenPath = SITE_PATH.STUDENT_8TH.PB
      } else if (screen === 'Todo') {
        screenPath = SITE_PATH.STUDENT_8TH.TODO
      } else if (screen === 'MyLesson') {
        screenPath = SITE_PATH.DODON_FRIENDS.MY_LESSON
      } else if (screen === 'D&F_Library') {
        screenPath = SITE_PATH.DODON_FRIENDS.LIBRARY
      } else {
        screenPath = SITE_PATH.STUDENT_8TH.DAILY_RG
      }
      router.replace(screenPath)
    }
  }, [screen, router])

  if (student.isLoading || studentHistory.isLoading) {
    return null
  }
  if (student.error || studentHistory.error) {
    if (student.error) {
      return <div>Error: {student.error.message}</div>
    } else if (studentHistory.error) {
      return <div>Error: {studentHistory.error.message}</div>
    }
    return null
  }

  return null
}
