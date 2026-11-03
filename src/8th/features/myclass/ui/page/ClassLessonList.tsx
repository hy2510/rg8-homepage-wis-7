'use client'

import { getStartActivityStatus } from '@/8th/features/myclass/etc/content-action'
import { LectureStart } from '@/8th/features/myclass/model/lecture-start'
import {
  useCourseBook,
  useLectureSection,
  useLectureStart,
} from '@/8th/features/myclass/service/myclass-query'
import ClassCard from '@/8th/features/myclass/ui/component/ClassCard'
import ClassesListFilterBar from '@/8th/features/myclass/ui/component/ClassesListFilterBar'
import ClassesListLessonAllBookList, {
  LessonBookItemProps,
} from '@/8th/features/myclass/ui/component/ClassesListLessonAllBookList'
import ClassesListLessonList from '@/8th/features/myclass/ui/component/ClassesListLessonList'
import ClassesListUnitTabs from '@/8th/features/myclass/ui/component/ClassesListUnitTabs'
import MyLessonVideoModal from '@/8th/features/myclass/ui/modal/MyLessonVideoModal'
import {
  useStudent,
  useStudentHistoryList,
} from '@/8th/features/student/service/student-query'
import useStartStudy from '@/8th/shared/hook/useStartStudy'
import { ClassesListStyle } from '@/8th/shared/styled/FeaturesStyled'
import { ActionBarDropdownItem } from '@/8th/shared/ui/ActionBar'
import { BoxStyle, Gap } from '@/8th/shared/ui/Misc'
import { SubPageNavHeader } from '@/8th/shared/ui/SubPageNavHeader'
import SITE_PATH from '@/app/site-path'
import useTranslation from '@/localization/client/useTranslations'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

export default function ClassLessonList({
  id,
  part,
  view = 'lesson',
}: {
  id: string
  part?: string
  view?: string
}) {
  // @Language 'common'
  const { t } = useTranslation()

  const router = useRouter()

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

  const { data: sectionData, isLoading: isSectionDataLoading } =
    useLectureSection(
      {
        studentHistoryId: defaultStudentHistoryId!,
        classId: defaultClassId!,
      },
      {
        enabled: isStudentHistoryActive,
      },
    )
  const currentSection = sectionData?.sections?.find(
    (item) => item.lectureSectionLink === id,
  )

  const { data, isLoading } = useCourseBook(
    {
      lectureSection: id,
      studentHistoryId: defaultStudentHistoryId!,
      classId: defaultClassId!,
      status: 'All',
      page: 1,
    },
    {
      enabled: isStudentHistoryActive,
    },
  )

  const [lessonFilter, setLessonFilter] = useState<
    'all' | 'incomplete' | 'complete'
  >('all')
  const [filteredBookCount, setFilteredBookCount] = useState(0)
  const [movieStudyInfo, setMovieStudyInfo] = useState<{
    studyId: string
    studentHistoryId: string
    levelRoundId: string
    videoUrl: string
  } | null>(null)

  useEffect(() => {
    if (view === 'lesson') {
      setLessonFilter('all')
    }
  }, [view])

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

  if (!isStudentHistoryActive) {
    // 소속반이 없음.
    return null
  }

  if (isSectionDataLoading || isLoading) {
    // 로딩 중..
    return <></>
  }

  const isDataEmpty = (data?.lectures?.length || 0) === 0
  if (!currentSection || isDataEmpty) {
    // 없음
    return <></>
  }

  const lessonListFilterItems: ActionBarDropdownItem[] = [
    { key: 'all', label: t('t8thdf011'), isActive: lessonFilter === 'all' },
    {
      key: 'incomplete',
      label: t('t8thdf012'),
      isActive: lessonFilter === 'incomplete',
    },
    {
      key: 'complete',
      label: t('t8thdf010'),
      isActive: lessonFilter === 'complete',
    },
  ]
  const activeFilterItem =
    lessonListFilterItems.find((item) => item.isActive) ||
    lessonListFilterItems[0]

  const onLessonListFilterClick = (item: ActionBarDropdownItem) => {
    setLessonFilter(item.key as 'all' | 'incomplete' | 'complete')
  }

  const lessons = data!.lectures

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
      <SubPageNavHeader parentPath={SITE_PATH.DODON_FRIENDS.CLASSES} />
      <ClassesListStyle>
        <ClassCard
          key={currentSection.lectureSectionLink}
          id={currentSection.lectureSectionLink}
          title={currentSection.lectureSection}
          description={currentSection.description}
          totalCount={currentSection.totalStudyCount}
          completedCount={currentSection.completedStudyCount}
          characterImagePath={currentSection.characterImagePath}
          inProgressCharacterImagePath={currentSection.characterImagePath3}
          completeCharacterImagePath={currentSection.characterImagePath4}
          bookCoverImage1={currentSection.surfaceImagePath1}
          bookCoverImage2={currentSection.surfaceImagePath2}
        />
        <Gap size={2} />
        <BoxStyle display="flex" flexDirection="column" gap={20}>
          <ClassesListFilterBar
            value={view === 'lesson' ? 'lesson' : 'booksOnly'}
            onChange={(value) => {
              router.replace(
                `${SITE_PATH.DODON_FRIENDS.COURSE}?id=${id}&view=${value}`,
              )
            }}
            totalCount={filteredBookCount}
            summaryTitle={activeFilterItem.label}
            dropdowns={[
              {
                title: t('t8th012'),
                isActiveMakerVisible: true,
                items: lessonListFilterItems,
                onItemClick: onLessonListFilterClick,
              },
            ]}
          />
        </BoxStyle>

        {view === 'lesson' ? (
          <LessonList
            id={id}
            part={part}
            lessonFilter={lessonFilter}
            lectures={lessons}
            onStartActivity={onStartActivity}
            onFilteredBookCountChange={setFilteredBookCount}
          />
        ) : (
          <LessonBookList
            id={id}
            lectures={lessons}
            onStartActivity={onStartActivity}
          />
        )}
      </ClassesListStyle>

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

type LessonListProps = {
  id: string
  part?: string
  lessonFilter?: 'all' | 'incomplete' | 'complete'
  lectures: {
    lectureTitle: string
    lectureNumber: number
    lectureActiveDate: string
    lectureStatus: string
    activities: {
      bookId: string
      levelRoundId: string
      levelName: string
      topicTitle: string
      activityType: string
      status: string
      surfaceImagePath: string
      studyImagePath: string
      bookPoint: number
      earnedPoint: number
      passCount: number
      getableRgPoint: number
    }[]
  }[]
  onStartActivity?: (
    levelRoundId: string,
    activityType: string,
    sectionDate: string,
  ) => void
  onFilteredBookCountChange?: (count: number) => void
}

function LessonList({
  id,
  part,
  lessonFilter = 'all',
  lectures,
  onStartActivity,
  onFilteredBookCountChange,
}: LessonListProps) {
  const router = useRouter()

  const onChangePart = (part: { key: string; label: string }) => {
    router.replace(
      `${SITE_PATH.DODON_FRIENDS.COURSE}?id=${id}&part=${part.key}`,
    )
  }
  const activePart = String(Number(part || 0))
  const partUnits = lectures
    .map(({ lectureTitle }) => lectureTitle.match(/^(\d+)\./)?.[1])
    .filter((v): v is string => !!v)
    .map(Number)
    .filter((v, i, arr) => arr.indexOf(v) === i)
    .map((v) => v.toString())
  const activePartIndex = partUnits.findIndex((v) => v === activePart)

  const allLessons = useMemo(() => {
    return lectures.filter((lecture) => {
      if (lessonFilter === 'incomplete') {
        let groupType: 'lesson' | 'review' | 'commingsoon' = 'lesson'
        if (lecture.lectureTitle.includes(': Review')) {
          groupType = 'review'
        } else if (lecture.lectureTitle.includes('Coming Soon~')) {
          groupType = 'commingsoon'
        }
        return (
          groupType === 'lesson' &&
          lecture.lectureStatus.toLowerCase() === 'incomplete'
        )
      } else if (lessonFilter === 'complete') {
        let groupType: 'lesson' | 'review' | 'commingsoon' = 'lesson'
        if (lecture.lectureTitle.includes(': Review')) {
          groupType = 'review'
        } else if (lecture.lectureTitle.includes('Coming Soon~')) {
          groupType = 'commingsoon'
        }
        return (
          groupType === 'lesson' &&
          lecture.lectureStatus.toLowerCase() === 'complete'
        )
      }
      return true
    })
  }, [lectures, lessonFilter])

  const lessonGroup = useMemo(() => {
    return partUnits.map((part) => {
      return allLessons
        .filter((lecture) => lecture.lectureTitle.startsWith(part))
        .map((lecture) => {
          let groupType: 'lesson' | 'review' | 'commingsoon' = 'lesson'
          if (lecture.lectureTitle.includes(': Review')) {
            groupType = 'review'
          } else if (lecture.lectureTitle.includes('Coming Soon~')) {
            groupType = 'commingsoon'
          }

          return {
            id: `id${lecture.lectureNumber}`,
            title: lecture.lectureTitle,
            groupType,
            isCompleted:
              groupType === 'lesson'
                ? lecture.lectureStatus.toLowerCase() === 'complete'
                : false,
            activeDate: lecture.lectureActiveDate,
            activities: lecture.activities || [],
          }
        })
    })
  }, [partUnits, allLessons])

  const partUnitTabs = useMemo(() => {
    return partUnits.map((part) => {
      const partIndex = partUnits.findIndex((v) => v === part)
      const lessonCount = lessonGroup[partIndex].length
      // 26. 7. 13 : 파트 옆에 조회 개수 표시는 기획에 없으므로 주석처리
      // return { key: part, label: `Part ${part} (${lessonCount})` }
      return { key: part, label: `Part ${part}` }
    })
  }, [partUnits, lessonGroup])

  useEffect(() => {
    if (onFilteredBookCountChange) {
      onFilteredBookCountChange(allLessons.length)
    }
  }, [onFilteredBookCountChange, allLessons.length])

  if (activePartIndex === -1 && partUnits.length > 0) {
    onChangePart(partUnitTabs[0])
    return
  }

  return (
    <>
      <Gap size={2} />
      <ClassesListUnitTabs
        units={partUnitTabs}
        activeUnit={activePart}
        onUnitChange={(unit) => {
          onChangePart(unit)
        }}
      />
      <ClassesListLessonList
        lessons={lessonGroup[activePartIndex]}
        onClick={onStartActivity}
      />
    </>
  )
}

function LessonBookList({ lectures, onStartActivity }: LessonListProps) {
  const books: (LessonBookItemProps & {
    activityType: string
    activeDate: string
  })[] = []
  lectures.forEach((lecture) => {
    books.push(
      ...lecture.activities
        .filter((activity) => activity.activityType.toLowerCase() === 'ebook')
        .map((activity) => ({
          title: activity.topicTitle,
          imagePath: activity.surfaceImagePath,
          levelName: activity.levelName,
          levelRoundId: activity.levelRoundId,
          activeDate: lecture.lectureActiveDate,
          activityType: activity.activityType,
          passCount: activity.passCount,
          bookPoint: activity.bookPoint,
          earnedPoint: activity.earnedPoint,
          getableRgPoint: activity.getableRgPoint,
        })),
    )
  })
  return (
    <ClassesListLessonAllBookList
      books={books}
      onClick={(id) => {
        const book = books.find((book) => book.levelRoundId === id)
        if (!!book) {
          if (onStartActivity) {
            onStartActivity(
              book.levelRoundId,
              book.activityType,
              book.activeDate,
            )
          }
        }
      }}
    />
  )
}
