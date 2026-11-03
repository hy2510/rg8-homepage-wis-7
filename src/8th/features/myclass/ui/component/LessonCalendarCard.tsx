'use client'

import LessonCalendarModal from '@/8th/features/myclass/ui/modal/LessonCalendarModal'
import useCalednarDay from '@/8th/shared/hook/useCalendarDay'
import { LessonCalendarCardStyle } from '@/8th/shared/styled/FeaturesStyled'
import {
  CommonTitleStyle,
  WidgetBoxStyle,
} from '@/8th/shared/styled/SharedStyled'
import useTranslation from '@/localization/client/useTranslations'
import { useState } from 'react'

const WEEK_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const

interface LessonCalendarCardProps {
  year: number
  month: number
  dayData: {
    isAssign: boolean
    isComplete: boolean
  }[]
  selectedDay?: number
}

export default function LessonCalendarCard({
  year,
  month,
  dayData,
  selectedDay,
}: LessonCalendarCardProps) {
  // @Language 'common'
  const { t } = useTranslation()

  const [isCalendarModalOpen, setCalendarModalOpen] = useState(false)

  const {
    today: todayDate,
    calendarDayCells,
    getWeekDay,
  } = useCalednarDay({ year, month })
  const targetDate = new Date(year, month - 1, 1)
  const monthLabel = targetDate.toLocaleString('en-US', { month: 'long' })

  let allAssignCount = 0
  let allCompleteCount = 0
  dayData.forEach((item) => {
    allAssignCount += item.isAssign ? 1 : 0
    allCompleteCount += item.isComplete ? 1 : 0
  })

  return (
    <>
      <WidgetBoxStyle height="fit-content" todayGoal={false} getAward={false}>
        <LessonCalendarCardStyle>
          <CommonTitleStyle onClick={() => setCalendarModalOpen(true)}>
            {t('t8thdf009', { month: monthLabel, year })}
          </CommonTitleStyle>

          <div className="calendar-header" role="row">
            {WEEK_LABELS.map((label, i) => (
              <span key={`${label}-${i}`}>{label}</span>
            ))}
          </div>

          <div className="calendar-grid" role="grid">
            {calendarDayCells.map((day, idx) => {
              if (day < 1) {
                return (
                  <div
                    key={`e-${year}-${month}-${idx}`}
                    className="calendar-day-cell calendar-day-cell--empty"
                    aria-hidden
                  />
                )
              }

              const dayValue =
                dayData.length >= day ? dayData[day - 1] : undefined
              const isSunday = getWeekDay(day) === 0
              const isCompleted = dayValue?.isComplete || false
              const isAssigned = !isCompleted && (dayValue?.isAssign || false)
              const isSelected = selectedDay === day
              const isToday =
                todayDate.year === year &&
                todayDate.month === month &&
                todayDate.day === day

              const dayClasses = [
                'calendar-day',
                isToday && 'calendar-day--today',
                isSunday && 'calendar-day--sunday',
                isCompleted && 'calendar-day--completed',
                isAssigned && 'calendar-day--prepared',
                isSelected && 'calendar-day--selected',
              ]
                .filter(Boolean)
                .join(' ')

              return (
                <div
                  key={`d-${year}-${month}-${day}`}
                  className="calendar-day-cell">
                  <div
                    className={dayClasses}
                    role="gridcell"
                    aria-current={isToday ? 'date' : undefined}>
                    {day}
                  </div>
                </div>
              )
            })}
          </div>

          <hr />

          <div className="calendar-legend">
            <div className="calendar-legend-row">
              <div className="left">
                <span
                  className="calendar-legend-swatch calendar-legend-swatch--ready"
                  aria-hidden
                />
                <div className="text">{t('t8thdf016')}</div>
              </div>
              <div className="text-count">{allAssignCount}</div>
            </div>

            <div className="calendar-legend-row">
              <div className="left">
                <span
                  className="calendar-legend-swatch calendar-legend-swatch--done"
                  aria-hidden
                />
                <div className="text">{t('t8thdf017')}</div>
              </div>
              <div className="text-count">{allCompleteCount}</div>
            </div>
          </div>
        </LessonCalendarCardStyle>
      </WidgetBoxStyle>
      {isCalendarModalOpen && (
        <LessonCalendarModal onCloseModal={() => setCalendarModalOpen(false)} />
      )}
    </>
  )
}
