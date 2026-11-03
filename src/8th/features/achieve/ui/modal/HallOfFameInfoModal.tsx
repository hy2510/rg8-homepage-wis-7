'use client'

import {
  ModalBodyStyle,
  ModalHeaderStyle,
} from '@/8th/shared/styled/SharedStyled'
import IframeResizeble from '@/8th/shared/ui/IframeResizeble'
import { ModalContainer } from '@/8th/shared/ui/Modal'
import useTranslation from '@/localization/client/useTranslations'

export default function HallOfFameInfoModal({
  onCloseModal,
}: {
  onCloseModal?: () => void
}) {
  // @Language 'common'
  const { t, i18n } = useTranslation()
  const language = i18n.language

  return (
    <ModalContainer>
      <ModalHeaderStyle>
        <div className="title">{t('t8th245')}</div>
        <div className="btn-close" onClick={onCloseModal} />
      </ModalHeaderStyle>
      <ModalBodyStyle iframeBody="fit">
        <IframeResizeble
          fitContentHeight
          className="iframe-container"
          src={`/src/html/page-contents/mobile/ranking/ranking_03_scholarship_benefits_pop.html?lang=${language}`}
        />
      </ModalBodyStyle>
    </ModalContainer>
  )
}
