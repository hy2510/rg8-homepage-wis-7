import { sendToLog } from '@/app/api/aalog/logutil'

// EB, PB, PK, NEW PK, DODO ABC
type StudyStartInfo = {
  studyId: string
  studentHistoryId: string
  bookCode: string
  levelRoundId: string
  bookLevel: string
}
type StudyRef = {
  StudyId: string
  StudentHistoryId: string
  LevelName: string
  LevelRoundId: string
  User: string
  Mode: 'quiz' | 'review' | 'super' | 'trial' | 'preview'
  BookType: 'EB' | 'PB' | 'PK' | 'NEW_PK' | 'DODO' | 'DDR'
  level: string
  studyEntryType?: 'remix' | 'legacy'
  isStartSpeak?: boolean
  referer?: string
  exitUrl?: string
  logoutUrl?: string
  unit?: string
  language?: string
  device?: string
  isGuide?: boolean
  isNB?: boolean
}
export function goToStudy({
  studyInfo,
  user = 'student',
  mode = 'quiz',
  studyEntryType = 'legacy',
  isStartSpeak = false,
  unit,
  language = 'ko',
  device,
  refererUrl,
  exitUrl,
  logoutUrl,
  isNB = false,
}: {
  studyInfo: StudyStartInfo
  user?: 'guest' | 'student' | 'staff'
  mode?: 'quiz' | 'review' | 'trial' | 'preview'
  studyEntryType?: 'remix' | 'legacy'
  isStartSpeak?: boolean
  refererUrl?: string
  exitUrl?: string
  logoutUrl?: string
  unit?: string
  language?: string
  device?: string
  isNB?: boolean
}) {
  const LevelName = studyInfo.bookCode
  let bookTypeTmp: 'EB' | 'PB' | 'PK' | 'NEW_PK' | 'DODO' | undefined =
    undefined
  const isPK = LevelName.startsWith('EB-PK')
  const bookRound = Number(LevelName.substring(6))
  if (isPK) {
    if (bookRound < 300) {
      bookTypeTmp = 'PK'
    } else if (bookRound >= 301 && bookRound <= 560) {
      bookTypeTmp = 'NEW_PK'
    } else {
      bookTypeTmp = 'DODO'
    }
  } else if (LevelName.startsWith('EB')) {
    bookTypeTmp = 'EB'
  } else if (LevelName.startsWith('PB')) {
    bookTypeTmp = 'PB'
  }
  if (!bookTypeTmp) {
    throw Error('BookType Mismatch')
  }

  const BookType = bookTypeTmp!

  const ref: StudyRef = {
    StudyId: studyInfo.studyId,
    StudentHistoryId: studyInfo.studentHistoryId,
    LevelName,
    LevelRoundId: studyInfo.levelRoundId,
    BookType,
    User: user,
    Mode: mode,
    level: studyInfo.bookLevel,
    studyEntryType: studyEntryType || 'legacy',
    isStartSpeak: isStartSpeak,
    referer: refererUrl,
    exitUrl: exitUrl || refererUrl,
    logoutUrl: logoutUrl,
    unit,
    language,
    device,
    isNB,
  }
  sendToLog(refererUrl || '')
    .then()
    .catch()
    .finally(() => {
      const signedRef = encodeURIComponent(btoa(JSON.stringify(ref)))
      if (window && window.location) {
        window.location.href = '/study/start.html?REF=' + signedRef
      }
    })
}

// DUBBING
type DubbingRef = {
  StudentHistoryId: string
  LevelName: string
  LevelRoundId: string
  Level: string
  SoloStudy?: {
    studyId: string
    studentHistoryId: string
    endDate: string
    bookPoint: number
  }
  FullStudy?: {
    studyId: string
    studentHistoryId: string
    endDate: string
    bookPoint: number
  }
  BookType: 'DDR'
  User: 'student' | 'staff'
  Mode: 'quiz'
  referer?: string
  exitUrl?: string
  logoutUrl?: string
  unit?: string
  language?: string
  device?: string
  isNB?: boolean
}
export function goToDubbing({
  levelRoundId,
  studentHistoryId,
  levelName,
  soloStudy,
  fullStudy,
  user = 'student',
  mode = 'quiz',
  unit,
  language = 'ko',
  device,
  refererUrl,
  exitUrl,
  logoutUrl,
  isNB = false,
}: {
  levelRoundId: string
  studentHistoryId: string
  levelName: string
  soloStudy?: {
    studyId: string
    studentHistoryId: string
    endDate: string
    bookPoint: number
  }
  fullStudy?: {
    studyId: string
    studentHistoryId: string
    endDate: string
    bookPoint: number
  }
  user?: 'student' | 'staff'
  mode?: 'quiz'
  refererUrl?: string
  exitUrl?: string
  logoutUrl?: string
  unit?: string
  language?: string
  device?: string
  isNB?: boolean
}) {
  const BookType = 'DDR'
  const level = levelName.substring(3, 5)

  const ref: DubbingRef = {
    StudentHistoryId: studentHistoryId,
    LevelName: levelName,
    LevelRoundId: levelRoundId,
    BookType,
    SoloStudy: soloStudy,
    FullStudy: fullStudy,
    User: user,
    Mode: mode,
    Level: level,
    referer: refererUrl,
    exitUrl: exitUrl || refererUrl,
    logoutUrl: logoutUrl,
    unit,
    language,
    device,
    isNB,
  }
  const signedRef = encodeURIComponent(btoa(JSON.stringify(ref)))
  if (window && window.location) {
    window.location.href = '/study/start.html?REF=' + signedRef
  }
}

// LEVEL_TEST
type LevelTestRef = {
  BookType: 'LEVELTEST'
  User: 'student' | 'staff'
  Mode: 'quiz'
  referer: string
  exitUrl: string
  language: string
}
export function goToLevelTest({
  user = 'student',
  language = 'ko',
  exitUrl = '/8th',
}: {
  user?: 'student' | 'staff'
  language?: string
  exitUrl?: string
}) {
  const ref: LevelTestRef = {
    BookType: 'LEVELTEST',
    User: user,
    Mode: 'quiz',
    referer: exitUrl,
    exitUrl,
    language,
  }
  const signedRef = encodeURIComponent(btoa(JSON.stringify(ref)))
  if (window && window.location) {
    window.location.href = '/study/start.html?REF=' + signedRef
  }
}

// Word Practice
type WordPracticeRef = {
  BookType: 'WORD_PRACTICE'
  User: 'student' | 'staff'
  Mode: 'quiz'
  wordBookType: 'EB' | 'PB'
  level: string
  referer?: string
  exitUrl?: string
  logoutUrl?: string
  unit?: string
  language?: string
  device?: string
}

export function goToWordPractice({
  bookType,
  level,
  user = 'student',
  mode = 'quiz',
  unit,
  language = 'ko',
  device,
  refererUrl,
  exitUrl,
  logoutUrl,
}: {
  bookType: 'EB' | 'PB'
  level: string
  user?: 'student' | 'staff'
  mode?: 'quiz'
  refererUrl?: string
  exitUrl?: string
  logoutUrl?: string
  unit?: string
  language?: string
  device?: string
}) {
  const ref: WordPracticeRef = {
    BookType: 'WORD_PRACTICE',
    User: user,
    Mode: mode,
    wordBookType: bookType,
    level: level,
    referer: refererUrl,
    exitUrl: exitUrl || refererUrl,
    logoutUrl: logoutUrl,
    unit,
    language,
    device,
  }
  const signedRef = encodeURIComponent(btoa(JSON.stringify(ref)))
  if (window && window.location) {
    window.location.href = '/study/start.html?REF=' + signedRef
  }
}
