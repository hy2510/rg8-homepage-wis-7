import DayLessonList from '@/8th/features/myclass/ui/page/DayLessonList'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ title?: string; date?: string }>
}) {
  const { date, title } = await searchParams
  if (!date || !/^\d{8}$/.test(date)) {
    return <div>Invalid date</div>
  }

  return <DayLessonList title={title || 'Lesson'} date={date} />
}
