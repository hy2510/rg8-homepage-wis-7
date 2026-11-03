'use client'

import { useRegistTicket } from '@/8th/features/payment/service/payment-query'
import PayerAgreement from '@/8th/features/payment/ui/component/PayerAgreement'
import PayerInfo from '@/8th/features/payment/ui/component/PayerInfo'
import PurchaseStudentInfo from '@/8th/features/payment/ui/component/PurchaseStudentInfo'
import RegistTicketResultModal from '@/8th/features/payment/ui/modal/RegistTicketResultModal'
import {
  useChangeSmsAgree,
  useRegistPhoneNumberCertificate,
  useRegistPhoneNumberRequest,
  useStudent,
} from '@/8th/features/student/service/student-query'
import { useCountDown } from '@/8th/shared/hook/useCountDown'
import useTranslation from '@/localization/client/useTranslations'
import { useEffect, useRef, useState } from 'react'

const EMPTY_CODES = ['', '', '', '']
const MAX_TICKET = 2

export default function RegistTicket() {
  // @language 'common'
  const { t } = useTranslation()

  const studentInfo = useStudent()
  const student = studentInfo.data?.student

  const loginId = student?.loginId ?? ''

  const [tickets, setTickets] = useState([
    { id: 'ticket-0', codes: [...EMPTY_CODES] },
  ])
  const [registResult, setRegistResult] = useState<
    { ticket: string; code: number }[] | undefined
  >(undefined)

  const { mutate: registTicket, isPending: isRegistTicketPending } =
    useRegistTicket({
      onSuccess: (data, variables) => {
        const tickets: string[] = variables.tickets
        const successedCount = data.result.filter(
          (item: { code: number }) => item.code === 0,
        ).length

        if (successedCount === data.result.length) {
          setTickets([{ id: `ticket-${Date.now()}`, codes: [...EMPTY_CODES] }])
          alert(t('t8th0260'))
          //   maketingEventTracker.eventAction('이용권 등록 완료', {
          //     voucher_code_masked: JSON.stringify(
          //       tickets.map((ticket) => ticket.codes.join('').replace(/-/g, '').substring(0, 4) + '*'),
          //     ),
          //   })
        } else {
          const newTicket: { id: string; codes: string[] }[] = []
          data.result.forEach(
            (item: { code: number; ticket: string }, idx: number) => {
              if (item.code !== 0) {
                newTicket.push({
                  id: `id${idx + Math.random()}`,
                  codes: [...item.ticket.split('-')],
                })
              }
            },
          )
          setTickets([...newTicket])
          setRegistResult(data.result as { ticket: string; code: number }[])

          // alert('티켓 등록에 실패했습니다. 번호를 다시 확인해 주세요.')

          // maketingEventTracker.eventAction('이용권 등록 실패', {
          //   voucher_code_masked: JSON.stringify(
          //     tickets.map((code) => code.replace(/-/g, '').substring(0, 4) + '*'),
          //   ),
          //   error_reason: JSON.stringify(
          //     data.result.map((item: { code: number; ticket: string }) => {
          //       let errorVal = 'invalid'
          //       if (item.code === 0) {
          //         errorVal = 'success'
          //       } else if (item.code === -3) {
          //         errorVal = 'already_used'
          //       } else if (item.code === -10) {
          //         errorVal = 'expired'
          //       }
          //       return errorVal
          //     }),
          //   ),
          // })
        }
      },
      onError: (error) => {
        alert(t('t8th0261'))
      },
    })

  const onChangeTicket = (id: string, codes: string[]) => {
    setTickets((current) =>
      current.map((item) => (item.id === id ? { ...item, codes } : item)),
    )
  }

  const [modifyPhoneType, setModifyPhoneType] = useState<
    'default' | 'phone' | 'validate'
  >('default')
  const [phoneNumberErrorMessage, setPhoneNumberErrorMessage] = useState<
    string | undefined
  >(undefined)
  const [authErrorMessage, setAuthErrorMessage] = useState<string | undefined>(
    undefined,
  )
  const { mutate: requestPhoneAuth } = useRegistPhoneNumberRequest({
    onSuccess: () => {
      setModifyPhoneType('validate')
      setPhoneNumberErrorMessage('')
      phoneAuthCountDown.reset()
    },
    onError: () => {
      setPhoneNumberErrorMessage(t('t8th129'))
      phoneAuthCountDown.stop()
    },
  })
  const { mutate: validatePhoneAuth } = useRegistPhoneNumberCertificate({
    onSuccess: () => {
      setModifyPhoneType('default')
      setPhoneNumberErrorMessage('')
      setAuthErrorMessage('')
      phoneAuthCountDown.stop()
      alert(t('t8th132'))
    },
    onError: () => {
      setAuthErrorMessage(t('t8th131'))
    },
  })
  const phoneAuthCountDown = useCountDown({ timeset: 60 * 10 })
  const onPhoneAuthReset = () => {
    setModifyPhoneType('default')
    setPhoneNumberErrorMessage('')
    setAuthErrorMessage('')
    phoneAuthCountDown.stop()
  }
  const onPhoneAuthRequest = (phone: string) => {
    if (phone.length === 0) {
      setPhoneNumberErrorMessage(t('t8th134'))
      return
    }
    requestPhoneAuth({ phoneNumber: phone })
  }
  const onPhoneAuthValidate = (phoneNumber: string, authCode: string) => {
    if (authCode.length === 0) {
      setAuthErrorMessage(t('t8th131'))
      return
    }
    if (phoneNumber.length === 0) {
      setAuthErrorMessage(t('t8th130'))
      return
    }
    setAuthErrorMessage('')
    validatePhoneAuth({
      phoneNumber: phoneNumber,
      authCode: authCode,
    })
  }

  const [policyAgree, setPolicyAgree] = useState(false)
  const [notifyAgree, setNotifyAgree] = useState(false)
  const { mutate: changeSmsAgree } = useChangeSmsAgree({
    onSuccess: (data, variables) => {
      if (variables.isReceive) {
        alert(t('t8th124'))
      } else {
        alert(t('t8th125'))
      }
      setNotifyAgree(variables.isReceive)
    },
  })
  useEffect(() => {
    const isReceive = student?.smsEventInfomationYn || student?.smsStudyReportYn
    setNotifyAgree(!!isReceive)
  }, [student?.smsEventInfomationYn, student?.smsStudyReportYn])

  const onChangeNotifyAgree = (checked: boolean) => {
    setNotifyAgree(checked)
    changeSmsAgree({ isReceive: checked })
  }

  const onSubmitTicket = () => {
    if (!policyAgree) {
      alert(t('t8th0256'))
      return
    }

    const parsed = tickets.map((item) => {
      const joined = item.codes.join('')
      if (!joined) return ''
      if (joined.length !== 16) return 'invalid'
      return item.codes.join('-')
    })
    const filled = parsed.filter((ticket) => ticket && ticket !== 'invalid')
    if (parsed.includes('invalid') || filled.length === 0) {
      alert(t('t8th0258'))
      return
    }
    if (new Set(filled).size !== filled.length) {
      alert(t('t8th0259'))
      return
    }

    // maketingEventTracker.eventAction('이용권 코드 입력 시도', {
    //   voucher_code_masked: JSON.stringify(
    //     filled.map((code) => code.replace(/-/g, '').substring(0, 4) + '*'),
    //   ),
    // })
    registTicket({
      tickets: filled,
    })
  }

  return (
    <>
      <div className="board">
        <PurchaseStudentInfo
          loginId={loginId}
          studyEndDay={studentInfo.data?.student?.studyEndDay ?? 0}
        />

        <section>
          <div className="section-head">
            <h2 className="section-title">{t('t8th0262')}</h2>
            <p className="section-help">{t('t8th0263')}</p>
          </div>
          <div className="ticket-input-block">
            <div className="ticket-rows">
              {tickets.map((ticket) => (
                <TicketCodeRow
                  key={ticket.id}
                  codes={ticket.codes}
                  onChange={(codes) => onChangeTicket(ticket.id, codes)}
                />
              ))}
            </div>
            {tickets.length < MAX_TICKET && (
              <div className="ticket-add">
                <button
                  type="button"
                  onClick={() =>
                    setTickets((current) => [
                      ...current,
                      { id: `ticket-${Date.now()}`, codes: [...EMPTY_CODES] },
                    ])
                  }>
                  {t('t8th0264')}
                </button>
              </div>
            )}
          </div>
        </section>

        <PayerInfo
          loginId={loginId}
          savedPhone={student?.parentCellPhone || undefined}
          phoneViewType={modifyPhoneType}
          phoneErrorMessage={phoneNumberErrorMessage}
          authErrorMessage={authErrorMessage}
          timeText={phoneAuthCountDown.timeText}
          isReSendable={phoneAuthCountDown.currentTime < 360}
          onCancel={onPhoneAuthReset}
          onModifyPhone={() => setModifyPhoneType('phone')}
          onPhoneAuthRequest={onPhoneAuthRequest}
          onPhoneAuthValidate={onPhoneAuthValidate}
        />

        <PayerAgreement
          policyAgree={policyAgree}
          notifyAgree={notifyAgree}
          onPolicyAgreedChange={(checked) => setPolicyAgree(checked)}
          onNotifyChange={onChangeNotifyAgree}
        />

        <ul className="ticket-notes">
          <li>{t('t8th0265')}</li>
          <li>{t('t8th0266')}</li>
          <li>{t('t8th0267')}</li>
          <li>{t('t8th0268')}</li>
        </ul>

        <div className="ticket-actions">
          <button
            type="button"
            className="pay-button"
            disabled={isRegistTicketPending}
            onClick={onSubmitTicket}>
            {t('t8th0269')}
          </button>
        </div>
      </div>

      {registResult && (
        <RegistTicketResultModal
          result={registResult}
          onCancel={() => {
            setRegistResult(undefined)
          }}
        />
      )}
    </>
  )
}

function TicketCodeRow({
  codes,
  onChange,
}: {
  codes: string[]
  onChange: (next: string[]) => void
}) {
  // @language 'common'
  const { t } = useTranslation()
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const onInput = (index: number, value: string) => {
    const cleaned = value.replace(/[^0-9a-zA-Z-]/g, '').toUpperCase()
    const joined = cleaned.replace(/-/g, '')
    const next = [...codes]

    if (joined.length > 4) {
      let rest = joined
      for (let i = index; i < 4 && rest.length > 0; i++) {
        next[i] = rest.slice(0, 4)
        rest = rest.slice(4)
      }
      onChange(next)
      const focusIndex = next.findIndex((code) => code.length < 4)
      if (focusIndex >= 0) inputRefs.current[focusIndex]?.focus()
      else inputRefs.current[3]?.blur()
      return
    }

    next[index] = joined.slice(0, 4)
    onChange(next)
    if (next[index].length === 4 && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  return (
    <div className="ticket-row">
      {codes.map((code, index) => (
        <span key={index} className="ticket-field">
          <input
            ref={(node) => {
              inputRefs.current[index] = node
            }}
            className="ticket-input"
            value={code}
            placeholder="XXXX"
            autoComplete="off"
            spellCheck={false}
            onChange={(event) => onInput(index, event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Backspace' && !codes[index] && index > 0) {
                inputRefs.current[index - 1]?.focus()
              }
            }}
            aria-label={t('t8th0270', { num: index + 1 })}
          />
          {index < 3 ? <span className="ticket-dash">-</span> : null}
        </span>
      ))}
    </div>
  )
}
