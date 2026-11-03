import { Assets } from '@/8th/assets/asset-library'
import { MyLessonHeaderStyle } from '@/8th/shared/styled/FeaturesStyled'
import useTranslation from '@/localization/client/useTranslations'
import Image from 'next/image'

export interface MyLessonHeaderProps {
  date: Date
  onCalendarButtonClick?: () => void
}

export default function MyLessonHeader({
  date,
  onCalendarButtonClick,
}: MyLessonHeaderProps) {
  // @Language 'common'
  const { t } = useTranslation()

  const labelDate = date || new Date()
  const monthLabel = labelDate.toLocaleString('en-US', { month: 'long' })
  const yearLabel = labelDate.getFullYear()

  return (
    <MyLessonHeaderStyle>
      <div
        className="calendar-button"
        role={onCalendarButtonClick ? 'button' : undefined}
        tabIndex={onCalendarButtonClick ? 0 : undefined}
        aria-haspopup={onCalendarButtonClick ? 'dialog' : undefined}
        onClick={onCalendarButtonClick}
        onKeyDown={(e) => {
          if (!onCalendarButtonClick || (e.key !== 'Enter' && e.key !== ' ')) {
            return
          }
          e.preventDefault()
          onCalendarButtonClick()
        }}>
        {/* <Image
          src={Assets.Icon.calendarSymbol}
          alt="calendar"
          width={32}
          height={32}
        /> */}
        <div className="calendar-button-text">
          <span>
            {t('t8thdf009', {
              year: yearLabel,
              month: monthLabel,
            })}
          </span>
          <Image
            src={Assets.Icon.chevronDownGray}
            alt=""
            width={16}
            height={16}
          />
        </div>
      </div>
    </MyLessonHeaderStyle>
  )
}
