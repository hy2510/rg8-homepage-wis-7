import { OverrideQueryOptions } from '@/8th/shared/react-query/types'
import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query'
import { getHallOfFameRank } from '../model/hall-of-fame'
import { getHallOfFameInfo } from '../model/hall-of-fame-info'
import { getLevelMasterRank } from '../model/level-master'
import { getPointRank } from '../model/point'
import { getReadingKingRank } from '../model/readingking'
import { getReadingKingGroupRank } from '../model/readingking-group'
import { getRgRaceRank } from '../model/rg-race-rank'
import { getRgRaceStage } from '../model/rg-race-stage'
import { rankKeys } from './rank-key'

export function useHallOfFameRank(
  params?: { hallOfFameGradeId?: string; page?: number },
  options?: OverrideQueryOptions,
) {
  return useQuery({
    ...options,
    queryKey: rankKeys.hallOfFame(params?.hallOfFameGradeId, params?.page),
    queryFn: () => getHallOfFameRank(params ?? undefined),
  })
}

export function useHallOfFameRankInfinite(
  params?: { hallOfFameGradeId?: string; page?: number },
  options?: OverrideQueryOptions,
) {
  return useInfiniteQuery({
    ...options,
    queryKey: [
      ...rankKeys.hallOfFame(params?.hallOfFameGradeId, params?.page),
      'infinite',
    ],
    queryFn: ({ pageParam }) => {
      return getHallOfFameRank({ ...params, page: pageParam })
    },
    placeholderData: keepPreviousData,
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages, lastPageParam) => {
      const lastItemCount = lastPage?.list?.length ?? 0
      if (lastItemCount === 0 || lastItemCount % 100 !== 0) return undefined
      return lastPageParam + 1
    },
  })
}

export function useHallOfFameInfo(options?: OverrideQueryOptions) {
  return useQuery({
    ...options,
    queryKey: rankKeys.hallOfFameInfo(),
    queryFn: () => getHallOfFameInfo(),
  })
}

export function useLevelMasterRank(options?: OverrideQueryOptions) {
  return useQuery({
    ...options,
    queryKey: rankKeys.levelMaster(),
    queryFn: () => getLevelMasterRank(),
  })
}

export function usePointRank(
  params: { type: 'monthly' | 'total' },
  options?: OverrideQueryOptions,
) {
  return useQuery({
    ...options,
    queryKey: rankKeys.point(params.type),
    queryFn: () => getPointRank(params),
  })
}

export function useReadingKingRank(
  params: {
    eventId: string
  },
  options?: OverrideQueryOptions,
) {
  return useQuery({
    ...options,
    queryKey: rankKeys.readingKing(params.eventId),
    queryFn: () => getReadingKingRank(params),
  })
}

export function useReadingKingGroupRank(
  params: {
    eventId: string
  },
  options?: OverrideQueryOptions,
) {
  return useQuery({
    ...options,
    queryKey: rankKeys.readingKingGroup(params.eventId),
    queryFn: () => getReadingKingGroupRank(params),
  })
}

export function useRgRaceStage(options?: OverrideQueryOptions) {
  return useQuery({
    ...options,
    queryKey: rankKeys.rgRaceStage(),
    queryFn: () => getRgRaceStage(),
  })
}

export function useRgRaceRank(
  params: {
    raceStageId: string
    page?: number
  },
  options?: OverrideQueryOptions,
) {
  return useQuery({
    ...options,
    queryKey: rankKeys.rgRaceRank(params.raceStageId, params.page),
    queryFn: () => getRgRaceRank(params),
  })
}

export function useRgRaceRankInfinite(
  params: {
    raceStageId: string
    page?: number
  },
  options?: OverrideQueryOptions,
) {
  return useInfiniteQuery({
    ...options,
    queryKey: [
      ...rankKeys.rgRaceRank(params.raceStageId, params.page),
      'infinite',
    ],
    queryFn: ({ pageParam }) => {
      return getRgRaceRank({ ...params, page: pageParam })
    },
    placeholderData: keepPreviousData,
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages, lastPageParam) => {
      if (!lastPage?.list?.length) return undefined
      return lastPageParam + 1
    },
  })
}
