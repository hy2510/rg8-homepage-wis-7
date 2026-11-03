'use client'

import { useCustomerConfiguration } from '@/8th/application/context/CustomerContext'
import { useIsTabletLarge } from '@/8th/application/context/ScreenModeContext'
import { MENU_ITEM } from '@/8th/application/root/SiteNav'
import { Assets } from '@/8th/assets/asset-library'
import LessonCalendarModal from '@/8th/features/myclass/ui/modal/LessonCalendarModal'
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
import GlobalNavDropdowns from './GlobalNavDropdowns'
import { Gap } from './Misc'

/**
 * RG TRACK ... More 까지
 */

const MP3_URL = {
  dodo: 'https://util.readinggate.com/Library/DodoABCWorkSheetMP3Info',
  pk: 'https://wcfresource.a1edu.com/NewSystem/AppMobile/webview/randing/prek_workbook_mp3/',
}

export default function GlobalNavBarDnf() {
  // @Language 'common'
  const { t } = useTranslation()

  const { menu } = useCustomerConfiguration()

  const maketingEventTracker = useTrack()

  const isGnbBottom = useIsTabletLarge('smaller')

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isCalendarOpen, setCalendarOpen] = useState(false)
  const [isLevelTestOpen, setLevelTestOpen] = useState(false)

  const pathname = usePathname()

  const router = useRouter()

  const dropdownItems: { text: string; onClick: () => void }[] = []
  if (menu.levelTest.open) {
    dropdownItems.push({
      text: 'Level Test',
      onClick: () => setLevelTestOpen(true),
    })
  }

  if (menu.activity.tryAgain.open) {
    dropdownItems.push({
      text: 'Try Again',
      onClick: () => {
        maketingEventTracker.eventAction('GNB 탭 클릭', {
          version: '8th',
          tab_name: 'Try Again',
        })
        router.push(SITE_PATH.DODON_FRIENDS.TRYAGAIN)
      },
    })
  }
  // 더빙, 무비 메뉴 추가(모바일로 메뉴 축소된 경우에만 추가)
  if (isGnbBottom) {
    if (menu.dubbing.open) {
      dropdownItems.push({
        text: MENU_ITEM.Dubbing.title,
        onClick: () => router.push(SITE_PATH.DODON_FRIENDS.DUBBING),
      })
    }
    if (menu.movies.open) {
      dropdownItems.push({
        text: MENU_ITEM.Movies.title,
        onClick: () => router.push(SITE_PATH.DODON_FRIENDS.MOVIES),
      })
    }
  }

  if (menu.account.setting.open) {
    dropdownItems.push({
      text: 'Setting',
      onClick: () => {
        maketingEventTracker.eventAction('GNB 탭 클릭', {
          version: '8th',
          tab_name: 'Setting',
        })
        router.push(SITE_PATH.DODON_FRIENDS.ACCOUNTINFO_SETTING)
      },
    })
  }
  if (menu.dodoAbcWorkbookMp3.open && menu.eb.readingLevel.level.dodoAbc.open) {
    // dropdownItems.push({
    //   // 'PK Workbook MP3',
    //   text: t('t8th342'),
    //   onClick: () => {
    //     maketingEventTracker.eventAction('GNB 탭 클릭', {
    //       version: '8th',
    //       tab_name: 'PK Workbook MP3',
    //     })
    //     openWindow(MP3_URL.dodo, {
    //       external: true,
    //       target: '_blank',
    //       feature: 'noopener, noreferrer',
    //     })
    //   },
    // })
  }

  return (
    <GlobalNavBarStyle $zIndex={isDropdownOpen ? 1000 : 100}>
      <div className="logo-container">
        <Link
          href={'#'}
          onClick={() => (window.location.href = SITE_PATH.HOME.MAIN)}>
          <Image
            src={Assets.Image.AppLogoDnf}
            alt="App Logo"
            className="dnf-logo"
          />
        </Link>
      </div>

      <div className="menu-container">
        <MenuItem
          icon={MENU_ITEM.MyClass.icon}
          text={MENU_ITEM.MyClass.title}
          isActive={pathname.includes(SITE_PATH.DODON_FRIENDS.MY_CLASS)}
          linkUrl={SITE_PATH.DODON_FRIENDS.MY_LESSON}
        />
        {(menu.eb.readingLevel.level.dodoAbc.open ||
          menu.eb.readingLevel.level.prekClassic.open ||
          menu.eb.open ||
          menu.pb.open) && (
          <MenuItem
            icon={MENU_ITEM.Library.icon}
            text={MENU_ITEM.Library.title}
            isActive={pathname.includes(SITE_PATH.DODON_FRIENDS.LIBRARY)}
            linkUrl={SITE_PATH.DODON_FRIENDS.LIBRARY}
          />
        )}
        {menu.activity.open && (
          <MenuItem
            icon={MENU_ITEM.Activity.icon}
            text={MENU_ITEM.Activity.title}
            isActive={
              pathname.includes(SITE_PATH.DODON_FRIENDS.ACTIVITY) ||
              pathname.includes(SITE_PATH.DODON_FRIENDS.ACCOUNTINFO)
            }
            linkUrl={SITE_PATH.DODON_FRIENDS.ACTIVITY}
          />
        )}
        {menu.calendar.open && (
          <DisplayNoneStyle $hideOnLabtopS>
            <div className="divider" />

            {menu.dubbing.open && (
              <>
                <Gap size={10} />
                <MenuItem
                  icon={MENU_ITEM.Dubbing.icon}
                  text={MENU_ITEM.Dubbing.title}
                  isActive={pathname.includes(SITE_PATH.DODON_FRIENDS.DUBBING)}
                  linkUrl={SITE_PATH.DODON_FRIENDS.DUBBING}
                />
              </>
            )}
            {menu.movies.open && (
              <>
                <Gap size={10} />
                <MenuItem
                  icon={MENU_ITEM.Movies.icon}
                  text={MENU_ITEM.Movies.title}
                  isActive={pathname.includes(SITE_PATH.DODON_FRIENDS.MOVIES)}
                  linkUrl={SITE_PATH.DODON_FRIENDS.MOVIES}
                />
              </>
            )}
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
        <LessonCalendarModal onCloseModal={() => setCalendarOpen(false)} />
      )}
      {isLevelTestOpen && (
        <LevelTestInfoModal onClose={() => setLevelTestOpen(false)} />
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
  dropdownItems?: { text: string; onClick: () => void }[]
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
