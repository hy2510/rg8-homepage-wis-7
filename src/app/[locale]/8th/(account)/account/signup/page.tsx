import SignUp from '@/8th/features/account/ui/page/SignUp'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>
}) {
  const { email } = await searchParams
  return <SignUp email={email} />
}
