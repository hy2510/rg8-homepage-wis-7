import { dailyKeys } from '@/8th/features/daily/service/daily-key'
import { libraryKeys } from '@/8th/features/library/service/library-key'
import { todoKeys } from '@/8th/features/todo/service/todo-key'
import {
  OverrideMutationOptions,
  OverrideQueryOptions,
} from '@/8th/shared/react-query/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { postAnimationComplete } from '../model/animation-complete'
import { getCourseBook } from '../model/course-book'
import { getDailyBook } from '../model/daily-book'
import { getLectureMonthStatus } from '../model/lecture-month-status'
import { getLectureSection } from '../model/lecture-section'
import { getLectureStart } from '../model/lecture-start'
import { getLectureWeekStatus } from '../model/lecture-week-status'
import { myclassKeys } from './myclass-key'

export function useWeekStatus(
  params: {
    classId: string
    studentHistoryId: string
    startDate: string
    endDate: string
  },
  options?: OverrideQueryOptions,
) {
  return useQuery({
    ...options,
    queryKey: myclassKeys.weekStatus(params),
    queryFn: () => getLectureWeekStatus(params),
  })
}

export function useMonthStatus(
  params: {
    classId: string
    studentHistoryId: string
    startDate: string
    endDate: string
  },
  options?: OverrideQueryOptions,
) {
  return useQuery({
    ...options,
    queryKey: myclassKeys.monthStatus(params),
    queryFn: () => getLectureMonthStatus(params),
  })
}

export function useDailyBook(
  params: {
    date: string
    classId: string
    studentHistoryId: string
    page: number
  },
  options?: OverrideQueryOptions,
) {
  return useQuery({
    ...options,
    queryKey: myclassKeys.dailyBookWithParam(params),
    queryFn: () => getDailyBook(params),
  })
}

export function useCourseBook(
  params: {
    lectureSection: string
    classId: string
    studentHistoryId: string
    status: string
    page: number
  },
  options?: OverrideQueryOptions,
) {
  return useQuery({
    ...options,
    queryKey: myclassKeys.courseBookWithParam(params),
    queryFn: () => getCourseBook(params),
  })
}

export function useLectureSection(
  params: {
    classId: string
    studentHistoryId: string
  },
  options?: OverrideQueryOptions,
) {
  return useQuery({
    ...options,
    queryKey: myclassKeys.lectureSectionWithParam(params),
    queryFn: () => getLectureSection(params),
  })
}

export function useLessonVideoComplete(options?: OverrideMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: (input: { studyId: string; studentHistoryId: string }) =>
      postAnimationComplete(input),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: myclassKeys.dailyBook() })
      queryClient.invalidateQueries({ queryKey: myclassKeys.courseBook() })
      queryClient.invalidateQueries({ queryKey: myclassKeys.lectureSection() })
      options?.onSuccess?.(data, variables)
    },
  })
}

////////////
export function useLectureStart(options?: OverrideMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: async (input: {
      studentHistoryId: string
      levelRoundId: string
      activityType: string
      startMode: 'quiz' | 'preview' | 'review'
      playMode: 'study' | 'movie'
    }) => {
      return getLectureStart(input)
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: libraryKeys.search() })
      queryClient.invalidateQueries({ queryKey: dailyKeys.bookList() })
      queryClient.invalidateQueries({ queryKey: todoKeys.list() })
      queryClient.invalidateQueries({ queryKey: libraryKeys.bookInfo() })
      options?.onSuccess?.(data, variables)
    },
  })
}
