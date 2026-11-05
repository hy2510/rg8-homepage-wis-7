'use client'

import { useCustomerConfiguration } from '@/8th/application/context/CustomerContext'
import { useIsTabletLarge } from '@/8th/application/context/ScreenModeContext'
import { MENU_ITEM } from '@/8th/application/root/SiteNav'
import { Assets } from '@/8th/assets/asset-library'
import CalendarModal from '@/8th/features/achieve/ui/modal/CalendarModal'
import LevelTestInfoModal from '@/8th/features/student/ui/modal/LevelTestInfoModal'
import SITE_PATH from '@/app/site-path'
import { useTrack } from '@/external/marketing-tracker/component/MarketingTrackerContext'
import useTranslation from '@/localization/client/useTranslations'
import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  DisplayNoneStyle,
  GlobalNavBarStyle,
  MenuItemStyle,
} from '../styled/SharedStyled'
import { openWindow } from '../utils/open-window'
import GlobalNavDropdowns from './GlobalNavDropdowns'
import { Gap } from './Misc'
import AppUserGuideModal from './modal/app-user-guide/AppUserGuideModal'

/**
 * RG TRACK ... More 까지
 */

const MP3_URL = {
  dodo: 'https://util.readinggate.com/Library/DodoABCWorkSheetMP3Info',
  pk: 'https://wcfresource.a1edu.com/NewSystem/AppMobile/webview/randing/prek_workbook_mp3/',
}

export default function GlobalNavBar() {
  // @Language 'common'
  const { t } = useTranslation()

  const { menu, logo, setting, targetTemplate } = useCustomerConfiguration()

  const maketingEventTracker = useTrack()

  const isGnbBottom = useIsTabletLarge('smaller')

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isCalendarOpen, setCalendarOpen] = useState(false)
  const [isLevelTestOpen, setLevelTestOpen] = useState(false)
  const [isShowAppUserGuideModal, setShowAppUserGuideModal] = useState(false)

  const pathname = usePathname()

  const router = useRouter()

  const paymentUrl = setting.paymentable ? setting.paymentUrl : undefined

  const dropdownItems: {
    text: string
    icon?: string | StaticImageData
    isService?: boolean
    onClick: () => void
  }[] = []
  if (menu.levelTest.open) {
    dropdownItems.push({
      text: 'Level Test',
      icon: '/src/images/more-menu/level-test.png',
      onClick: () => setLevelTestOpen(true),
    })
  }

  if (menu.activity.tryAgain.open) {
    dropdownItems.push({
      text: 'Try Again',
      icon: '/src/images/more-menu/try-again.png',
      onClick: () => {
        maketingEventTracker.eventAction('GNB 탭 클릭', {
          version: '8th',
          tab_name: 'Try Again',
        })
        router.push(SITE_PATH.STUDENT_8TH.TRYAGAIN)
      },
    })
  }
  if (menu.account.setting.open) {
    dropdownItems.push({
      text: 'Setting',
      icon: '/src/images/more-menu/setting.png',
      onClick: () => {
        maketingEventTracker.eventAction('GNB 탭 클릭', {
          version: '8th',
          tab_name: 'Setting',
        })
        router.push(SITE_PATH.STUDENT_8TH.ACCOUNTINFO_SETTING)
      },
    })
  }
  if (menu.eb.collections.workbooks.open) {
    dropdownItems.push({
      text: 'Workbook Units',
      icon: '/src/images/more-menu/workbook-units.png',
      onClick: () => {
        maketingEventTracker.eventAction('GNB 탭 클릭', {
          version: '8th',
          tab_name: 'Workbook Units',
        })
        router.push(`${SITE_PATH.STUDENT_8TH.EB_WORKBOOK}/ka`)
      },
    })
  }
  if (menu.dodoAbcWorkbookMp3.open && menu.eb.readingLevel.level.dodoAbc.open) {
    dropdownItems.push({
      // 'PK Workbook MP3',
      text: t('t8th342'),
      icon: '/src/images/more-menu/workbooklistening-dodoabc.png',
      onClick: () => {
        maketingEventTracker.eventAction('GNB 탭 클릭', {
          version: '8th',
          tab_name: 'PK Workbook MP3',
        })
        openWindow(MP3_URL.dodo, {
          external: true,
          target: '_blank',
          feature: 'noopener, noreferrer',
        })
      },
    })
  }
  if (menu.pkWorkbookMp3.open && menu.eb.readingLevel.level.prekClassic.open) {
    dropdownItems.push({
      // 'PK Classic Workbook MP3',
      text: t('t8th341'),
      icon: '/src/images/more-menu/workbook-listening-prek.png',
      onClick: () => {
        maketingEventTracker.eventAction('GNB 탭 클릭', {
          version: '8th',
          tab_name: 'PK Classic Workbook MP3',
        })
        openWindow(MP3_URL.pk, {
          external: true,
          target: '_blank',
          feature: 'noopener, noreferrer',
        })
      },
    })
  }
  if (menu.rank.open) {
    dropdownItems.push({
      text: t('t8th229'),
      icon: '/src/images/more-menu/reading-rankings.png',
      onClick: () => router.push(SITE_PATH.STUDENT_8TH.RANKING),
    })
  }

  // 이용 가이드 보기 안내 메뉴 추가
  dropdownItems.push({
    text: t('t8th317'),
    icon: '/src/images/more-menu/user-guide.png',
    onClick: () => {
      maketingEventTracker.eventAction('GNB 탭 클릭', {
        version: '8th',
        tab_name: 'App User Guide',
      })
      setShowAppUserGuideModal(true)
    },
  })

  if (!!paymentUrl) {
    if (targetTemplate === 'private') {
      dropdownItems.push({
        text: t('t8th343'),
        icon: '/src/images/more-menu/rg-membership.png',
        onClick: () => {
          maketingEventTracker.eventAction('GNB 탭 클릭', {
            version: '8th',
            tab_name: 'RG Membership',
          })
          router.push(SITE_PATH.HOME_8TH.PAYMENT)
        },
      })
    } else if (targetTemplate === 'private-vn' || targetTemplate === 'school') {
      dropdownItems.push({
        text: t('t8th095'),
        icon: '/src/images/more-menu/rg-membership.png',
        onClick: () => {
          maketingEventTracker.eventAction('GNB 탭 클릭', {
            version: '8th',
            tab_name: 'RG Payment',
          })
          const hrefTo =
            targetTemplate === 'school'
              ? paymentUrl
              : SITE_PATH.HOME.MEMBERSHIP_PAYMENT
          router.push(SITE_PATH.HOME_8TH.PAYMENT)
        },
      })
    }
  }
  dropdownItems.push({
    text: t('t8th320'),
    icon: '/src/images/more-menu/homepage.png',
    onClick: () => {
      maketingEventTracker.eventAction('GNB 탭 클릭', {
        version: '8th',
        tab_name: 'Go To Hompage',
      })
      router.push(SITE_PATH.HOME_8TH.HOME)
    },
  })

  if (isGnbBottom) {
    // 더빙룸 메뉴 제거
    // dropdownItems.splice(3, 0, {
    //   text: 'Dubbing',
    //   onClick: () => router.push(SITE_PATH.NW82.EB_WORKBOOK),
    // })
  }

  // 단어 연습 메뉴 추가(모바일로 메뉴 축소된 경우에만 추가)
  if (isGnbBottom) {
    if (menu.wordPractice.open) {
      dropdownItems.push({
        text: MENU_ITEM.WordPractice.title,
        isService: true,
        icon: MENU_ITEM.WordPractice.icon,
        onClick: () => {
          router.push(SITE_PATH.STUDENT_8TH.WORD_PRACTICE)
        },
      })
    }
    if (menu.dubbing.open) {
      dropdownItems.push({
        text: MENU_ITEM.Dubbing.title,
        isService: true,
        icon: MENU_ITEM.Dubbing.icon,
        onClick: () => {
          router.push(SITE_PATH.STUDENT_8TH.DUBBING)
        },
      })
    }
  }

  return (
    <GlobalNavBarStyle
      $zIndex={isDropdownOpen ? 1000 : 100}
      data-bottom-fixed-nav={isGnbBottom ? '' : undefined}>
      <div className="logo-container">
        <Link
          href={'#'}
          onClick={() => (window.location.href = SITE_PATH.HOME_8TH.HOME)}>
          {logo ? (
            <Image
              className="custom-logo"
              width={300}
              height={100}
              src={logo}
              alt="App Logo"
            />
          ) : (
            <Image src={Assets.Image.AppLogo} alt="App Logo" className="logo" />
          )}
        </Link>
      </div>

      <div className="menu-container">
        {menu.dailyRg.open && (
          <MenuItem
            icon={MENU_ITEM.RgTrack.icon}
            text={MENU_ITEM.RgTrack.title}
            isActive={pathname.includes(SITE_PATH.STUDENT_8TH.DAILY_RG)}
            linkUrl={SITE_PATH.STUDENT_8TH.DAILY_RG}
          />
        )}
        {(menu.eb.readingLevel.level.dodoAbc.open ||
          menu.eb.readingLevel.level.prekClassic.open ||
          menu.eb.open ||
          menu.pb.open) && (
          <MenuItem
            icon={MENU_ITEM.Library.icon}
            text={MENU_ITEM.Library.title}
            isActive={pathname.includes(SITE_PATH.STUDENT_8TH.LIBRARY)}
            linkUrl={SITE_PATH.STUDENT_8TH.LIBRARY}
          />
        )}
        {/*
        {menu.eb.open && (
          <MenuItem
            icon={MENU_ITEM.EB.icon}
            text={MENU_ITEM.EB.title}
            isActive={pathname.includes(SITE_PATH.STUDENT_8TH.EB)}
            linkUrl={SITE_PATH.STUDENT_8TH.EB}
          />
        )}
        {menu.pb.open && (
          <MenuItem
            icon={MENU_ITEM.PB.icon}
            text={MENU_ITEM.PB.title}
            isActive={pathname.includes(SITE_PATH.STUDENT_8TH.PB)}
            linkUrl={SITE_PATH.STUDENT_8TH.PB}
          />
        )}
        */}
        {menu.activity.open && (
          <MenuItem
            icon={MENU_ITEM.Activity.icon}
            text={MENU_ITEM.Activity.title}
            isActive={
              pathname.includes(SITE_PATH.STUDENT_8TH.ACTIVITY) ||
              pathname.includes(SITE_PATH.STUDENT_8TH.ACCOUNTINFO)
            }
            linkUrl={SITE_PATH.STUDENT_8TH.ACTIVITY}
          />
        )}
        {menu.calendar.open && (
          <DisplayNoneStyle $hideOnLabtopS>
            {/* // 더빙룸 메뉴 제거
          <div className="divider" />
          <Gap size={10} />
          <MenuItem icon={Assets.Icon.Gnb.dubbing} text="DUBBING" /> 
          */}
            <div className="divider" />
            <Gap size={10} />
            {menu.wordPractice.open && (
              <>
                <MenuItem
                  icon={MENU_ITEM.WordPractice.icon}
                  text={MENU_ITEM.WordPractice.title}
                  isActive={pathname.includes(
                    SITE_PATH.STUDENT_8TH.WORD_PRACTICE,
                  )}
                  linkUrl={SITE_PATH.STUDENT_8TH.WORD_PRACTICE}
                />
                <Gap size={10} />
              </>
            )}
            {menu.dubbing.open && (
              <>
                <MenuItem
                  icon={MENU_ITEM.Dubbing.icon}
                  text={MENU_ITEM.Dubbing.title}
                  isActive={pathname.includes(SITE_PATH.STUDENT_8TH.DUBBING)}
                  linkUrl={SITE_PATH.STUDENT_8TH.DUBBING}
                />
                <Gap size={10} />
              </>
            )}
            <MenuItemCalendar
              text={MENU_ITEM.Calendar.title}
              onClick={() => {
                maketingEventTracker.eventAction('GNB 탭 클릭', {
                  version: '8th',
                  tab_name: 'Calendar',
                })
                setCalendarOpen(true)
              }}
            />
            <Gap size={10} />
            <div className="divider" />
            <Gap size={10} />
          </DisplayNoneStyle>
        )}
        {dropdownItems.length > 0 && (
          <MenuItem
            icon={MENU_ITEM.More.icon}
            text={MENU_ITEM.More.title}
            isActive={false}
            isDropdown={true}
            onDropdownToggle={() => setIsDropdownOpen(!isDropdownOpen)}
            isOpen={isDropdownOpen}
            dropdownItems={dropdownItems}
          />
        )}
      </div>
      {isCalendarOpen && (
        <CalendarModal onCloseModal={() => setCalendarOpen(false)} />
      )}
      {isLevelTestOpen && (
        <LevelTestInfoModal onClose={() => setLevelTestOpen(false)} />
      )}
      {isShowAppUserGuideModal && (
        <AppUserGuideModal
          onCloseModal={() => setShowAppUserGuideModal(false)}
        />
      )}
    </GlobalNavBarStyle>
  )
}

interface MenuItemProps {
  icon?: StaticImageData
  text?: string
  isActive?: boolean
  isDropdown?: boolean
  onDropdownToggle?: () => void
  isOpen?: boolean
  dropdownItems?: {
    text: string
    icon?: string | StaticImageData
    isService?: boolean
    onClick: () => void
  }[]
  linkUrl?: string
  onClick?: () => void
}

function MenuItem({
  icon,
  text,
  isActive,
  isDropdown,
  onDropdownToggle,
  isOpen,
  dropdownItems,
  linkUrl,
  onClick,
}: MenuItemProps) {
  const maketingEventTracker = useTrack()

  const isGnbBottom = useIsTabletLarge('smaller')

  const [dropDownPosition, setDropDownPosition] = useState<
    'topRight' | 'rightCenter'
  >('topRight')

  useEffect(() => {
    let mediaQuery: MediaQueryList | undefined = undefined
    const handleChange = () => {
      if (mediaQuery && !isGnbBottom) {
        setDropDownPosition('rightCenter')
      }
    }

    if (window && isDropdown) {
      if (isGnbBottom) {
        setDropDownPosition('topRight')
      } else {
        const query = `(max-height: 699px)`
        mediaQuery = window.matchMedia(query)
        if (mediaQuery) {
          handleChange()
          mediaQuery.addEventListener('change', handleChange)
        }
      }
    }
    return () => {
      if (mediaQuery) {
        mediaQuery.removeEventListener('change', handleChange)
      }
    }
  }, [isDropdown, isGnbBottom])

  const router = useRouter()

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (linkUrl) {
      maketingEventTracker.eventAction('GNB 탭 클릭', {
        version: '8th',
        tab_name: text,
      })
      router.push(linkUrl)
    } else if (isDropdown && onDropdownToggle) {
      onDropdownToggle()
    }
  }

  return (
    <MenuItemStyle
      className={isActive ? 'is-active' : ''}
      onClick={handleClick}>
      <div className="menu-item-icon">
        <Image
          src={icon as StaticImageData}
          alt={text || ''}
          width={34}
          height={34}
        />
      </div>

      <div className="menu-item-text">{text}</div>

      {isDropdown && isOpen && dropdownItems && (
        <GlobalNavDropdowns
          items={dropdownItems}
          moreGrid
          showArrow={false}
          isOpen={isOpen}
          onClose={() => {
            if (onDropdownToggle) {
              onDropdownToggle()
            }
          }}
          position={dropDownPosition}
        />
      )}
    </MenuItemStyle>
  )
}

function MenuItemCalendar({
  text,
  onClick,
}: {
  text: string
  onClick?: () => void
}) {
  const handleClick = () => {
    if (onClick) {
      onClick()
    }
  }

  const dayNumber = new Date().getDate()

  return (
    <MenuItemStyle onClick={handleClick}>
      <div
        className="menu-item-icon"
        style={{ position: 'relative', display: 'inline-block' }}>
        <Image
          src={Assets.Icon.Gnb.calendar}
          alt={text || ''}
          width={34}
          height={34}
        />
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: 0,
            width: 34,
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}>
          <span
            style={{
              color: '#8A2BE2',
              fontWeight: '900',
              padding: '0',
              fontSize: 11,
            }}>
            {dayNumber}
          </span>
        </div>
      </div>

      <div className="menu-item-text">{text}</div>
    </MenuItemStyle>
  )
}
