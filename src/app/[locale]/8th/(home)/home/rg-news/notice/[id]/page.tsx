import { CurrentContentUpdater } from '@/8th/features/board/ui/page/NoticeBoard'

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  return <CurrentContentUpdater id={params.id} />
}
