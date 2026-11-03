import GalleryBoard from '@/8th/features/board/ui/page/GalleryBoard'
import SITE_PATH from '@/app/site-path'
import React from 'react'

const CONTENTS_URL = SITE_PATH.HOME_8TH.GALLERY
export default function Layout({ children }: { children?: React.ReactNode }) {
  return <GalleryBoard basicPath={CONTENTS_URL}>{children}</GalleryBoard>
}
