import { getAuthorizationWithCookie } from '@/authorization/server/nextjsCookieAuthorization'
import NotAccessablePage from './_components/NotAccessablePage'
import TeacherHome from './_components/TeacherHome'

export default async function Page() {
  const authorizationWithCookie = await getAuthorizationWithCookie()
  const token = authorizationWithCookie.getActiveAccessToken()

  const userDetails = token
    ? authorizationWithCookie.getTokenUserDetails()
    : undefined
  const isStaffAccess =
    userDetails?.role === 'staff' || userDetails?.role === 'admin'

  if (!isStaffAccess) {
    return <NotAccessablePage />
  }
  return <TeacherHome />
}
