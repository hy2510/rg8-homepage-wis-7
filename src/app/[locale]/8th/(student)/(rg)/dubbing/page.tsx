import DubbingList from '@/8th/features/dubbing/ui/page/DubbingList'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ level?: string }>
}) {
  const { level } = await searchParams

  return <DubbingList level={level} />
}
