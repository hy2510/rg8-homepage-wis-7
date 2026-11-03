'server-only'

import { execute, makeRequest } from './utils'

const BASIC_PATH = 'lecture'
const getPath = (path: string): string => {
  return `${BASIC_PATH}/${path}`
}

async function section(
  token: string,
  input: {
    studentHistoryId: string
  },
) {
  const request = makeRequest({
    token,
    path: getPath('section'),
    option: {
      method: 'get',
      queryString: {
        studentHistoryId: input.studentHistoryId,
      },
    },
  })
  return await execute(request)
}

async function weekStatus(
  token: string,
  input: {
    studentHistoryId: string
    studyDate: string
  },
) {
  const request = makeRequest({
    token,
    path: getPath('week'),
    option: {
      method: 'get',
      queryString: {
        studentHistoryId: input.studentHistoryId,
        studyDate: input.studyDate,
      },
    },
  })
  return await execute(request)
}

async function monthStatus(
  token: string,
  input: {
    studentHistoryId: string
    studyDate: string
  },
) {
  const request = makeRequest({
    token,
    path: getPath('month'),
    option: {
      method: 'get',
      queryString: {
        studentHistoryId: input.studentHistoryId,
        studyDate: input.studyDate,
      },
    },
  })
  return await execute(request)
}

async function book(
  token: string,
  input: {
    studentHistoryId: string
    studyDate: string
  },
) {
  const request = makeRequest({
    token,
    path: getPath('book'),
    option: {
      method: 'get',
      queryString: {
        studentHistoryId: input.studentHistoryId,
        studyDate: input.studyDate,
      },
    },
  })
  return await execute(request)
}

async function course(
  token: string,
  input: {
    studentHistoryId: string
    page?: number
    lectureSection?: string
    status?: string
  },
) {
  const request = makeRequest({
    token,
    path: getPath('course'),
    option: {
      method: 'get',
      queryString: {
        studentHistoryId: input.studentHistoryId,
        page: input.page,
        lectureSection: input.lectureSection,
        status: input.status,
      },
    },
  })
  return await execute(request)
}
const Lecture = {
  section,
  weekStatus,
  monthStatus,
  book,
  course,
}
export default Lecture
