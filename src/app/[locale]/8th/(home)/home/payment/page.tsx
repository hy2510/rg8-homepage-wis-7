import SITE_PATH from '@/app/site-path'
import { redirect } from 'next/navigation'

export default function Page() {
  return redirect(SITE_PATH.HOME_8TH.PAYMENT_PURCHASE)
}
