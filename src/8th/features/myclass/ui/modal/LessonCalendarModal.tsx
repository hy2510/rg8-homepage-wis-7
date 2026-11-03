'use client'

import { Assets } from '@/8th/assets/asset-library'
import LessonCalendarHeader from '@/8th/features/myclass/ui/component/LessonCalendarHeader'
import LessonCalendarItem from '@/8th/features/myclass/ui/component/LessonCalendarItem'
import { useStudentHistoryList } from '@/8th/features/student/service/student-query'
import useCalednarDay from '@/8th/shared/hook/useCalendarDay'
import {
  CalendarGridDnfStyle,
  CalendarWeekdayStyle,
} from '@/8th/shared/styled/FeaturesStyled'
import {
  ModalBodyStyle,
  ModalHeaderStyle,
} from '@/8th/shared/styled/SharedStyled'
import { ModalContainer } from '@/8th/shared/ui/Modal'
import SITE_PATH from '@/app/site-path'
import { useTrack } from '@/external/marketing-tracker/component/MarketingTrackerContext'
import useTranslation from '@/localization/client/useTranslations'
import DateUtils from '@/util/date-utils'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useMonthStatus } from '../../service/myclass-query'

/**
 * 도도앤프렌즈 전용 캘린더 모달 (기존 CalendarModal 복사)
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

interface LessonCalendarModalProps {
  onCloseModal: () => void
}

export default function LessonCalendarModal({
  onCloseModal,
}: LessonCalendarModalProps) {
  // @Language 'common'
  const { t } = useTranslation()

  const maketingEventTracker = useTrack()
  const router = useRouter()

  const [currentDate, setCurrentDate] = useState(new Date())
  const monthDate = DateUtils.toStringDate(currentDate, {
    divide: '',
    digitfix: true,
  })
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth() + 1

  const studentHistory = useStudentHistoryList()
  const defaultStudentHistoryId =
    studentHistory.data?.list && studentHistory.data?.list.length > 0
      ? studentHistory.data.list[0].studentHistoryId
      : undefined
  const defaultClassId =
    studentHistory.data?.list && studentHistory.data?.list.length > 0
      ? studentHistory.data.list[0].classId
      : undefined

  const isStudentHistoryActive = !!defaultClassId && !!defaultStudentHistoryId

  const { data, isLoading } = useMonthStatus(
    {
      classId: defaultClassId!,
      studentHistoryId: defaultStudentHistoryId!,
      startDate: monthDate,
      endDate: monthDate,
    },
    {
      enabled: isStudentHistoryActive,
    },
  )

  const { today: todayDate, calendarDayCells } = useCalednarDay({ year, month })

  useEffect(() => {
    maketingEventTracker.eventAction('캘린더 화면 진입', {
      version: '8th',
      product: 'dodonfriends',
    })
  }, [maketingEventTracker])

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

  const onCalendarItemClick = (
    unit: number,
    year: number,
    month: number,
    day: number,
  ) => {
    const sectionTitle = unit > 0 ? `Day ${unit}` : ''
    const date = `${year}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`
    maketingEventTracker.eventAction('캘린더 날짜 클릭', {
      version: '8th',
      product: 'dodonfriends',
      selected_date: date,
    })

    const params = `title=${sectionTitle}&date=${date}`
    router.push(`${SITE_PATH.DODON_FRIENDS.MY_LESSON_DAY}?${params}`)
    if (onCloseModal) {
      onCloseModal()
    }
  }

  let lessonAllBooks = 0
  data?.day?.forEach((item) => (lessonAllBooks += item.unitCount))
  const lessonDayCount = data?.day?.filter((item) => item.unit > 0).length ?? 0
  const lessonCompleteDayCount =
    data?.day?.filter(
      (item) => item.unit > 0 && item.unitPassCount === item.unitCount,
    ).length ?? 0

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
        <CalendarGridDnfStyle>
          <LessonCalendarHeader
            assignBookCount={lessonAllBooks}
            lessonDayCount={lessonDayCount}
            completeDayCount={lessonCompleteDayCount}
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
            {calendarDayCells.map((day, index) => {
              const isToday =
                todayDate.year === year &&
                todayDate.month === month &&
                todayDate.day === day

              let dayNumber: number = day
              if (day < 1) {
                dayNumber = day * -1
              }

              if (isLoading) {
                return (
                  <LessonCalendarItem
                    key={`${year}_${month}_${index}_${day}`}
                    dayNumber={dayNumber}
                    isToday={isToday}
                    isCurrentMonth={day > 0}
                  />
                )
              } else {
                const targetDate = `${year}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`
                const lessonItem = data?.day.find(
                  (item) => item.weekDays === targetDate,
                )
                const isAssignedLesson = !!(
                  lessonItem &&
                  !!lessonItem.unit &&
                  !!lessonItem.unitCount
                )
                const label = isAssignedLesson
                  ? `${t('t8thdf004', { day: lessonItem?.unit })}`
                  : ''
                const lessonCount = isAssignedLesson
                  ? lessonItem?.unitCount
                  : undefined
                const completeCount = isAssignedLesson
                  ? lessonItem?.unitPassCount
                  : undefined
                const isDayComplete =
                  isAssignedLesson && lessonCount === completeCount

                return (
                  <LessonCalendarItem
                    key={`${year}_${month}_${index}_${day}`}
                    dayNumber={dayNumber}
                    isToday={isToday}
                    isCurrentMonth={day > 0}
                    label={label}
                    completeCount={completeCount}
                    lessonCount={lessonCount}
                    isAllComplete={isDayComplete}
                    isAssigned={isAssignedLesson}
                    onClick={() => {
                      onCalendarItemClick(
                        lessonItem?.unit ?? 0,
                        year,
                        month,
                        dayNumber,
                      )
                    }}
                  />
                )
              }
            })}
          </div>
        </CalendarGridDnfStyle>
      </ModalBodyStyle>
    </ModalContainer>
  )
}
