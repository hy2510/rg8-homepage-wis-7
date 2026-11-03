import { RouteResponse, executeRequestAction } from '@/app/api/_util'
import { getAuthorizationWithCookie } from '@/authorization/server/nextjsCookieAuthorization'
import { NextRequest } from 'next/server'
import Movie from '@/repository/server/movie'

export async function GET(request: NextRequest) {
  const authorizationWithCookie = await getAuthorizationWithCookie()
  const token = authorizationWithCookie.getActiveAccessToken()
  if (!token) {
    return RouteResponse.invalidAccessToken()
  }

  const [payload, status, error] = await executeRequestAction(
    Movie.categories(token),
  )
  if (error) {
    return RouteResponse.commonError()
  }

  const savedLng = request.cookies.get('lang')?.value

  const MovieCategories =
    payload?.Categories?.map((category: any) => {
      const { DescriptionKor, DescriptionEng, DescriptionVie } = category
      delete category.DescriptionKor
      delete category.DescriptionEng
      delete category.DescriptionVie

      const Description =
        savedLng === 'ko'
          ? DescriptionKor
          : savedLng === 'vi'
            ? DescriptionVie
            : DescriptionEng
      return {
        ...category,
        Description,
      }
    }) || []
  const newPayload = {
    MovieCategories,
  }
  return RouteResponse.response(newPayload, status)
}
