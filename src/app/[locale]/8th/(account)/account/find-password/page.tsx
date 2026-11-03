import FindPassword from '@/8th/features/account/ui/page/FindPassword'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ type?: 'id' | 'email'; hint?: string }>
}) {
  const { type, hint } = await searchParams
  return <FindPassword defaultType={type} hint={hint} />
}
