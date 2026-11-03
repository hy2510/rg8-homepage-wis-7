import { commonGet } from '@/app/api/trial/study/book-reading/common-api'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  return await commonGet(`quiz/ebook-story`, request.nextUrl.search)
}
