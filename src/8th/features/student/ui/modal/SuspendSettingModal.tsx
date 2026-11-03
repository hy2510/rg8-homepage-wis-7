'use client'

import { useAdjustChange } from '@/8th/features/payment/service/payment-query'
import {
  ModalBodyStyle,
  ModalHeaderStyle,
} from '@/8th/shared/styled/SharedStyled'
import { BoxStyle, TextStyle } from '@/8th/shared/ui/Misc'
import { ModalContainer } from '@/8th/shared/ui/Modal'
import useTranslation from '@/localization/client/useTranslations'

export default function SuspendSettingModal({
  currentPause,
  onClickClose,
}: {
  currentPause: boolean
  onClickClose?: () => void
}) {
  if (currentPause) {
    return <SuspendDoRelease onCancel={onClickClose} />
  } else {
    return <SuspendDoPause onCancel={onClickClose} />
  }
}

function SuspendDoPause({ onCancel }: { onCancel?: () => void }) {
  // @language 'common'
  const { t } = useTranslation()

  const { mutate: adjustChange, isPending: isAdjustPending } = useAdjustChange({
    onSuccess: (data, variables) => {
      if (data.success) {
        alert(t('t8th144'))
        if (onCancel) {
          onCancel()
        }
      }
    },
  })

  const onChangeAdjust = () => {
    if (isAdjustPending) {
      return
    }
    adjustChange({
      command: 'pause',
    })
  }

  return (
    <ModalContainer>
      <ModalHeaderStyle>
        <div className="title">{t('t8th151')}</div>
        <div className="btn-close" onClick={onCancel} />
      </ModalHeaderStyle>
      <ModalBodyStyle>
        <BoxStyle display="flex" flexWrap="wrap" gap={4}>
          <TextStyle
            type="span"
            fontSize="medium"
            fontColor="primary"
            fontFamily="sans">
            {t('t8th153')}
          </TextStyle>
        </BoxStyle>

        <BoxStyle
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          gap={20}
          margin="40px 0 0 0">
          <div />
          <BoxStyle display="flex" gap={10}>
            <TextStyle
              onClick={onCancel}
              fontFamily="sans"
              fontSize="large"
              fontWeight="bold"
              fontColor="var(--line-color-light-blue)"
              margin="0 10px 0 0">
              {t('t8th300')}
            </TextStyle>
            <TextStyle
              onClick={onChangeAdjust}
              fontFamily="sans"
              fontSize="large"
              fontWeight="bold"
              fontColor="var(--color-gray-strong)"
              margin="0 10px 0 0">
              {t('t8th299')}
            </TextStyle>
          </BoxStyle>
        </BoxStyle>
      </ModalBodyStyle>
    </ModalContainer>
  )
}

function SuspendDoRelease({ onCancel }: { onCancel?: () => void }) {
  // @language 'common'
  const { t } = useTranslation()

  const { mutate: adjustChange, isPending: isAdjustPending } = useAdjustChange({
    onSuccess: (data, variables) => {
      if (data.success) {
        alert(t('t8th145'))
        if (onCancel) {
          onCancel()
        }
      }
    },
  })

  const onChangeAdjust = () => {
    if (isAdjustPending) {
      return
    }
    adjustChange({
      command: 'release',
    })
  }

  return (
    <ModalContainer>
      <ModalHeaderStyle>
        <div className="title">{t('t8th150')}</div>
        <div className="btn-close" onClick={onCancel} />
      </ModalHeaderStyle>
      <ModalBodyStyle>
        <BoxStyle display="flex" flexWrap="wrap" gap={4}>
          <TextStyle
            type="span"
            fontSize="medium"
            fontColor="primary"
            fontFamily="sans">
            {t('t8th152')}
          </TextStyle>
        </BoxStyle>

        <BoxStyle
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          gap={20}
          margin="40px 0 0 0">
          <div />
          <BoxStyle display="flex" gap={10}>
            <TextStyle
              onClick={onCancel}
              fontFamily="sans"
              fontSize="large"
              fontWeight="bold"
              fontColor="var(--line-color-light-blue)"
              margin="0 10px 0 0">
              {t('t8th300')}
            </TextStyle>
            <TextStyle
              onClick={onChangeAdjust}
              fontFamily="sans"
              fontSize="large"
              fontWeight="bold"
              fontColor="var(--color-gray-strong)"
              margin="0 10px 0 0">
              {t('t8th299')}
            </TextStyle>
          </BoxStyle>
        </BoxStyle>
      </ModalBodyStyle>
    </ModalContainer>
  )
}
