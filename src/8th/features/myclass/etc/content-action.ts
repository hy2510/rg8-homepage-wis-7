import DateUtils from '@/util/date-utils'

export function getStartActivityStatus(
  levelRoundId: string,
  activityType: string,
  sectionDate: string,
  userType: 'staff' | 'student',
  isPreviewEnabled?: boolean,
): {
  levelRoundId: string
  activityType: string
  dayDistance: number
  startMode: 'quiz' | 'preview'
  playMode: 'study' | 'movie'
} {
  const dayDistance = DateUtils.dayDistance(
    new Date(),
    DateUtils.createDate(sectionDate),
  )

  let startMode: 'quiz' | 'preview' = 'quiz'
  if (isPreviewEnabled && dayDistance > 0) {
    startMode = 'preview'
  }
  const playMode = isMovieActivity(activityType) ? 'movie' : 'study'
  if (playMode === 'movie' && userType === 'staff') {
    startMode = 'preview'
  }

  return {
    levelRoundId,
    activityType,
    dayDistance,
    startMode,
    playMode,
  }
}

export function isMovieActivity(activityType: string) {
  const activityTypeLower = activityType.toLowerCase()
  return activityTypeLower === 'movie' || activityTypeLower === 'guide'
}
