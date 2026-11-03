'use client'

import { execute, makeRequest } from '@/8th/shared/http'
import RenewType from '@/util/string-utils'

export type Course = {
  id: string
  title: string
  lessons: CourseLesson[]
}

type CourseLesson = {
  teacherCurriculumId: string
  id: string
  kind: 'lesson' | 'review'
  title: string
  pageLabel?: string
  hasGuide: boolean
  canStart: boolean
}

type CoursePayload = {
  TeacherCurriculumId: string
  ClassId: string
  CourseOrder: number
  CourseTitle: string
  LessonOrder: number
  LessonType: string
  LessonTitle: string
  Pages: string
  GuideYn: boolean
}

function makeCourse(json: any): CoursePayload {
  return {
    TeacherCurriculumId: RenewType.renewString(json.TeacherCurriculumId),
    ClassId: RenewType.renewString(json.ClassId),
    CourseOrder: RenewType.renewNumber(json.CourseOrder),
    CourseTitle: RenewType.renewString(json.CourseTitle),
    LessonOrder: RenewType.renewNumber(json.LessonOrder),
    LessonType: RenewType.renewString(json.LessonType),
    LessonTitle: RenewType.renewString(json.LessonTitle),
    Pages: RenewType.renewString(json.Pages),
    GuideYn: RenewType.renewBoolean(json.GuideYn),
  }
}

function transform(json: any): CourseResponse {
  const payloadList: CoursePayload[] =
    json?.courses?.map((item: any) => makeCourse(item)) ?? []

  if (payloadList.length === 0) {
    throw new Error('Course not found')
  }
  const classId = payloadList[0].ClassId
  const courseTitle = payloadList[0].CourseTitle
  const courses: Course[] = []

  const orderMap = new Map<number, CoursePayload[]>()
  payloadList.forEach((item: CoursePayload) => {
    const id = item.CourseOrder
    const list = orderMap.get(id) ?? []
    list.push(item)
    orderMap.set(id, list)
  })
  for (const [key, values] of orderMap) {
    if (values.length === 0) {
      continue
    }
    const course: Course = {
      id: `${classId}-${key}`,
      title: values[0].CourseTitle,
      lessons: values.map((item) => {
        return {
          teacherCurriculumId: item.TeacherCurriculumId,
          id: item.TeacherCurriculumId,
          kind: item.LessonType as 'lesson' | 'review',
          title: item.LessonTitle,
          pageLabel: item.Pages,
          hasGuide: item.GuideYn,
          canStart: true,
        }
      }),
    }
    courses.push(course)
  }

  return {
    classId,
    courseTitle,
    courses,
  }
}

export type CourseParams = {
  classId: string
}

export type CourseResponse = {
  classId: string
  courseTitle: string
  courses: Course[]
}

export async function getCourse(input: CourseParams): Promise<CourseResponse> {
  const request = makeRequest(`api/teacher-guide/courses`, {
    method: 'get',
    queryString: {
      classId: input.classId,
    },
  })
  return await execute(request, transform)
}
