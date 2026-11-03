import MovieContentsList from '@/8th/features/movies/ui/page/MovieContentsListDnf'

export default async function MovieContentsListPage({
  params,
}: {
  params: Promise<{ categoryId: string }>
}) {
  const { categoryId } = await params

  return <MovieContentsList categoryId={categoryId} />
}
