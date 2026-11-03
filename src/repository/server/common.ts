'server-only'

import {
  type DevCustomer,
  type DevCustomerSearch,
  getDevCustomer,
  getDevCustomerByToken,
  getDevCustomerSearch,
} from './dev-customer-data'
import { execute, makeRequest } from './utils'

// 개발용 하드코딩 DB 사용 여부
const IS_DEV_DB = process.env.DB_CONNECT_DEV === 'Y'

const BASIC_PATH = 'common'
const getPath = (path: string): string => {
  return `${BASIC_PATH}/${path}`
}

async function selfCustomer(token: string) {
  // MEMO - 개발서버 DB 하드코딩
  if (IS_DEV_DB) {
    return new Promise<{ ok: boolean; status: number; data: DevCustomer }>(
      (resolve) => {
        resolve({ ok: true, status: 200, data: getDevCustomerByToken(token) })
      },
    )
  }

  const request = makeRequest({
    token,
    path: getPath('customer'),
    option: {
      method: 'get',
    },
  })
  return await execute(request)
}

async function findCustomer(input: {
  homepageUrl?: string
  customerId?: string
}) {
  const isAppWhitelist = [
    'localhost',
    'apps.readinggate.com',
    'apps_w1.readinggate.com',
    'apps_w2.readinggate.com',
    'apps_w3.readinggate.com',
    'apps_w4.readinggate.com',
  ]
  if (input.homepageUrl) {
    const isApp = isAppWhitelist.some(
      (item) => input.homepageUrl!.indexOf(item) >= 0,
    )
    if (isApp) {
      return new Promise<{
        ok: boolean
        status: number
        extra: any
        data?: DevCustomer
      }>((resolve) => {
        resolve({ ok: true, status: 400, extra: '' })
      })
    }
  }

  // MEMO - 개발서버 DB 하드코딩
  if (IS_DEV_DB) {
    return new Promise<{ ok: boolean; status: number; data: DevCustomer }>(
      (resolve) => {
        resolve({ ok: true, status: 200, data: getDevCustomer(input) })
      },
    )
  }

  let requestPath = getPath(`find-customer?homepageUrl=${input.homepageUrl}`)
  if (!input.homepageUrl) {
    requestPath = getPath(`find-customer?customerId=${input.customerId}`)
  }
  const request = makeRequest({
    path: requestPath,
    option: {
      method: 'get',
    },
  })
  return await execute(request)
}

async function searchCustomer(input: {
  keyword?: string
  customerUse?: string
  countryCode?: string
}) {
  // MEMO - 개발서버 DB 하드코딩
  if (IS_DEV_DB) {
    return new Promise<{
      ok: boolean
      status: number
      data: { Customers: DevCustomerSearch[] }
    }>((resolve) => {
      resolve({ ok: true, status: 200, data: getDevCustomerSearch() })
    })
  }

  const requestPath = getPath(
    `customer-search?keyword=${input.keyword}&customerUse=${input.customerUse}&countryCode=${input.countryCode}`,
  )

  const request = makeRequest({
    path: requestPath,
    option: {
      method: 'get',
    },
  })
  return await execute(request)
}

async function getTrialAccessToken() {
  const requestPath = getPath('trial-access-token')
  const request = makeRequest({
    path: requestPath,
    option: {
      method: 'get',
    },
  })
  return await execute(request)
}

const Common = {
  selfCustomer,
  findCustomer,
  searchCustomer,
  getTrialAccessToken,
}
export default Common
