import { NextRequest, NextResponse } from 'next/server'
import BUILD_INFO from '../auto-gen-build-info'

export async function GET(request: NextRequest) {
  return NextResponse.json(BUILD_INFO, { status: 200 })
}
