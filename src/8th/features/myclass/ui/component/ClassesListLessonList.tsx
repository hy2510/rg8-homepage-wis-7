'use client'

import { Assets } from '@/8th/assets/asset-library'
import useTranslation from '@/localization/client/useTranslations'
import Image from 'next/image'
import { ReactNode } from 'react'
import ClassesListLessonBook from './ClassesListLessonBook'

export type LessonItemProps = {
  id: string
  title: string
  groupType: 'lesson' | 'review' | 'commingsoon'
  isCompleted: boolean
  activeDate: string
  activities: {
    topicTitle: string
    bookId: string
    levelRoundId: string
    levelName: string
    surfaceImagePath: string
    activityType: string
    status: string
    bookPoint: number
    earnedPoint: number
    getableRgPoint: number
    passCount: number
  }[]
}

export default function ClassesListLessonList({
  lessons,
  onClick,
}: {
  lessons: LessonItemProps[]
  onClick?: (
    levelRoundId: string,
    activityType: string,
    sectionDate: string,
  ) => void
}) {
  return (
    <>
      {lessons.length > 0 &&
        lessons.map((group) => {
          return (
            <ClassesListLessonGroup
              key={group.id}
              title={group.title}
              groupType={group.groupType}
              isCompleted={group.isCompleted}>
              {group.activities.map((activity) => {
                return (
                  <ClassesListLessonBook
                    key={`${activity.bookId}_${activity.activityType}`}
                    title={activity.topicTitle}
                    imgUrl={activity.surfaceImagePath}
                    activityType={activity.activityType}
                    point={activity.getableRgPoint}
                    isLessonComplete={activity.status.toLowerCase() === 'pass'}
                    isReviewComplete={activity.passCount > 1}
                    onClick={() => {
                      if (onClick) {
                        onClick(
                          activity.levelRoundId,
                          activity.activityType,
                          group.activeDate,
                        )
                      }
                    }}
                  />
                )
              })}
            </ClassesListLessonGroup>
          )
        })}
      {lessons.length === 0 && <LessonBookClassesListLessonEmpty />}
    </>
  )
}

function LessonBookClassesListLessonEmpty() {
  // @Language 'common'
  const { t } = useTranslation()

  return (
    <div className="cl-empty-state" role="status" aria-live="polite">
      <Image src={Assets.Image.emptyResults} alt="" width={120} height={120} />
      <p className="cl-empty-state-message">{t('t8thdf013')}</p>
    </div>
  )
}

function ClassesListLessonGroup({
  groupType = 'lesson',
  title,
  isCompleted = false,
  children,
}: {
  title: string
  groupType?: 'lesson' | 'review' | 'commingsoon'
  isCompleted?: boolean
  children?: ReactNode
}) {
  return (
    <section className="cl-lesson-group" data-unit-done={isCompleted}>
      <div className="cl-lesson-head">
        {groupType === 'review' ? (
          <span className="cl-lesson-head-icon-spacer" aria-hidden>
            <Image
              src={Assets.Icon.cornerLeftUpGray}
              alt=""
              width={24}
              height={24}
              className="cl-lesson-head-corner-icon"
            />
          </span>
        ) : (
          <Image
            src={Assets.Icon.Study.checkMarkGold}
            alt=""
            width={30}
            height={30}
            className="cl-lesson-head-icon"
          />
        )}
        <div className="cl-lesson-head-body">
          <div className="cl-lesson-title-row">
            <div className="cl-lesson-title">{title}</div>
            {/* <div className="cl-lesson-stats">
              <span className="cl-lesson-stat-done">
                Done
                <span className="cl-stat-done">(0)</span>
              </span>
              <span className="cl-lesson-stat-review">
                Review
                <span className="cl-stat-review">(0)</span>
              </span>
            </div> */}
          </div>
        </div>
      </div>
      {groupType === 'lesson' && <div className="cl-book-row">{children}</div>}
    </section>
  )
}
