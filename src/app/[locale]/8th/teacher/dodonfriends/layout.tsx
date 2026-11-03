import type { Metadata, Viewport } from 'next'
import TeacherStyleRegistry from './_components/TeacherStyleRegistry'

export const metadata: Metadata = {
  title: 'Teacher’s Classroom | DODO & FRIENDS',
  description:
    'Explore all DODO & FRIENDS courses and teaching resources in one place.',
  robots: { index: false, follow: false },
}

export const viewport: Viewport = { width: 'device-width', initialScale: 1 }

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <TeacherStyleRegistry>{children}</TeacherStyleRegistry>
}
