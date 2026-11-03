import { execute, makeRequest } from '@/8th/shared/http'
import { Pagination, transformPagination } from '@/8th/shared/model/pagination'
import { SearchBook, transformSearchBook } from '@/8th/shared/model/search-book'

function transform(json: any): SearchBookKeywordResponse {
  return {
    book: json.Books.map((item: any) => transformSearchBook(item)),
    page: transformPagination(json.Pagination),
    download: json.ExcelDownload,
  }
}

export type SearchBookKeywordParams = {
  bookType: string
  keyword: string
  type?: string
  page?: number
  model?: 'rg' | 'dnf'
}

export type SearchBookKeywordResponse = {
  book: SearchBook[]
  page: Pagination
  download?: string
}

export async function getSearchBookKeyword({
  bookType,
  keyword,
  type,
  page = 1,
  model = 'rg',
}: SearchBookKeywordParams): Promise<SearchBookKeywordResponse> {
  const request = makeRequest(`api/library/search/keyword`, {
    method: 'get',
    queryString: {
      bookType,
      searchText: keyword,
      searchType: type,
      page,
      model,
    },
  })
  return await execute(request, transform)
}
