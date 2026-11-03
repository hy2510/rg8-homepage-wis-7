import { execute, makeRequest } from '@/8th/shared/http'
import RenewType from '@/util/string-utils'

export type StudentHistory = {
  studentHistoryId: string
  classId: string
  className: string
  isBookWizard: boolean
  isPrintAssessmentReport: boolean
  programModelCode: string
  programModelName: string
}

function makeStudentHistory(json: any): StudentHistory {
  return {
    studentHistoryId: RenewType.renewString(json?.StudentHistoryId),
    classId: RenewType.renewString(json?.ClassId),
    className: RenewType.renewString(json?.ClassName),
    isBookWizard: RenewType.renewBoolean(json?.BookWizardYn),
    isPrintAssessmentReport: RenewType.renewBoolean(json?.PrintAssessmentYn),
    programModelCode: RenewType.renewString(json?.ProgramModelCode),
    programModelName: RenewType.renewString(json?.ProgramModelName),
  }
}

function transform(json: any): StudentHistoryListResponse {
  return {
    list: json.StudentHistory.map((item: any) => makeStudentHistory(item)),
  }
}

export type StudentHistoryListParams = {}

export type StudentHistoryListResponse = {
  list: StudentHistory[]
}

export async function getStudentHistoryList(
  input?: StudentHistoryListParams,
): Promise<StudentHistoryListResponse> {
  const request = makeRequest(`api/student/history-list`, {
    method: 'get',
  })
  return await execute(request, transform)
}
