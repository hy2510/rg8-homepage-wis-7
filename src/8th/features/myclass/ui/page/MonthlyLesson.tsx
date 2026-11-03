'use client'

import { Assets } from '@/8th/assets/asset-library'
import LibraryTabBar from '@/8th/features/library/ui/component/LibraryTabBar'
import { getStartActivityStatus } from '@/8th/features/myclass/etc/content-action'
import { LectureStart } from '@/8th/features/myclass/model/lecture-start'
import {
  useDailyBook,
  useLectureStart,
  useMonthStatus,
} from '@/8th/features/myclass/service/myclass-query'
import MyLessonBookItem from '@/8th/features/myclass/ui/component/MyLessonBookItem'
import MyLessonHeader from '@/8th/features/myclass/ui/component/MyLessonHeader'
import MyLessonSection from '@/8th/features/myclass/ui/component/MyLessonSection'
import LessonCalendarModal from '@/8th/features/myclass/ui/modal/LessonCalendarModal'
import MyLessonVideoModal from '@/8th/features/myclass/ui/modal/MyLessonVideoModal'
import ClassesList from '@/8th/features/myclass/ui/page/ClassesList'
import {
  useStudent,
  useStudentHistoryList,
} from '@/8th/features/student/service/student-query'
import useStartStudy from '@/8th/shared/hook/useStartStudy'
import {
  MyLessonStyle,
  QuickJumpButtonStyle,
} from '@/8th/shared/styled/FeaturesStyled'
import { BoxStyle, Gap, TextStyle } from '@/8th/shared/ui/Misc'
import SITE_PATH from '@/app/site-path'
import useTranslation from '@/localization/client/useTranslations'
import DateUtils from '@/util/date-utils'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

export default function MonthlyLesson({
  year,
  month,
}: {
  year?: number
  month?: number
}) {
  // @Language 'common'
  const { t } = useTranslation()

  const student = useStudent()
  const isStudyAllEnabled = student?.data?.student?.usePreviewFlag === 'A'
  const isPreviewEnabled = student?.data?.student?.usePreviewFlag === 'Y'

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

  const nowDate = new Date()
  const yearValue = year ?? nowDate.getFullYear()
  const monthValue = month ?? nowDate.getMonth() + 1
  const monthDate = DateUtils.toStringDate(
    new Date(yearValue, monthValue - 1, 1),
    {
      divide: '',
      digitfix: true,
    },
  )
  const { data, isLoading, isPending } = useMonthStatus(
    {
      classId: defaultClassId!,
      studentHistoryId: defaultStudentHistoryId!,
      startDate: monthDate,
      endDate: monthDate,
    },
    {
      enabled: isStudentHistoryActive,
    },
  )

  if (!isStudentHistoryActive) {
    // 소속반이 없음.
    return <></>
  }

  if (isPending || isLoading) {
    // 로딩 중.
    return <></>
  }

  const isError = !data || !data.day
  if (isError) {
    return <></>
  }

  const isActiveMyLesson = !!student.data?.student?.useLectureYn

  const daySection: DaySection[] = data.day
    .filter((section) => section.unit > 0)
    .map((section) => ({
      date: section.weekDays,
      dayNumber: section.unit,
      lessonCount: section.unitCount,
      passCount: section.unitPassCount,
    }))

  const hasLectureThisMonth =
    isActiveMyLesson &&
    daySection.filter((lesson) => lesson.lessonCount > 0).length > 0

  if (!hasLectureThisMonth) {
    // 이번달 학습이 없는 경우, Classes 목록 화면 렌더링 하도록 강제함.
    return <ClassesList />

    // 이 달에 학습할 내용 없음
    // return (
    //   <>
    //     <LibraryTabBar
    //       items={[
    //         {
    //           href: SITE_PATH.DODON_FRIENDS.MY_LESSON,
    //           active: true,
    //           label: t('t8thdf001'),
    //         },
    //         {
    //           href: SITE_PATH.DODON_FRIENDS.CLASSES,
    //           active: false,
    //           label: t('t8thdf002'),
    //         },
    //       ]}
    //     />
    //     <div
    //       style={{
    //         display: 'flex',
    //         flexDirection: 'column',
    //         alignItems: 'center',
    //         justifyContent: 'center',
    //         minHeight: '400px',
    //       }}>
    //       <TextStyle fontSize="large" fontFamily="sans">
    //         {t('t8thdf038')}
    //       </TextStyle>
    //     </div>
    //   </>
    // )
  }

  return (
    <>
      <LibraryTabBar
        items={[
          {
            href: SITE_PATH.DODON_FRIENDS.MY_LESSON,
            active: true,
            label: t('t8thdf001'),
          },
          {
            href: SITE_PATH.DODON_FRIENDS.CLASSES,
            active: false,
            label: t('t8thdf002'),
          },
        ]}
      />
      <MonthlyLessonSectionList
        studentHistoryId={defaultStudentHistoryId!}
        classId={defaultClassId!}
        isStudyAllEnabled={isStudyAllEnabled}
        isPreviewEnabled={isPreviewEnabled}
        daySection={daySection}
      />
    </>
  )
}

type DaySection = {
  date: string
  dayNumber: number
  lessonCount: number
  passCount: number
}

function MonthlyLessonSectionList({
  studentHistoryId,
  classId,
  isStudyAllEnabled,
  isPreviewEnabled,
  daySection,
}: {
  studentHistoryId: string
  classId: string
  isStudyAllEnabled: boolean
  isPreviewEnabled: boolean
  daySection: DaySection[]
}) {
  // @Language 'common'
  const { t } = useTranslation()

  const now = new Date()
  const today = DateUtils.toStringDate(now, {
    digitfix: true,
    divide: '',
  })

  const router = useRouter()

  const student = useStudent()

  const [movieStudyInfo, setMovieStudyInfo] = useState<{
    studyId: string
    studentHistoryId: string
    levelRoundId: string
    videoUrl: string
  } | null>(null)

  const { onStartStudy, userType } = useStartStudy('quiz', 'dnf')
  const activityStart = useLectureStart({
    onSuccess: (data, variables) => {
      const { activityType, startMode, playMode } = variables
      const payload: LectureStart = data as LectureStart
      if (playMode === 'movie') {
        setMovieStudyInfo({
          studyId: payload.studyId,
          studentHistoryId: payload.studentHistoryId,
          levelRoundId: payload.levelRoundId,
          videoUrl: payload.animationPath,
        })
      } else {
        onStartStudy({ ...payload }, { isPreview: startMode === 'preview' })
      }
    },
    onError: (error) => {
      alert(t('t8thdf007'))
    },
  })

  const isTodayBooks = daySection.find(
    (lesson) => lesson.date === today && lesson.lessonCount > 0,
  )

  const { data: dayData, isLoading } = useDailyBook(
    {
      classId,
      studentHistoryId,
      date: today,
      page: 1,
    },
    {
      enabled: !!isTodayBooks,
    },
  )

  const currentActivityId = useMemo(() => {
    const lectures = dayData?.lectures
    if (!lectures) {
      return ''
    }
    let activityId = ''
    for (let i = 0; i < lectures.length; i++) {
      for (let j = 0; j < lectures[i].activities.length; j++) {
        const currentActivity = lectures[i].activities[j]
        if (currentActivity.status === 'Not Yet') {
          activityId = `${currentActivity.levelRoundId}-${currentActivity.activityType}`
          break
        }
      }
      if (!!activityId) {
        break
      }
    }
    return activityId
  }, [dayData?.lectures])

  const focusTargetRef = useRef<HTMLDivElement>(null)
  const [jumpButtonState, setJumpButtonState] = useState<
    'up' | 'down' | undefined
  >('down')

  const [isItemHeightCatched, setItemHeightCatched] = useState(false)
  const [scrollRetryCount, setScrollRetryCount] = useState(0)

  // 데이터가 준비되었는지 확인
  const isDataReady =
    !isLoading &&
    !!isTodayBooks &&
    !!dayData &&
    dayData.lectures &&
    dayData.lectures.length > 0

  // stageId, currentSectionId, focusBookLevelRoundId가 변경될 때마다 타겟 위치 재계산을 위해 리셋
  useLayoutEffect(() => {
    const prevScrollRestoreVal = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'
    // 스크롤을 맨 위로 이동시키지 않고, 타겟 위치로 이동하도록 함
    setItemHeightCatched(false)
    setScrollRetryCount(0)

    return () => {
      window.history.scrollRestoration = prevScrollRestoreVal
    }
  }, [currentActivityId])

  const currentTargetInfo = useMemo(() => {
    if (!isItemHeightCatched) {
      return undefined
    }

    const element = focusTargetRef.current
    if (!element) {
      return undefined
    }

    const elementBox = element.getBoundingClientRect()
    const style = window.getComputedStyle(element)

    // 타겟 요소의 절대 위치 (절대 상단 위치)
    const targetElementTop = window.scrollY + elementBox.top

    // 아이템 박스의 높이 (마진 포함)
    const boxHeight =
      elementBox.height +
      (parseInt(style.marginTop ?? '0') ?? 0) +
      (parseInt(style.marginBottom ?? '0') ?? 0)

    // 타겟 요소의 절대 중앙 위치
    const targetElementCenter = targetElementTop + boxHeight / 2

    // 정중앙 정렬보다 스크롤을 EXTRA_PX 만큼 더 내림 (scrollTop 증가)
    const FOCUS_SCROLL_EXTRA_DOWN_PX = -50
    const moveYCenter =
      targetElementCenter - window.innerHeight / 2 + FOCUS_SCROLL_EXTRA_DOWN_PX

    return {
      itemHeight: boxHeight,
      destinationY: moveYCenter,
    }
  }, [isItemHeightCatched])

  const moveToFocusTarget = useCallback(
    (behavior: 'instant' | 'smooth' | 'none') => {
      if (behavior === 'none' || !currentTargetInfo?.destinationY) {
        return false
      }
      if (!isDataReady || !focusTargetRef.current) {
        return false
      }
      try {
        window.scrollTo({
          top: currentTargetInfo.destinationY,
          behavior: behavior,
        })
        return true
      } catch (error) {
        console.error('Scroll failed:', error)
        return false
      }
    },
    [currentTargetInfo?.destinationY, isDataReady],
  )

  // 이미지 로드 타임아웃 처리
  useEffect(() => {
    if (!isDataReady || !focusTargetRef.current || isItemHeightCatched) {
      return
    }

    // 데이터가 준비되었지만 일정 시간 내에 이미지가 로드되지 않은 경우 강제로 높이 캡처
    const timeoutId = setTimeout(() => {
      if (focusTargetRef.current && !isItemHeightCatched) {
        setItemHeightCatched(true)
      }
    }, 500) // 0.5초 후 강제 설정

    return () => clearTimeout(timeoutId)
  }, [isDataReady, isItemHeightCatched])

  // 자동 스크롤 실행 및 재시도 로직
  useEffect(() => {
    if (!isDataReady || !focusTargetRef.current) {
      return
    }

    if (currentTargetInfo?.destinationY === undefined) {
      // 데이터는 준비되었지만 타겟 정보가 없는 경우 재시도
      if (scrollRetryCount < 5) {
        const retryTimeoutId = setTimeout(() => {
          setScrollRetryCount((prev) => prev + 1)
        }, 500)
        return () => clearTimeout(retryTimeoutId)
      }
      return
    }

    // 이미지 로드 후 DOM이 완전히 렌더링되도록 여러 프레임 대기
    const timeoutId = setTimeout(() => {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          const success = moveToFocusTarget('smooth')
          if (!success && scrollRetryCount < 5) {
            // 스크롤 실패 시 재시도
            setTimeout(() => {
              setScrollRetryCount((prev) => prev + 1)
            }, 500)
          }
        })
      })
    }, 100)

    return () => clearTimeout(timeoutId)
  }, [
    moveToFocusTarget,
    currentTargetInfo?.destinationY,
    isDataReady,
    scrollRetryCount,
  ])

  useEffect(() => {
    if (!currentTargetInfo?.itemHeight || !currentTargetInfo?.destinationY) {
      return
    }
    const scrollWather = () => {
      const itemHeight = currentTargetInfo?.itemHeight || 0
      const destinationY = currentTargetInfo?.destinationY || 0
      const scrollY = window.scrollY
      if (scrollY < destinationY - itemHeight * 1.5) {
        if (jumpButtonState !== 'down') {
          setJumpButtonState('down')
        }
      } else if (scrollY > destinationY + itemHeight * 1.5) {
        if (jumpButtonState !== 'up') {
          setJumpButtonState('up')
        }
      } else {
        if (jumpButtonState !== undefined) {
          setJumpButtonState(undefined)
        }
      }
    }
    window.addEventListener('scroll', scrollWather, { passive: true })
    return () => {
      window.removeEventListener('scroll', scrollWather)
    }
  }, [
    jumpButtonState,
    currentTargetInfo?.itemHeight,
    currentTargetInfo?.destinationY,
  ])

  const [isCalendarModalOpen, setCalendarModalOpen] = useState(false)

  if (isLoading) {
    return null
  }

  // TODO: 학습이 가능한 경우에만 열리도록 하는 기능이 필요.
  const isStudyEnd = student?.data?.studyState?.isStudyEnd || false
  const onStudyEndMessage = () => {
    const message = student?.data?.studyState?.studyEndMessage || ''
    if (message) {
      alert(message)
    }
  }
  const onStartActivity = (
    levelRoundId: string,
    activityType: string,
    sectionDate: string,
  ) => {
    if (isStudyEnd) {
      onStudyEndMessage()
      return
    }
    if (activityStart.isPending) {
      return
    }

    const activityStatus = getStartActivityStatus(
      levelRoundId,
      activityType,
      sectionDate,
      userType,
      isPreviewEnabled,
    )

    if (!isStudyAllEnabled && !isPreviewEnabled) {
      if (activityStatus.dayDistance > 0) {
        alert(t('t8thdf006'))
        return
      }
    }

    activityStart.mutate({
      activityType,
      levelRoundId,
      studentHistoryId: studentHistoryId!,
      startMode: activityStatus.startMode,
      playMode: activityStatus.playMode,
    })
  }

  return (
    <>
      <MyLessonStyle>
        <MyLessonHeader
          date={now}
          onCalendarButtonClick={() => {
            setCalendarModalOpen(true)
          }}
        />
        {!isTodayBooks && (
          <>
            <BoxStyle
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              gap={20}
              minHeight="180px">
              <TextStyle
                fontFamily="sans"
                fontSize="small"
                fontColor="secondary">
                {t('t8thdf003')}
              </TextStyle>
            </BoxStyle>
            <hr
              style={{
                borderTop: 'none',
                borderLeft: 'none',
                borderRight: 'none',
                height: '1px',
                borderColor: 'var(--line-color-primary)',
              }}
            />
          </>
        )}

        {daySection.map((section) => {
          const isToday = section.date === today

          let todayActivityCount = 0
          const dateLabel = DateUtils.toRgDateEnglishFormat(section.date, 'MD')
          let sectionTitle = t('t8thdf004', {
            day: section.dayNumber,
          })
          if (dateLabel) {
            sectionTitle = `${sectionTitle} · ${dateLabel}`
          }
          if (isToday) {
            if (dayData && dayData.lectures && dayData.lectures.length > 0) {
              dayData.lectures.forEach(
                (lectures) =>
                  (todayActivityCount += lectures.activities.length),
              )
            }
            sectionTitle += ` (${t('t8thdf005')})`
          }

          return (
            <React.Fragment key={section.date}>
              <MyLessonSection
                key={`${section.date}_section`}
                title={sectionTitle}
                completedCount={section.passCount}
                totalCount={section.lessonCount}
                isActive={isToday}
                onSectionClick={() => {
                  const params = `title=${encodeURIComponent(sectionTitle)}&date=${section.date}`
                  router.push(
                    `${SITE_PATH.DODON_FRIENDS.MY_LESSON_DAY}?${params}`,
                  )
                }}
              />
              {isToday &&
                todayActivityCount > 0 &&
                dayData!.lectures!.map((lecture) => {
                  return (
                    <>
                      <Gap size={15} />
                      <BoxStyle
                        display="flex"
                        flexDirection="row"
                        gap={5}
                        alignItems="center"
                        padding="5px 2px">
                        {/* <TextStyle fontColor="secondary">•</TextStyle> */}
                        <TextStyle fontSize="large">
                          {lecture.lectureTitle}
                        </TextStyle>
                      </BoxStyle>
                      <div>
                        {lecture.activities.map((activity, i) => {
                          const activityId = `${activity.levelRoundId}-${activity.activityType}`
                          const isCurrent = currentActivityId === activityId
                          const isPassed =
                            activity.status.toLowerCase() === 'pass'
                          const passCount = activity.passCount
                          const title = activity.topicTitle
                          const imageUrl =
                            activity.studyImagePath || activity.surfaceImagePath
                          const point = activity.getableRgPoint
                          const isMovie = activity.activityType
                            .toLocaleLowerCase()
                            .includes('movie')
                          const onStartAction = () => {
                            onStartActivity(
                              activity.levelRoundId,
                              activity.activityType,
                              section.date,
                            )
                          }
                          return (
                            <MyLessonBookItem
                              key={activityId}
                              ref={isCurrent ? focusTargetRef : undefined}
                              no={i + 1}
                              title={title}
                              imgUrl={imageUrl}
                              passCount={passCount}
                              point={point}
                              isPassed={isPassed}
                              isCurrent={isCurrent}
                              activityType={activity.activityType}
                              isMovieAvailable={isMovie}
                              onContentClick={
                                !isCurrent ? onStartAction : undefined
                              }
                              onStart={isCurrent ? onStartAction : undefined}
                              onImageLoaded={
                                isCurrent && !isItemHeightCatched
                                  ? (isSuccess) => {
                                      if (isSuccess) {
                                        setItemHeightCatched(true)
                                      } else if (scrollRetryCount < 3) {
                                        // 이미지 로드 실패 시 재시도
                                        setTimeout(() => {
                                          setScrollRetryCount(
                                            (prev) => prev + 1,
                                          )
                                        }, 500)
                                      }
                                    }
                                  : undefined
                              }
                            />
                          )
                        })}
                      </div>
                    </>
                  )
                })}

              {isToday && todayActivityCount === 0 && <div>No List</div>}
            </React.Fragment>
          )
        })}
      </MyLessonStyle>

      <Gap size={100} />

      {jumpButtonState && isDataReady && (
        <QuickJumpButtonStyle
          isVisible={true}
          onClick={() => {
            const success = moveToFocusTarget('smooth')
            if (!success && currentTargetInfo?.destinationY) {
              setTimeout(() => {
                moveToFocusTarget('smooth')
              }, 300)
            }
          }}>
          {jumpButtonState === 'up' && (
            <Image
              src={Assets.Icon.arrowUpBlue}
              alt="arrow up"
              width={30}
              height={30}
            />
          )}
          {jumpButtonState === 'down' && (
            <Image
              src={Assets.Icon.arrowDownBlue}
              alt="arrow down"
              width={30}
              height={30}
            />
          )}
        </QuickJumpButtonStyle>
      )}

      {isCalendarModalOpen && (
        <LessonCalendarModal onCloseModal={() => setCalendarModalOpen(false)} />
      )}
      {movieStudyInfo && (
        <MyLessonVideoModal
          studyId={movieStudyInfo.studyId}
          studentHistoryId={movieStudyInfo.studentHistoryId}
          levelRoundId={movieStudyInfo.levelRoundId}
          videoUrl={movieStudyInfo.videoUrl}
          onClose={() => setMovieStudyInfo(null)}
        />
      )}
    </>
  )
}
