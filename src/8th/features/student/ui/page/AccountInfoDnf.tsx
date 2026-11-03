'use client'

import { useCustomerConfiguration } from '@/8th/application/context/CustomerContext'
import LibraryTabBar from '@/8th/features/library/ui/component/LibraryTabBar'
import { useContinuousStudy } from '@/8th/features/student/service/learning-query'
import {
  useChangePassword,
  useChangeSmsAgree,
  useChangeStudentName,
  useRegistPhoneNumberCertificate,
  useRegistPhoneNumberRequest,
  useStudent,
} from '@/8th/features/student/service/student-query'
import StudentEditInputPassword from '@/8th/features/student/ui/component/StudentEditInputPassword'
import StudentEditInputPhoneNumber from '@/8th/features/student/ui/component/StudentEditInputPhone'
import StudentEditInputText from '@/8th/features/student/ui/component/StudentEditInputText'
import StudyStatusView from '@/8th/features/student/ui/component/StudyStatusView'
import { BASE_TIME, useCountDown } from '@/8th/shared/hook/useCountDown'
import CustomCheckbox from '@/8th/shared/ui/CustomCheckbox'
import { BoxStyle } from '@/8th/shared/ui/Misc'
import { SubPageNavHeader } from '@/8th/shared/ui/SubPageNavHeader'
import {
  isValidatePassword,
  isValidateStudentName,
} from '@/8th/shared/utils/validation'
import SITE_PATH from '@/app/site-path'
import { useTrack } from '@/external/marketing-tracker/component/MarketingTrackerContext'
import useTranslation from '@/localization/client/useTranslations'
import DateUtils from '@/util/date-utils'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

type editModeType =
  | 'studentName'
  | 'loginId'
  | 'email'
  | 'phoneNumber'
  | 'password'
  | undefined
export default function AccountInfo() {
  const maketingEventTracker = useTrack()
  useEffect(() => {
    maketingEventTracker.eventAction('계정정보 화면 진입', {
      version: '8th',
    })
  }, [maketingEventTracker])

  const { menu, setting, country } = useCustomerConfiguration()

  // @language 'common'
  const { t } = useTranslation()

  const pathname = usePathname()

  const { data } = useStudent()
  const continuousStudyData = useContinuousStudy()

  const [studentName, setStudentName] = useState({
    value: '',
    readOnly: false,
    isEdit: false,
  })
  const [loginId, setLoginId] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState({
    value: '',
    isEdit: false,
    isAuthCodeEnabled: false,
  })
  const [editMode, setEditMode] = useState<editModeType>(undefined)

  const isSmsAgree =
    data?.student?.smsStudyReportYn && data?.student?.smsEventInfomationYn
  const onEditModeCancel = () => {
    setEditMode(undefined)
  }

  useEffect(() => {
    if (data?.student?.name && studentName.value !== data.student.name) {
      const newStudentName = {
        ...studentName,
        value: data.student.name,
      }
      setStudentName(newStudentName)
    }
  }, [data?.student?.name, studentName])

  useEffect(() => {
    if (data?.student?.loginId) {
      setLoginId(data.student.loginId)
    }
  }, [data?.student?.loginId])

  useEffect(() => {
    if (data?.student?.parentEmail) {
      setEmail(data.student.parentEmail)
    }
  }, [data?.student?.parentEmail])

  useEffect(() => {
    if (
      data?.student?.parentCellPhone &&
      phone.value !== data.student.parentCellPhone
    ) {
      const newPhone = {
        ...phone,
        value: data.student.parentCellPhone,
      }
      setPhone(newPhone)
    }
  }, [data?.student?.parentCellPhone, phone])

  let studyEndDate = ''
  if (data?.student?.studyEndDate) {
    let endDate: Date | undefined = undefined
    if (
      data?.student?.studyEndDate.length === 8 ||
      data?.student?.studyEndDate.length === 10
    ) {
      endDate = DateUtils.createDate(data?.student?.studyEndDate)
    }
    if (endDate) {
      endDate.setDate(endDate.getDate() - 1)
      studyEndDate = DateUtils.toStringDate(endDate, {
        divide: '.',
        digitfix: false,
      })
    }
  }

  const paymentUrl = setting.paymentable ? setting.paymentUrl : undefined

  const tabBarItems: React.ComponentProps<typeof LibraryTabBar>['items'] = []
  if (menu.account.setting.open) {
    tabBarItems.push({
      href: SITE_PATH.DODON_FRIENDS.ACCOUNTINFO_SETTING,
      active: pathname.includes(SITE_PATH.DODON_FRIENDS.ACCOUNTINFO_SETTING),
      label: t('t8th336'),
    })
  }
  if (menu.account.studentInfo.open) {
    tabBarItems.push({
      href: SITE_PATH.DODON_FRIENDS.ACCOUNTINFO,
      active: pathname.endsWith(SITE_PATH.DODON_FRIENDS.ACCOUNTINFO),
      label: t('t8th337'),
    })
  }
  return (
    <>
      <SubPageNavHeader
        title={t('t8th335')}
        parentPath={SITE_PATH.DODON_FRIENDS.ACTIVITY}
      />
      {tabBarItems.length > 1 && <LibraryTabBar items={tabBarItems} />}
      <BoxStyle
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        gap={20}>
        {menu.account.studentInfo.studyAvaliableDay.open && (
          <StudyStatusView
            remainingStudyPeriod={data?.student?.studyEndDay || 0}
            endStudyDate={studyEndDate}
            paymentUrl={paymentUrl}
          />
        )}
        {menu.account.studentInfo.studentName.open && (
          <StudentName
            isKorea={country === 'kr'}
            studentName={studentName.value}
            readOnly={!menu.account.studentInfo.studentName.editable}
            isEditMode={editMode === 'studentName'}
            onEditModeStart={() => setEditMode('studentName')}
            onEditModeCancel={onEditModeCancel}
          />
        )}
        {menu.account.studentInfo.loginId.open && (
          <StudentEditInputText
            value={loginId}
            label={t('t8th098')}
            readOnly={true}
          />
        )}
        {menu.account.studentInfo.email.open && (
          <StudentEditInputText
            value={email}
            label={t('t8th099')}
            readOnly={true}
          />
        )}
        {menu.account.studentInfo.password.open && (
          <LoginPassword
            isEditMode={editMode === 'password'}
            onEditModeStart={() => setEditMode('password')}
            onEditModeCancel={onEditModeCancel}
          />
        )}
        {menu.account.studentInfo.phoneNumber.open && (
          <PhoneNumber
            phoneNumber={phone.value}
            readOnly={!menu.account.studentInfo.phoneNumber.editable}
            isEditMode={editMode === 'phoneNumber'}
            onEditModeStart={() => setEditMode('phoneNumber')}
            onEditModeCancel={onEditModeCancel}
          />
        )}

        {menu.account.studentInfo.smsNotice.open && (
          <CheckSmsAgreement isSmsAgree={isSmsAgree || false} />
        )}
      </BoxStyle>
    </>
  )
}

function StudentName({
  isKorea,
  studentName,
  readOnly,
  isEditMode,
  onEditModeStart,
  onEditModeCancel,
}: {
  isKorea: boolean
  studentName: string
  readOnly: boolean
  isEditMode: boolean
  onEditModeStart: () => void
  onEditModeCancel: () => void
}) {
  // @language 'common'
  const { t } = useTranslation()

  const { mutate: changeStudentName } = useChangeStudentName({
    onSuccess: (data, variables) => {
      alert(t('t8th108'))
      onEditModeCancel()
    },
  })

  const onChangeStudentName = (name: string) => {
    if (name.length === 0) {
      alert(t('t8th105'))
      return
    }
    if (!isValidateStudentName(name, isKorea ? 'kr' : 'default')) {
      alert(t('t8th106'))
      return
    }
    changeStudentName({ studentName: name })
  }

  return (
    <StudentEditInputText
      value={studentName}
      label={t('t8th097')}
      isEdit={isEditMode}
      onEdit={onEditModeStart}
      readOnly={readOnly}
      onSave={onChangeStudentName}
      onCancel={onEditModeCancel}
    />
  )
}

function PhoneNumber({
  phoneNumber,
  readOnly,
  isEditMode,
  onEditModeStart,
  onEditModeCancel,
}: {
  phoneNumber: string
  readOnly: boolean
  isEditMode: boolean
  onEditModeStart: () => void
  onEditModeCancel: () => void
}) {
  // @language 'common'
  const { t } = useTranslation()

  const { mutate: registPhoneNumberRequest } = useRegistPhoneNumberRequest({
    onSuccess: (data, variables) => {
      if (data.success) {
        alert(t('t8th128'))
        setAuthCodeEnabled(true)
        reset()
      } else {
        alert(t('t8th129'))
      }
    },
  })
  const { mutate: registPhoneNumberCertificate } =
    useRegistPhoneNumberCertificate({
      onSuccess: (data, variables) => {
        if (data.success) {
          alert(t('t8th132'))
          onEditModeCancel()
        } else {
          alert(t('t8th131'))
        }
      },
    })

  const { timeText, reset, stop } = useCountDown({
    timeset: BASE_TIME, // 10 minutes
    autoStart: false,
  })

  const onChangePhoneNumber = (phoneNumber: string) => {
    if (phoneNumber.length === 0) {
      alert(t('t8th134'))
      return
    }
    registPhoneNumberRequest({ phoneNumber })
  }

  const onChangePhoneNumberCertificate = (
    phoneNumber: string,
    authCode: string,
  ) => {
    if (authCode.length === 0) {
      alert(t('t8th131'))
      return
    }
    if (phoneNumber.length === 0) {
      alert(t('t8th130'))
      return
    }
    registPhoneNumberCertificate({ phoneNumber, authCode })
  }

  const [isAuthCodeEnabled, setAuthCodeEnabled] = useState(false)

  return (
    <StudentEditInputPhoneNumber
      value={phoneNumber}
      label={t('t8th101')}
      readOnly={readOnly}
      isEdit={isEditMode}
      onEdit={onEditModeStart}
      isAuthCodeEnabled={isAuthCodeEnabled}
      authCodeTimeText={timeText}
      onRequestAuthCode={onChangePhoneNumber}
      onResetAuthCode={() => {
        setAuthCodeEnabled(false)
      }}
      onSaveAuthCode={onChangePhoneNumberCertificate}
      onCancel={onEditModeCancel}
    />
  )
}

function LoginPassword({
  isEditMode,
  onEditModeStart,
  onEditModeCancel,
}: {
  isEditMode: boolean
  onEditModeStart: () => void
  onEditModeCancel: () => void
}) {
  // @language 'common'
  const { t } = useTranslation()

  const { mutate: changePassword } = useChangePassword({
    onError: (error, variables) => {
      const code = (error as unknown as { code: number }).code
      if (code === 1000) {
        alert(t('t8th107'))
      }
    },
    onSuccess: (data, variables) => {
      if (data.success) {
        alert(t('t8th114'))
        onEditModeCancel()
      } else {
        alert(t('t8th107'))
      }
    },
  })

  const onChangePassword = (password: string, newPassword: string) => {
    if (password.length === 0) {
      alert(t('t8th109'))
      return
    }
    if (newPassword.length === 0) {
      alert(t('t8th110'))
      return
    }
    if (password === newPassword) {
      alert(t('t8th111'))
      return
    }
    if (!isValidatePassword(newPassword)) {
      alert(t('t8th112', { num1: 8, num2: 20 }))
      return
    }
    changePassword({ oldPassword: password, newPassword })
  }

  return (
    <StudentEditInputPassword
      isEdit={isEditMode}
      onEdit={onEditModeStart}
      onSavePassword={onChangePassword}
      onCancel={onEditModeCancel}
    />
  )
}

function CheckSmsAgreement({ isSmsAgree }: { isSmsAgree: boolean }) {
  // @language 'common'
  const { t } = useTranslation()

  const { mutate: changeSmsAgree } = useChangeSmsAgree({
    onSuccess: (data, variables) => {
      if (variables.isReceive) {
        alert(t('t8th124'))
      } else {
        alert(t('t8th125'))
      }
    },
  })

  const onChangeSmsAgree = (isAgree: boolean) => {
    if (isSmsAgree === isAgree) {
      return
    }
    changeSmsAgree({ isReceive: isAgree })
  }
  return (
    <BoxStyle padding="10px">
      <CustomCheckbox
        id="checkbox-sms-receive"
        checked={isSmsAgree}
        onChange={onChangeSmsAgree}
        label={t('t8th104')}
      />
    </BoxStyle>
  )
}
