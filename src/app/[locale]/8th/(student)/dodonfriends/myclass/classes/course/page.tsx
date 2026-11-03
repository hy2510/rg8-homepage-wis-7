import ClassLessonList from '@/8th/features/myclass/ui/page/ClassLessonList'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; part?: string; view?: string }>
}) {
  const { id, part, view } = await searchParams

  if (!id) {
    return <div>Invalid id</div>
  }

  return <ClassLessonList id={id} part={part} view={view} />
}
