'use client'

import { useDevicePlatform } from '@/8th/application/context/ApplicationContext'
import { useCustomerConfiguration } from '@/8th/application/context/CustomerContext'
import { Assets } from '@/8th/assets/asset-library'
import { useAccountList } from '@/8th/features/account/service/account-query'
import { useHome } from '@/8th/features/board/service/board-query'
import HeaderEnteranceDNF from '@/8th/features/home/ui/component/HeaderEnteranceDNF'
import UrgentNoticeBar from '@/8th/features/home/ui/component/UrgentNoticeBar'
import { useAuth } from '@/8th/shared/auth/AuthContext'
import {
  HpDodoFriendsStyled,
  HpMainStyled,
} from '@/8th/shared/styled/HpFeaturesStyled'
import { Gap } from '@/8th/shared/ui/Misc'
import SITE_PATH from '@/app/site-path'
import useTranslation from '@/localization/client/useTranslations'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Fragment, useEffect, useId, useState } from 'react'
import IntroduceRG from './IntroduceRG'

export default function IntroduceDNF() {
  const { accessDNF, accessRG } = useCustomerConfiguration()
  const router = useRouter()

  useEffect(() => {
    if (!accessDNF && accessRG) {
      router.replace(SITE_PATH.HOME_8TH.HOME)
    }
  }, [router, accessDNF, accessRG])

  if (!accessDNF) {
    return <IntroduceRG />
  }
  return <IntroduceDNFView />
}

function IntroduceDNFView() {
  // @language 'common'
  const { t } = useTranslation()

  const { target, country } = useCustomerConfiguration()
  const platform = useDevicePlatform()

  const router = useRouter()

  const { student } = useAuth()
  const isStudentLogin = student === 'active'

  const hasLoginHistory = useAccountList().length > 0
  const { data: mainData } = useHome({
    template: target,
    platform: platform,
    country: country,
  })
  const urgentNotice = mainData?.important || undefined

  const startButtonLabel = isStudentLogin ? t('t8th0325') : t('t8th0075')

  const sections = [
    { id: 'levels', label: t('t8th0390') },
    { id: 'content', label: t('t8th0391') },
    { id: 'workbook', label: t('t8th0392') },
  ]
  const contentHighlights = [
    {
      label: t('t8th0355'),
      image: Assets.DodoFriends.AnimationQuiz,
      alt: t('t8th0393'),
      description: t('t8th0396'),
    },
    {
      label: t('t8th0356'),
      image: Assets.DodoFriends.EbookQuiz,
      alt: t('t8th0394'),
      description: t('t8th0397'),
    },
    {
      label: t('t8th0357'),
      image: Assets.DodoFriends.WorkbookActivity,
      alt: t('t8th0395'),
      description: t('t8th0398'),
    },
  ]

  return (
    <HpMainStyled>
      {urgentNotice && <UrgentNoticeBar notice={urgentNotice} />}

      <HeaderEnteranceDNF
        startButtonLabel={startButtonLabel}
        onStartButtonClick={() => {
          router.push(SITE_PATH.ACCOUNT_8TH.HOME)
        }}
      />
      <Gap size={40} />
      <HpDodoFriendsStyled as="div">
        {sections.map((section, index) => (
          <Fragment key={section.id}>
            <section
              className="section"
              aria-labelledby={`dodo-section-${index}`}>
              <h2 className="section-title" id={`dodo-section-${index}`}>
                {section.label}
              </h2>
              {section.id === 'content' ? (
                <div className="panel dodo-content-intro">
                  <div className="dodo-content-grid">
                    {contentHighlights.map((item) => (
                      <article className="dodo-content-card" key={item.label}>
                        <Image
                          className="dodo-content-image"
                          src={item.image}
                          alt={item.alt}
                          width={1672}
                          height={941}
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        <h3 className="dodo-content-label">{item.label}</h3>
                        <p>{item.description}</p>
                      </article>
                    ))}
                  </div>
                </div>
              ) : section.id === 'levels' ? (
                <HpDodoLevelSlider />
              ) : (
                <HpDodoWorkbookSlider />
              )}
            </section>
            <Gap size={80} />
          </Fragment>
        ))}
      </HpDodoFriendsStyled>
    </HpMainStyled>
  )
}

function getStages(t: (key: string) => string) {
  return [
    {
      name: t('t8th0358'),
      title: t('t8th0399'),
      courses: [
        {
          name: t('t8th0363'),
          title: t('t8th0404'),
        },
      ],
    },
    {
      name: t('t8th0359'),
      title: t('t8th0400'),
      courses: [
        {
          name: t('t8th0364'),
          title: t('t8th0405'),
        },
        {
          name: t('t8th0365'),
          title: t('t8th0406'),
        },
        {
          name: t('t8th0366'),
          title: t('t8th0407'),
        },
      ],
    },
    {
      name: t('t8th0360'),
      title: t('t8th0401'),
      courses: [
        {
          name: t('t8th0367'),
          title: t('t8th0408'),
        },
        {
          name: t('t8th0368'),
          title: t('t8th0409'),
        },
      ],
    },
    {
      name: t('t8th0361'),
      title: t('t8th0402'),
      courses: [
        {
          name: t('t8th0369'),
          title: t('t8th0410'),
        },
        {
          name: t('t8th0370'),
          title: t('t8th0411'),
        },
      ],
    },
    {
      name: t('t8th0362'),
      title: t('t8th0403'),
      courses: [
        {
          name: t('t8th0371'),
          title: t('t8th0412'),
        },
        {
          name: t('t8th0372'),
          title: t('t8th0413'),
        },
        {
          name: t('t8th0373'),
          title: t('t8th0414'),
        },
      ],
    },
  ]
}

const defaultThumbnailOrder = [0, 1, 2, 3, 4]
// Existing asset IDs corresponding to A, B, C, D, E.
const alphabetThumbnailOrder = [0, 'b', 10, 1, 'e']

function dodoThumbnail(courseName: string, id: number | string) {
  const course =
    Assets.DodoFriends.Thumbnail[
      courseName.toLowerCase() as keyof typeof Assets.DodoFriends.Thumbnail
    ]
  return course[String(id) as keyof typeof course]
}

function HpDodoLevelSlider() {
  return (
    <>
      <div className="dodo-desktop-only">
        <LevelSlider mobile={false} />
      </div>
      <div className="dodo-mobile-only">
        <LevelSlider mobile />
      </div>
    </>
  )
}

function LevelSlider({ mobile }: { mobile: boolean }) {
  // @language 'common'
  const { t } = useTranslation()

  const stageList = getStages(t)
  const coursesWithoutThumbnails = [t('t8th0371'), t('t8th0372'), t('t8th0373')]
  const slides = mobile
    ? stageList.flatMap((stage, stageIndex) =>
        stage.courses.map((course) => ({
          ...stage,
          stageIndex,
          courses: [course],
        })),
      )
    : stageList.map((stage, stageIndex) => ({ ...stage, stageIndex }))
  const [index, setIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isKeyboardFocused, setIsKeyboardFocused] = useState(false)
  const waveId = useId()

  useEffect(() => {
    if (isHovered || isKeyboardFocused) return
    const timer = window.setInterval(() => {
      if (!document.hidden) setIndex((current) => (current + 1) % slides.length)
    }, 8000)
    return () => window.clearInterval(timer)
  }, [isHovered, isKeyboardFocused, slides.length])
  return (
    <div
      className="panel dodo-level-slider"
      role="region"
      aria-roledescription={t('t8th0415')}
      aria-label={t('t8th0416')}>
      <svg
        className="dodo-level-waves"
        viewBox="0 24 150 28"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false">
        <defs>
          <path
            id={waveId}
            d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
          />
        </defs>
        <g>
          {[0, 3, 5, 7].map((y) => (
            <use key={y} href={`#${waveId}`} x="48" y={y} />
          ))}
        </g>
      </svg>
      <div className="dodo-stage-window">
        <div
          className="dodo-stage-track"
          style={{ transform: `translateX(-${index * 100}%)` }}>
          {slides.map((stage, i) => (
            <div
              className="dodo-stage-slide"
              key={stage.courses[0].name}
              aria-hidden={index !== i}
              inert={index !== i}
              role="group"
              aria-roledescription={t('t8th0417')}
              aria-label={t('t8th0384', {
                current: i + 1,
                total: slides.length,
                stage: stage.name,
                course: stage.courses[0].name,
              })}>
              <div className="dodo-stage-heading">
                <span className="dodo-stage-number">
                  {t('t8th0374', {
                    num: String(stage.stageIndex + 1).padStart(2, '0'),
                  })}
                </span>
                <h3>{stage.name}</h3>
                <strong>{stage.title}</strong>
              </div>
              <div className="dodo-stage-courses">
                {stage.courses.map((course) => (
                  <article
                    className="dodo-stage-course"
                    data-character={course.name.toLowerCase()}
                    key={course.name}>
                    {!coursesWithoutThumbnails.includes(course.name) && (
                      <div className="dodo-course-panorama" aria-hidden="true">
                        {(course.name === t('t8th0363')
                          ? alphabetThumbnailOrder
                          : defaultThumbnailOrder
                        ).map((n) => (
                          <Image
                            key={n}
                            src={dodoThumbnail(course.name, n)}
                            alt=""
                            width={200}
                            height={114}
                            sizes="200px"
                          />
                        ))}
                      </div>
                    )}
                    <Image
                      className="dodo-stage-character"
                      src={
                        Assets.DodoFriends.Level[
                          course.name.toLowerCase() as keyof typeof Assets.DodoFriends.Level
                        ]
                      }
                      alt={t('t8th0418', { name: course.name })}
                      width={200}
                      height={200}
                    />
                    <div className="dodo-stage-course-name">
                      <h4>{course.name}</h4>
                    </div>
                    <strong>{course.title}</strong>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        className={`dodo-stage-nav${mobile ? ' dodo-level-controls' : ''}`}
        aria-label={t('t8th0419')}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={(event) => {
          if (event.target.matches(':focus-visible')) setIsKeyboardFocused(true)
        }}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget))
            setIsKeyboardFocused(false)
        }}>
        {mobile ? (
          <>
            <button
              type="button"
              aria-label={t('t8th0420')}
              onClick={() =>
                setIndex(
                  (current) => (current - 1 + slides.length) % slides.length,
                )
              }>
              <Image
                src={Assets.Icon.chevronLeftGray}
                alt=""
                width={24}
                height={24}
              />
            </button>
            <div
              className="dodo-level-indicator"
              aria-live={isHovered || isKeyboardFocused ? 'polite' : 'off'}
              aria-atomic="true">
              <strong>
                {slides[index].name} · {slides[index].courses[0].name}
              </strong>
              <span>
                {index + 1} / {slides.length}
              </span>
            </div>
            <button
              type="button"
              aria-label={t('t8th0421')}
              onClick={() =>
                setIndex((current) => (current + 1) % slides.length)
              }>
              <Image
                src={Assets.Icon.chevronRightGray}
                alt=""
                width={24}
                height={24}
              />
            </button>
          </>
        ) : (
          stageList.map((stage, i) => (
            <button
              key={stage.name}
              type="button"
              aria-pressed={index === i}
              onClick={() => setIndex(i)}>
              {stage.name}
            </button>
          ))
        )}
      </div>
    </div>
  )
}

function getWorkbooks(t: (key: string) => string) {
  return [
    {
      name: t('t8th0358'),
      count: 3,
      image: Assets.DodoFriends.Workbook.workbook1,
      width: 2172,
      height: 724,
      volumes: [t('t8th0376')],
      descriptions: [t('t8th0422'), t('t8th0423')],
    },
    {
      name: t('t8th0359'),
      count: 9,
      image: Assets.DodoFriends.Workbook.workbook2,
      width: 2172,
      height: 724,
      volumes: [t('t8th0377'), t('t8th0378'), t('t8th0379')],
      descriptions: [t('t8th0424'), t('t8th0425')],
    },
    {
      name: t('t8th0360'),
      count: 6,
      image: Assets.DodoFriends.Workbook.workbook3,
      width: 1783,
      height: 882,
      volumes: [t('t8th0380'), t('t8th0381')],
      descriptions: [t('t8th0426'), t('t8th0427')],
    },
    {
      name: t('t8th0361'),
      count: 12,
      image: Assets.DodoFriends.Workbook.workbook4,
      width: 2142,
      height: 734,
      volumes: [t('t8th0382'), t('t8th0383')],
      descriptions: [t('t8th0428'), t('t8th0429')],
    },
  ]
}

function HpDodoWorkbookSlider() {
  // @language 'common'
  const { t } = useTranslation()

  const workbooks = getWorkbooks(t)
  const [index, setIndex] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    if (hovered || focused) return
    const timer = window.setInterval(() => {
      if (!document.hidden)
        setIndex((current) => (current + 1) % workbooks.length)
    }, 8000)
    return () => window.clearInterval(timer)
  }, [hovered, focused])

  return (
    <div
      className="panel dodo-workbook-slider"
      role="region"
      aria-label={t('t8th0430')}
      aria-roledescription={t('t8th0415')}>
      <div className="dodo-stage-window">
        <div
          className="dodo-stage-track"
          style={{ transform: `translateX(-${index * 100}%)` }}>
          {workbooks.map((workbook, i) => (
            <div
              className="dodo-stage-slide"
              key={workbook.name}
              aria-hidden={index !== i}
              inert={index !== i}
              role="group"
              aria-label={t('t8th0385', {
                current: i + 1,
                total: workbooks.length,
                name: workbook.name,
              })}>
              <div className="dodo-stage-heading">
                <span className="dodo-stage-number">
                  {t('t8th0375', { num: String(i + 1).padStart(2, '0') })}
                </span>
                <h3>
                  {workbook.name}{' '}
                  <span className="dodo-workbook-count">
                    ({t('t8th0431', { count: workbook.count })})
                  </span>
                </h3>
              </div>
              <div className={`dodo-workbook-art dodo-workbook-art-${i + 1}`}>
                <ul
                  className="dodo-workbook-volumes"
                  aria-label={t('t8th0432')}>
                  {workbook.volumes.map((volume) => (
                    <li key={volume}>{volume}</li>
                  ))}
                </ul>
                <Image
                  src={workbook.image}
                  alt={t('t8th0433', { name: workbook.name })}
                  width={workbook.width}
                  height={workbook.height}
                  sizes="(max-width: 768px) 100vw, 900px"
                />
                <ul className="dodo-workbook-descriptions">
                  {workbook.descriptions.map((description) => (
                    <li key={description}>
                      <span aria-hidden="true">✓</span>
                      {description}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="dodo-desktop-only">
        <div
          className="dodo-stage-nav"
          aria-label={t('t8th0434')}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocus={() => setFocused(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget))
              setFocused(false)
          }}>
          {workbooks.map((workbook, i) => (
            <button
              key={workbook.name}
              type="button"
              aria-pressed={index === i}
              onClick={() => setIndex(i)}>
              {workbook.name}
            </button>
          ))}
        </div>
      </div>
      <div className="dodo-mobile-only">
        <div
          className="dodo-stage-nav dodo-level-controls"
          aria-label={t('t8th0434')}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocus={() => setFocused(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget))
              setFocused(false)
          }}>
          <button
            type="button"
            aria-label={t('t8th0435')}
            onClick={() =>
              setIndex(
                (current) =>
                  (current - 1 + workbooks.length) % workbooks.length,
              )
            }>
            <Image
              src={Assets.Icon.chevronLeftGray}
              alt=""
              width={24}
              height={24}
            />
          </button>
          <div
            className="dodo-level-indicator"
            aria-live={hovered || focused ? 'polite' : 'off'}
            aria-atomic="true">
            <strong>
              {workbooks[index].name} ·{' '}
              {t('t8th0431', { count: workbooks[index].count })}
            </strong>
            <span>
              {index + 1} / {workbooks.length}
            </span>
          </div>
          <button
            type="button"
            aria-label={t('t8th0436')}
            onClick={() =>
              setIndex((current) => (current + 1) % workbooks.length)
            }>
            <Image
              src={Assets.Icon.chevronRightGray}
              alt=""
              width={24}
              height={24}
            />
          </button>
        </div>
      </div>
    </div>
  )
}
