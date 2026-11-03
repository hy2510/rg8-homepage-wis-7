import { RouteResponse } from '@/app/api/_util'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest): Promise<NextResponse> {
  return RouteResponse.response({ isPass: true }, { status: 200 })
}
