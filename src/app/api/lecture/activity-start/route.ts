import { getAuthorizationWithCookie } from '@/authorization/server/nextjsCookieAuthorization'
import { NextRequest } from 'next/server'
import Library from '@/repository/server/library'
import {
  RouteResponse,
  executeRequestAction,
  getBodyParameters,
} from '../../_util'

// @NB_ :늘봄 개발
// 학습 시작데이터 조회
export async function POST(request: NextRequest) {
  const authorizationWithCookie = await getAuthorizationWithCookie()
  const token = authorizationWithCookie.getActiveAccessToken()
  if (!token) {
    return RouteResponse.invalidAccessToken()
  }

  const parameter = await getBodyParameters(
    request,
    'studentHistoryId',
    'levelRoundId',
  )

  const studyId = ''
  const studentHistoryId = parameter.getString('studentHistoryId', '')
  const levelRoundId = parameter.getString('levelRoundId', '')

  const [bookInfo, bookInfoStatus, bookInfoError] = await executeRequestAction(
    Library.bookInfo(token, {
      studyId,
      studentHistoryId,
      levelRoundId,
    }),
  )
  if (bookInfoError) {
    return RouteResponse.response(
      { code: 3000, message: 'First BookInfo Query Error' },
      { status: 500 },
    )
  }
  if (bookInfo.StudyId) {
    return RouteResponse.response(
      {
        StudyId: bookInfo.StudyId,
        StudentHistoryId: bookInfo.StudentHistoryId,
        LevelRoundId: levelRoundId,
        BookLevel: bookInfo.BookLevel,
        BookCode: bookInfo.BookCode,
        AnimationPath: bookInfo.AnimationPath,
      },
      bookInfoStatus,
    )
  } else {
    // Repsonse에 StudyId가 없으면 조회
    const [addTodo, addTodoStatus, addTodoError] = await executeRequestAction(
      Library.addTodos(token, {
        levelRoundIds: levelRoundId,
        studentHistoryId,
      }),
    )
    if (addTodoError) {
      return RouteResponse.response(
        { code: 3001, message: 'Add Todo Error' },
        { status: 500 },
      )
    }
    if (addTodoStatus.status >= 200 && addTodoStatus.status < 300) {
      const [afterBookInfo, afterBookInfoStatus, afterBookInfoError] =
        await executeRequestAction(
          Library.bookInfo(token, {
            studyId,
            studentHistoryId,
            levelRoundId,
          }),
        )
      if (afterBookInfoError) {
        return RouteResponse.response(
          { code: 3002, message: 'After BookInfo Query Error' },
          { status: 500 },
        )
      }
      if (afterBookInfo.StudyId) {
        return RouteResponse.response(
          {
            StudyId: afterBookInfo.StudyId,
            StudentHistoryId: afterBookInfo.StudentHistoryId,
            LevelRoundId: levelRoundId,
            BookLevel: afterBookInfo.BookLevel,
            BookCode: afterBookInfo.BookCode,
            AnimationPath: bookInfo.AnimationPath,
          },
          afterBookInfoStatus,
        )
      } else {
        return RouteResponse.response(
          { code: 3003, message: 'BookInfo StudyId Not Found' },
          { status: 500 },
        )
      }
    } else if (addTodoStatus.status === 400) {
      const extra = JSON.parse(addTodo.message)
      let message = '도서를 Todo에 추가할 수 없습니다.'
      if (extra.code === 1005) {
        message = 'Todo에는 200권 까지 추가 가능합니다.'
      } else if (extra.code === 1001 || extra.code === 1006) {
        message = '해당 레벨의 도서를 추가할 수 없습니다.' + extra.code
      }
      return RouteResponse.response({ code: 3005, message }, { status: 500 })
    }
  }
  return RouteResponse.commonError()
}
