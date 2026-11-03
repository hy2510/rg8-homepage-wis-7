import { execute, makeRequest } from '@/8th/shared/http'
import RenewType from '@/util/string-utils'

export type DubbingContentDetail = {
  levelRoundId: string
  studyId: string
  studentHistoryId: string
  studentId: string
  classId: string
  title: string
  studyImagePath: string
  bookCode: string
  rgPoint: number
  getableRgPoint: number
  passCount: number
  activeStudyMode: string
  studyMode: string
  studyStatus: string
  videoPath: string
  subtitlePath: string
  record: {
    quizNo: number
    actor: string
    lead: boolean
    soundPath: string
    sentence: string
    startTime: string
    endTime: string
    rawJson: string
  }[]
  scoreOverall: number
  score1: number
  score2: number
  score3: number
  score4: number
  score5: number
}

function makeDubbingContentDetail(json: any): DubbingContentDetail {
  return {
    levelRoundId: RenewType.renewString(json?.LevelRoundId),
    studyId: RenewType.renewString(json?.StudyId),
    studentHistoryId: RenewType.renewString(json?.StudentHistoryId),
    studentId: RenewType.renewString(json?.StudentId),
    classId: RenewType.renewString(json?.ClassId),
    title: RenewType.renewString(json?.Title),
    studyImagePath: RenewType.renewString(json?.StudyImagePath),
    bookCode: RenewType.renewString(json?.BookCode),
    rgPoint: RenewType.renewNumber(json?.RgPoint),
    getableRgPoint: RenewType.renewNumber(json?.GetableRgPoint),
    passCount: RenewType.renewNumber(json?.PassCount),
    activeStudyMode: RenewType.renewString(json?.ActiveStudyMode),
    studyMode: RenewType.renewString(json?.StudyMode),
    studyStatus: RenewType.renewString(json?.StudyStatus),
    videoPath: RenewType.renewString(json?.VideoPath),
    subtitlePath: RenewType.renewString(json?.SubtitlePath),
    record:
      json?.Record?.map((item: any) => ({
        quizNo: RenewType.renewNumber(item?.QuizNo),
        actor: RenewType.renewString(item?.Actor),
        lead: RenewType.renewBoolean(item?.Lead),
        soundPath: RenewType.renewString(item?.SoundPath),
        sentence: RenewType.renewString(item?.Sentence),
        startTime: RenewType.renewString(item?.StartTime),
        endTime: RenewType.renewString(item?.EndTime),
        rawJson: RenewType.renewString(item?.RawJson),
      })) || [],
    scoreOverall: RenewType.renewNumber(json?.ScoreOverall),
    score1: RenewType.renewNumber(json?.Score1),
    score2: RenewType.renewNumber(json?.Score2),
    score3: RenewType.renewNumber(json?.Score3),
    score4: RenewType.renewNumber(json?.Score4),
    score5: RenewType.renewNumber(json?.Score5),
  }
}

function transform(json: any): DubbingContentDetailResponse {
  return makeDubbingContentDetail(json)
}

export type DubbingContentDetailParams = {
  levelRoundId: string
  studyId?: string
  studyMode?: string
}

export type DubbingContentDetailResponse = DubbingContentDetail

export async function getDubbingContentDetail(
  input: DubbingContentDetailParams,
): Promise<DubbingContentDetailResponse> {
  const request = makeRequest(`api/dubbingroom/content`, {
    method: 'get',
    queryString: {
      levelRoundId: input.levelRoundId,
      studyId: input.studyId,
      studyMode: input.studyMode,
    },
  })
  return await execute(request, transform)
}
