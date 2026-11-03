'server-only'

import { execute, makeRequest } from './utils'

const BASIC_PATH = 'dubbingroom'
const getPath = (path: string): string => {
  return `${BASIC_PATH}/${path}`
}

async function info(token: string) {
  const requestPath = getPath('info')
  const request = makeRequest({
    token,
    path: requestPath,
    option: {
      method: 'get',
    },
  })
  return await execute(request)
}

async function tags(token: string) {
  const requestPath = getPath('tags')
  const request = makeRequest({
    token,
    path: requestPath,
    option: {
      method: 'get',
    },
  })
  return await execute(request)
}

async function search(token: string, input: { level: string }) {
  const requestPath = getPath('search')
  const request = makeRequest({
    token,
    path: requestPath,
    option: {
      method: 'get',
      queryString: {
        level: input.level,
      },
    },
  })
  return await execute(request)
}

async function myVideo(token: string, input: { level: string }) {
  const requestPath = getPath('my-video')
  const request = makeRequest({
    token,
    path: requestPath,
    option: {
      method: 'get',
      queryString: {
        level: input.level,
      },
    },
  })
  return await execute(request)
}

async function contents(
  token: string,
  input: { levelRoundId: string; studyId?: string; studyMode?: string },
) {
  const requestPath = getPath('content')
  const request = makeRequest({
    token,
    path: requestPath,
    option: {
      method: 'get',
      queryString: {
        levelRoundId: input.levelRoundId,
        studyId: input.studyId,
        studyMode: input.studyMode,
      },
    },
  })
  return await execute(request)
}

async function commonGet(token: string, path: string) {
  const requestPath = getPath(path)
  const request = makeRequest({
    token,
    path: requestPath,
    option: {
      method: 'get',
    },
  })
  return await execute(request)
}

async function commonPost(token: string, path: string, input: unknown) {
  const requestPath = getPath(path)
  const request = makeRequest({
    token,
    path: requestPath,
    option: {
      method: 'post',
      body: input,
    },
  })
  return await execute(request)
}

const DubbingRoom = {
  info,
  tags,
  search,
  myVideo,
  contents,
  commonGet,
  commonPost,
}
export default DubbingRoom
