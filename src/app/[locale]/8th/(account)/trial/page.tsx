import { TrialLevel } from '@/8th/features/account/ui/page/Trial'
import SITE_PATH from '@/app/site-path'
import { redirect } from 'next/navigation'

export default async function Page() {
  const level: TrialLevel = 'prek' as TrialLevel
  return redirect(`${SITE_PATH.ACCOUNT_8TH.TRIAL}/${level}`)
}
