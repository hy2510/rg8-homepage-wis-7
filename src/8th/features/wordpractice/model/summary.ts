import { execute, makeRequest } from '@/8th/shared/http'
import RenewType from '@/util/string-utils'

export type WordPracticeSummary = {
  studyTypeName: string
  levelName: string
  totalWordsCount: number
  perfectCount: number
  strongCount: number
  normalCount: number
  weaknessCount: number
}

function makeWordPracticeSummary(json: any): WordPracticeSummary {
  return {
    studyTypeName: RenewType.renewString(json?.StudyTypeName),
    levelName: RenewType.renewString(json?.LevelName),
    totalWordsCount: RenewType.renewNumber(json?.TotalWordsCount),
    perfectCount: RenewType.renewNumber(json?.PerfectCount),
    strongCount: RenewType.renewNumber(json?.StrongCount),
    normalCount: RenewType.renewNumber(json?.NormalCount),
    weaknessCount: RenewType.renewNumber(json?.WeaknessCount),
  }
}

function transform(json: any): WordPracticeSummaryResponse {
  return {
    summaryList: json?.SummaryList?.map(makeWordPracticeSummary) ?? [],
  }
}

export type WordPracticeSummaryParams = {}

export type WordPracticeSummaryResponse = {
  summaryList: WordPracticeSummary[]
}

export async function getWordPracticeSummary(
  input?: WordPracticeSummaryParams,
): Promise<WordPracticeSummaryResponse> {
  const request = makeRequest(`api/word-practice/summary`, {
    method: 'get',
  })
  return await execute(request, transform)
}
