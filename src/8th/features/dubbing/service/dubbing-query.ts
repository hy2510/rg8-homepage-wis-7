import { OverrideQueryOptions } from '@/8th/shared/react-query/types'
import { useQuery } from '@tanstack/react-query'
import { getDubbingContentDetail } from '../model/contents'
import { getDubbingInfo } from '../model/info'
import { getDubbingMyVideo } from '../model/my-video'
import { getDubbingContentSearch } from '../model/serach'
import { getDubbingTags } from '../model/tags'
import { dubbingKeys } from './dubbing-key'

export function useDubbingInfo(options?: OverrideQueryOptions) {
  return useQuery({
    queryKey: dubbingKeys.info(),
    queryFn: () => getDubbingInfo(),
    ...options,
  })
}

export function useDubbingTags(options?: OverrideQueryOptions) {
  return useQuery({
    queryKey: dubbingKeys.tags(),
    queryFn: () => getDubbingTags(),
    ...options,
  })
}

export function useDubbingSearch(
  params: { level: string },
  options?: OverrideQueryOptions,
) {
  return useQuery({
    queryKey: dubbingKeys.searchWithLevel(params.level),
    queryFn: () => getDubbingContentSearch(params),
    ...options,
  })
}

export function useDubbingMyVideo(
  params: { level: string },
  options?: OverrideQueryOptions,
) {
  return useQuery({
    queryKey: dubbingKeys.myVideoWithLevel(params.level),
    queryFn: () => getDubbingMyVideo(params),
    ...options,
  })
}

export function useDubbingSearchAndMyVideo(
  params: { level: string },
  options?: OverrideQueryOptions,
) {
  return useQuery({
    queryKey: dubbingKeys.searchAndMyVideo(params.level),
    queryFn: async () => {
      const [searchList, myVideoList] = await Promise.all([
        getDubbingContentSearch(params),
        getDubbingMyVideo(params),
      ])

      const getLevelGrade = (level: string) => {
        if (level === 'KA') {
          return 'A'
        } else if (level === 'KB') {
          return 'B'
        } else if (level === 'KC') {
          return 'C'
        }
      }
      const allList = searchList.contents.map((item) => {
        const myVideoItem = myVideoList.contents.find(
          (v) => item.levelRoundId === v.levelRoundId,
        )
        const level = item.levelName.substring(3, 5)
        return {
          order: item.order,
          levelGrade: getLevelGrade(level) || '',
          levelRoundId: item.levelRoundId,
          levelName: item.levelName,
          topicTitle: item.topicTitle,
          studyImagePath: item.studyImagePath,
          soloStudy: myVideoItem?.soloStudy,
          fullStudy: myVideoItem?.fullStudy,
        }
      })
      return allList
    },
    ...options,
  })
}
export function useDubbingContent(
  params: { levelRoundId: string; studyId?: string; studentHistoryId?: string },
  options?: OverrideQueryOptions,
) {
  return useQuery({
    queryKey: dubbingKeys.contentWithParams(params),
    queryFn: () => getDubbingContentDetail(params),
    ...options,
  })
}
