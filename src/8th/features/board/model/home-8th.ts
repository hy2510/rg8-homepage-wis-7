import { execute, makeRequest } from '@/8th/shared/http'
import RenewType from '@/util/string-utils'

export type Home8th = {
  important?: NoticeBanner
  notice?: {
    title: string
    date: string
    link: string
    self: boolean
  }[]
  slide?: { image: string; link: string; self: boolean }[]
  partners?: { name: string; href: string; logo?: string; icon?: string }[]
  experienceVideos?: {
    id: string
    url: string
    title: string
    thumbnail: string
  }[]
  floatingmenu?: { action: string; icon: string }[]
}

type NoticeBanner = {
  start: string
  end: string
  message: string
  bgColor: string
  link: string
}

function makeHome8th(json: any): Home8th {
  const important = json?.important
    ? {
        start: RenewType.renewString(json?.important?.start),
        end: RenewType.renewString(json?.important?.end),
        message: RenewType.renewString(json?.important?.message),
        bgColor: RenewType.renewString(json?.important?.bgColor),
        link: RenewType.renewString(json?.important?.link),
      }
    : undefined
  const notice = json?.notice?.map((item: any) => {
    return {
      title: RenewType.renewString(item?.title),
      date: RenewType.renewString(item?.date),
      link: RenewType.renewString(item?.link),
      self: RenewType.renewBoolean(item?.self),
    }
  })
  const slide = json?.slide?.map((item: any) => {
    return {
      image: RenewType.renewString(item?.image),
      link: RenewType.renewString(item?.link),
      self: RenewType.renewBoolean(item?.self),
    }
  })
  const partners = json?.partners?.map((item: any) => {
    return {
      name: RenewType.renewString(item?.name),
      href: RenewType.renewString(item?.href),
      logo: RenewType.renewString(item?.logo),
      icon: RenewType.renewString(item?.icon),
    }
  })
  const experienceVideos = json?.experienceVideos?.map((item: any) => {
    return {
      id: RenewType.renewString(item?.id),
      url: RenewType.renewString(item?.url),
      thumbnail: RenewType.renewString(item?.thumbnail),
      title: RenewType.renewString(item?.title),
    }
  })
  const floatingmenu = json?.floatingmenu?.map((item: any) => {
    return {
      action: RenewType.renewString(item?.action),
      icon: RenewType.renewString(item?.icon),
    }
  })
  return {
    important,
    notice,
    slide,
    partners,
    experienceVideos,
    floatingmenu,
  }
}

function transform(json: any): Home8thResponse {
  return makeHome8th(json)
}

export type Home8thParams = {
  template: string
  platform: string
  country: string
}

export type Home8thResponse = Home8th

export async function getHome8th(
  input: Home8thParams,
): Promise<Home8thResponse> {
  const request = makeRequest(`api/home8th`, 'append-customer', {
    method: 'get',
    queryString: {
      template: input.template,
      platform: input.platform,
      country: input.country,
    },
  })
  return await execute(request, transform)
}
