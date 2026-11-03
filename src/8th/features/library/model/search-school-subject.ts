import { execute, makeRequest } from '@/8th/shared/http'
import { SearchBook, transformSearchBook } from '@/8th/shared/model/search-book'

function transform(json: any): SearchSchoolSubjectResponse {
  return {
    book: json.Books.map((item: any) => transformSearchBook(item)),
  }
}

export type SearchSchoolSubjectParams = {
  bookType: string
  grade: string
  publisher: string
  lesson: string
}

export type SearchSchoolSubjectResponse = {
  book: SearchBook[]
}

export async function getSearchSchoolSubject(
  input: SearchSchoolSubjectParams,
): Promise<SearchSchoolSubjectResponse> {
  const request = makeRequest(`api/library/search/school-subject`, {
    method: 'get',
    queryString: {
      bookType: input.bookType,
      grade: input.grade,
      publisher: input.publisher,
      lesson: input.lesson,
    },
  })
  return await execute(request, transform)
}
