'use client'

import {
  ServiceCountry,
  ServiceTarget,
} from '@/8th/application/context/ApplicationContext'
import { Assets } from '@/8th/assets/asset-library'
import LanguageSelect from '@/8th/features/account/ui/component/LanguageSelect'
import { HallOfFameTier } from '@/8th/features/board/ui/util/hall-of-fame-util'
import { HpGnbStyled } from '@/8th/shared/styled/HpFeaturesStyled'
import { AvatarSync } from '@/8th/shared/ui/Avatar'
import { openWindow } from '@/8th/shared/utils/open-window'
import SITE_PATH, { CUSTOMER_CENTER_URL } from '@/app/site-path'
import useTranslation from '@/localization/client/useTranslations'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const MENU_BASE: { id: string; href: string }[] = [
  { id: 'introduce-rg', href: SITE_PATH.HOME_8TH.HOME },
  { id: 'introduce-dnf', href: SITE_PATH.HOME_8TH.HOME_DNF },
  { id: 'news', href: SITE_PATH.HOME_8TH.NEWS },
  { id: 'leaderboard', href: SITE_PATH.HOME_8TH.LEADERBOARD },
  { id: 'payment', href: SITE_PATH.HOME_8TH.PAYMENT },
  { id: 'payment-school', href: SITE_PATH.HOME_8TH.PAYMENT_UNPAID },
  { id: 'book-rental', href: 'https://www.woodo.kr/readinggate' },
  { id: 'help-private', href: CUSTOMER_CENTER_URL.private },
  { id: 'help-school', href: CUSTOMER_CENTER_URL.school },
  { id: 'help-academy', href: CUSTOMER_CENTER_URL.academy },
  { id: 'help-global', href: CUSTOMER_CENTER_URL.vietnam },
] as const

export default function HomeGNB({
  isApp,
  target,
  country,
  customLogo,
  isLogin = false,
  isStaffLogin = false,
  accountLabel,
  avatarSrc,
  medalName,
  studentName,
  locale,
  languages,
  introUse,
  accessDNF,
  isPaymentable,
  onSelectLanguage,
  onGoAdminConsole,
}: {
  isApp: boolean
  target: ServiceTarget
  country: ServiceCountry
  customLogo?: string | null
  isLogin?: boolean
  isStaffLogin?: boolean
  accountLabel?: string
  avatarSrc?: string
  medalName?: HallOfFameTier
  studentName?: string
  locale: string
  languages: { code: string; label: string }[]
  introUse: { rg: boolean; dnf: boolean }
  accessDNF?: boolean
  isPaymentable?: boolean
  onSelectLanguage?: (locale: string) => void
  onGoAdminConsole?: () => void
}) {
  // @language 'common'
  const { t } = useTranslation()

  const router = useRouter()
  const pathname = usePathname()

  const menus = getMenus(
    target,
    country,
    isApp,
    introUse,
    isPaymentable ?? false,
    t,
  )

  const rootRef = useRef<HTMLDivElement>(null)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const avatarFrameImg = medalName
    ? Assets.HallOfFame.Profile[medalName].src
    : undefined

  useEffect(() => {
    if (!isUserMenuOpen) return

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsUserMenuOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isUserMenuOpen])

  return (
    <HpGnbStyled>
      <div className="inner">
        <Link className="logo" href="/" aria-label={t('t8th0319')}>
          {!!customLogo && (
            <Image
              className="custom-logo"
              src={customLogo}
              width={190}
              height={30}
              priority
              alt={'Logo'}
            />
          )}
          {!customLogo && (
            <Image
              src="/src/images/@home/logo_color_full.svg"
              width={190}
              height={30}
              priority
              alt={t('t8th0298')}
            />
          )}
        </Link>

        <nav className="navigation" aria-label={t('t8th0320')}>
          {menus.map((menu) => {
            if (menu.id.startsWith('help')) {
              return (
                <a
                  key={menu.id}
                  href={menu.href}
                  rel="noopener noreferrer"
                  target="_blank">
                  {menu.label}
                </a>
              )
            } else if (menu.id === 'book-rental') {
              return (
                <Link
                  key={menu.id}
                  className={undefined}
                  href={''}
                  onClick={(e) => {
                    e.preventDefault()
                    if (confirm(t('t8th0321'))) {
                      openWindow(menu.href, {
                        external: true,
                        target: '_blank',
                        feature: 'noopener, noreferrer',
                      })
                    }
                  }}>
                  {menu.label}
                </Link>
              )
            } else if (!isLogin && menu.id === 'payment') {
              return (
                <Link
                  key={menu.id}
                  className={
                    isActive(pathname, menu.href) ? 'active' : undefined
                  }
                  href={''}
                  onClick={(e) => {
                    e.preventDefault()
                    if (isLogin) {
                      router.push(menu.href)
                    } else {
                      if (confirm(t('t8th0322'))) {
                        router.push(
                          `${SITE_PATH.ACCOUNT_8TH.HOME}?to=${menu.href}`,
                        )
                      }
                    }
                  }}>
                  {menu.label}
                </Link>
              )
            } else if (isLogin && menu.id === 'payment-school') {
              console.log('payment-school', menu.href)
              return (
                <Link
                  key={menu.id}
                  className={
                    isActive(pathname, menu.href) ? 'active' : undefined
                  }
                  href={menu.href}>
                  {menu.label}
                </Link>
              )
            }
            return (
              <Link
                key={menu.id}
                className={isActive(pathname, menu.href) ? 'active' : undefined}
                href={menu.href}>
                {menu.label}
              </Link>
            )
          })}
        </nav>

        <div className="actions">
          <LanguageSelect
            locale={locale}
            languages={languages}
            onSelectLanguage={onSelectLanguage}
            isShowLabel={false}
          />

          {isLogin && !isStaffLogin ? (
            <div
              className={`account-select${isUserMenuOpen ? ' is-open' : ''}`}
              ref={rootRef}>
              <button
                type="button"
                className={`account-avatar${avatarFrameImg ? ' has-frame' : ''}`}
                aria-label={
                  studentName
                    ? t('t8th0323', { name: studentName })
                    : t('t8th0324')
                }
                aria-expanded={isUserMenuOpen}
                aria-haspopup="menu"
                onClick={() => setIsUserMenuOpen((current) => !current)}>
                {(avatarSrc || avatarFrameImg) && (
                  <div className="avatar-stack">
                    <AvatarSync />
                    {/* {avatarSrc && (
                      <Image
                        className="avatar-image"
                        src={avatarSrc}
                        alt=""
                        width={44}
                        height={44}
                      />
                    )} */}
                    {avatarFrameImg && (
                      <Image
                        className="avatar-frame"
                        src={avatarFrameImg}
                        alt=""
                        width={59}
                        height={59}
                      />
                    )}
                  </div>
                )}
              </button>
              {isUserMenuOpen && (
                <div className="account-menu" role="menu">
                  {studentName ? (
                    <p className="account-menu-head">{studentName}</p>
                  ) : null}
                  <ul>
                    <li>
                      <button
                        type="button"
                        role="menuitem"
                        className="study-link"
                        onClick={() => {
                          setIsUserMenuOpen(false)
                          router.push(SITE_PATH.ACCOUNT_8TH.FORWARDER)
                        }}>
                        {t('t8th0325')}
                        <Image
                          src={Assets.Icon.arrowUpRightBlack}
                          alt=""
                          width={12}
                          height={12}
                        />
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          router.replace(SITE_PATH.ACCOUNT_8TH.SIGNOUT)
                        }}>
                        {t('t8th297')}
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : isStaffLogin ? null : (
            <Link className="account-button" href={SITE_PATH.ACCOUNT_8TH.HOME}>
              {accountLabel || t('t8th0326')}
            </Link>
          )}

          {isStaffLogin ? (
            <div
              className={`account-select${isUserMenuOpen ? ' is-open' : ''}`}
              ref={rootRef}>
              <button
                type="button"
                className={`account-avatar${avatarFrameImg ? ' has-frame' : ''}`}
                aria-label={t('t8th0324')}
                aria-expanded={isUserMenuOpen}
                aria-haspopup="menu"
                onClick={() => setIsUserMenuOpen((current) => !current)}>
                <span>관리자</span>
              </button>
              {isUserMenuOpen && (
                <div className="account-menu" role="menu">
                  <ul>
                    <li>
                      <button
                        type="button"
                        role="menuitem"
                        className="study-link"
                        onClick={() => {
                          if (onGoAdminConsole) {
                            onGoAdminConsole()
                          }
                          setIsUserMenuOpen(false)
                        }}>
                        {'관리자 콘솔'}
                        <Image
                          src={Assets.Icon.arrowUpRightBlack}
                          alt=""
                          width={12}
                          height={12}
                        />
                      </button>
                    </li>
                    {accessDNF && (
                      <li>
                        <button
                          type="button"
                          role="menuitem"
                          className="study-link"
                          onClick={() => {
                            router.push('/8th/teacher/dodonfriends')
                          }}>
                          {'선생님 강의실'}
                          <Image
                            src={Assets.Icon.arrowUpRightBlack}
                            alt=""
                            width={12}
                            height={12}
                          />
                        </button>
                      </li>
                    )}
                    {isLogin && (
                      <li>
                        <button
                          type="button"
                          role="menuitem"
                          className="study-link"
                          onClick={() => {
                            setIsUserMenuOpen(false)
                            router.push(SITE_PATH.ACCOUNT_8TH.FORWARDER)
                          }}>
                          {`${t('t8th0325')} (${studentName})`}
                          <Image
                            src={Assets.Icon.arrowUpRightBlack}
                            alt=""
                            width={12}
                            height={12}
                          />
                        </button>
                      </li>
                    )}
                    <li>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          router.replace(SITE_PATH.ACCOUNT_8TH.SIGNOUT)
                        }}>
                        {t('t8th297')}
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : null}

          {/* <LanguageSelect locale={locale} />
          {isLogin ? (
            <AccountMenu locale={locale} />
          ) : (
            <Link className="account-button" href={accountHref}>
              {accountLabel}
            </Link>
          )}
          <AppInstallSelect /> */}
        </div>
      </div>
    </HpGnbStyled>
  )
}

function getMenus(
  target: ServiceTarget,
  country: ServiceCountry,
  isApp: boolean,
  introUse: { rg: boolean; dnf: boolean },
  isPaymentable: boolean,
  t: (key: string) => string,
) {
  const APP_DISABLED_MENUS = ['payment-school', 'book-rental']
  const PRIVATE = [
    'introduce-rg',
    'introduce-dnf',
    'news',
    'leaderboard',
    'payment',
    'book-rental',
    'help-private',
  ]
  const SCHOOL = [
    'introduce-rg',
    'news',
    'leaderboard',
    'payment-school',
    'book-rental',
    'help-school',
  ]
  const ACADEMY = ['introduce-rg', 'introduce-dnf', 'news', 'help-academy']
  const PRIVATE_VN = [
    'introduce-rg',
    'introduce-dnf',
    'news',
    'payment',
    'help-private',
  ]
  const GLOBAL = ['introduce-rg', 'introduce-dnf', 'news', 'help-global']

  const getLabel = (id: string, isApp: boolean) => {
    switch (id) {
      case 'introduce-rg':
        return t('t8th0327')
      case 'introduce-dnf':
        return t('t8th0386')
      case 'news':
        return t('t8th0328')
      case 'leaderboard':
        return t('t8th0329')
      case 'payment':
        return isApp ? t('t8th0330') : t('t8th0331')
      case 'payment-school':
        return t('t8th095')
      case 'book-rental':
        return t('t8th0332')
      case 'help-private':
      case 'help-school':
      case 'help-academy':
      case 'help-global':
        return t('t8th0333')
      default:
        return ''
    }
  }

  return MENU_BASE.map((menu) => {
    const label = getLabel(menu.id, isApp)
    return {
      id: menu.id,
      href: menu.href,
      label: label,
    }
  })
    .filter((menu) => {
      if (country === 'kr') {
        if (target === 'private') {
          return PRIVATE.includes(menu.id)
        } else if (target === 'school') {
          return SCHOOL.includes(menu.id)
        } else if (target === 'academy') {
          return ACADEMY.includes(menu.id)
        }
      } else {
        if (target === 'private') {
          return PRIVATE_VN.includes(menu.id)
        } else {
          return GLOBAL.includes(menu.id)
        }
      }
    })
    .filter((menu) => {
      if (isApp) {
        return !APP_DISABLED_MENUS.includes(menu.id)
      } else {
        return true
      }
    })
    .filter((menu) => {
      if (menu.id === 'introduce-rg') return introUse.rg
      if (menu.id === 'introduce-dnf') return introUse.dnf
      return true
    })
    .filter((menu) => {
      if (
        !isPaymentable &&
        (menu.id === 'payment' || menu.id === 'payment-school')
      )
        return false
      return true
    })
}

function isActive(pathname: string, href: string) {
  if (href === SITE_PATH.HOME_8TH.HOME) {
    return pathname.endsWith(href)
  }
  return pathname.includes(href)
}
