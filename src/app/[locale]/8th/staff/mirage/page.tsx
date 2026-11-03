'use client'

import SITE_PATH from '@/app/site-path'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function Page() {
  const searchParams = useSearchParams()
  const uid = searchParams.get('uid')

  useEffect(() => {
    async function fetching(uid: string) {
      const response = await requestMirageStudent(uid)
      if (response) {
        window.location.replace(SITE_PATH.ACCOUNT_8TH.FORWARDER)
      } else {
      }
    }
    if (uid) {
      fetching(uid)
    } else {
    }
  }, [uid])

  return <></>
}

async function requestMirageStudent(studentId: string): Promise<boolean> {
  let success = false

  try {
    const dataFetch = await fetch(`/api/staff/mirage?uid=${studentId}`, {
      method: 'put',
    })
    if (dataFetch.ok) {
      const data = await dataFetch.json()
      success = data.success
    } else {
      success = false
    }
  } catch (error) {
    success = false
  }
  return success
}
