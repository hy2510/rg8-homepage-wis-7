import NoticeBoard from '@/8th/features/board/ui/page/NoticeBoard'
import SITE_PATH from '@/app/site-path'
import React from 'react'

const CONTENTS_URL = SITE_PATH.HOME_8TH.NOTICE
export default function Layout({ children }: { children?: React.ReactNode }) {
  return <NoticeBoard basicPath={CONTENTS_URL}>{children}</NoticeBoard>
}
