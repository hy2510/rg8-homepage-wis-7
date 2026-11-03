import { PracticeChartSectionStyle } from '@/8th/shared/styled/FeaturesStyled'
import useTranslation from '@/localization/client/useTranslations'
import { WordStatus, WordStatusColor } from '../wordStatusData'

export default function PracticeDonutChart({
  level,
  bookType,
  summaries,
  totalWords,
}: {
  level: string
  bookType: string
  summaries: {
    status: WordStatus
    count: number
  }[]
  totalWords: number
}) {
  //@language 'common'
  const { t } = useTranslation()

  const bookTypeLabel = bookType === 'eb' ? t('t8th325') : t('t8th326')

  const segments = summaries.map((item) => ({
    value: item.count,
    color: WordStatusColor[item.status],
  }))

  const getWordCountLabel = (wordStatus: WordStatus) => {
    switch (wordStatus) {
      case 'weak':
        return t('t8th361')
      case 'normal':
        return t('t8th362')
      case 'strong':
        return t('t8th363')
      case 'perfect':
        return t('t8th364')
      default:
        return ''
    }
  }

  return (
    <PracticeChartSectionStyle>
      <div className="donut-wrap">
        <MultiSegmentDonut segments={segments} />
        <div className="donut-center">
          <span className="level">{level}</span>
          <span className="book-type">{bookTypeLabel}</span>
          <span className="word-count">
            {`+ ${totalWords} ${t('t8th365')}`}
          </span>
        </div>
      </div>
      <div className="legend">
        {summaries.map((item) => (
          <div key={item.status} className="legend-item">
            <span
              className="dot"
              style={{
                backgroundColor: WordStatusColor[item.status],
              }}
            />
            <span className="label">
              {`${getWordCountLabel(item.status)} (${item.count})`}
            </span>
          </div>
        ))}
      </div>
    </PracticeChartSectionStyle>
  )
}

function MultiSegmentDonut({
  segments,
  size = 220,
  strokeWidth = 28,
}: {
  segments: { value: number; color: string }[]
  size?: number
  strokeWidth?: number
}) {
  const radius = (size - strokeWidth) / 2
  const center = size / 2
  const circumference = 2 * Math.PI * radius
  const total = segments.reduce((sum, segment) => sum + segment.value, 0)
  let accumulatedAngle = 0

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="#E9EDF3"
        strokeWidth={strokeWidth}
      />
      {segments.map((segment, index) => {
        if (segment.value <= 0 || total <= 0) {
          return null
        }

        const ratio = segment.value / total
        const dash = ratio * circumference
        const rotation = -90 + accumulatedAngle
        accumulatedAngle += ratio * 360

        return (
          <circle
            key={`${segment.color}-${index}`}
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={segment.color}
            strokeWidth={strokeWidth}
            strokeLinecap="butt"
            strokeDasharray={`${dash} ${circumference}`}
            transform={`rotate(${rotation} ${center} ${center})`}
          />
        )
      })}
      <circle
        cx={center}
        cy={center}
        r={radius - strokeWidth / 2 - 4}
        fill="#fff"
      />
    </svg>
  )
}
