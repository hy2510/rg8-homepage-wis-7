'use client'

import useTranslation from '@/localization/client/useTranslations'

export default function ForgotIdResult({
  list,
  onClick,
  goLogin,
}: {
  list: { loginId: string; studentName: string; registDate: string }[]
  onClick?: (item: {
    loginId: string
    studentName: string
    registDate: string
  }) => void
  goLogin?: () => void
}) {
  // @language 'common'
  const { t } = useTranslation()

  return (
    <div className="body is-add">
      <h1>{t('t8th0083')}</h1>
      {/* <p className="pick-copy">{t('t8th0084')}</p> */}
      <div className="member-list">
        {list.map((item) => (
          <button
            type="button"
            className="member-item"
            key={`${item.loginId}-${item.registDate}`}
            onClick={() => {
              if (onClick) {
                onClick(item)
              }
            }}
            style={{ cursor: onClick ? 'pointer' : 'default' }}>
            <strong>{item.studentName}</strong>
            <span>{item.loginId}</span>
          </button>
        ))}
        {goLogin && (
          <button className="add-find" onClick={goLogin}>
            {t('t8th0077')}
          </button>
        )}
      </div>
    </div>
  )
}
