import { execute, makeRequest } from '@/8th/shared/http'
import { Pagination, transformPagination } from '@/8th/shared/model/pagination'
import RenewType from '@/util/string-utils'

export type WordPracticeListItem = {
  studyTypeName: string
  levelName: string
  word: string
  wordSoundPath: string
  proficiency: string
  totalRecordCount: number
}

function makeWordPracticeList(json: any): WordPracticeListItem {
  return {
    studyTypeName: RenewType.renewString(json?.StudyTypeName),
    levelName: RenewType.renewString(json?.LevelName),
    word: RenewType.renewString(json?.Word),
    wordSoundPath: RenewType.renewString(json?.WordSoundPath),
    proficiency: RenewType.renewString(json?.Proficiency),
    totalRecordCount: RenewType.renewNumber(json?.TotalRecordCount),
  }
}

function transform(json: any): WordPracticeListResponse {
  return {
    words: json?.Words?.map(makeWordPracticeList) ?? [],
    page: transformPagination(json.Pagination),
  }
}

export type WordPracticeListParams = {
  studyTypeName: string
  levelName: string
  proficiency: string
  page: number
}

export type WordPracticeListResponse = {
  words: WordPracticeListItem[]
  page: Pagination
}

export async function getWordPracticeList(
  input: WordPracticeListParams,
): Promise<WordPracticeListResponse> {
  const request = makeRequest(`api/word-practice/list/${input.studyTypeName}`, {
    method: 'get',
    queryString: {
      level: input.levelName,
      proficiency: input.proficiency,
      page: input.page,
    },
  })
  return await execute(request, transform)
}
