'use client'

import LibraryTabBar from '@/8th/features/library/ui/component/LibraryTabBar'
import {
  useLectureSection,
  useMonthStatus,
} from '@/8th/features/myclass/service/myclass-query'
import ClassCard from '@/8th/features/myclass/ui/component/ClassCard'
import {
  useStudent,
  useStudentHistoryList,
} from '@/8th/features/student/service/student-query'
import { ClassesStyle } from '@/8th/shared/styled/FeaturesStyled'
import SITE_PATH from '@/app/site-path'
import useTranslation from '@/localization/client/useTranslations'
import DateUtils from '@/util/date-utils'
import { useRouter } from 'next/navigation'

export default function ClassesList() {
  // @Language 'common'
  const { t } = useTranslation()

  const router = useRouter()

  const student = useStudent()

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
  const yearValue = nowDate.getFullYear()
  const monthValue = nowDate.getMonth() + 1
  const monthDate = DateUtils.toStringDate(
    new Date(yearValue, monthValue - 1, 1),
    {
      divide: '',
      digitfix: true,
    },
  )
  const {
    data: monthStatus,
    isLoading: isMonthStatusLoading,
    isPending: isMonthStatusPending,
  } = useMonthStatus(
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

  const { data, isLoading } = useLectureSection(
    {
      studentHistoryId: defaultStudentHistoryId!,
      classId: defaultClassId!,
    },
    {
      enabled: isStudentHistoryActive,
    },
  )

  if (!isStudentHistoryActive) {
    // 소속반이 없음.
    return null
  }

  if (isLoading || isMonthStatusLoading || isMonthStatusPending) {
    // 로딩 중..
    return <></>
  }

  const onClassesClick = (id: string) => {
    router.push(`${SITE_PATH.DODON_FRIENDS.COURSE}?id=${id}`)
  }

  const isActiveMyLesson = !!student.data?.student?.useLectureYn
  const hasLectureThisMonth =
    isActiveMyLesson &&
    (
      monthStatus?.day.filter(
        (section) => section.unit > 0 && section.unitCount > 0,
      ) || []
    ).length > 0

  const tabItems: { href: string; active: boolean; label: string }[] = [
    {
      href: SITE_PATH.DODON_FRIENDS.CLASSES,
      active: true,
      label: t('t8thdf002'),
    },
  ]
  if (hasLectureThisMonth) {
    tabItems.splice(0, 0, {
      href: SITE_PATH.DODON_FRIENDS.MY_LESSON,
      active: false,
      label: t('t8thdf001'),
    })
  }

  return (
    <>
      <LibraryTabBar items={tabItems} />
      <ClassesStyle>
        {data?.sections?.map((section) => {
          return (
            <ClassCard
              key={section.lectureSectionLink}
              id={section.lectureSectionLink}
              title={section.lectureSection}
              description={section.description}
              totalCount={section.totalStudyCount}
              completedCount={section.completedStudyCount}
              characterImagePath={section.characterImagePath}
              inProgressCharacterImagePath={section.characterImagePath3}
              completeCharacterImagePath={section.characterImagePath4}
              bookCoverImage1={section.surfaceImagePath1}
              bookCoverImage2={section.surfaceImagePath2}
              onClick={() => onClassesClick(section.lectureSectionLink)}
            />
          )
        })}
      </ClassesStyle>
    </>
  )
}
