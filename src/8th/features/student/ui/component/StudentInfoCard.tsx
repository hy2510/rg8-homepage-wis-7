'use client'

import { Assets } from '@/8th/assets/asset-library'
import { StudentInfoCardStyle } from '@/8th/shared/styled/FeaturesStyled'
import { ConditionalLink } from '@/8th/shared/ui/ConditionalLink'
import { BoxStyle } from '@/8th/shared/ui/Misc'
import useTranslation from '@/localization/client/useTranslations'
import Image from 'next/image'
import Link from 'next/link'

/**
 * 이름, 랭킹, 점수, Todo, Favorite 카드
 */

interface StudentInfoCardProps {
  name: string
  loginId: string
  signUpDate: string
  remainingStudyDays: number
  studyEndDate?: string
  avatar: string
  readingUnit: string
  settingUrl?: string
  accountInfoUrl?: string
  customerGroupName?: string
  paymentUrl?: string
}

export default function StudentInfoCard({
  name,
  loginId,
  signUpDate,
  remainingStudyDays,
  studyEndDate,
  avatar,
  readingUnit,
  customerGroupName,
  settingUrl,
  accountInfoUrl,
  paymentUrl,
}: StudentInfoCardProps) {
  // @Language 'common'
  const { t } = useTranslation()

  const buttonUrl = settingUrl ? settingUrl : accountInfoUrl

  return (
    <StudentInfoCardStyle>
      <BoxStyle className="character-container">
        <ConditionalLink href={settingUrl} className="character-link-area">
          <span></span>
        </ConditionalLink>
        <Image
          src={avatar}
          alt="character"
          width={160}
          height={160}
          className="main-character"
        />
        <Image
          src={readingUnit}
          alt="character"
          width={160}
          height={160}
          className="sub-character"
        />
      </BoxStyle>
      <BoxStyle className="info-container">
        <BoxStyle className="info-content-container">
          <ConditionalLink href={accountInfoUrl}>
            <div className="user-name">{name}</div>
          </ConditionalLink>
          <BoxStyle
            display="flex"
            flexDirection="column"
            alignItems="flex-start">
            <div className="user-id">
              <ConditionalLink
                href={accountInfoUrl}
                style={{ font: 'inherit', color: 'inherit' }}>
                {loginId}
              </ConditionalLink>
            </div>
            {/* <div className="sign-up-date">{signUpDate}</div> */}
            {remainingStudyDays >= 0 && (
              <>
                <div className="study-remaining-period">
                  {remainingStudyDays === 0
                    ? t('t8th338')
                    : `${t('t8th093')} ${t('t8th049', { num: remainingStudyDays })}`}
                  {paymentUrl && (
                    <a href={paymentUrl} style={{ textDecoration: 'none' }}>
                      <span
                        style={{
                          marginLeft: '8px',
                          alignItems: 'center',
                          fontFamily: 'sans',
                          fontWeight: '700',
                          color: 'var(--font-color-light-blue)',
                          fontSize: 'var(--font-size-large)',
                          borderBottom:
                            'solid 1px var(--font-color-light-blue)',
                        }}>
                        {`${t('t8th095')}`}
                      </span>
                    </a>
                  )}
                </div>
                {remainingStudyDays > 0 && (
                  <div className="study-remaining-period">{`${t('t8th094')} ${studyEndDate}`}</div>
                )}
              </>
            )}
            <div className="customer-group-name">{customerGroupName}</div>
          </BoxStyle>
        </BoxStyle>
      </BoxStyle>
      {!!buttonUrl && (
        <Link href={buttonUrl} className="settings-gear">
          <Image src={Assets.Icon.SettingsGray} alt="" width={22} height={22} />
        </Link>
      )}
    </StudentInfoCardStyle>
  )
}
