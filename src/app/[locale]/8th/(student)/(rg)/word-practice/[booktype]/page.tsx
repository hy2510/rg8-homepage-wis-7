import WordPractice from '@/8th/features/wordpractice/ui/page/WordPractice'

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ booktype: string; level: string }>
  searchParams: Promise<{ level: string }>
}) {
  const { booktype } = await params
  const { level } = await searchParams

  return (
    <WordPractice
      bookType={booktype.toLowerCase() as 'eb' | 'pb'}
      level={level}
    />
  )
}
