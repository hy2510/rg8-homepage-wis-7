import { OverrideQueryOptions } from '@/8th/shared/react-query/types'
import { useQuery } from '@tanstack/react-query'
import { getWordPracticeList } from '../model/list'
import { getWordPracticeSummary } from '../model/summary'
import { wordpracticeKeys } from './wordpractice-key'

export function useWordPracticeSummary(options?: OverrideQueryOptions) {
  return useQuery({
    queryKey: wordpracticeKeys.summary(),
    queryFn: () => getWordPracticeSummary(),
    ...options,
  })
}

export function useWordPracticeWordList(
  params: {
    bookType: 'EB' | 'PB'
    level: string
    proficiency?: 'all' | 'perfect' | 'strong' | 'normal' | 'weak'
    page?: number
  },
  options?: OverrideQueryOptions,
) {
  return useQuery({
    queryKey: wordpracticeKeys.wordListWithParams(params),
    queryFn: () => {
      let proficiency = 'All'
      if (params.proficiency === 'all') {
        proficiency = 'All'
      } else if (params.proficiency === 'perfect') {
        proficiency = 'Perfect'
      } else if (params.proficiency === 'strong') {
        proficiency = 'Strong'
      } else if (params.proficiency === 'normal') {
        proficiency = 'Normal'
      } else if (params.proficiency === 'weak') {
        proficiency = 'Weak'
      }
      return getWordPracticeList({
        studyTypeName: params.bookType,
        levelName: params.level,
        proficiency,
        page: params.page ?? 1,
      })
    },
    ...options,
  })
}
