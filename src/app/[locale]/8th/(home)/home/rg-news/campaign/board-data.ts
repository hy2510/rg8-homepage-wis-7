import SITE_PATH from '@/app/site-path'

const STATIC_HOME_PAGE_RESOURCE = process.env.STATIC_HOME_PAGE_RESOURCE

export async function getStaticBoardData() {
  const DATA_URL = `${STATIC_HOME_PAGE_RESOURCE}/contents/json/campaign.json`
  const CONTENTS_URL = SITE_PATH.HOME_8TH.CAMPAIGN

  const postRes = await fetch(DATA_URL, {
    next: { revalidate: 3600, tags: ['data:cdn', `board:campaign`] },
  })
  const post = (await postRes.json()) as {
    id: string
    title: string
    url: string
  }[]
  return post.map((item) => {
    return {
      ...item,
      originUrl: item.url,
      url: `${CONTENTS_URL}/${item.id}`,
    }
  })
}
