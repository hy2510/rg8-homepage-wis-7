'use client'

import {
  getLevelBooksQueryOptions,
  getLevelPointsQueryOptions,
} from '@/8th/features/achieve/service/achieve-query'
import { getSearchFavoriteBookQueryOptions } from '@/8th/features/library/service/search-query'
import { getReadingKingEventListQueryOptions } from '@/8th/features/readingking/service/readingking-query'
import {
  getContinuousStudyQueryOptions,
  getStudentDailyLearningQueryOptions,
  getTodayStudyLearningQueryOptions,
} from '@/8th/features/student/service/learning-query'
import {
  getStudentAvatarListQueryOptions,
  getStudentEarnReadingUnitQueryOptions,
} from '@/8th/features/student/service/setting-query'
import {
  getStudentHistoryListQueryOptions,
  getStudentQueryOptions,
} from '@/8th/features/student/service/student-query'
import { getTodoListQueryOptions } from '@/8th/features/todo/service/todo-query'
import { QueryClient, useQueryClient } from '@tanstack/react-query'
import { useCallback, useState } from 'react'

export default function useStudentBootstrap() {
  const [isLoading, setIsLoading] = useState(false)
  const queryClient = useQueryClient()

  const bootstrap = useCallback(async () => {
    setIsLoading(true)
    const result = await fetchStudentBootstrap(queryClient)
    setIsLoading(false)
    return result
  }, [queryClient])
  return { bootstrap, isLoading }
}

export async function fetchStudentBootstrap(queryClient: QueryClient) {
  const result = await Promise.all([
    queryClient.fetchQuery(getStudentQueryOptions()),
    queryClient.fetchQuery(getStudentHistoryListQueryOptions()),
    queryClient.fetchQuery(getStudentEarnReadingUnitQueryOptions()),
    queryClient.fetchQuery(getStudentAvatarListQueryOptions()),
    queryClient.fetchQuery(getLevelBooksQueryOptions()),
    queryClient.fetchQuery(getLevelPointsQueryOptions()),
    queryClient.fetchQuery(getContinuousStudyQueryOptions()),
    queryClient.fetchQuery(getTodayStudyLearningQueryOptions()),
    queryClient.fetchQuery(getStudentDailyLearningQueryOptions()),
    queryClient.fetchQuery(getTodoListQueryOptions()),
    queryClient.fetchQuery(getSearchFavoriteBookQueryOptions()),
    queryClient.fetchQuery(getReadingKingEventListQueryOptions()),
  ])
  return {
    student: result[0],
    history: result[1],
    readingUnit: result[2],
    avatarList: result[3],
    levelBooks: result[4],
    levelPoints: result[5],
    continuousStudy: result[6],
    studyLearning: result[7],
    dailyLearning: result[8],
    todoList: result[9],
    favorite: result[10],
    readingkingEvent: result[11],
  }
}
