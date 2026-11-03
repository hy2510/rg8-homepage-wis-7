'use client'

import {
  useCustomerConfiguration,
  useCustomerInfo,
} from '@/8th/application/context/CustomerContext'
import { useUpdateStudentLocalConfig } from '@/8th/features/student/service/setting-query'
import { useStudent } from '@/8th/features/student/service/student-query'
import {
  ModalBodyStyle,
  ModalHeaderStyle,
  ModalIframeStyle,
} from '@/8th/shared/styled/SharedStyled'
import { BoxStyle, TextStyle } from '@/8th/shared/ui/Misc'
import { ModalContainer } from '@/8th/shared/ui/Modal'
import SITE_PATH from '@/app/site-path'
import useTranslation from '@/localization/client/useTranslations'

export default function AppUserGuideModal({
  isInitialPopup,
  onCloseModal,
}: {
  isInitialPopup?: boolean
  onCloseModal: () => void
}) {
  // @Language 'common'
  const { t, i18n } = useTranslation()
  const language = i18n.language

  const { target } = useCustomerConfiguration()
  const { customerId } = useCustomerInfo()
  const student = useStudent()
  const studentId = student.data?.student?.studentId || ''
  const updateUserConfig = useUpdateStudentLocalConfig()

  const onClickDoNotAutoShow = (isDoNotAutoShow: boolean) => {
    updateUserConfig({
      customerId: customerId,
      studentId: studentId,
      appUserGuideAutoShow: !isDoNotAutoShow,
    })
    onCloseModal()
  }

  return (
    <ModalContainer heightMode="fill">
      <ModalHeaderStyle>
        <div className="title">{t('t8th318')}</div>
        <div className="btn-close" onClick={onCloseModal} />
      </ModalHeaderStyle>
      <ModalBodyStyle iframeBody>
        <ModalIframeStyle
          src={`/src/html/8th-user-guide/index.html?lang=${language}${target === 'academy' ? '&templateType=academy' : ''}`}
        />
        <BoxStyle
          display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
          height="48px"
          flexShrink={0}
          borderTop="solid 1px"
          borderBottom="solid 1px">
          <a href={SITE_PATH.HOME.USER_GUIDE} style={{ marginBottom: '4px' }}>
            <TextStyle
              fontFamily="sans"
              fontSize="medium"
              fontWeight={700}
              fontColor="#ff7700">
              {`${t('t8th359')}`}
            </TextStyle>
          </a>
        </BoxStyle>
      </ModalBodyStyle>
      {isInitialPopup && (
        <BoxStyle
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          height={'60px'}
          flexShrink={0}
          onClick={() => {
            onClickDoNotAutoShow(true)
          }}>
          <TextStyle
            fontFamily="sans"
            fontSize="medium"
            fontWeight={500}
            fontColor="var(--font-color-secondary)"
            padding="0 0 10px 0">
            {t('t8th319')}
          </TextStyle>
        </BoxStyle>
      )}
    </ModalContainer>
  )
}
