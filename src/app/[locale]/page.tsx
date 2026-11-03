import { redirect } from 'next/navigation'
import SITE_PATH from '../site-path'

export default function Page() {
  return redirect(SITE_PATH.HOME_8TH.ROOT)
}
