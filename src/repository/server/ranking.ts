'server-only'

import { execute, makeRequest } from './utils'

const BASIC_PATH = 'ranking'
const getPath = (path: string): string => {
  return `${BASIC_PATH}/${path}`
}

async function pointMonthly(token?: string, customer?: string) {
  const request = makeRequest({
    token,
    customer,
    path: getPath('point/monthly'),
    option: {
      method: 'get',
    },
  })
  return await execute(request)
}

async function pointTotal(token?: string, customer?: string) {
  const request = makeRequest({
    token,
    customer,
    path: getPath('point/total'),
    option: {
      method: 'get',
    },
  })
  return await execute(request)
}

async function readingking(
  token?: string,
  customer?: string,
  input?: {
    eventId: string
  },
) {
  const request = makeRequest({
    token,
    customer,
    path: getPath('readingking'),
    option: {
      method: 'get',
      queryString: {
        eventId: input?.eventId,
      },
    },
  })
  return await execute(request)
}

async function readingkingGroup(
  token?: string,
  customer?: string,
  input?: {
    eventId: string
  },
) {
  const request = makeRequest({
    token,
    customer,
    path: getPath('readingking/group'),
    option: {
      method: 'get',
      queryString: {
        eventId: input?.eventId,
      },
    },
  })
  return await execute(request)
}

async function levelMaster(customer: string, input?: {}) {
  const request = makeRequest({
    customer,
    path: getPath('level-master'),
    option: {
      method: 'get',
      queryString: {},
    },
  })
  return await execute(request)
}

async function hallOfFameInfo(token?: string, customer?: string, input?: {}) {
  const request = makeRequest({
    token,
    customer,
    path: getPath('hall-of-fame-info'),
    option: {
      method: 'get',
      queryString: {},
    },
  })
  return await execute(request)
}

async function hallOfFame(
  token?: string,
  customer?: string,
  input?: {
    hallOfFameGradeId?: string
    page?: number
  },
) {
  const request = makeRequest({
    token,
    customer,
    path: getPath('hall-of-fame'),
    option: {
      method: 'get',
      queryString: {
        hallOfFameGradeId: input?.hallOfFameGradeId,
        page: input?.page,
      },
    },
  })
  return await execute(request)
}

async function rgRaceStage(token?: string, customer?: string, input?: {}) {
  const request = makeRequest({
    token,
    customer,
    path: getPath('rg-race-stage'),
    option: {
      method: 'get',
      queryString: {},
    },
  })
  return await execute(request)
}

async function rgRaceRank(
  token?: string,
  customer?: string,
  input?: {
    raceStageId: string
    page?: number
  },
) {
  const request = makeRequest({
    token,
    customer,
    path: getPath('rg-race'),
    option: {
      method: 'get',
      queryString: {
        raceStageId: input?.raceStageId,
        page: input?.page,
      },
    },
  })
  return await execute(request)
}

const Ranking = {
  pointMonthly,
  pointTotal,
  readingking,
  readingkingGroup,
  levelMaster,
  hallOfFameInfo,
  hallOfFame,
  rgRaceStage,
  rgRaceRank,
}
export default Ranking
