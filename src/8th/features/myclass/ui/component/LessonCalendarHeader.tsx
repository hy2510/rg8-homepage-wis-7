import { CalendarHeaderStyle } from '@/8th/shared/styled/FeaturesStyled'
import useTranslation from '@/localization/client/useTranslations'

interface LessonCalendarHeaderProps {
  assignBookCount: number
  lessonDayCount: number
  completeDayCount: number
}

/**
 * 도도앤프렌즈 전용 캘린더 헤더
 */
export default function LessonCalendarHeader({
  assignBookCount,
  lessonDayCount,
  completeDayCount,
}: LessonCalendarHeaderProps) {
  // @Language 'common'
  const { t } = useTranslation()

  return (
    <CalendarHeaderStyle>
      <div className="left-group">
        <div className="comment">
          <span className="title">{t('t8thdf018')}</span>
          <span className="value">{assignBookCount}</span>
        </div>
      </div>
      <div className="right-group">
        <div className="comment">
          <span className="icon blue green" />
          <span className="title">{t('t8thdf016')}</span>
          <span className="value black">{lessonDayCount}</span>
        </div>
        <div className="comment">
          <span className="icon yellow" />
          <span className="title">{t('t8thdf017')}</span>
          <span className="value black">{completeDayCount}</span>
        </div>
      </div>
    </CalendarHeaderStyle>
  )
}
