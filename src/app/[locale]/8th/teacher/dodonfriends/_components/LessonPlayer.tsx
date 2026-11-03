'use client'

import { useEffect, useRef, useState } from 'react'
import { LessonCatalog } from '../_data/get-lesson'
import getTeacherStudyUrl from '../_data/get-teacher-study'
import useTranslation from '../_i18n/useTranslation'
import Icon from './Icon'
import LessonActivity from './LessonActivity'
import LessonVideo from './LessonVideo'
import { PlayerDialog } from './PlayerStyles'
import StableUnityFrame from './StableUnityFrame'
import WorkbookPages from './WorkbookPages'
import { useMediaLifecycle } from './useMediaLifecycle'

export default function LessonPlayer({
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

  const dialogRef = useRef<HTMLDialogElement>(null)
  const surfaceRef = useRef<HTMLDivElement>(null)
  const [menuOpen, setMenuOpen] = useState(true)
  useEffect(() => {
    try {
      setMenuOpen(localStorage.getItem('dnf:lesson-menu-open') !== 'false')
    } catch {
      /* Storage may be unavailable in private or restricted browsers. */
    }
  }, [])
  const toggleMenu = () => {
    const next = !menuOpen
    setMenuOpen(next)
    try {
      localStorage.setItem('dnf:lesson-menu-open', String(next))
    } catch {
      /* The toggle still works for this session. */
    }
  }
  const ownsFullscreen = useRef(false)
  const [fullscreen, setFullscreen] = useState(false)
  const enterFullscreen = async () => {
    try {
      if (!surfaceRef.current?.requestFullscreen) throw new Error('Unsupported')
      await surfaceRef.current.requestFullscreen()
      ownsFullscreen.current = true
    } catch {
      // Keep the viewport-sized player as the fallback when native fullscreen is unavailable.
    }
  }
  const exitPlayerFullscreen = async () => {
    if (document.fullscreenElement) await document.exitFullscreen()
    ownsFullscreen.current = false
    setFullscreen(false)
  }
  const closePlayer = async () => {
    try {
      await exitPlayerFullscreen()
    } catch (error) {
      console.warn('Unable to exit browser fullscreen', error)
    } finally {
      onClose()
    }
  }

  const menus = lesson.guides.map((section) => {
    return {
      id: section.type,
      title: getTypeLabel(section.type),
      lessons: section.chapter.flatMap((chapter) =>
        chapter.lessons.map((item, lessonIndex) => {
          let title = chapter.title
          if (chapter.lessons.length > 1) {
            if (section.type !== 'activity') {
              title = item.title
            } else {
              title = `${chapter.title === 'Activity' ? t('tch024') : chapter.title} · ${lessonIndex + 1}`
            }
          }
          return {
            id: item.id,
            title: title,
          }
        }),
      ),
    }
  })
  const entries = lesson.guides.flatMap((section) =>
    section.chapter.flatMap((chapter) =>
      chapter.lessons.map((item, lessonIndex) => {
        let title = chapter.title
        if (chapter.lessons.length > 1) {
          if (section.type !== 'activity') {
            title = item.title
          } else {
            title = `${chapter.title === 'Activity' ? t('tch024') : chapter.title} · ${lessonIndex + 1}`
          }
        }
        let kind = 'activity'
        let url = item.content.uri
        if (item.contentType === 'video') {
          kind = 'video'
        } else if (item.contentType === 'workbook') {
          kind = 'images'
        } else if (item.contentType === 'hidodo') {
          kind = 'unity'
        } else {
          url = getTeacherStudyUrl({
            type: item.contentType,
            uri: item.content.uri,
            extra: item.content.extra,
            language: language,
          })
        }
        const images = kind === 'images' ? item.workBooks : undefined
        return {
          id: item.id,
          stepId: section.type,
          title: title,
          kind: kind,
          url: url,
          images: images,
        }
      }),
    ),
  )

  const [index, setIndex] = useState(0)
  const [expanded, setExpanded] = useState<string | undefined>(menus[0]?.id)
  useMediaLifecycle(dialogRef)
  const [finished, setFinished] = useState(false)
  const active = entries[index]
  const select = (next: number) => {
    setIndex(next)
    setExpanded(entries[next]?.stepId)
    setFinished(false)
  }
  const next = () => {
    if (index < entries.length - 1) select(index + 1)
    else setFinished(true)
  }
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const previousFocus = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog.showModal()
    // HTML dialog elements cannot be targets of requestFullscreen.
    void enterFullscreen()
    const fullscreenChanged = () => {
      if (!document.fullscreenElement) setFullscreen(false)
    }
    document.addEventListener('fullscreenchange', fullscreenChanged)
    return () => {
      document.removeEventListener('fullscreenchange', fullscreenChanged)
      if (ownsFullscreen.current && document.fullscreenElement)
        void document.exitFullscreen().catch(() => {})
      dialog.close()
      document.body.style.overflow = overflow
      previousFocus?.focus()
    }
  }, [])
  return (
    <PlayerDialog
      ref={dialogRef}
      aria-label={t('tch038', { title })}
      onCancel={(event) => {
        event.preventDefault()
        void closePlayer()
      }}>
      <div ref={surfaceRef} className="player-surface">
        <div className="player-body">
          <aside
            id="lesson-player-menu"
            className={`player-menu${menuOpen ? '' : ' is-collapsed'}`}
            inert={!menuOpen}
            aria-hidden={!menuOpen}>
            <div className="player-menu-inner">
              <div className="player-menu-steps">
                {menus.map((step, stepIndex) => (
                  <details key={step.id} open={expanded === step.id}>
                    <summary
                      onClick={(event) => {
                        event.preventDefault()
                        setExpanded(expanded === step.id ? undefined : step.id)
                      }}>
                      <span>{stepIndex + 1}</span>
                      {step.title}
                      <Icon name="arrow" size={16} />
                    </summary>
                    {step.lessons.map((lesson, lessonIndex) => {
                      let currentIndex = 0
                      for (let i = 0; i < stepIndex; i++) {
                        currentIndex += menus[i].lessons.length
                      }
                      currentIndex += lessonIndex
                      return (
                        <button
                          key={lesson.id}
                          type="button"
                          aria-current={
                            index === currentIndex ? 'step' : undefined
                          }
                          onClick={() => {
                            select(currentIndex)
                          }}>
                          {lesson.title}
                        </button>
                      )
                    })}
                  </details>
                ))}
              </div>
            </div>
          </aside>
          <main
            className={`player-stage${fullscreen ? ' content-expanded' : ''}`}>
            {fullscreen && (
              <button
                className="content-fullscreen-exit"
                type="button"
                aria-label={t('tch035')}
                title={t('tch035')}
                onClick={() => {
                  setFullscreen(false)
                }}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true">
                  <path d="M19.2 4.8l-6 6m0-5v5h5M4.8 19.2l6-6m-5 0h5v5" />
                </svg>
              </button>
            )}
            {!active ? (
              <p>{t('tch025')}</p>
            ) : finished ? (
              <div className="player-finished">
                <h2>{t('tch026')}</h2>
                <button onClick={() => select(0)}>{t('tch027')}</button>
              </div>
            ) : active.kind === 'video' && active.url ? (
              <LessonVideo
                key={active.id}
                url={active.url}
                title={active.title}
              />
            ) : active.kind === 'images' ? (
              <WorkbookPages
                key={active.id}
                images={active.images ?? []}
                title={active.title}
              />
            ) : active.kind === 'unity' ? (
              <StableUnityFrame
                key={active.id}
                url={active.url}
                title={active.title}
              />
            ) : (
              <LessonActivity
                key={active.id}
                title={active.title}
                url={active.url}
              />
            )}
          </main>
        </div>

        <header className="player-header">
          <button
            type="button"
            className="player-menu-toggle"
            aria-expanded={menuOpen}
            aria-controls="lesson-player-menu"
            onClick={toggleMenu}
            title={menuOpen ? t('tch028') : t('tch029')}>
            <strong>{title}</strong>
            <span>{active?.title ?? t('tch030')}</span>
          </button>
          <nav className="player-footer" aria-label={t('tch031')}>
            <button
              className="player-navigation"
              type="button"
              aria-label={t('tch032')}
              title={t('tch032')}
              disabled={index === 0 || !active}
              onClick={() => select(index - 1)}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true">
                <path d="M20 12H4m7-7-7 7 7 7" />
              </svg>
            </button>
            <button
              className="player-page-menu-toggle"
              type="button"
              aria-label={menuOpen ? t('tch028') : t('tch029')}
              title={menuOpen ? t('tch028') : t('tch029')}
              aria-expanded={menuOpen}
              aria-controls="lesson-player-menu"
              onClick={toggleMenu}>
              {active ? index + 1 : 0} / {entries.length}
            </button>
            <button
              className="player-navigation"
              type="button"
              aria-label={
                index === entries.length - 1 ? t('tch034') : t('tch033')
              }
              title={index === entries.length - 1 ? t('tch034') : t('tch033')}
              disabled={!active || finished}
              onClick={next}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true">
                <path d="M4 12h16m-7-7 7 7-7 7" />
              </svg>
            </button>
          </nav>
          <div className="player-controls">
            <button
              type="button"
              onClick={() => {
                if (!document.fullscreenElement) void enterFullscreen()
                setFullscreen(true)
              }}
              aria-label={t('tch036')}
              title={t('tch036')}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true">
                <path
                  d={
                    fullscreen
                      ? 'M4 9h5V4M20 9h-5V4M4 15h5v5M20 15h-5v5'
                      : 'M9 4H4v5M15 4h5v5M4 15v5h5M20 15v5h-5'
                  }
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => {
                void closePlayer()
              }}
              aria-label={t('tch037')}>
              <Icon name="close" />
            </button>
          </div>
        </header>
      </div>
    </PlayerDialog>
  )
}
