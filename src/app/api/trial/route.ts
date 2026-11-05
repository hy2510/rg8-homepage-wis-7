import { RouteResponse, getParameters } from '@/app/api/_util'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const parameter = await getParameters(request, 'level')
  const level = parameter.getString('level', '')

  if (level === 'prek') {
    return RouteResponse.response(PK_TRIAL_CONTENTS, { status: 200 })
  } else if (level === 'k') {
    return RouteResponse.response(EBK_TRIAL_CONTENTS, { status: 200 })
  } else if (level === '1') {
    return RouteResponse.response(EB1_TRIAL_CONTENTS, { status: 200 })
  } else if (level === '2-6') {
    return RouteResponse.response(EB2_TRIAL_CONTENTS, { status: 200 })
  } else {
    return RouteResponse.commonError()
  }

  //FIXME :: 하드코딩 데이터

  // const [payload, status, error] = await executeRequestAction(
  //   Student.levelTestInfo(token),
  // )
  //   if (error) {
  //     return RouteResponse.commonError()
  //   }
  //   return RouteResponse.response(payload, status)
}

type ContentsList = {
  list: {
    group: string
    contents: {
      title: string
      bookCode: string
      image: string
      levelRoundId: number
      studyId: string
      studentHistoryId: string
      bookLevel: string
    }[]
  }[]
}

const PK_TRIAL_CONTENTS: ContentsList = {
  list: [
    {
      group: 'Alphabet',
      contents: [
        {
          title: 'Alphabet Aa',
          bookCode: 'EB-PK-301',
          image:
            'https://wcfresource.a1edu.com/newsystem/image/dodoabc/cover/eb-pk-301.jpg',
          levelRoundId: 5882,
          studyId: '000729C2600001633',
          studentHistoryId: '000729C2026000007',
          bookLevel: 'PK',
        },
        {
          title: 'Alphabet Bb',
          bookCode: 'EB-PK-302',
          image:
            'https://wcfresource.a1edu.com/newsystem/image/dodoabc/cover/eb-pk-302.jpg',
          levelRoundId: 5883,
          studyId: '000729C2600001660',
          studentHistoryId: '000729C2026000007',
          bookLevel: 'PK',
        },
        {
          title: 'Alphabet Cc',
          bookCode: 'EB-PK-303',
          image:
            'https://wcfresource.a1edu.com/newsystem/image/dodoabc/cover/eb-pk-303.jpg',
          levelRoundId: 5884,
          studyId: '000729C2600001661',
          studentHistoryId: '000729C2026000007',
          bookLevel: 'PK',
        },
        {
          title: 'Alphabet Dd',
          bookCode: 'EB-PK-304',
          image:
            'https://wcfresource.a1edu.com/newsystem/image/dodoabc/cover/eb-pk-304.jpg',
          levelRoundId: 5953,
          studyId: '000729C2600001662',
          studentHistoryId: '000729C2026000007',
          bookLevel: 'PK',
        },
      ],
    },
    {
      group: 'Phonics',
      contents: [
        {
          title: 'am/an',
          bookCode: 'EB-PK-401',
          image:
            'https://wcfresource.a1edu.com/newsystem/image/dodoabc/cover/eb-pk-401.jpg',
          levelRoundId: 5885,
          studyId: '000729C2600001634',
          studentHistoryId: '000729C2026000007',
          bookLevel: 'PK',
        },
        {
          title: 'ag/ad',
          bookCode: 'EB-PK-402',
          image:
            'https://wcfresource.a1edu.com/newsystem/image/dodoabc/cover/eb-pk-402.jpg',
          levelRoundId: 5886,
          studyId: '000729C2600001663',
          studentHistoryId: '000729C2026000007',
          bookLevel: 'PK',
        },
        {
          title: 'at/ap',
          bookCode: 'EB-PK-403',
          image:
            'https://wcfresource.a1edu.com/newsystem/image/dodoabc/cover/eb-pk-403.jpg',
          levelRoundId: 5887,
          studyId: '000729C2600001664',
          studentHistoryId: '000729C2026000007',
          bookLevel: 'PK',
        },
        {
          title: 'ed/et',
          bookCode: 'EB-PK-404',
          image:
            'https://wcfresource.a1edu.com/newsystem/image/dodoabc/cover/eb-pk-404.jpg',
          levelRoundId: 5976,
          studyId: '000729C2600001665',
          studentHistoryId: '000729C2026000007',
          bookLevel: 'PK',
        },
      ],
    },
    {
      group: 'Sight Words',
      contents: [
        {
          title: 'Hello, I Am Dodo!',
          bookCode: 'EB-PK-501',
          image:
            'https://wcfresource.a1edu.com/newsystem/image/dodoabc/cover/eb-pk-501.jpg',
          levelRoundId: 5896,
          studyId: '000729C2600001635',
          studentHistoryId: '000729C2026000007',
          bookLevel: 'PK',
        },
        {
          title: 'Look at the Sky',
          bookCode: 'EB-PK-502',
          image:
            'https://wcfresource.a1edu.com/newsystem/image/dodoabc/cover/eb-pk-502.jpg',
          levelRoundId: 5932,
          studyId: '000729C2600001666',
          studentHistoryId: '000729C2026000007',
          bookLevel: 'PK',
        },
        {
          title: 'What Is This?',
          bookCode: 'EB-PK-503',
          image:
            'https://wcfresource.a1edu.com/newsystem/image/dodoabc/cover/eb-pk-503.jpg',
          levelRoundId: 5933,
          studyId: '000729C2600001667',
          studentHistoryId: '000729C2026000007',
          bookLevel: 'PK',
        },
        {
          title: 'She Is My Mother',
          bookCode: 'EB-PK-504',
          image:
            'https://wcfresource.a1edu.com/newsystem/image/dodoabc/cover/eb-pk-504.jpg',
          levelRoundId: 5934,
          studyId: '000729C2600001668',
          studentHistoryId: '000729C2026000007',
          bookLevel: 'PK',
        },
      ],
    },
  ],
}

const EBK_TRIAL_CONTENTS: ContentsList = {
  list: [
    {
      group: 'Level KA',
      contents: [
        {
          title: "Alligator's Apples",
          bookCode: 'EB-KA-001',
          image:
            'https://wcfresource.a1edu.com/newsystem/image/BR/CoverNew1/EB-KA-001.jpg',
          levelRoundId: 2726,
          studyId: '000729C2600001637',
          studentHistoryId: '000729C2026000007',
          bookLevel: 'KA',
        },
      ],
    },
    {
      group: 'Level KC',
      contents: [
        {
          title: "Baro's Dream",
          bookCode: 'EB-KC-184',
          image:
            'https://wcfresource.a1edu.com/newsystem/image/br/covernew1/eb-kc-184.jpg',
          levelRoundId: 6884,
          studyId: '000729C2600001669',
          studentHistoryId: '000729C2026000007',
          bookLevel: 'KC',
        },
        {
          title: 'Teddy, Are You Alright?',
          bookCode: 'EB-KC-304',
          image:
            'https://wcfresource.a1edu.com/newsystem/image/BR/CoverNew1/EB-KC-304.jpg',
          levelRoundId: 4987,
          studyId: '000729C2600001671',
          studentHistoryId: '000729C2026000007',
          bookLevel: 'KC',
        },
        {
          title: 'Colorful Fruit Salad',
          bookCode: 'EB-KC-616',
          image:
            'http://wcfresource.a1edu.com/newsystem/image/br/covernew1/eb-kc-616.jpg',
          levelRoundId: 7185,
          studyId: '000729C2600001670',
          studentHistoryId: '000729C2026000007',
          bookLevel: 'KC',
        },
      ],
    },
  ],
}

const EB1_TRIAL_CONTENTS: ContentsList = {
  list: [
    {
      group: 'Level 1A',
      contents: [
        {
          title: 'Zappy Wants to Play',
          bookCode: 'EB-1A-100',
          image:
            'http://wcfresource.a1edu.com/newsystem/image/br/covernew1/eb-1a-100.jpg',
          levelRoundId: 7226,
          studyId: '000729C2600001672',
          studentHistoryId: '000729C2026000007',
          bookLevel: '1A',
        },
        {
          title: 'Milly, Molly and the Bike Ride',
          bookCode: 'EB-1A-201',
          image:
            'https://wcfresource.a1edu.com/newsystem/image/BR/CoverNew1/EB-1A-201.jpg',
          levelRoundId: 4590,
          studyId: '000729C2600001673',
          studentHistoryId: '000729C2026000007',
          bookLevel: '1A',
        },
      ],
    },
    {
      group: 'Level 1B',
      contents: [
        {
          title: 'The Mysterious Monster',
          bookCode: 'EB-1B-511',
          image:
            'https://wcfresource.a1edu.com/newsystem/image/br/covernew1/eb-1b-511.jpg',
          levelRoundId: 6568,
          studyId: '000729C2600001674',
          studentHistoryId: '000729C2026000007',
          bookLevel: '1B',
        },
      ],
    },
    {
      group: 'Level 1C',
      contents: [
        {
          title: 'Life Cycle of a Plastic Bottle',
          bookCode: 'EB-1C-355',
          image:
            'https://wcfresource.a1edu.com/newsystem/image/br/covernew1/eb-1c-355.jpg',
          levelRoundId: 6363,
          studyId: '000729C2600001675',
          studentHistoryId: '000729C2026000007',
          bookLevel: '1C',
        },
      ],
    },
  ],
}

const EB2_TRIAL_CONTENTS: ContentsList = {
  list: [
    {
      group: 'Level 2',
      contents: [
        {
          title: 'The Ferocious Chocolate Wolf',
          bookCode: 'EB-2A-376',
          image:
            'https://wcfresource.a1edu.com/newsystem/image/br/covernew1/eb-2a-376.jpg',
          levelRoundId: 6221,
          studyId: '000729C2600001676',
          studentHistoryId: '000729C2026000007',
          bookLevel: '2A',
        },
      ],
    },
    {
      group: 'Level 3',
      contents: [
        {
          title: 'Mozart',
          bookCode: 'EB-3A-308',
          image:
            'http://wcfresource.a1edu.com/newsystem/image/br/covernew1/eb-3a-308.jpg',
          levelRoundId: 3613,
          studyId: '000729C2600001677',
          studentHistoryId: '000729C2026000007',
          bookLevel: '3A',
        },
      ],
    },
    {
      group: 'Level 4',
      contents: [
        {
          title: 'The Blue Carbuncle',
          bookCode: 'EB-4B-308',
          image:
            'https://wcfresource.a1edu.com/newsystem/image/BR/CoverNew1/EB-4B-308.jpg',
          levelRoundId: 5585,
          studyId: '000729C2600001678',
          studentHistoryId: '000729C2026000007',
          bookLevel: '4B',
        },
      ],
    },
    {
      group: 'Level 5',
      contents: [
        {
          title: 'Heidi Meets Her Grandfather',
          bookCode: 'EB-5C-001',
          image:
            'https://wcfresource.a1edu.com/newsystem/image/br/covernew1/eb-5c-001.jpg',
          levelRoundId: 6780,
          studyId: '000729C2600001679',
          studentHistoryId: '000729C2026000007',
          bookLevel: '5C',
        },
      ],
    },
  ],
}
