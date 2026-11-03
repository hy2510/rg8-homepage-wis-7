import { CalendarItemDnfStyle } from '@/8th/shared/styled/FeaturesStyled'

interface LessonCalendarItemProps {
  dayNumber: number
  isToday: boolean
  isCurrentMonth: boolean
  isAllComplete?: boolean
  isAssigned?: boolean
  label?: string
  completeCount?: number
  lessonCount?: number
  onClick?: () => void
}

export default function LessonCalendarItem({
  dayNumber,
  isToday,
  isCurrentMonth,
  isAllComplete,
  label,
  completeCount,
  lessonCount,
  isAssigned,
  onClick,
}: LessonCalendarItemProps) {
  const isClickable = lessonCount && lessonCount > 0

  return (
    <CalendarItemDnfStyle
      className={`calendar-item ${!isCurrentMonth ? 'other-month' : ''} ${isAllComplete ? 'completed-bg' : ''} ${isAssigned ? 'assigned-bg' : ''}`}
      onClick={isClickable ? onClick : undefined}>
      <div
        className={`day-number ${isToday ? 'today' : ''} ${
          !isCurrentMonth ? 'other-month' : ''
        } ${isAllComplete ? 'completed' : ''} ${isAssigned ? 'assigned' : ''}`}>
        {dayNumber > 0 ? dayNumber : ''}
      </div>
      {isClickable && (
        <div className="content">
          <div className={`lesson-title ${isAllComplete ? 'completed' : ''}`}>
            {label || ' '}
          </div>
          <div
            className={`lesson-progress ${isAllComplete ? 'completed' : ''}`}>
            {lessonCount && lessonCount > 0
              ? `${completeCount || 0}/${lessonCount}`
              : ' '}
          </div>
        </div>
      )}
    </CalendarItemDnfStyle>
  )
}
