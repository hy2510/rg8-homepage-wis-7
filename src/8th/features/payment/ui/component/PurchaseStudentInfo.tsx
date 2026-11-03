'use client'

import useTranslation from '@/localization/client/useTranslations'
import DateUtils from '@/util/date-utils'

export default function PurchaseStudentInfo({
  loginId,
  studyEndDay,
}: {
  loginId: string
  studyEndDay: number
}) {
  // @language 'common'
  const { t } = useTranslation()

  const studentPeriod = t('t8th0243', {
    num: studyEndDay,
    txt: DateUtils.toStringDate(getRemainingDate(studyEndDay), {
      divide: '.',
      digitfix: false,
    }),
  })
  return (
    <section>
      <h2 className="section-title">{t('t8th0027')}</h2>
      <div className="member-box">
        <div className="member-row">
          <span>{t('t8th0232')}</span>
          <strong>{loginId}</strong>
        </div>
        <div className="member-row">
          <span>{t('t8th0244')}</span>
          <strong>{studentPeriod}</strong>
        </div>
      </div>
    </section>
  )
}

function getRemainingDate(day: number): Date {
  const currentDate = new Date()
  currentDate.setDate(currentDate.getDate() + day - 1)
  return currentDate
}
