'use client'

import {
  ModalBodyStyle,
  ModalHeaderStyle,
} from '@/8th/shared/styled/SharedStyled'
import IframeResizeble from '@/8th/shared/ui/IframeResizeble'
import { ModalContainer } from '@/8th/shared/ui/Modal'
import useTranslation from '@/localization/client/useTranslations'

export default function PolicyModal({
  title,
  src,
  onClose,
}: {
  title: string
  src: string
  onClose: () => void
}) {
  // @Language 'common'
  const { t, i18n } = useTranslation()
  const language = i18n.language

  return (
    <ModalContainer>
      <ModalHeaderStyle>
        <div className="title">{title}</div>
        <div className="btn-close" onClick={onClose} />
      </ModalHeaderStyle>
      <ModalBodyStyle iframeBody="fit">
        <IframeResizeble
          fitContentHeight
          className="iframe-container"
          src={src}
        />
      </ModalBodyStyle>
      {/* <BoxStyle
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100px">
        <button onClick={onClose}>동의합니다.</button>
      </BoxStyle> */}
    </ModalContainer>
  )
}
