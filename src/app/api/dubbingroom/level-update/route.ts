import { NextRequest } from 'next/server'
import { commonPost } from '../common-api'

export async function POST(request: NextRequest) {
  const data = await request.json()
  return await commonPost(`level-update`, data)
}
