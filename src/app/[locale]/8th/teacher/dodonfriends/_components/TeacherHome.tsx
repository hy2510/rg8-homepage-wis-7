'use client'

import { Assets } from '@/8th/assets/asset-library'
import reviewArrow from '@/8th/assets/images/icons/corner-left-up-gray.svg'
import { useQuery } from '@tanstack/react-query'
import Image, { StaticImageData } from 'next/image'
import { useEffect, useRef, useState } from 'react'
import logo from '../_assets/logo_top.svg'
import { getClasses } from '../_data/get-classes'
import { Course, getCourse } from '../_data/get-course'
import { LessonCatalog, getLesson } from '../_data/get-lesson'
import useTranslation from '../_i18n/useTranslation'
import ActivityView from './ActivityView'
import GuideVideo from './GuideVideo'
import Icon from './Icon'
import LessonPlayer from './LessonPlayer'
import TeacherNavigation from './TeacherNavigation'
import { CourseSection, ResourceDialog, TeacherShell } from './TeacherStyles'
import WorkbookPages from './WorkbookPages'
import { useMediaLifecycle } from './useMediaLifecycle'

export default function TeacherHome() {
  // @language 'teacher'
  const { t } = useTranslation()

  const { data: classGroups } = useQuery({
    queryKey: ['dodonfriends-techer', 'class-groups'],
    queryFn: getClasses,
  })

  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const {
    data: courses,
    isLoading: isCoursesLoading,
    isError: isCoursesError,
  } = useQuery({
    queryKey: ['dodonfriends-techer', 'courses', selectedGroup],
    queryFn: async () => {
      return await getCourse({ classId: selectedGroup ?? '' })
    },
    enabled: !!selectedGroup,
  })

  const [selectedLesson, setSelectedLesson] = useState<{
    viewMode: 'guide' | 'play'
    teacherCurriculumId: string
    lessonId: string
    title: string
  } | null>(null)
  const { data: lesson } = useQuery({
    queryKey: ['dodonfriends-techer', 'lesson', selectedLesson],
    queryFn: () =>
      getLesson({
        teacherCurriculumId: selectedLesson?.teacherCurriculumId ?? '',
      }),
    enabled: !!selectedLesson,
  })

  return (
    <TeacherShell>
      <a className="skip-link" href="#teacher-content">
        {t('tch002')}
      </a>
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <button
              type="button"
              onClick={() => setSelectedGroup(null)}
              aria-label={t('tch003')}>
              <Image src={logo} alt="DODO & FRIENDS" priority />
            </button>
            <span className="teacher-badge">{t('tch001')}</span>
          </div>
          <TeacherNavigation active="lessons" />
        </div>
      </header>

      <main id="teacher-content" aria-label={t('tch004')}>
        {classGroups?.length === 0 && <p role="status">{t('tch005')}</p>}
        {classGroups?.map((group) => {
          const color = getResourceColor(group.id)
          return (
            <CourseSection
              key={group.id}
              $color={color.color}
              $background={color.background}
              aria-labelledby={`heading-${group.id}`}>
              <div className="section-heading">
                <h2 id={`heading-${group.id}`}>{group.name}</h2>
              </div>
              <div className="course-grid">
                {group.classes.map((cls) => (
                  <button
                    key={cls.id}
                    className="level-card"
                    aria-expanded={selectedGroup === cls.id}
                    aria-controls={
                      selectedGroup === cls.id ? `detail-${cls.id}` : undefined
                    }
                    onClick={() => {
                      setSelectedGroup(selectedGroup === cls.id ? null : cls.id)
                    }}>
                    <span className="character">
                      <Image
                        src={getResourceIcon(cls.id)}
                        unoptimized
                        alt=""
                        width={80}
                        height={80}
                      />
                    </span>
                    <span className="level-copy">
                      <span className="level-name">{cls.name}</span>
                    </span>
                    <span className="card-arrow">
                      <Icon name="arrow" size={16} />
                    </span>
                  </button>
                ))}
              </div>

              {!!selectedGroup &&
                group.classes.some((cls) => cls.id === selectedGroup) && (
                  <CourseDetail
                    detailId={selectedGroup}
                    className={
                      group.classes.find((cls) => cls.id === selectedGroup)
                        ?.name ?? ''
                    }
                    courses={courses?.courses ?? null}
                    isLoading={isCoursesLoading}
                    isError={isCoursesError}
                    onStartClick={(data) => {
                      setSelectedLesson({
                        teacherCurriculumId: data.teacherCurriculumId,
                        viewMode: data.viewMode,
                        lessonId: data.lessonId,
                        title: data.title,
                      })
                    }}
                  />
                )}
            </CourseSection>
          )
        })}
      </main>
      {selectedLesson && selectedLesson.viewMode === 'guide' && lesson && (
        <TeacherGuide
          title={selectedLesson.title ?? ''}
          lesson={lesson}
          onClose={() => {
            setSelectedLesson(null)
          }}
        />
      )}
      {selectedLesson && selectedLesson.viewMode === 'play' && lesson && (
        <LessonPlayer
          title={selectedLesson.title ?? ''}
          lesson={lesson}
          onClose={() => {
            setSelectedLesson(null)
          }}
        />
      )}
      {/* {panel?.type === 'player' ? (
        <LessonPlayer lesson={panel.lesson} onClose={() => setPanel(null)} />
      ) : (
        panel && <TeacherPanel panel={panel} onClose={() => setPanel(null)} />
      )} */}
    </TeacherShell>
  )
}

function CourseDetail({
  detailId,
  className,
  courses,
  isLoading,
  isError,
  onStartClick,
}: {
  detailId: string
  className: string
  courses: Course[] | null
  isLoading: boolean
  isError: boolean
  onStartClick?: (data: {
    viewMode: 'guide' | 'play'
    teacherCurriculumId: string
    lessonId: string
    title: string
  }) => void
}) {
  // @language 'teacher'
  const { t } = useTranslation()
  const onClick = (param: {
    viewMode: 'guide' | 'play'
    teacherCurriculumId: string
    lessonId: string
    title: string
  }) => {
    if (onStartClick) {
      onStartClick(param)
    }
  }

  return (
    <div className="course-detail" id={`detail-${detailId}`}>
      {isLoading && (
        <p className="unavailable" role="status">
          {t('tch006')}
        </p>
      )}
      {isError && (
        <p className="unavailable" role="alert">
          {t('tch007')}
        </p>
      )}
      {!isLoading && !isError && !courses?.length && (
        <p className="unavailable">{t('tch008', { name: className })}</p>
      )}
      {!isLoading &&
        !isError &&
        courses?.map((c) => (
          <details className="book" name={`books-${c.id}`} key={c.id}>
            <summary>
              {c.title}
              <span className="count">
                {t('tch009', { count: c.lessons.length })}
              </span>
              <Icon name="arrow" size={16} />
            </summary>
            {c.lessons.length === 0 ? (
              <p className="unavailable">{t('tch010')}</p>
            ) : (
              <div className="lesson-list">
                {c.lessons.map((lesson) => {
                  return (
                    <div
                      key={lesson.id}
                      className={`lesson ${lesson.kind === 'review' ? 'lesson-review' : ''}`}>
                      <div key={lesson.id} className="lesson-title">
                        {lesson.kind === 'lesson' ? (
                          <>
                            {lesson.title}
                            {lesson.pageLabel && (
                              <small>{lesson.pageLabel}</small>
                            )}
                          </>
                        ) : (
                          <>
                            <Image
                              src={reviewArrow}
                              alt=""
                              width={16}
                              height={16}
                            />
                            <span>
                              {lesson.title}
                              {lesson.pageLabel && (
                                <small>{lesson.pageLabel}</small>
                              )}
                            </span>
                          </>
                        )}
                      </div>
                      <div className="lesson-actions">
                        {lesson.hasGuide && (
                          <button
                            className="secondary-button"
                            onClick={() => {
                              onClick({
                                viewMode: 'guide',
                                teacherCurriculumId: lesson.teacherCurriculumId,
                                lessonId: lesson.id,
                                title: lesson.title,
                              })
                            }}>
                            {t('tch011')}
                          </button>
                        )}
                        <button
                          className={`start-button ${lesson.kind === 'review' ? 'review-start-button' : ''}`}
                          type="button"
                          onClick={() => {
                            onClick({
                              viewMode: 'play',
                              teacherCurriculumId: lesson.teacherCurriculumId,
                              lessonId: lesson.id,
                              title: lesson.title,
                            })
                          }}
                          disabled={!lesson.canStart}
                          title={t('tch013')}>
                          {t('tch012')}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </details>
        ))}
    </div>
  )
}

function TeacherGuide({
  title,
  lesson,
  onClose,
}: {
  title: string
  lesson: LessonCatalog
  onClose: () => void
}) {
  // @language 'teacher'
  const { t, i18n } = useTranslation()
  const language = i18n.language

  const ref = useRef<HTMLDialogElement>(null)
  const [openType, setOpenType] = useState<string | null>(null)
  const [selectedTab, setSelectedTab] = useState<string | null>(null)
  const [selectedContentId, setSelectedContentId] = useState<string | null>(
    null,
  )

  useMediaLifecycle(ref)
  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog.showModal()
    return () => {
      dialog.close()
      document.body.style.overflow = previousOverflow
      previousFocus?.focus()
    }
  }, [])

  function getTypeLabel(type: string) {
    switch (type) {
      case 'warm-up':
        return t('tch015')
      case 'watch':
        return t('tch016')
      case 'activity':
        return t('tch017')
      case 'read':
        return t('tch018')
      case 'wrap-up':
        return t('tch019')
      default:
        return type
    }
  }

  const activeGuide = openType
    ? lesson.guides.find((guide) => guide.type === openType)
    : null
  const activeTabs = activeGuide?.chapter.map((chapter) => chapter.title) ?? []
  const activeAllLessons =
    activeGuide?.chapter?.find((chapter) => chapter.title === selectedTab)
      ?.lessons ?? []

  const onSelectType = (selectType: string) => {
    setOpenType((current) => (current === selectType ? null : selectType))
    const selectGuide = lesson.guides.find((guide) => guide.type === selectType)
    if (selectGuide && selectGuide.chapter.length > 0) {
      setSelectedTab(selectGuide.chapter[0].title)
      if (selectGuide.chapter[0].lessons.length > 0) {
        setSelectedContentId(selectGuide.chapter[0].lessons[0].id)
      }
    }
  }

  const onSelectTab = (selectTab: string) => {
    if (activeGuide && activeGuide.chapter.length > 0) {
      const selectChapter = activeGuide.chapter.find(
        (chapter) => chapter.title === selectTab,
      )
      if (selectChapter && selectChapter.lessons.length > 0) {
        setSelectedTab(selectTab)
        setSelectedContentId(selectChapter.lessons[0].id)
      }
    }
  }

  const onSelectLesson = (lessonId: string) => {
    const selectLesson = activeAllLessons.find(
      (lesson) => lesson.id === lessonId,
    )
    setSelectedContentId(selectLesson?.id ?? null)
  }
  const selectedContent = activeAllLessons.find(
    (lesson) => lesson.id === selectedContentId,
  )

  return (
    <ResourceDialog
      ref={ref}
      aria-labelledby="resource-title"
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}>
      <div className="dialog-heading">
        <div>
          <h2 id="resource-title">{title}</h2>
          <p className="dialog-subtitle">{t('tch011')}</p>
        </div>
        <button
          className="close-button"
          autoFocus
          onClick={onClose}
          aria-label={t('tch014')}>
          <Icon name="close" size={20} />
        </button>
      </div>

      {lesson.guides.map((guide, index) => {
        return (
          <details
            className="step"
            open={openType === guide.type}
            key={guide.type}>
            <summary
              onClick={(event) => {
                event.preventDefault()
                ref.current
                  ?.querySelectorAll('video')
                  .forEach((video) => video.pause())
                onSelectType(guide.type)
              }}>
              <span>{index + 1}</span>
              {getTypeLabel(guide.type)}
              <Icon name="arrow" size={16} />
            </summary>

            <div className="step-media">
              {activeTabs.length > 0 && (
                <div
                  className="media-tabs"
                  role="tablist"
                  aria-label={t('tch020')}>
                  {activeTabs.map((tab, index) => {
                    return (
                      <button
                        key={tab}
                        type="button"
                        role="tab"
                        id={`tab-${index}`}
                        aria-controls={`tab-${index}-panel`}
                        aria-selected={selectedTab === tab}
                        tabIndex={index}
                        onClick={() => {
                          onSelectTab(tab)
                        }}
                        onKeyDown={(event) => {
                          let next = undefined
                          if (event.key === 'ArrowRight') {
                            next = (index + 1) % activeTabs.length
                          } else if (event.key === 'ArrowLeft') {
                            next =
                              (index - 1 + activeTabs.length) %
                              activeTabs.length
                          } else if (event.key === 'Home') {
                            next = 0
                          } else if (event.key === 'End') {
                            next = activeTabs.length - 1
                          }
                          if (next === undefined) return
                          event.preventDefault()
                          if (activeTabs[next]) {
                            onSelectTab(activeTabs[next])
                          }
                          event.currentTarget.parentElement
                            ?.querySelectorAll('button')
                            [next]?.focus()
                        }}>
                        <span className="media-tab-number">{index + 1}</span>
                        {tab}
                      </button>
                    )
                  })}
                </div>
              )}
              {openType === guide.type &&
                activeAllLessons &&
                selectedContent && (
                  <div
                    id={`tab-${selectedTab}-panel`}
                    role={activeTabs.length > 1 ? 'tabpanel' : undefined}
                    aria-labelledby={
                      activeTabs.length > 1
                        ? `tab-${selectedTab}-tab-${selectedTab}`
                        : undefined
                    }>
                    {activeAllLessons.length > 1 && (
                      <div
                        className={`activity-subtabs ${selectedContent.contentType === 'workbook' ? 'workbook-subtabs' : ''}`}
                        role="tablist"
                        aria-label={t('tch021')}>
                        {activeAllLessons.map((lesson, index) => {
                          return (
                            <button
                              key={lesson.id}
                              type="button"
                              role="tab"
                              id={`${lesson.id}-group-${index}`}
                              aria-controls={`${lesson.id}-group-panel`}
                              aria-selected={selectedContent.id === lesson.id}
                              tabIndex={
                                selectedContent.id === lesson.id ? 0 : -1
                              }
                              onClick={() => {
                                onSelectLesson(lesson.id)
                              }}
                              onKeyDown={(event) => {
                                let next = undefined
                                if (event.key === 'ArrowRight') {
                                  next = (index + 1) % activeAllLessons.length
                                } else if (event.key === 'ArrowLeft') {
                                  next =
                                    (index - 1 + activeAllLessons.length) %
                                    activeAllLessons.length
                                } else if (event.key === 'Home') {
                                  next = 0
                                } else if (event.key === 'End') {
                                  next = activeAllLessons.length - 1
                                }
                                if (next === undefined) return
                                event.preventDefault()
                                if (activeAllLessons[next]) {
                                  onSelectLesson(activeAllLessons[next].id)
                                  event.currentTarget.parentElement
                                    ?.querySelectorAll('button')
                                    [next]?.focus()
                                }
                              }}>
                              {lesson.contentType === 'workbook'
                                ? lesson.title
                                : `${index + 1}`}
                            </button>
                          )
                        })}
                      </div>
                    )}

                    {selectedContent.contentType === 'video' && (
                      <GuideVideo
                        key={`${selectedTab}-video`}
                        url={selectedContent.content.uri}
                        title={selectedTab ?? ''}
                      />
                    )}
                    {selectedContent.contentType === 'workbook' && (
                      <WorkbookPages
                        key={selectedContent.id}
                        images={selectedContent.workBooks ?? []}
                        title={selectedContent.title}
                      />
                    )}
                    {selectedContent.contentType !== 'workbook' &&
                      selectedContent.contentType !== 'video' && (
                        <ActivityView
                          id={selectedContent.id}
                          type={selectedContent.contentType}
                          uri={selectedContent.content.uri}
                          title={selectedContent.title}
                          extra={selectedContent.content.extra}
                          language={language}
                        />
                      )}
                    {(selectedContent.comment?.script ||
                      selectedContent.comment?.tip) && (
                      <section
                        className="video-teacher-guide"
                        aria-label={t('tch022')}>
                        <h3>
                          <span aria-hidden="true">👩‍🏫</span> {t('tch022')}
                        </h3>
                        {selectedContent.comment?.script && (
                          <p className="teacher-guide-script">
                            “{selectedContent.comment?.script}”
                          </p>
                        )}
                        {selectedContent.comment?.tip && (
                          <p className="teacher-guide-tip">
                            <span aria-hidden="true">⭐</span>{' '}
                            <strong>{t('tch023')}</strong> —{' '}
                            {selectedContent.comment?.tip}
                          </p>
                        )}
                      </section>
                    )}
                  </div>
                )}
            </div>
          </details>
        )
      })}
    </ResourceDialog>
  )
}

function getResourceColor(id: string): {
  color: string
  background: string
} {
  switch (id) {
    case 'alphabet':
      return {
        color: '#a77908',
        background: '#fff5cd',
      }
    case 'phonics':
      return {
        color: '#d64d7c',
        background: '#ffebf1',
      }
    case 'sight-words':
      return {
        color: '#1689ac',
        background: '#e2f6fc',
      }
    case 'readers-a':
      return {
        color: '#577ca7',
        background: '#eaf0f8',
      }
    case 'readers-b':
      return {
        color: '#218560',
        background: '#e3f5eb',
      }
    default:
      return {
        color: '#dcdcdc',
        background: '#f5f5f5',
      }
  }
}

function getResourceIcon(id: string): StaticImageData | '' {
  switch (id) {
    case 'baro':
      return Assets.DailyRG.Badge.Baro
    case 'chello':
      return Assets.DailyRG.Badge.Chello
    case 'millo':
      return Assets.DailyRG.Badge.Millo
    case 'jack':
      return Assets.DailyRG.Badge.Jack
    case 'sheila':
      return Assets.DailyRG.Badge.Sheila
    case 'blanc':
      return Assets.DailyRG.Badge.Blanc
    case 'tori':
      return Assets.DailyRG.Badge.Tori
    case 'roro':
      return Assets.DailyRG.Badge.Roro
    case 'leoni':
      return Assets.DailyRG.Badge.Leoni
    case 'goma':
      return Assets.DailyRG.Badge.Goma
    case 'gino':
      return Assets.DailyRG.Badge.Gino
    default:
      return ''
  }
}
