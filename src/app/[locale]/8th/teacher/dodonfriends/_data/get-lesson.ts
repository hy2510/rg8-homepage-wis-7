import { execute, makeRequest } from '@/8th/shared/http'
import RenewType from '@/util/string-utils'

type LessonStage = 'warm-up' | 'watch' | 'activity' | 'read' | 'wrap-up'
type LessonContentType = 'video' | 'prek' | 'hidodo' | 'reading' | 'workbook'
export type LessonCatalog = {
  id: string
  workBookName: string
  workBookNo: number
  guides: LessonGuide[]
}

type ChapterLesson = {
  id: string
  title: string
  contentType: LessonContentType
  content: {
    uri: string
    extra?: string
  }
  workBooks?: string[]
  comment?: {
    script?: string
    tip?: string
  }
}

type LessonGuide = {
  type: LessonStage
  chapter: {
    title: string
    lessons: ChapterLesson[]
  }[]
}

type LessonPayload = {
  TeacherCurriculumId: string
  WorkBookName: string
  WorkBookNo: number
  LessonNo: string
  LessonTitle: string
  LessonType: string
  ActivityType: string
  ActivityNo: number
  StepNo: number
  ActivityGroup: string
  LevelRoundId: string
  Tag: string
  Type: string
  Title: string
  Thumbnail: string
  ImagePath: string
  MoviePath: string
  SubtitlePath: string
  BookCode: string
  BookPoint: string
  ActivityUrl: string
  TeacherGuide: string
  GuideTip: string
  StudyId: string
  StudentHistoryId: string
}

function makeLesson(json: any): LessonPayload {
  return {
    TeacherCurriculumId: RenewType.renewString(json.TeacherCurriculumId),
    WorkBookName: RenewType.renewString(json.WorkBookName),
    WorkBookNo: RenewType.renewNumber(json.WorkBookNo),
    LessonNo: RenewType.renewString(json.LessonNo),
    LessonTitle: RenewType.renewString(json.LessonTitle),
    LessonType: RenewType.renewString(json.LessonType),
    ActivityType: RenewType.renewString(json.ActivityType),
    ActivityNo: RenewType.renewNumber(json.ActivityNo),
    StepNo: RenewType.renewNumber(json.StepNo),
    ActivityGroup: RenewType.renewString(json.ActivityGroup),
    LevelRoundId: RenewType.renewString(json.LevelRoundId),
    Tag: RenewType.renewString(json.Tag),
    Type: RenewType.renewString(json.Type),
    Title: RenewType.renewString(json.Title),
    Thumbnail: RenewType.renewString(json.Thumbnail),
    ImagePath: RenewType.renewString(json.ImagePath),
    MoviePath: RenewType.renewString(json.MoviePath),
    SubtitlePath: RenewType.renewString(json.SubtitlePath),
    BookCode: RenewType.renewString(json.BookCode),
    BookPoint: RenewType.renewString(json.BookPoint),
    ActivityUrl: RenewType.renewString(json.ActivityUrl),
    TeacherGuide: RenewType.renewString(json.TeacherGuide),
    GuideTip: RenewType.renewString(json.GuideTip),
    StudyId: RenewType.renewString(json.StudyId),
    StudentHistoryId: RenewType.renewString(json.StudentHistoryId),
  }
}

function makeLessonItem(item: LessonPayload): ChapterLesson {
  let id = `lesson-${item.ActivityType}-${item.Type}-${item.ActivityGroup}-${item.Title}-${item.StepNo}`
  if (item.ActivityType === 'activity' && item.ActivityGroup === 'Bonus') {
    id = `${id}-${item.Tag}`
  }
  let title = item.Title
  let contentType: LessonContentType | undefined = undefined
  switch (item.Type) {
    case 'Movie':
      contentType = 'video'
      break
    case 'Movie Activity':
      contentType = 'prek'
      break
    case 'eBook':
      contentType = 'reading'
      break
    case 'WorkBook':
    case 'WorkBookAnswer':
      contentType = 'workbook'
      if (item.Type === 'WorkBookAnswer') {
        title = 'WorkBook Answer'
      } else {
        title = 'WorkBook'
      }
      break
  }
  if (
    !contentType &&
    item.ActivityType === 'activity' &&
    item.ActivityGroup === 'Bonus'
  ) {
    contentType = 'hidodo'
  }

  let uri: string = ''
  let extra: string | undefined = undefined
  if (contentType === 'video') {
    uri = item.MoviePath
  } else if (contentType === 'hidodo') {
    uri = item.ActivityUrl
  } else if (contentType === 'reading' || contentType === 'prek') {
    uri = item.BookCode
    extra = `levelRoundId=${item.LevelRoundId}&stepNo=${item.StepNo}&bookCode=${item.BookCode}&unit=${item.WorkBookName.toLocaleLowerCase()}&studyId=${item.StudyId}&studentHistoryId=${item.StudentHistoryId}`
  }
  let workBooks: string[] | undefined = undefined
  if (contentType === 'workbook') {
    workBooks = item.ImagePath.split('|')
  }
  return {
    id: id,
    title: title,
    contentType: contentType!,
    content: {
      uri: uri,
      extra: extra,
    },
    workBooks: workBooks,
    comment:
      !!item.TeacherGuide || !!item.GuideTip
        ? {
            script: item.TeacherGuide,
            tip: item.GuideTip,
          }
        : undefined,
  }
}

function transform(json: any): LessonResponse {
  const payloadList: LessonPayload[] =
    json?.lessons?.map((item: any) => makeLesson(item)) ?? []

  if (payloadList.length === 0) {
    throw new Error('Lesson not found')
  }

  /* ================================================
   * Step 1: Warm-up
   * ================================================ */
  const filteredWramUp = payloadList.filter(
    (item: LessonPayload) => item.ActivityType === 'warm-up',
  )
  const guideWramUp: LessonGuide | null =
    filteredWramUp.length > 0
      ? {
          type: 'warm-up',
          chapter: filteredWramUp.map((item: LessonPayload) => ({
            title: item.ActivityGroup,
            lessons: [makeLessonItem(item)],
          })),
        }
      : null

  /* ================================================
   * Step 2: Watch
   * ================================================ */
  const filteredWatch = payloadList.filter(
    (item: LessonPayload) => item.ActivityType === 'watch',
  )
  const guideWatch: LessonGuide | null =
    filteredWatch.length > 0
      ? {
          type: 'watch',
          chapter: filteredWatch.map((item: LessonPayload) => ({
            title: item.ActivityGroup,
            lessons: [makeLessonItem(item)],
          })),
        }
      : null

  /* ================================================
   * Step 3: Activity
   * ================================================ */

  const filteredActivity = payloadList.filter(
    (item: LessonPayload) => item.ActivityType === 'activity',
  )
  const guideActivity: LessonGuide | null =
    filteredActivity.length > 0
      ? {
          type: 'activity',
          chapter: [],
        }
      : null
  if (
    guideActivity !== null &&
    filteredActivity.filter(
      (item: LessonPayload) => item.ActivityGroup === 'Activity',
    ).length > 0
  ) {
    guideActivity.chapter.push({
      title: 'Activity',
      lessons: filteredActivity
        .filter((item: LessonPayload) => item.ActivityGroup === 'Activity')
        .map((item: LessonPayload) => makeLessonItem(item)),
    })
  }
  if (
    guideActivity !== null &&
    filteredActivity.filter(
      (item: LessonPayload) => item.ActivityGroup === 'Bonus',
    ).length > 0
  ) {
    guideActivity.chapter.push({
      title: 'Bonus',
      lessons: filteredActivity
        .filter((item: LessonPayload) => item.ActivityGroup === 'Bonus')
        .map((item: LessonPayload) => makeLessonItem(item)),
    })
  }

  /* ================================================
   * Step 4: Read
   * ================================================ */
  const filteredRead = payloadList.filter(
    (item: LessonPayload) => item.ActivityType === 'read',
  )
  const guideRead: LessonGuide | null =
    filteredRead.length > 0
      ? {
          type: 'read',
          chapter: [],
        }
      : null
  if (
    guideRead !== null &&
    filteredRead.filter(
      (item: LessonPayload) =>
        item.ActivityNo === 4 && item.ActivityGroup === 'eBook',
    ).length > 0
  ) {
    guideRead.chapter.push({
      title: 'eBook',
      lessons: filteredRead
        .filter(
          (item: LessonPayload) =>
            item.ActivityNo === 4 && item.ActivityGroup === 'eBook',
        )
        .map((item: LessonPayload) => makeLessonItem(item)),
    })
  }
  if (
    guideRead !== null &&
    filteredRead.filter(
      (item: LessonPayload) =>
        item.ActivityNo === 4 && item.ActivityGroup === 'WorkBook',
    ).length > 0
  ) {
    guideRead.chapter.push({
      title: 'WorkBook',
      lessons: filteredRead
        .filter(
          (item: LessonPayload) =>
            item.ActivityNo === 4 && item.ActivityGroup === 'WorkBook',
        )
        .map((item: LessonPayload) => makeLessonItem(item)),
    })
  }

  /* ================================================
   * Step 5: Wrap-up
   * ================================================ */
  const filteredWrapUp = payloadList.filter(
    (item: LessonPayload) => item.ActivityType === 'wrap-up',
  )
  const guideWrapUp: LessonGuide | null =
    filteredWrapUp.length > 0
      ? {
          type: 'wrap-up',
          chapter: filteredWrapUp.map((item: LessonPayload) => ({
            title: item.ActivityGroup,
            lessons: [makeLessonItem(item)],
          })),
        }
      : null

  const guides = [
    guideWramUp,
    guideWatch,
    guideActivity,
    guideRead,
    guideWrapUp,
  ].filter((item) => item !== null)
  return {
    id: payloadList[0].TeacherCurriculumId.toString(),
    workBookName: payloadList[0].WorkBookName,
    workBookNo: payloadList[0].WorkBookNo,
    guides,
  }
}

export type LessonParams = {
  teacherCurriculumId: string
}

export type LessonResponse = LessonCatalog

export async function getLesson(input: LessonParams): Promise<LessonResponse> {
  const request = makeRequest(`api/teacher-guide/lessons`, {
    method: 'get',
    queryString: {
      teacherCurriculumId: input.teacherCurriculumId,
    },
  })
  return await execute(request, transform)
}
