import DubbingListDnf from '@/8th/features/dubbing/ui/page/DubbingListDnf'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ level?: string }>
}) {
  const { level } = await searchParams

  return <DubbingListDnf level={level} />
}
