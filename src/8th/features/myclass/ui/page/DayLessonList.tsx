'use client'

import { DailyRgResultActionBar } from '@/8th/features/daily/ui/component/DailyRGActionBar'
import { getStartActivityStatus } from '@/8th/features/myclass/etc/content-action'
import { LectureStart } from '@/8th/features/myclass/model/lecture-start'
import {
  useDailyBook,
  useLectureStart,
} from '@/8th/features/myclass/service/myclass-query'
import MyLessonBookItem from '@/8th/features/myclass/ui/component/MyLessonBookItem'
import MyLessonVideoModal from '@/8th/features/myclass/ui/modal/MyLessonVideoModal'
import {
  useStudent,
  useStudentHistoryList,
} from '@/8th/features/student/service/student-query'
import useStartStudy from '@/8th/shared/hook/useStartStudy'
import { DailyRGCourseListStyle } from '@/8th/shared/styled/FeaturesStyled'
import { BoxStyle, Gap, TextStyle } from '@/8th/shared/ui/Misc'
import { SubPageNavHeader } from '@/8th/shared/ui/SubPageNavHeader'
import SITE_PATH from '@/app/site-path'
import useTranslation from '@/localization/client/useTranslations'
import { useLayoutEffect, useMemo, useState } from 'react'

export default function DayLessonList({
  title,
  date,
}: {
  title: string
  date: string
}) {
  // @Language 'common'
  const { t } = useTranslation()

  useLayoutEffect(() => {
    window?.scrollTo(0, 0)
  }, [title, date])

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

  const { data, isLoading } = useDailyBook(
    {
      classId: defaultClassId!,
      studentHistoryId: defaultStudentHistoryId!,
      date,
      page: 1,
    },
    {
      enabled: isStudentHistoryActive,
    },
  )
  const isEmptyList = !data || !data.lectures || data.lectures.length === 0

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

  const currentActivityId = useMemo(() => {
    const lectures = data?.lectures
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
  }, [data?.lectures])

  if (!isStudentHistoryActive) {
    // 소속반이 없음.
    return null
  }

  if (isLoading) {
    // 로딩 중..
    return <></>
  }

  let completeCount = 0
  let totalCount = 0
  if (data && data.lectures && data.lectures.length > 0) {
    data.lectures.forEach((lecture) => {
      totalCount += lecture.activities.length
      completeCount += lecture.activities.filter(
        (act) => act.status.toLowerCase() === 'pass',
      ).length
    })
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
      studentHistoryId: defaultStudentHistoryId!,
      startMode: activityStatus.startMode,
      playMode: activityStatus.playMode,
    })
  }

  return (
    <>
      <BoxStyle display="flex" flexDirection="column" gap={5}>
        <SubPageNavHeader parentPath={SITE_PATH.DODON_FRIENDS.MY_LESSON} />
        <Gap size={15} />
        <DailyRgResultActionBar
          title={title}
          bookCount={completeCount}
          totalCount={totalCount}
          countLabel={t('t8thdf037')}
        />

        <DailyRGCourseListStyle>
          {isEmptyList && (
            <div style={{ padding: '10px' }}>{t('t8thdf008')}</div>
          )}
          {data?.lectures?.map((lecture) => {
            return (
              <div key={lecture.lectureTitle}>
                <Gap size={15} />
                <BoxStyle
                  display="flex"
                  flexDirection="row"
                  gap={5}
                  alignItems="center"
                  padding="5px 2px">
                  {/* <TextStyle fontColor="secondary">•</TextStyle> */}
                  <TextStyle fontSize="large" padding="0 0 0 8px">
                    {lecture.lectureTitle}
                  </TextStyle>
                </BoxStyle>
                <div>
                  {lecture.activities.map((activity, i) => {
                    const activityId = `${activity.levelRoundId}-${activity.activityType}`
                    const passCount = activity.passCount
                    const title = activity.topicTitle
                    const imageUrl =
                      activity.studyImagePath || activity.surfaceImagePath
                    const point = activity.getableRgPoint
                    const isPassed = activity.status.toLowerCase() === 'pass'
                    const isMovie = activity.activityType
                      .toLocaleLowerCase()
                      .includes('movie')
                    return (
                      <MyLessonBookItem
                        key={activityId}
                        no={i + 1}
                        title={title}
                        imgUrl={imageUrl}
                        passCount={passCount}
                        point={point}
                        isPassed={isPassed}
                        activityType={activity.activityType}
                        isMovieAvailable={isMovie}
                        isFullCardContent={true}
                        onContentClick={() => {
                          onStartActivity(
                            activity.levelRoundId,
                            activity.activityType,
                            date,
                          )
                        }}
                      />
                    )
                  })}
                </div>
              </div>
            )
          })}
        </DailyRGCourseListStyle>
      </BoxStyle>
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
