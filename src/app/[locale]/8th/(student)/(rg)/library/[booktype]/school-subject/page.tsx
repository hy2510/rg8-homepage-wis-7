import SearchSchoolSubjectBookList from '@/8th/features/library/ui/page/SearchSchoolSubjectBookList'

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ booktype: string }>
  searchParams: Promise<{ grade?: string; publisher?: string; lesson?: string }>
}) {
  const { booktype } = await params
  const { grade, publisher, lesson } = await searchParams

  return (
    <SearchSchoolSubjectBookList
      bookType={booktype as 'eb' | 'pb'}
      grade={grade}
      publisher={publisher}
      lesson={lesson}
    />
  )
}
