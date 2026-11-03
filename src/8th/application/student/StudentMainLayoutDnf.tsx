'use client'

import {
  useCustomerConfiguration,
  useCustomerInfo,
} from '@/8th/application/context/CustomerContext'
import { useIsDesktop } from '@/8th/application/context/ScreenModeContext'
import { useLockBodyScroll } from '@/8th/application/context/ScrollLockContext'
import { Assets } from '@/8th/assets/asset-library'
import { AvatarExpression } from '@/8th/assets/avatar'
import {
  useLevelMasters,
  useLevelPoints,
} from '@/8th/features/achieve/service/achieve-query'
import { useSearchFavoriteBook } from '@/8th/features/library/service/search-query'
import { useMonthStatus } from '@/8th/features/myclass/service/myclass-query'
import LessonCalendarCard from '@/8th/features/myclass/ui/component/LessonCalendarCard'
import LessonCalendarModal from '@/8th/features/myclass/ui/modal/LessonCalendarModal'
import { usePointRank } from '@/8th/features/rank/service/rank-query'
import { useHistoryReadingInfinite } from '@/8th/features/review/service/history-query'
import {
  useChangeStudyLearningLevel,
  useContinuousStudy,
  useStudentDailyLearning,
  useTodayStudyLearning,
} from '@/8th/features/student/service/learning-query'
import {
  useStudentAvatarList,
  useStudentLocalConfig,
  useUpdateStudentLocalConfig,
} from '@/8th/features/student/service/setting-query'
import {
  useStudent,
  useStudentHistoryList,
} from '@/8th/features/student/service/student-query'
import StudentProfileCard from '@/8th/features/student/ui/component/StudentProfileCard'
import LevelGuidanceModal from '@/8th/features/student/ui/modal/LevelGuidanceModal'
import MessageModal from '@/8th/features/student/ui/modal/MessageModal'
import SelfStudentClassChangeModal, {
  useSelfStudentChangeInfo,
} from '@/8th/features/student/ui/modal/SelfStudentClassChangeModal'
import { useTodoList } from '@/8th/features/todo/service/todo-query'
import useConnectRefreshToken from '@/8th/shared/hook/useConnectRefreshToken'
import {
  BasicGridLayoutStyle,
  BodyContainerStyle,
  ContentsWrapperStyle,
  LeftContainerStyle,
  LogoutButtonStyle,
  MenuItemStyle,
  MobileTopPlaceholderStyle,
  RightContainerStyle,
} from '@/8th/shared/styled/SharedStyled'
import { AvatarSync, AvatarSyncContextProvider } from '@/8th/shared/ui/Avatar'
import FooterMenu from '@/8th/shared/ui/FooterMenu'
import GlobalNavBarDnf from '@/8th/shared/ui/GlobalNavBarDnf'
import { openWindow } from '@/8th/shared/utils/open-window'
import { injectUid } from '@/app/api/aalog/logutil'
import SITE_PATH, { CUSTOMER_CENTER_URL } from '@/app/site-path'
import useTranslation from '@/localization/client/useTranslations'
import DateUtils from '@/util/date-utils'
import LevelUtils from '@/util/level-utils'
import NumberUtils from '@/util/number-utils'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { getMenuItem } from '../root/SiteNav'
import useMainLayoutTypeGuard from './useMainLayoutTypeGuard'

export default function StudentMainLayoutDnf({
  children,
}: {
  children: React.ReactNode
}) {
  useConnectRefreshToken()

  const { notAccessibleFlag } = useMainLayoutTypeGuard('dnf')

  if (notAccessibleFlag === 'unknown') {
    return null
  }
  if (notAccessibleFlag === true) {
    return null
  }
  return <MainLayout>{children}</MainLayout>
}

function MainLayout({ children }: { children: React.ReactNode }) {
  // @Language 'common'
  const { t } = useTranslation()

  const isDesktop = useIsDesktop()

  const { menu, target, country } = useCustomerConfiguration()

  const pathname = usePathname()
  const router = useRouter()
  const header = getMenuItem(pathname)

  useEffect(() => {
    if (header === null) {
      setIsRightContainerOpen(false)
    }
  }, [header])

  const leftContainerGap = 25

  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false)
  const [isRightContainerOpen, setIsRightContainerOpen] = useState(false)

  /// right container
  const student = useStudent()
  const continuousStudy = useContinuousStudy()
  const todayLearning = useTodayStudyLearning()
  const dailyLearning = useStudentDailyLearning()
  const levelPoint = useLevelPoints()
  const todo = useTodoList()
  const favorite = useSearchFavoriteBook({ status: 'All' })
  const avatar = useStudentAvatarList()
  const myAvatar = avatar.data?.list.find(
    (item) => item.avatarId === avatar.data?.avatarId,
  )

  const rank = usePointRank({ type: 'total' })
  const myRank = rank.data?.user ? rank.data.user.totalRank : 0
  const todayText = DateUtils.toStringDate(new Date(), {
    divide: '',
    digitfix: true,
  })
  const latestHistory = useHistoryReadingInfinite({
    startDate: todayText,
    endDate: todayText,
    status: 'All',
    page: 1,
  })
  const latestLevelMaster = useLevelMasters()

  const { mutate: changeStudyLevel } = useChangeStudyLearningLevel({
    onSuccess: () => {
      setRecommendLevel({
        level: recommendLevel.level,
        checkDate: recommendLevel.checkDate,
        visible: false,
      })
    },
  })

  const { customerId, customerUse, countryCode } = useCustomerInfo()
  const studentId = student.data?.student?.studentId || ''
  const userConfig = useStudentLocalConfig({ customerId, studentId })
  const updateUserConfig = useUpdateStudentLocalConfig()

  const studentHistory = useStudentHistoryList()
  const defaultStudentHistoryId =
    studentHistory.data?.list && studentHistory.data?.list.length > 0
      ? studentHistory.data.list[0].studentHistoryId
      : undefined
  const defaultClassId =
    studentHistory.data?.list && studentHistory.data?.list.length > 0
      ? studentHistory.data.list[0].classId
      : undefined

  const isStudentHistoryActive = !!defaultClassId && !!defaultStudentHistoryId

  // 학습캘린더
  const today = new Date()
  const todayString = DateUtils.toStringDate(today, {
    divide: '',
    digitfix: true,
  })
  const { data: lessonData, isLoading } = useMonthStatus(
    {
      classId: defaultClassId!,
      studentHistoryId: defaultStudentHistoryId!,
      startDate: todayString,
      endDate: todayString,
    },
    {
      enabled: isStudentHistoryActive,
    },
  )
  const lessonDay: { isAssign: boolean; isComplete: boolean }[] =
    lessonData?.day?.map((lesson) => {
      return {
        isAssign: lesson.unit > 0 && lesson.unitCount > 0,
        isComplete:
          lesson.unit > 0 && lesson.unitPassCount === lesson.unitCount,
      }
    }) || []

  // 레벨추천 가이드 모달
  const [recommendLevel, setRecommendLevel] = useState<{
    level: string
    checkDate: string
    visible: boolean
    popupType?: 'change' | 'levelupback'
  }>({
    level: '',
    checkDate: '',
    visible: false,
  })

  // Self 전반 모달
  const { isShowSelfStudentChangeModal, onClassGroupChangeResult } =
    useSelfStudentChangeInfo()

  // App User Guide 모달
  const [isShowAppUserGuideModal, setShowAppUserGuideModal] = useState(false)
  useEffect(() => {
    if (userConfig._id && userConfig.appUserGuideAutoShow) {
      setShowAppUserGuideModal(true)
    }
  }, [userConfig._id, userConfig.appUserGuideAutoShow])

  useEffect(() => {
    injectUid(studentId)
  }, [studentId])

  const footerRef = useRef<HTMLDivElement>(null)
  const [footerOffset, setFooterOffset] = useState(0)
  const FOOTER_HEIGHT_PX = 60

  useEffect(() => {
    // 데스크톱에서만 footer 노출 높이를 추적하고, 그만큼 RightContainer를 위로 올린다.
    if (!isDesktop) {
      setFooterOffset(0)
      return
    }

    const footer = footerRef.current
    if (!footer) {
      setFooterOffset(0)
      return
    }

    // 0..1 범위를 1% 단위로 나눠 단일 threshold보다 더 부드럽게 offset을 갱신한다.
    const thresholds = Array.from({ length: 101 }, (_, index) => index / 100)
    const observer = new IntersectionObserver(
      ([entry]) => {
        const footerHeight = footer.offsetHeight || FOOTER_HEIGHT_PX
        const footerTop = entry.boundingClientRect.top
        const isOutsideViewport =
          footerTop >= window.innerHeight || footerTop + footerHeight <= 0
        const visibleHeight =
          !entry.isIntersecting || isOutsideViewport
            ? 0
            : Math.max(0, window.innerHeight - footerTop)
        // offset이 footer 높이를 넘지 않도록 안전하게 제한한다.
        const nextOffset = Math.min(visibleHeight, footerHeight)
        setFooterOffset((prev) =>
          Math.abs(prev - nextOffset) < 1 ? prev : nextOffset,
        )
      },
      {
        threshold: thresholds,
      },
    )

    observer.observe(footer)

    return () => {
      observer.disconnect()
    }
  }, [isDesktop])

  const rightContainerRef = useRef<HTMLDivElement>(null)
  const isShowRightContainerOverlay = isRightContainerOpen && !isDesktop

  useEffect(() => {
    if (!isShowRightContainerOverlay) {
      return
    }

    const rafId = window.requestAnimationFrame(() => {
      if (rightContainerRef.current) {
        rightContainerRef.current.scrollTop = 0
      }
    })

    return () => window.cancelAnimationFrame(rafId)
  }, [isShowRightContainerOverlay])

  useLockBodyScroll(isShowRightContainerOverlay)

  const latestHistoryPassedItems =
    latestHistory.data && latestHistory.data.pages.length > 0
      ? latestHistory.data?.pages[0].history.filter(
          (history) => history.average >= 70,
        )
      : undefined
  const userLevel = dailyLearning?.data?.settingLevelName || 'PK'

  if (
    latestHistoryPassedItems &&
    latestHistoryPassedItems.length > 0 &&
    !!dailyLearning?.data?.settingLevelName
  ) {
    const historyLevelItem = latestHistoryPassedItems[0]
    const historyLevel = historyLevelItem.levelName.substring(3, 5)
    const historyLevelDate = historyLevelItem.completeDate
    if (historyLevel && userLevel) {
      let visible = false
      let popupType: 'change' | 'levelupback' = 'change'

      const todayLatestLevelMasterData = latestLevelMaster.data?.list.find(
        (item) => item.levelDate === historyLevelDate,
      )

      // 레벨업 되돌리기 알림 체크
      if (!!todayLatestLevelMasterData) {
        const levelUpBackLevelData =
          userConfig.levelGuidanceLevelUpBackRequest.split('#')
        const levelUpBackLevel =
          levelUpBackLevelData.length > 0 ? levelUpBackLevelData[0] : undefined
        const levelUpBackLevelDate =
          levelUpBackLevelData.length > 1 ? levelUpBackLevelData[1] : undefined

        if (
          userLevel === todayLatestLevelMasterData.levelName &&
          historyLevel === todayLatestLevelMasterData.masterLevelName &&
          (levelUpBackLevel !== historyLevel ||
            levelUpBackLevelDate !== historyLevelDate)
        ) {
          visible = true
          popupType = 'levelupback'
        }
      }

      // 최근 학습 레벨 유지 알림 체크
      if (
        !visible &&
        popupType !== 'levelupback' &&
        userConfig.levelGuidanceLevelChange
      ) {
        const findLevelRank = (level: string) => {
          if (level.length < 2) {
            return -1
          }
          if (level.substring(0, 1) === 'P') {
            return 1
          } else if (level.substring(0, 1) === 'K') {
            return 2
          } else if (Number(level.substring(0, 1)) < 4) {
            return Number(level.substring(0, 1)) + 2
          } else {
            return 6
          }
        }
        const userLevelRank = findLevelRank(userLevel)
        const historyLevelRank = findLevelRank(historyLevel)
        if (userLevelRank !== historyLevelRank) {
          visible = true

          const levelChangeRequestLevelData =
            userConfig.levelGuidanceLevelChangeRequestLevel.split('#')
          const levelChangeRequestLevelRank =
            levelChangeRequestLevelData.length > 0
              ? findLevelRank(levelChangeRequestLevelData[0])
              : undefined
          const levelChangeRequestDate =
            levelChangeRequestLevelData.length > 1
              ? levelChangeRequestLevelData[1]
              : undefined
          if (
            popupType === 'change' &&
            historyLevelRank === levelChangeRequestLevelRank &&
            historyLevelDate === levelChangeRequestDate
          ) {
            visible = false
          }
        }
      }
      if (
        recommendLevel.level !== historyLevel ||
        recommendLevel.checkDate !== historyLevelDate ||
        recommendLevel.visible !== visible ||
        recommendLevel.popupType !== popupType
      ) {
        setRecommendLevel({
          level: historyLevel,
          checkDate: historyLevelDate,
          visible,
          popupType,
        })
      }
    }
  }

  const point = student.data?.student?.rgPoint || 0
  let medalName:
    | 'bronze'
    | 'silver'
    | 'gold'
    | 'platinum'
    | 'titanium'
    | undefined = undefined
  if (point >= 50000) {
    medalName = 'titanium'
  } else if (point >= 40000) {
    medalName = 'platinum'
  } else if (point >= 30000) {
    medalName = 'gold'
  } else if (point >= 20000) {
    medalName = 'silver'
  } else if (point >= 10000) {
    medalName = 'bronze'
  }
  const isStreakLegacyMode = continuousStudy.data?.continuousViewType === '6'
  const isTodayStudy = continuousStudy.data?.todayStudyYn || false
  const streakDay = continuousStudy.data?.continuous || 0
  const streakDay6th = continuousStudy.data?.continuous6th || 0
  const dailyType = (dailyLearning.data?.settingType || 'Points') as
    | 'Points'
    | 'Books'
  const dailyValue =
    (dailyType === 'Points'
      ? todayLearning.data?.point
      : todayLearning.data?.books) || 0
  const dailyGoalValue =
    (dailyType === 'Points'
      ? dailyLearning.data?.point
      : dailyLearning.data?.books) || 0
  const studyLevelName = dailyLearning.data?.settingLevelName || 'PK'
  const studyLevelPoint = levelPoint.data?.list.find(
    (level) => level.levelName === studyLevelName,
  )
  const levelMasterProgress = NumberUtils.getHundredPercentage(
    studyLevelPoint?.myRgPoint || 0,
    studyLevelPoint?.requiredRgPoint || 0,
  )

  const onLevelGuidanceModalHandler = (
    action: 'confirm' | 'cancel' | 'close',
    popupType: 'change' | 'levelupback',
    isDoNotShowAgain?: boolean,
  ) => {
    if (action === 'confirm') {
      changeStudyLevel(recommendLevel.level)
    } else {
      setRecommendLevel({
        level: recommendLevel.level,
        checkDate: recommendLevel.checkDate,
        popupType: recommendLevel.popupType,
        visible: false,
      })
    }
    updateUserConfig({
      ...userConfig,
      customerId,
      studentId,
      levelGuidanceLevelChange: isDoNotShowAgain ? false : true,
      levelGuidanceLevelChangeRequestLevel: `${recommendLevel.level}#${recommendLevel.checkDate}`,
      levelGuidanceLevelUpBackRequest:
        popupType === 'levelupback'
          ? `${recommendLevel.level}#${recommendLevel.checkDate}`
          : undefined,
    })
  }

  const footerMenuLinks = [
    {
      event: 'a' as const,
      url: SITE_PATH.HOME.MAIN,
      text: t('t8th320'),
    },
    {
      event: 'a' as const,
      url: SITE_PATH.HOME.NEWS_POST,
      text: t('t8th321'),
    },
    // {
    //   event: 'click',
    //   text: t('t8th321'),
    // },
    {
      event: 'click' as const,
      text: t('t8th322'),
      url: '',
      onClick: () => {
        let url: string | undefined = undefined
        if (country === 'vn') {
          url = CUSTOMER_CENTER_URL.vietnam
        } else {
          if (target === 'private') {
            url = CUSTOMER_CENTER_URL.private
          } else if (target === 'school') {
            url = CUSTOMER_CENTER_URL.school
          } else if (target === 'academy') {
            url = CUSTOMER_CENTER_URL.academy
          }
        }
        if (url) {
          openWindow(url, {
            external: true,
            target: '_blank',
            feature: 'noopener, noreferrer',
          })
        }
      },
    },
  ]

  let avatarExpression = AvatarExpression.DEFAULT
  if (dailyValue > 0 && dailyValue >= dailyGoalValue) {
    avatarExpression = AvatarExpression.EXCITED
  } else if (dailyValue <= 0) {
    avatarExpression = AvatarExpression.DISAPPOINTED
  }

  return (
    <AvatarSyncContextProvider
      avatarId={myAvatar?.avatarId}
      expression={avatarExpression}>
      {isShowSelfStudentChangeModal && (
        <SelfStudentClassChangeModal
          onClassGroupChangeResult={onClassGroupChangeResult}
        />
      )}
      {recommendLevel.visible && recommendLevel.popupType === 'change' && (
        <LevelGuidanceModal
          title={`${t('t8th302')}`}
          subtitle={t('t8th303')}
          message={t('t8th304', {
            txt: LevelUtils.getLevelLabel(recommendLevel.level),
          })}
          isCheckableDoNotShowAgain={true}
          onCloseModal={(isDoNotShowAgain) => {
            onLevelGuidanceModalHandler('close', 'change', isDoNotShowAgain)
          }}
          onConfirm={(isDoNotShowAgain) => {
            onLevelGuidanceModalHandler('confirm', 'change', isDoNotShowAgain)
          }}
          onCancel={(isDoNotShowAgain) => {
            onLevelGuidanceModalHandler('cancel', 'change', isDoNotShowAgain)
          }}
        />
      )}
      {recommendLevel.visible && recommendLevel.popupType === 'levelupback' && (
        <MessageModal
          title={`${t('t8th302')}`}
          message={t('t8th323', {
            txt1: LevelUtils.getLevelLabel(userLevel),
            txt2: LevelUtils.getLevelLabel(recommendLevel.level),
          })}
          onCloseModal={() => {
            onLevelGuidanceModalHandler('close', 'levelupback')
          }}
          onConfirm={() => {
            onLevelGuidanceModalHandler('confirm', 'levelupback')
          }}
          onCancel={() => {
            onLevelGuidanceModalHandler('cancel', 'levelupback')
          }}
        />
      )}
      <GlobalNavBarDnf />
      <BodyContainerStyle>
        <ContentsWrapperStyle>
          {header && <MobileTopPlaceholderStyle />}
          <BasicGridLayoutStyle>
            <LeftContainerStyle leftContainerGap={leftContainerGap}>
              {header && (
                <div className="left-container-title-box">
                  <div className="title" onClick={() => {}}>
                    <Image
                      src={header.icon}
                      alt={header.title.toLowerCase().replace(' ', '-')}
                      width={38}
                      height={38}
                    />
                    {header.title}
                  </div>
                  <div className="menu">
                    <MenuItemAvatar
                      medal={medalName}
                      onClick={() => setIsRightContainerOpen(true)}
                    />
                  </div>
                </div>
              )}
              {children}
            </LeftContainerStyle>

            <RightContainerStyle
              ref={rightContainerRef}
              className={isShowRightContainerOverlay ? 'active' : ''}
              style={
                isDesktop
                  ? { ['--footer-offset' as string]: `${footerOffset}px` }
                  : undefined
              }>
              <div
                className="right-container-close-button"
                onClick={() => setIsRightContainerOpen(false)}>
                <Image
                  src={Assets.Icon.deleteBlack}
                  alt="CLOSE"
                  width={24}
                  height={24}
                />
              </div>
              <StudentProfileCard
                studentName={student.data?.student?.name || ''}
                book={student.data?.student?.brCount || 0}
                point={NumberUtils.toRgDecimalPoint(
                  student.data?.student?.rgPoint || 0,
                )}
                todo={todo.data?.count || 0}
                favorite={favorite.data?.page.totalRecords || 0}
                isOpenTodo={menu.activity.todo.open}
                isOpenFavorite={menu.activity.favorite.open}
                isChangeableLevel={false}
                medal={medalName}
                onMenuClick={(menuId) => {
                  if (menuId === 'activity') {
                    router.push(SITE_PATH.DODON_FRIENDS.ACTIVITY)
                  } else if (menuId === 'todo') {
                    router.push(SITE_PATH.DODON_FRIENDS.TODO)
                  } else if (menuId === 'favorite') {
                    router.push(SITE_PATH.DODON_FRIENDS.FAVORITE)
                  }
                  setIsRightContainerOpen(false)
                }}
              />
              {/* {menu.streak.open && isDesktop && (
                <StreakCard
                  isClassicMode={isStreakLegacyMode}
                  isTodayStudy={isTodayStudy}
                  streakDay={isStreakLegacyMode ? streakDay6th : streakDay}
                />
              )} */}
              {/* {!dailyLearning.isError && (
                <DailyGoalCard
                  studentId={student.data?.student?.studentId || ''}
                  loading={dailyLearning.isLoading}
                  currentValue={dailyValue}
                  settingValue={dailyGoalValue}
                  settingType={dailyType}
                />
              )} */}
              {/* <ReadingUnitCard point={point} /> */}
              <LessonCalendarCard
                year={today.getFullYear()}
                month={today.getMonth() + 1}
                dayData={lessonDay}
              />
              <LogoutButtonStyle
                onClick={() => {
                  // router.replace('/signoff')
                  window.location.href = '/8th/signout'
                }}>
                {t('t8th297')}
              </LogoutButtonStyle>
              {/* {isAvailable8thCustomerFlag && (
                <GoTo7thButtonStyle
                  onClick={() => {
                    updateSiteBridge('od')
                    window.location.href = '/'
                  }}>
                  {t('t8th316')}
                </GoTo7thButtonStyle>
              )} */}
            </RightContainerStyle>

            {isShowRightContainerOverlay && (
              <div
                className="right-container-overlay"
                onClick={() => setIsRightContainerOpen(false)}
              />
            )}
          </BasicGridLayoutStyle>

          {/* 모달 */}
          {isCalendarModalOpen && (
            <LessonCalendarModal
              onCloseModal={() => setIsCalendarModalOpen(false)}
            />
          )}
        </ContentsWrapperStyle>
        <FooterMenu menuLinks={footerMenuLinks} footerRef={footerRef} />
      </BodyContainerStyle>
    </AvatarSyncContextProvider>
  )
}

function MenuItemAvatar({
  medal,
  levelName,
  onClick,
}: {
  medal?: 'titanium' | 'platinum' | 'gold' | 'silver' | 'bronze'
  /** 모바일(폰)에서만 아바타 이미지와 겹쳐 표시 (예: KA, 1B) */
  levelName?: string
  onClick?: () => void
}) {
  const frameImage = medal ? Assets.HallOfFame.Profile[medal].src : undefined
  return (
    <MenuItemStyle
      className={levelName ? 'menu-item-avatar-with-level' : undefined}
      style={{ padding: 0 }}
      onClick={onClick}>
      <div
        style={{ position: 'relative', width: 46, height: 46, flexShrink: 0 }}>
        {frameImage && (
          <Image
            src={frameImage}
            alt=""
            width={46}
            height={46}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 2,
            }}
          />
        )}
        <div
          style={{
            width: 32,
            height: 32,
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1,
          }}>
          <AvatarSync size="small" />
        </div>
        {!!levelName && (
          <span className="menu-item-avatar-level-label" title={levelName}>
            {LevelUtils.getLevelLabel(levelName)}
          </span>
        )}
      </div>
    </MenuItemStyle>
  )
}
