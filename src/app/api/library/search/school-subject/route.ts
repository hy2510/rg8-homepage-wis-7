import { RouteResponse, getParameters } from '@/app/api/_util'
import { getAuthorizationWithCookie } from '@/authorization/server/nextjsCookieAuthorization'
import { NextRequest } from 'next/server'
import Library from '@/repository/server/library'
import { searchBook } from '../../search-book'

export async function GET(request: NextRequest) {
  const authorizationWithCookie = await getAuthorizationWithCookie()
  const token = authorizationWithCookie.getActiveAccessToken()

  if (!token) {
    return RouteResponse.invalidAccessToken()
  }

  const parameter = await getParameters(
    request,
    'bookType',
    'grade',
    'publisher',
    'lesson',
    'page',
  )
  const bookType = parameter.getString('bookType')
  const grade = parameter.getString('grade')
  const publisher = parameter.getString('publisher')
  const lesson = parameter.getString('lesson')
  const page = parameter.getNumber('page', 1)

  return searchBook({
    searchRequest: Library.schoolSubjectSearchBook(token, {
      grade: grade,
      publisherCode: publisher,
      lesson: lesson,
      page: page,
    }),
  })
}
