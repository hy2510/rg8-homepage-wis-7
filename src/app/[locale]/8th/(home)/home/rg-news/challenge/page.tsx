import { redirect } from 'next/navigation'
import { getStaticBoardData } from './board-data'

export default async function Page() {
  const post = await getStaticBoardData()
  const firstPost = post.length > 0 ? post[0] : null

  if (!firstPost) {
    return null
  }
  return redirect(firstPost.url)
}
