'use client'

export default function getTeacherStudyUrl({
  type,
  uri,
  extra,
  language,
}: {
  type: string
  uri: string
  extra?: string
  language?: string
}) {
  if (type !== 'prek' && type !== 'reading') {
    return ''
  }
  const extraRecord: Record<string, string> = Object.fromEntries(
    new URLSearchParams(extra ?? ''),
  )
  const bookCode = uri
  const levelRoundId = extraRecord.levelRoundId || ''
  const level = bookCode.substring(3, 5)
  const bookType = type === 'prek' ? 'NEW_PK' : 'EB'
  const studyId = extraRecord.studyId || ''
  const studentHistoryId = extraRecord.studentHistoryId || ''
  const unit = extraRecord.unit || 'baro'

  const returnUrl = 'about:blank;'

  const ref = {
    StudyId: studyId,
    StudentHistoryId: studentHistoryId,
    LevelName: bookCode,
    LevelRoundId: levelRoundId,
    BookType: bookType,
    User: 'guest',
    Mode: 'quiz',
    level: level,
    studyEntryType: 'legacy',
    isStartSpeak: false,
    referer: returnUrl,
    exitUrl: returnUrl,
    logoutUrl: '/8th/account',
    unit: unit,
    language: language || 'en',
    device: 'desktop',
    isNB: true,
    isGuide: true,
  }
  const signedRef = encodeURIComponent(btoa(JSON.stringify(ref)))
  return `/study/start.html?REF=${signedRef}`
}
