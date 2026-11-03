'use client'

import {
  useLevelBooks,
  useLevelPoints,
} from '@/8th/features/achieve/service/achieve-query'
import { useSearchFavoriteBook } from '@/8th/features/library/service/search-query'
import {
  useContinuousStudy,
  useStudentDailyLearning,
  useTodayStudyLearning,
} from '@/8th/features/student/service/learning-query'
import {
  useStudentAvatarList,
  useStudentEarnReadingUnit,
} from '@/8th/features/student/service/setting-query'
import {
  useStudent,
  useStudentHistoryList,
} from '@/8th/features/student/service/student-query'
import { useTodoList } from '@/8th/features/todo/service/todo-query'

export default function StudentInfoLoadingProvider({
  children,
}: {
  children?: React.ReactNode
}) {
  const student = useStudent()
  const studnetHistory = useStudentHistoryList()
  const todayLearning = useTodayStudyLearning()
  const dailyLearning = useStudentDailyLearning()
  const todo = useTodoList()
  const favorite = useSearchFavoriteBook({ status: 'All' })
  const levelPoint = useLevelPoints()
  const levelBooks = useLevelBooks()
  const avatar = useStudentAvatarList()
  const earnReadingUnit = useStudentEarnReadingUnit()
  const continuousStudy = useContinuousStudy()

  const isLoading =
    student.isLoading ||
    studnetHistory.isLoading ||
    todayLearning.isLoading ||
    dailyLearning.isLoading ||
    todo.isLoading ||
    favorite.isLoading ||
    levelPoint.isLoading ||
    levelBooks.isLoading ||
    avatar.isLoading ||
    earnReadingUnit.isLoading ||
    continuousStudy.isLoading

  const isError =
    student.error ||
    studnetHistory.error ||
    todayLearning.error ||
    dailyLearning.error ||
    todo.error ||
    favorite.error ||
    levelPoint.error ||
    levelBooks.error ||
    avatar.error ||
    earnReadingUnit.error ||
    continuousStudy.error

  if (isError) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}>
        <div>Page Error</div>
        <button
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            borderRadius: '5px',
            backgroundColor: 'var(--font-color-light-blue)',
            color: 'white',
            cursor: 'pointer',
          }}
          onClick={() => {
            window.location.reload()
          }}>
          Reload
        </button>
      </div>
    )
  }

  if (isLoading) {
    return null
  }
  return <>{children}</>
}
