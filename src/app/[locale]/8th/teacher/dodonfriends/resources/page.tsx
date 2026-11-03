import { getAuthorizationWithCookie } from '@/authorization/server/nextjsCookieAuthorization'
import type { Metadata } from 'next'
import NotAccessablePage from '../_components/NotAccessablePage'
import ResourcesView from './ResourcesView'

export const metadata: Metadata = { title: 'Resources | DODO & FRIENDS' }
export default async function ResourcesPage() {
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

  return <ResourcesView />
}
