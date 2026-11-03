import { notSupportedApi } from '@/app/api/trial/study/book-reading/common-api'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  return notSupportedApi()
}
