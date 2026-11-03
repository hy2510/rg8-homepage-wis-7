'use client'

import { useIsPhone } from '@/8th/application/context/ScreenModeContext'
import { Assets } from '@/8th/assets/asset-library'
import {
  useCalendarAttend,
  useCalendarStudy,
} from '@/8th/features/achieve/service/achieve-query'
import { useStudentDailyLearning } from '@/8th/features/student/service/learning-query'
import useCalednarDay from '@/8th/shared/hook/useCalendarDay'
import {
  CalendarGridStyle,
  CalendarWeekdayStyle,
} from '@/8th/shared/styled/FeaturesStyled'
import {
  ModalBodyStyle,
  ModalHeaderStyle,
} from '@/8th/shared/styled/SharedStyled'
import { Gap } from '@/8th/shared/ui/Misc'
import { ModalContainer } from '@/8th/shared/ui/Modal'
import SITE_PATH from '@/app/site-path'
import { useTrack } from '@/external/marketing-tracker/component/MarketingTrackerContext'
import useTranslation from '@/localization/client/useTranslations'
import LevelUtils from '@/util/level-utils'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import CalendarEventItem from '../component/CalendarEventItem'
import CalendarHeader from '../component/CalendarHeader'
import CalendarItem from '../component/CalendarItem'

/**
 * 캘린더 모달
 */

const WEEKDAY_LABELS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
interface CalendarModalProps {
  onCloseModal: () => void
}

export default function CalendarModal({ onCloseModal }: CalendarModalProps) {
  // @Language 'common'
  const { t } = useTranslation()

  const isPhone = useIsPhone()
  const maketingEventTracker = useTrack()
  const router = useRouter()

  const [currentDate, setCurrentDate] = useState(new Date()) // 현재 날짜로 초기화

  const handlePrevMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
    )
  }

  const handleNextMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
    )
  }

  const formatMonthYear = (date: Date) => {
    return `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`
  }

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth() + 1

  const studentLearningSetting = useStudentDailyLearning()
  const calendarStudy = useCalendarStudy({ year: year, month: month })
  const calendarAttend = useCalendarAttend({ year: year, month: month })

  const { today: todayDate, calendarDayCells } = useCalednarDay({ year, month })

  const { eventList, totalPoints, totalBooks, totalSuccess, totalAttendance } =
    useMemo(() => {
      const eventList: {
        day: number
        type: 'books' | 'change' | 'levelup'
        value: number | string
        changeType?: string
      }[] = []
      let totalPoints = 0
      let totalBooks = 0
      let totalSuccess = 0
      let totalAttendance = 0

      if (
        !calendarStudy.data ||
        !calendarAttend.data ||
        calendarDayCells.length === 0
      ) {
        return {
          eventList,
          totalPoints,
          totalBooks,
          totalSuccess,
          totalAttendance,
        }
      }
      calendarDayCells.forEach((day) => {
        if (day <= 0) return

        const itemIndex = day - 1
        const studyItem = calendarStudy.data?.list[itemIndex]
        const attendItem = calendarAttend.data?.list[itemIndex]
        if (!studyItem || !attendItem) return

        let eventValue: number | undefined = undefined
        let eventChangeType: string | undefined = undefined

        let beforeItem: typeof studyItem
        if (itemIndex === 0) {
          beforeItem = calendarStudy.data?.beforeSetup as typeof studyItem
        } else {
          beforeItem = calendarStudy.data?.list[
            itemIndex - 1
          ] as typeof studyItem
        }
        if (beforeItem.settingType !== studyItem.settingType) {
          eventValue =
            studyItem.settingType === 'Books'
              ? studyItem.settingBooks
              : studyItem.aimPoint
          eventChangeType = studyItem.settingType as 'Books' | 'Points'
        } else if (
          studyItem.settingType === 'Books' &&
          beforeItem.settingBooks !== studyItem.settingBooks
        ) {
          eventValue = studyItem.settingBooks
          eventChangeType = 'Books'
        } else if (
          studyItem.settingType === 'Points' &&
          beforeItem.aimPoint !== studyItem.aimPoint
        ) {
          eventValue = studyItem.aimPoint
          eventChangeType = 'Points'
        }
        if (eventChangeType) {
          eventList.push({
            day: day,
            type: 'change',
            value: eventValue!,
            changeType: eventChangeType,
          })
        }

        if (attendItem.studyCountHundred) {
          eventList.push({
            day: day,
            type: 'books',
            value: attendItem.studyCountHundred,
          })
        }
        if (attendItem.levelUpLevel) {
          eventList.push({
            day: day,
            type: 'levelup',
            value: LevelUtils.previousLevel(attendItem.levelUpLevel) || '-',
          })
        }
        totalPoints += studyItem.point
        totalBooks += studyItem.books
        totalSuccess += studyItem.successYn ? 1 : 0
        totalAttendance += attendItem.validYn ? 1 : 0
      })
      return {
        eventList,
        totalPoints,
        totalBooks,
        totalSuccess,
        totalAttendance,
      }
    }, [calendarDayCells, calendarStudy.data, calendarAttend.data])

  useEffect(() => {
    if (studentLearningSetting.data) {
      setGoalType(studentLearningSetting.data.settingType as 'Books' | 'Points')
    }
  }, [studentLearningSetting.data])

  const [goalType, setGoalType] = useState<'Books' | 'Points'>('Points')
  let dailyGoalMessage = ''
  if (studentLearningSetting.data) {
    if (studentLearningSetting.data.settingType === 'Books') {
      dailyGoalMessage = ` ·  ${t('t8th181', { num: studentLearningSetting.data.books })}`
    } else if (studentLearningSetting.data.settingType === 'Points') {
      dailyGoalMessage = ` ·  ${t('t8th180', { num: studentLearningSetting.data.point })}`
    }
  }

  useEffect(() => {
    maketingEventTracker.eventAction('캘린더 화면 진입', {
      version: '8th',
    })
  }, [maketingEventTracker])

  const isLoading = calendarStudy.isFetching || calendarAttend.isFetching

  const onCalendarItemClick = (year: number, month: number, day: number) => {
    const date = `${year}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`
    maketingEventTracker.eventAction('캘린더 날짜 클릭', {
      version: '8th',
      selected_date: date,
    })
    router.push(
      `${SITE_PATH.STUDENT_8TH.REVIEW}?startDate=${date}&endDate=${date}`,
    )
    if (onCloseModal) {
      onCloseModal()
    }
  }

  return (
    <ModalContainer>
      <ModalHeaderStyle>
        <div className="calendar-header">
          <button
            className="nav-button prev"
            onClick={handlePrevMonth}
            aria-label={t('t8th177')}>
            <Image
              src={Assets.Icon.chevronLeftGray}
              alt=""
              width={20}
              height={20}
            />
          </button>
          <div className="title calendar-title">
            {formatMonthYear(currentDate)}
          </div>
          <button
            className="nav-button next"
            onClick={handleNextMonth}
            aria-label={t('t8th178')}>
            <Image
              src={Assets.Icon.chevronRightGray}
              alt=""
              width={20}
              height={20}
            />
          </button>
        </div>
        <div className="btn-close" onClick={onCloseModal} />
      </ModalHeaderStyle>
      <ModalBodyStyle calendarBody>
        <CalendarGridStyle>
          <div className="current-daily-goal">
            <span className="text-gray">{t('t8th179')}</span>
            {dailyGoalMessage}
          </div>
          <CalendarHeader
            goalType={goalType}
            onGoalTypeChange={(nextType) => {
              if (nextType !== goalType) {
                setGoalType(nextType)
              }
            }}
            totalPoints={totalPoints}
            totalBooks={totalBooks}
            dailyGoalAchievements={totalSuccess}
            dailyGoalType={goalType}
            totalAttendance={totalAttendance}
          />
          <div className="calendar-week-header">
            {WEEKDAY_LABELS.map((label, index) => (
              <CalendarWeekdayStyle
                key={label}
                variant={index === 0 ? 'sun' : index === 6 ? 'sat' : 'weekday'}>
                {label}
              </CalendarWeekdayStyle>
            ))}
          </div>
          <div className="calendar-body">
            {calendarDayCells.map((cell, index) => {
              const isToday =
                todayDate.year === year &&
                todayDate.month === month &&
                todayDate.day === cell

              let dayNumber: number = cell
              if (cell <= 0) {
                dayNumber = cell * -1
              }

              if (isLoading) {
                return (
                  <CalendarItem
                    key={`${year}_${month}_${index}_${cell}`}
                    dayNumber={dayNumber}
                    isToday={isToday}
                    isCurrentMonth={cell > 0}
                    goalType={goalType}
                    isSuccess={false}
                    earnedPoints={0}
                    booksRead={0}
                    isAttendance={false}
                  />
                )
              } else {
                const regDate = `${year}${month.toString().padStart(2, '0')}${cell.toString().padStart(2, '0')}`
                const attendItem = calendarAttend.data?.list.find(
                  (item) => item.regDate === regDate,
                )
                const studyItem = calendarStudy.data?.list.find(
                  (item) => item.regDate === regDate,
                )

                return (
                  <CalendarItem
                    key={`${year}_${month}_${index}_${cell}`}
                    dayNumber={dayNumber}
                    isToday={isToday}
                    isCurrentMonth={cell > 0}
                    goalType={goalType}
                    isSuccess={studyItem?.successYn || false}
                    earnedPoints={studyItem?.point}
                    booksRead={studyItem?.books}
                    isAttendance={attendItem?.validYn || false}
                    onClick={() => {
                      onCalendarItemClick(year, month, dayNumber)
                    }}
                  />
                )
              }
            })}
          </div>
          <div className="calendar-event-items">
            {!isLoading &&
              eventList.length > 0 &&
              eventList.map((item, i) => {
                let eventType:
                  | 'setGoalChangeBooks'
                  | 'setGoalChangePoint'
                  | 'achieveLevelMaster'
                  | 'achieveExtensiveReading'
                if (item.type === 'change') {
                  if (item.changeType === 'Books') {
                    eventType = 'setGoalChangeBooks'
                  } else if (item.changeType === 'Points') {
                    eventType = 'setGoalChangePoint'
                  }
                } else if (item.type === 'levelup') {
                  eventType = 'achieveLevelMaster'
                } else if (item.type === 'books') {
                  eventType = 'achieveExtensiveReading'
                }

                return (
                  <CalendarEventItem
                    key={`event_${item.day}_${i}`}
                    day={item.day}
                    eventType={eventType!}
                    eventValue={item.value}
                  />
                )
              })}
            {eventList.length === 0 && isPhone && <Gap size={70} />}
          </div>
        </CalendarGridStyle>
      </ModalBodyStyle>
    </ModalContainer>
  )
}
