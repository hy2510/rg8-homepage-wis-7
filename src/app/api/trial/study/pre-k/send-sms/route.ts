import { notSupportedApi } from '@/app/api/trial/study/pre-k/common-api'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  return notSupportedApi()
}
