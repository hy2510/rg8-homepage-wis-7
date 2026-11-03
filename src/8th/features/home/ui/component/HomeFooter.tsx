'use client'

import {
  ServiceCountry,
  ServiceTarget,
} from '@/8th/application/context/ApplicationContext'
import { HpFooterStyled } from '@/8th/shared/styled/HpFeaturesStyled'
import { openWindow } from '@/8th/shared/utils/open-window'
import SITE_PATH from '@/app/site-path'
import useTranslation from '@/localization/client/useTranslations'
import Image from 'next/image'
import Link from 'next/link'

const RG_CUSTOMER_CENTER_TEL = '1599-0533'
const MENU_BASE: { id: string; href: string }[] = [
  { id: 'home', href: SITE_PATH.HOME_8TH.HOME },
  { id: 'policy-terms', href: SITE_PATH.HOME_8TH.POLICY_TERMS },
  { id: 'policy-terms-vietnam', href: SITE_PATH.HOME_8TH.POLICY_TERMS_VIETNAM },
  { id: 'policy-privacy', href: SITE_PATH.HOME_8TH.POLICY_PRIVACY },
  {
    id: 'policy-privacy-school',
    href: SITE_PATH.HOME_8TH.POLICY_PRIVACY_SCHOOL,
  },
  {
    id: 'policy-privacy-vietnam',
    href: SITE_PATH.HOME_8TH.POLICY_PRIVACY_VIETNAM,
  },
  { id: 'hidodo', href: 'https://gohidodo.com/' },
  { id: 'dodo-story', href: 'https://characters.readinggate.com/' },
  {
    id: 'b2b-contact',
    href: 'https://util.readinggate.com/Community/BringInSchool',
  },
] as const

export default function HomeFooter({
  info,
  isApp = false,
  isLogin = false,
  target,
  country,
}: {
  info: {
    customerName: string
    address: string
    tel: string
  }
  isApp?: boolean
  isLogin?: boolean
  target: ServiceTarget
  country: ServiceCountry
}) {
  const { customerName, address, tel } = info || {}

  if (target === 'academy') {
    return (
      <AcademyFooter
        isApp={isApp}
        customerName={customerName}
        address={address}
        tel={tel}
      />
    )
  } else if (target === 'school') {
    return <SchoolFooter isApp={isApp} customerName={customerName} />
  } else if (target === 'private' && country === 'vn') {
    return <PrivateVNFooter isApp={isApp} />
  } else {
    return <PrivateKRFooter isApp={isApp} />
  }
}
function PrivateKRFooter({ isApp }: { isApp: boolean }) {
  // @language 'common'
  const { t } = useTranslation()

  const menus = getMenus('private', 'kr', t)
  return (
    <HpFooterStyled>
      <div className="inner">
        <nav className="footer-nav" aria-label="사이트 정보">
          {menus.map((menu) => {
            if (menu.href.startsWith('http')) {
              return (
                <Link
                  key={menu.id}
                  href={''}
                  onClick={(e) => {
                    e.preventDefault()
                    openWindow(menu.href, {
                      external: true,
                      target: '_blank',
                      feature: 'noopener, noreferrer',
                    })
                  }}>
                  {menu.label}
                </Link>
              )
            }
            return (
              <Link key={menu.id} href={menu.href}>
                {menu.label}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="footer-rule" />
      <div className="inner">
        <div className="footer-meta">
          <div className="legal">
            <p>Copyright © 2025 Reading Gate co., ltd. 모든 권리 보유.</p>
            <p>경기도 성남시 수정구 창업로 43, A동 807~810호(글로벌비즈센터)</p>
            <p className="legal-row">
              <span>대표이사 김용환</span>
              <span style={{ marginLeft: '4px' }}>
                사업자등록번호 220-86-02032
              </span>
              <span style={{ marginLeft: '4px' }}>
                통신판매번호: 2013-경기성남-0836호 성남교육지원청 등록 제4868호
              </span>
              <span style={{ marginLeft: '4px' }}>
                대표번호 :{' '}
                <a href={`tel:${RG_CUSTOMER_CENTER_TEL}`}>
                  {RG_CUSTOMER_CENTER_TEL}
                </a>
              </span>
              <span style={{ marginLeft: '4px' }}>FAX : 070-8266-8660</span>
              <span style={{ marginLeft: '4px' }}>
                이메일 :{' '}
                <a href={`mailto:rgmanager@readinggate.com`}>
                  {'rgmanager@readinggate.com'}
                </a>
              </span>
            </p>
          </div>
        </div>
      </div>
    </HpFooterStyled>
  )
}

function PrivateVNFooter({ isApp }: { isApp: boolean }) {
  // @language 'common'
  const { t } = useTranslation()

  const VN_CUSTOMER_TEL = '028-7303-9199'
  const VN_CUSTOMER_MEAIL = 'supportvn@vn-readinggate.com'

  const menus = getMenus('private', 'vn', t)

  return (
    <HpFooterStyled>
      <div className="inner">
        <nav className="footer-nav" aria-label="사이트 정보">
          {menus.map((menu) => {
            if (menu.href.startsWith('http')) {
              return (
                <Link
                  key={menu.id}
                  href={''}
                  onClick={(e) => {
                    e.preventDefault()
                    openWindow(menu.href, {
                      external: true,
                      target: '_blank',
                      feature: 'noopener, noreferrer',
                    })
                  }}>
                  {menu.label}
                </Link>
              )
            }
            return (
              <Link key={menu.id} href={menu.href}>
                {menu.label}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="footer-rule" />
      <div className="inner">
        <div className="footer-meta">
          <div className="legal">
            <p>Copyright © 2025 Reading Gate co., ltd.</p>
            <p>
              Tầng 1 tòa nhà số 165 Nguyễn Văn Trỗi, phường 1, quận Phú Nhuận,
              TP.HCM
            </p>
            <p className="legal-row">
              <span>CEO: Ông Trịnh Thế Phong</span>
              <span style={{ marginLeft: '4px' }}>
                사업자 등록 번호 : 0315641991
              </span>
              <span style={{ marginLeft: '4px' }}>
                대표번호 :{' '}
                <a href={`tel:${VN_CUSTOMER_TEL}`}>{VN_CUSTOMER_TEL}</a>
              </span>
              <span style={{ marginLeft: '4px' }}>
                이메일 :{' '}
                <a href={`mailto:${VN_CUSTOMER_MEAIL}`}>{VN_CUSTOMER_MEAIL}</a>
              </span>
            </p>
          </div>
          <div style={{ marginTop: '10px' }}>
            <a href="http://online.gov.vn/Website/chi-tiet-59891">
              <Image
                alt=""
                title=""
                width="180"
                height="68"
                src={`https://wcfresource.a1edu.com/newsystem/7th/home/etc/logo-sale-noti.png`}
              />
            </a>
          </div>
        </div>
      </div>
    </HpFooterStyled>
  )
}

function SchoolFooter({
  customerName,
}: {
  isApp: boolean
  customerName: string
}) {
  // @language 'common'
  const { t } = useTranslation()

  const menus = getMenus('school', 'kr', t)
  return (
    <HpFooterStyled>
      <div className="inner">
        <nav className="footer-nav" aria-label="사이트 정보">
          {menus.map((menu) => {
            if (menu.href.startsWith('http')) {
              return (
                <Link
                  key={menu.id}
                  href={''}
                  onClick={(e) => {
                    e.preventDefault()
                    openWindow(menu.href, {
                      external: true,
                      target: '_blank',
                      feature: 'noopener, noreferrer',
                    })
                  }}>
                  {menu.label}
                </Link>
              )
            }
            return (
              <Link key={menu.id} href={menu.href}>
                {menu.label}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="footer-rule" />
      <div className="inner">
        <div className="footer-meta">
          <div className="legal">
            <p>{customerName}</p>
            <p className="legal-row">
              <span>리딩게이트 고객센터: </span>
              <a
                href={`tel:${RG_CUSTOMER_CENTER_TEL}`}
                style={{ marginLeft: '4px' }}>
                {RG_CUSTOMER_CENTER_TEL}
              </a>
              <span style={{ marginLeft: '4px' }}>
                (평일 09:00~18:00 / 점심시간 12:30~13:30)
              </span>
            </p>
          </div>
        </div>
      </div>
    </HpFooterStyled>
  )
}

function AcademyFooter({
  customerName,
  address,
  tel,
}: {
  isApp: boolean
  customerName: string
  address?: string
  tel?: string
}) {
  return (
    <HpFooterStyled>
      <div className="inner">
        <div className="footer-meta">
          <div className="legal">
            <p>{customerName}</p>
            <p className="legal-row">
              {address && <span>{address}</span>}
              {tel && (
                <>
                  <span style={{ marginLeft: '4px' }}>대표번호 : </span>
                  <a href={`tel:${tel}`}>{tel}</a>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </HpFooterStyled>
  )
}

function getMenus(
  target: ServiceTarget,
  country: ServiceCountry,
  t: (key: string) => string,
) {
  const PRIVATE = [
    'home',
    'policy-terms',
    'policy-privacy',
    'hidodo',
    'dodo-story',
    'b2b-contact',
  ]
  const SCHOOL = ['home', 'policy-privacy-school']
  const ACADEMY: string[] = []
  const VIETNAM = ['policy-terms-vietnam', 'policy-privacy-vietnam']

  const getLabel = (id: string) => {
    switch (id) {
      case 'home':
        return t('t8th0349')
      case 'policy-terms':
      case 'policy-terms-vietnam':
        return t('t8th0033')
      case 'policy-privacy':
      case 'policy-privacy-school':
      case 'policy-privacy-vietnam':
        return t('t8th0350')
      case 'hidodo':
        return t('t8th0351')
      case 'dodo-story':
        return t('t8th0352')
      case 'b2b-contact':
        return t('t8th0353')
      default:
        return ''
    }
  }

  return MENU_BASE.map((menu) => {
    const label = getLabel(menu.id)
    return {
      id: menu.id,
      href: menu.href,
      label: label,
    }
  }).filter((menu) => {
    if (country === 'kr') {
      if (target === 'private') {
        return PRIVATE.includes(menu.id)
      } else if (target === 'school') {
        return SCHOOL.includes(menu.id)
      } else if (target === 'academy') {
        return ACADEMY.includes(menu.id)
      }
    } else {
      return VIETNAM.includes(menu.id)
    }
  })
}
