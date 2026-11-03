import { Assets } from '@/8th/assets/asset-library'
import { PracticeHeaderStyle } from '@/8th/shared/styled/FeaturesStyled'
import { StartButton } from '@/8th/shared/ui/Buttons'
import useTranslation from '@/localization/client/useTranslations'
import Image from 'next/image'

export default function PracticeHeader({
  startLevel,
  bookType,
  startDisabled = false,
  onStartClick,
}: {
  startLevel?: string
  bookType?: 'eb' | 'pb'
  startDisabled?: boolean
  onStartClick?: () => void
}) {
  //@language 'common'
  const { t } = useTranslation()

  const bookTypeLabel = bookType === 'pb' ? 'P-Book' : bookType === 'eb' ? 'E-Book' : undefined
  const levelLabel =
    startLevel && bookTypeLabel
      ? `(${bookTypeLabel} · ${startLevel})`
      : startLevel
  const startLabel = levelLabel
    ? t('t8th368', { level: levelLabel })
    : t('t8th368')

  return (
    <PracticeHeaderStyle>
      <div className="practice-header-text">
        <p className="practice-header-title">{t('t8th366')}</p>
        <p className="practice-header-subtitle">{t('t8th367')}</p>
        <StartButton
          label={startLabel}
          onClick={onStartClick}
          className="animated practice-start-button"
        />
      </div>
      <div className="practice-header-image">
        <Image
          src={Assets.Image.WordPracticeDodo}
          alt=""
          width={140}
          height={140}
          priority
        />
      </div>
    </PracticeHeaderStyle>
  )
}
