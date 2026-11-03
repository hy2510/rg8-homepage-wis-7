import { RouteResponse } from '@/app/api/_util'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  return RouteResponse.response(
    {
      ScoreStep1: '',
      ScoreStep2: '',
      ScoreStep3: '',
      ScoreStep4: '',
      ScoreStep5: '',
    },
    { status: 200 },
  )
}
