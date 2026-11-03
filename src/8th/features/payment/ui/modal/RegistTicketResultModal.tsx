'use client'

import useTranslation from '@/localization/client/useTranslations'

export default function RegistTicketResultModal({
  result,
  onCancel,
}: {
  result: { code: number; ticket: string }[]
  onCancel?: () => void
}) {
  // @language 'common'
  const { t } = useTranslation()

  const onCancelListener = () => {
    if (onCancel) {
      onCancel()
    }
  }

  return (
    <div
      className="hp-modal-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) {
          if (onCancelListener) {
            onCancelListener()
          }
        }
      }}>
      <section
        className="hp-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="purchase-progress-title">
        <header className="hp-modal-header">
          <h2 id="purchase-progress-title">{t('t8th0278')}</h2>
          <button
            type="button"
            className="hp-modal-close"
            aria-label={t('t8th0155')}
            onClick={onCancelListener}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6 18 18M18 6 6 18" />
            </svg>
          </button>
        </header>
        <div className="hp-modal-body ticket-result">
          <h3 className="ticket-result-title">{t('t8th0279')}</h3>
          <ol className="ticket-result-list">
            {result.map((info, idx) => {
              const isSuccess = info.code === 0
              let message = t('t8th0280')
              if (info.code === -3) {
                message = t('t8th0281')
              } else if (info.code === -10) {
                // 유효기간이 지난 티켓입니다.
              } else if (isSuccess) {
                message = t('t8th0282')
              }
              return (
                <li
                  key={`${info.ticket}-${idx}`}
                  className={isSuccess ? 'is-success' : undefined}>
                  <h4>
                    <svg
                      className="ticket-result-mark"
                      viewBox="0 0 16 16"
                      aria-hidden="true">
                      {isSuccess ? (
                        <path d="M3.2 8.2 6.4 11.4 12.8 4.6" />
                      ) : (
                        <path d="M4.2 4.2 11.8 11.8M11.8 4.2 4.2 11.8" />
                      )}
                    </svg>
                    {message}
                  </h4>
                  <p className="ticket-result-code">{info.ticket}</p>
                </li>
              )
            })}
          </ol>
          <div className="ticket-result-note">
            <p>{t('t8th0283')}</p>
            <p>{t('t8th0284')}</p>
          </div>
        </div>
      </section>
    </div>
  )
}
