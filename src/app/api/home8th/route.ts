import SITE_PATH from '@/app/site-path'
import { getCustomerWithHeader } from '@/authorization/server/nextjsHeaderCustomer'
import { NextRequest } from 'next/server'
import Home from '@/repository/server/home'
import { RouteResponse, executeRequestAction, getParameters } from '../_util'

type SlideBanner = {
  SlidingBannerId: string
  Priority: number
  SlidingBannerType: string
  ImagePath: string
  LinkUrl: string
  MessageData: string
  DeleteYn: boolean
  NewBrowser: string
}
type Notice = {
  NotifyId: string
  Title: string
  ReadCount: number
  StartDate: string
  EndDate: string
  PrevNotifyId: string
  NextNotifyId: string
  RegistDate: string
}
type ExperienceVideo = {
  id: string
  title: string
}
type Partner = {
  id: string
  name: string
  image: string
  link: string
}
type MainTemplate = {
  important?: {
    start: string
    end: string
    message: string
    bgColor?: string
    link?: string
  }
  notice: {
    title: string
    date: string
    link: string
    self: boolean
  }[]
  slide: { image: string; link: string; self: boolean }[]
  campaign: number
  partners?: Partner[]
  experienceVideos?: ExperienceVideo[]
}

const STATIC_HOME_PAGE_RESOURCE = process.env.STATIC_HOME_PAGE_RESOURCE
export async function GET(request: NextRequest) {
  const customer = await getCustomerWithHeader()
  if (!customer) {
    return RouteResponse.invalidCustomerToken()
  }
  const parameter = await getParameters(
    request,
    'template',
    'platform',
    'country',
  )
  const template = parameter.getString('template').toLowerCase()
  const country = parameter.getString('country', 'kr').toLowerCase()
  const platform = parameter.getString('platform', 'Web').toLowerCase()
  const isApp = platform === 'android' || platform === 'ios'

  let homeData: MainTemplate

  let dataTemplateId = 'private-kr'
  if (template === 'private') {
    if (country === 'kr' || country === 'vn') {
      dataTemplateId = `private-${country}`
    }
  } else if (template === 'school') {
    dataTemplateId = `school-kr`
  } else if (template === 'academy') {
    if (country === 'kr' || country === 'vn' || country === 'ca') {
      dataTemplateId = `academy-${country}`
    } else {
      dataTemplateId = `academy-kr`
    }
  }

  try {
    const jsonRes = await fetch(
      `${STATIC_HOME_PAGE_RESOURCE}/home/json/${dataTemplateId}.json`,
      { next: { revalidate: 600, tags: ['data:cdn', `home`] } },
    )

    if (!jsonRes.ok) {
      return RouteResponse.commonError()
    }
    const homeDataJson = await jsonRes.json()
    // FIXME: 파트너, 우수후기인터뷰 실 데이터 추가
    delete homeDataJson.quickmenu
    delete homeDataJson.layout
    homeData = {
      ...homeDataJson,
      notice: [],
      slide: [],
      floatingmenu: [...(homeDataJson.floatingmenu || [])],
      campaign: homeDataJson.campaign || 0,
      partners: !isApp ? tmpPartners : [],
      experienceVideos: !isApp
        ? proudRgVideos.map((video) => {
            return {
              id: video.id,
              url: getYoutubeUrl(video.id),
              thumbnail: getYoutubeThumbnail(video.id),
              title: video.title,
            }
          })
        : [],
    } as MainTemplate
  } catch (error) {
    return RouteResponse.commonError()
  }

  const [noticePayload, noticeStatus, noticeError] = await executeRequestAction(
    Home.noticeMainList(customer),
  )
  if (
    noticeError ||
    (noticeStatus.status < 200 && noticeStatus.status >= 300) ||
    !noticePayload.Board
  ) {
    return RouteResponse.commonError()
  }
  const [slidePayload, slideStatus, slideError] = await executeRequestAction(
    Home.slidingBanner(customer),
  )
  if (
    slideError ||
    (slideStatus.status < 200 && slideStatus.status >= 300) ||
    !slidePayload.Banner
  ) {
    return RouteResponse.commonError()
  }

  const [campaignPayload, campaignStatus, campaignError] =
    await executeRequestAction(Home.statisticRead())
  if (
    campaignError ||
    (campaignStatus.status < 200 && campaignStatus.status >= 300) ||
    !campaignPayload
  ) {
    return RouteResponse.commonError()
  }
  homeData.campaign = Number(campaignPayload.TotalBooks)

  const slideBannerList = slidePayload.Banner.filter((item: any) => {
    return true
  })
  const slideBanner: { image: string; link: string; self: boolean }[] =
    slideBannerList
      .map(
        (bnr: SlideBanner): { image: string; link: string; self: boolean } => {
          let self = bnr.NewBrowser !== 'Y'
          let link = bnr.LinkUrl || '#'
          if (self) {
            const linkUrl = bnr.LinkUrl
            if (linkUrl.startsWith('/News/LibraryBoardNotice')) {
              const data = linkUrl.split('no=')
              if (data.length === 2) {
                link = `${SITE_PATH.HOME_8TH.NOTICE}/${data[1]}`
              }
            } else if (linkUrl.startsWith('/News/NewBooks')) {
              link = SITE_PATH.HOME_8TH.NEW_BOOKS
            } else if (linkUrl.startsWith('/Community/BringInInstitution')) {
              link = 'https://util.readinggate.com/Community/BringInInstitution'
              self = false
            }
          }
          return {
            image: bnr.ImagePath,
            link,
            self,
          }
        },
      )
      .filter((item: { link: string }) => {
        if (isApp) {
          return !item.link.startsWith('http')
        }
        return true
      })
  homeData.slide.push(...slideBanner)

  const mainNotice: {
    title: string
    date: string
    link: string
    self: boolean
  }[] = noticePayload.Board.filter((_: unknown, i: number) => i < 5).map(
    (
      board: Notice,
    ): {
      title: string
      date: string
      link: string
      self: true
    } => {
      return {
        title: board.Title,
        date: board.RegistDate.substring(0, 10),
        link: `${SITE_PATH.HOME_8TH.NOTICE}/${board.NotifyId}`,
        self: true,
      }
    },
  )
  homeData.notice.push(...mainNotice)

  return RouteResponse.response(homeData, noticeStatus)
}

//// FIXME : 하드코딩 데이터
const tmpPartners = [
  {
    name: 'HiDODO',
    logo: '/src/sample-images/logo_hidodo.png',
    href: 'https://gohidodo.com/',
  },
  {
    name: '우리집은도서관',
    logo: '/src/sample-images/logo_woodo.png',
    href: 'https://www.woodo.kr/',
  },
  {
    name: '밀리',
    logo: '/src/sample-images/logo_millie.png',
    href: 'https://www.millie.co.kr/',
  },
  {
    name: '공식 카페',
    icon: '/src/sample-images/favi_naver_cafe.png',
    href: 'https://cafe.naver.com/readinggatecafe',
  },
  {
    name: '공식 블로그',
    icon: '/src/sample-images/favi_naver_blog.png',
    href: 'https://blog.naver.com/readinggate_official',
  },
  {
    name: '공식 인스타그램',
    icon: '/src/sample-images/favi_instagram.png',
    href: 'https://www.instagram.com/readinggate_official',
  },
  {
    name: '리딩게이트 샵',
    icon: '/src/sample-images/favi_naver_store.png',
    href: 'https://brand.naver.com/readinggate',
  },
  {
    name: '워크북 구매',
    icon: '/src/sample-images/favi_naver_store.png',
    href: 'https://brand.naver.com/readinggate/category/97ef382000f947ab90f05041ea6b1f0c?cp=1',
  },
]

const proudRgVideos = [
  {
    id: 'h8mry6ITLq4',
    title: '리딩게이트 덕분에 알게 된 영어 독서의 즐거움! [윤하진 학생 인터뷰]',
  },
  {
    id: 'bHvg4ibXzoY',
    title:
      '리딩게이트로 영어를 배우고 새로운 세계가 열렸어요! [김소담 학생 인터뷰]',
  },
  {
    id: 'VZE-tDzBcxA',
    title:
      '리딩게이트 덕분에 일찍 미국 대학생활을 시작했어요! [최은규 학생 인터뷰]',
  },
  {
    id: 'CvsWFKkrk7k',
    title: '리딩게이트 명예의 전당 티타늄 등급 제71호 박유은 학생 영어 인터뷰',
  },
  {
    id: 'zXfWJFYLhfY',
    title: '리딩게이트 명예의 전당 티타늄 등급 제64호 전도윤 학생 영어 인터뷰',
  },
  {
    id: 'OQ9957SWruQ',
    title: '리딩게이트 명예의 전당 티타늄 등급 제63호 김가온 학생 영어 인터뷰',
  },
  {
    id: '1zj5QtXnKkg',
    title: '제58호 티타늄 등급 하시윤 학생',
  },
  {
    id: 'Keik0bXmgNY',
    title: '제60호 티타늄 등급 박진규 학생',
  },
  {
    id: 'TLAZU3Yxnbk',
    title: '제62호 티타늄 등급 김민희 학생',
  },
  {
    id: 'LrFutlx539g',
    title: '제59호 티타늄 등급 전서진 학생',
  },
  {
    id: 'HSajULZEVRA',
    title: '제61호 티타늄 등급 김은지 학생',
  },
  {
    id: 'DIeNvgkFGhY',
    title: '제57호 티타늄 등급 남예린 학생',
  },
  {
    id: 'UTIxd4N9V34',
    title: '제56호 티타늄 등급 최다은 학생',
  },
  {
    id: 'WP2cmXhWmVM',
    title: '제53호 티타늄 등급 장준형 학생',
  },
  {
    id: 'WwkryOnG6_Y',
    title: '제51호 티타늄 등급 박소희 학생',
  },
  {
    id: 'X6H7JEbqvGU',
    title: '제48호 티타늄 등급 문준영 학생',
  },
  {
    id: 'o64MFYXc57Y',
    title: '제43호 티타늄 등급 최준서 학생',
  },
  {
    id: 'EqdYVGDAKg4',
    title: '제39호 티타늄 등급 김지민 학생',
  },
  {
    id: '1YY_LA8Qmeg',
    title: '제40호 티타늄 등급 정하운 학생',
  },
  {
    id: '4b2DBtajwNM',
    title: '제41호 티타늄 등급 허단풍 학생',
  },
  {
    id: 'ZMJhgZ0uRVo',
    title: '제35호 티타늄 등급 이다미 학생 & 어머니 인터뷰',
  },
  {
    id: '1Yk7nlRsx2c',
    title: '제34호 티타늄 등급 현서윤 학생 영어 인터뷰',
  },
  {
    id: 'U57WzgWgFGM',
    title: '제25호 티타늄 등급 이서윤 학생 영어 인터뷰',
  },
  {
    id: 'vlSQPLDrqwo',
    title: '제24호 티타늄 등급 이진 학생 영어 인터뷰',
  },
  {
    id: 'BeZCOJwJ4CM',
    title: '제20호 티타늄 등급 이라온 학생 & 어머니 랑이님 인터뷰',
  },
  {
    id: '7nwVQ1FoEPM',
    title: '제21호 티타늄 등급 천소현 학생 인터뷰',
  },
  {
    id: 'VkWmcz-2pf0',
    title: '특별한 영어 성장 비결은 따로 없어요. 랑이 스텝맘 인터뷰',
  },
  {
    id: 'HmvV7XCy2O8',
    title: '아이 실력이 제자리라고요? 식물나라 스텝맘 인터뷰',
  },
  {
    id: 'F9UgFVYBebM',
    title: '“아이의 성취는 엄마의 성취가 아니에요.“ 일곱날빛 필진 인터뷰',
  },
  {
    id: 'n_1WBzvtrJE',
    title: '“동화는 어른들에게도 필요해요.“ 염희정 동화작가 인터뷰',
  },
]

function getYoutubeThumbnail(id: string) {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
}
function getYoutubeUrl(id: string) {
  return `https://www.youtube.com/embed/${id}?enablejsapi=1&playsinline=1`
}
