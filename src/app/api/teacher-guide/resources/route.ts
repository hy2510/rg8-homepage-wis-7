import {
  RouteResponse,
  executeRequestAction,
  getParameters,
} from '@/app/api/_util'
import { getAuthorizationWithCookie } from '@/authorization/server/nextjsCookieAuthorization'
import { NextRequest } from 'next/server'
import Account from '@/repository/server/account'

export async function GET(request: NextRequest) {
  const authorizationWithCookie = await getAuthorizationWithCookie()
  const token = authorizationWithCookie.getActiveAccessToken()

  if (!token) {
    return RouteResponse.invalidAccessToken()
  }

  const userDetails = token
    ? authorizationWithCookie.getTokenUserDetails()
    : undefined
  const isStaffAccess =
    userDetails?.role === 'staff' || userDetails?.role === 'admin'

  if (!isStaffAccess) {
    return RouteResponse.response(null, { status: 403 })
  }

  const parameter = await getParameters(request, '')

  // FIXME: 하드코딩 데이터, DB 연동 필요
  if (true) {
    return RouteResponse.response(HARD_CODED_RESOURCES, { status: 200 })
  }
  const [payload, status, error] = await executeRequestAction(
    Account.staffMe(token || ''),
  )
  if (status.status >= 200 && status.status < 300) {
    return RouteResponse.response(payload, status)
  }
  if (error) {
    return RouteResponse.commonError()
  }
  return RouteResponse.commonError()
}

const HARD_CODED_RESOURCES = {
  materialGroups: [
    {
      id: 'alphabet',
      title: '알파벳 학습 자료',
      subtitle: 'Baro',
      items: [
        {
          id: 'letter-large',
          title: '알파벳 레터 카드 (L)',
          url: 'https://drive.google.com/file/d/1BaEQIfxIfg8hDbitNA_U3f3P6n1rGbHu/view?usp=sharing',
        },
        {
          id: 'letter-small',
          title: '알파벳 레터 카드 (S)',
          url: 'https://drive.google.com/file/d/15-aqDjH1hqJesrrrzv04bAN7yyhj1wUS/view?usp=sharing',
        },
        {
          id: 'picture',
          title: '알파벳 그림 플래시카드',
          url: 'https://drive.google.com/file/d/13JVjKuMke_Em24fiZ_FMLaU6PIMlpb5e/view?usp=sharing',
        },
        {
          id: 'paper',
          title: '알파벳 모양 종이',
          url: 'https://drive.google.com/file/d/1oJHoTS4qRBtw-FeYL82MwLo0I_o45Y2x/view?usp=sharing',
        },
        {
          id: 'worksheet',
          title: '알파벳 워크시트',
          url: 'https://drive.google.com/file/d/18P7cbw5l2h2JSJ9VJa7c9NXoqY_1oDr2/view?usp=sharing',
        },
      ],
    },
    {
      id: 'phonics',
      title: '파닉스 학습 자료',
      subtitle: 'Chello, Millo, Jack',
      items: [
        {
          id: 'flashcards',
          title: '파닉스 플래시카드 (L)',
          url: 'https://drive.google.com/file/d/1aFp0j8a9PBPAQrOm86OMOMH9qnK6DdnI/view?usp=sharing',
        },
        {
          id: 'word-family',
          title: 'Word Family 카드',
          url: 'https://drive.google.com/file/d/1g6-ZnYTGb26Zsjcoy2b2xVHfAdMHF1FG/view?usp=sharing',
        },
        {
          id: 'consonants',
          title: '자음 카드',
          url: 'https://drive.google.com/file/d/14M39dD-1V6Fry_IP5jHocqOXjtTtmUfd/view?usp=sharing',
        },
      ],
    },
    {
      id: 'sight-words',
      title: '사이트워즈 학습 자료',
      subtitle: 'Blanc, Sheila',
      items: [
        {
          id: 'worksheets',
          title: '문장 워크시트',
          url: 'https://drive.google.com/file/d/1-JX9DLgyCmMOI2ecZrtKMGzk9ia5JeMu/view?usp=sharing',
        },
        {
          id: 'flashcards',
          title: '단어 플래시카드',
          url: 'https://drive.google.com/file/d/1sb-y7iyxXwRv4guD7S7gMHn7G5VKYUYX/view?usp=sharing',
        },
        {
          id: 'sentences',
          title: '문장 카드',
          url: 'https://drive.google.com/file/d/1a4HL1TaWEpw2vzJOGdXDoO3WJ_FAwCQD/view?usp=sharing',
        },
      ],
    },
    {
      id: 'common',
      title: '공통 학습 자료',
      subtitle: 'Common',
      items: [
        {
          id: 'bingo',
          title: '빙고 시트',
          url: 'https://drive.google.com/file/d/1r65UxvHeKezKxbtmnRwLqKFcTo5SuHHA/view?usp=sharing',
        },
        {
          id: 'instructions',
          title: '지시문 카드',
          url: 'https://drive.google.com/file/d/1GQaP3Zi-mTfJ48e_w_pHv1I6XwoIF-gT/view?usp=sharing',
        },
        {
          id: 'questions',
          title: '질문 카드',
          url: 'https://drive.google.com/file/d/15r492cxCHRXQPOKgojfGk2I33kIGb3cK/view?usp=sharing',
        },
      ],
    },
  ],
  answerKeyGroups: [
    {
      id: 'alphabet',
      title: 'Alphabet',
      items: [
        { id: 'baro-1', title: 'Baro 1', url: 'https://www.google.com' },
        { id: 'baro-2', title: 'Baro 2', url: 'https://www.google.com' },
        { id: 'baro-3', title: 'Baro 3', url: 'https://www.google.com' },
      ],
    },
    {
      id: 'phonics',
      title: 'Phonics',
      items: [
        {
          id: 'chello-1',
          title: 'Chello 1',
          url: 'https://www.google.com',
        },
        {
          id: 'chello-2',
          title: 'Chello 2',
          url: 'https://www.google.com',
        },
        {
          id: 'chello-3',
          title: 'Chello 3',
          url: 'https://www.google.com',
        },
        {
          id: 'millo-1',
          title: 'Millo 1',
          url: 'https://www.google.com',
        },
        {
          id: 'millo-2',
          title: 'Millo 2',
          url: 'https://www.google.com',
        },
        {
          id: 'millo-3',
          title: 'Millo 3',
          url: 'https://www.google.com',
        },
        { id: 'jack-1', title: 'Jack 1', url: 'https://www.google.com' },
        { id: 'jack-2', title: 'Jack 2', url: 'https://www.google.com' },
        { id: 'jack-3', title: 'Jack 3', url: 'https://www.google.com' },
      ],
    },
    {
      id: 'sight-words',
      title: 'Sight Words',
      items: [
        {
          id: 'blanc-1',
          title: 'Blanc 1',
          url: 'https://www.google.com',
        },
        {
          id: 'blanc-2',
          title: 'Blanc 2',
          url: 'https://www.google.com',
        },
        {
          id: 'blanc-3',
          title: 'Blanc 3',
          url: 'https://www.google.com',
        },
        {
          id: 'sheila-4',
          title: 'Sheila 4',
          url: 'https://www.google.com',
        },
        {
          id: 'sheila-5',
          title: 'Sheila 5',
          url: 'https://www.google.com',
        },
        {
          id: 'sheila-6',
          title: 'Sheila 6',
          url: 'https://www.google.com',
        },
      ],
    },
    {
      id: 'readers-a',
      title: 'Readers A',
      items: [
        { id: 'tori-1', title: 'Tori 1', url: 'https://www.google.com' },
        { id: 'tori-2', title: 'Tori 2', url: 'https://www.google.com' },
        { id: 'tori-3', title: 'Tori 3', url: 'https://www.google.com' },
        { id: 'tori-4', title: 'Tori 4', url: 'https://www.google.com' },
        { id: 'tori-5', title: 'Tori 5', url: 'https://www.google.com' },
        { id: 'tori-6', title: 'Tori 6', url: 'https://www.google.com' },
        { id: 'roro-1', title: 'Roro 1', url: 'https://www.google.com' },
        { id: 'roro-2', title: 'Roro 2', url: 'https://www.google.com' },
        { id: 'roro-3', title: 'Roro 3', url: 'https://www.google.com' },
        { id: 'roro-4', title: 'Roro 4', url: 'https://www.google.com' },
        { id: 'roro-5', title: 'Roro 5', url: 'https://www.google.com' },
        { id: 'roro-6', title: 'Roro 6', url: 'https://www.google.com' },
      ],
    },
    {
      id: 'readers-b',
      title: 'Readers B',
      items: [
        {
          id: 'leoni-1',
          title: 'Leoni 1',
          url: 'https://www.google.com',
        },
        {
          id: 'leoni-2',
          title: 'Leoni 2',
          url: 'https://www.google.com',
        },
        {
          id: 'leoni-3',
          title: 'Leoni 3',
          url: 'https://www.google.com',
        },
        { id: 'gino-1', title: 'Gino 1', url: 'https://www.google.com' },
        { id: 'gino-2', title: 'Gino 2', url: 'https://www.google.com' },
        { id: 'gino-3', title: 'Gino 3', url: 'https://www.google.com' },
        { id: 'goma-1', title: 'Goma 1', url: 'https://www.google.com' },
        { id: 'goma-2', title: 'Goma 2', url: 'https://www.google.com' },
        { id: 'goma-3', title: 'Goma 3', url: 'https://www.google.com' },
      ],
    },
  ],
}
