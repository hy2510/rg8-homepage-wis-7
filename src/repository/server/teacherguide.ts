'server-only'

import { execute, makeRequest } from './utils'

const BASIC_PATH = 'teacherguide'
const getPath = (path: string): string => {
  return `${BASIC_PATH}/${path}`
}

async function classList(token: string) {
  const request = makeRequest({
    token,
    path: getPath(`class-list`),
    option: {
      method: 'get',
    },
  })
  return await execute(request)
}

async function courseList(token: string, input: { classId: string }) {
  const request = makeRequest({
    token,
    path: getPath(`course-list`),
    option: {
      method: 'get',
      queryString: {
        classId: input.classId,
      },
    },
  })
  return await execute(request)
}

async function lessonList(
  token: string,
  input: { teacherCurriculumId: number },
) {
  const request = makeRequest({
    token,
    path: getPath(`lesson-list`),
    option: {
      method: 'get',
      queryString: {
        teacherCurriculumId: input.teacherCurriculumId,
      },
    },
  })
  return await execute(request)
}

const TeacherGuide = {
  classList,
  courseList,
  lessonList,
}
export default TeacherGuide
