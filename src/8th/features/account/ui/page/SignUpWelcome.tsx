'use client'

import { useStudent } from '@/8th/features/student/service/student-query'
import SITE_PATH from '@/app/site-path'
import useTranslation from '@/localization/client/useTranslations'
import { useRouter } from 'next/navigation'

export default function SignUpWelcome() {
  // @language 'common'
  const { t } = useTranslation()

  const router = useRouter()

  const student = useStudent()
  const info = student.data?.student
  const notice = t('t8th0120')
  const noticeBreak = notice.lastIndexOf(' ')
  const noticeHead = notice.slice(0, noticeBreak + 1)
  const noticeTail = notice.slice(noticeBreak + 1)

  return (
    <div className="body is-add">
      <h1>{t('t8th0064')}</h1>
      <section className="add-panel welcome-panel">
        <h2>{t('t8th0027')}</h2>
        <p>{t('t8th0049')}</p>
        <dl className="welcome-info">
          <InfoField label={t('t8th097')} value={info?.name} />
          <InfoField label={t('t8th098')} value={info?.loginId} />
          <InfoField
            label={t('t8th0117')}
            value={info?.registDate?.slice(0, 10)}
          />
          <InfoField
            label={t('t8th0118')}
            value={info ? t('t8th0119', { num: info.studyEndDay }) : undefined}
          />
        </dl>
        <p className="welcome-note">
          {`* ${noticeHead}`}
          <span className="welcome-tail">
            {noticeTail}
            <button
              type="button"
              className="welcome-inline"
              onClick={() => {
                router.replace(SITE_PATH.STUDENT_8TH.ACCOUNTINFO)
              }}>
              {t('t8th0121')}
            </button>
          </span>
        </p>
        <button
          type="button"
          className="welcome-primary"
          onClick={() => {
            router.replace(SITE_PATH.STUDENT_8TH.LIBRARY)
          }}>
          {t('t8th0122')}
        </button>
        <button
          type="button"
          className="add-find"
          onClick={() => {
            router.replace(SITE_PATH.HOME.MAIN)
          }}>
          {t('t8th0123')}
        </button>
      </section>
    </div>
  )
}

function InfoField({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}
