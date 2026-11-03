import { execute, makeRequest } from '@/8th/shared/http'
import RenewType from '@/util/string-utils'

function transform(json: any): AnimationCompleteResponse {
  return {
    success: RenewType.renewBoolean(json.success),
  }
}

export type AnimationCompleteParams = {
  studyId: string
  studentHistoryId: string
}

export type AnimationCompleteResponse = {
  success: boolean
}

export async function postAnimationComplete(
  input: AnimationCompleteParams,
): Promise<AnimationCompleteResponse> {
  const request = makeRequest(
    `api/study/book-reading/book/animation-complete-neulbom`,
    {
      method: 'post',
      body: {
        studyId: input.studyId,
        studentHistoryId: input.studentHistoryId,
      },
    },
  )
  return await execute(request, transform)
}
