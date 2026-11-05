'use client'

import { useTrialContents } from '@/8th/features/account/service/account-query'
import LibraryTabBar from '@/8th/features/library/ui/component/LibraryTabBar'
import { useStartTrial } from '@/8th/shared/hook/useStartStudy'
import { HpTrialContentStyled } from '@/8th/shared/styled/HpFeaturesStyled'
import SITE_PATH from '@/app/site-path'
import useTranslation from '@/localization/client/useTranslations'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import AccountRoot from './AccountRoot'

export type TrialLevel = 'prek' | 'k' | '1' | '2-6'
const TRIAL_LEVELS: { level: TrialLevel; label: string; link: string }[] = [
  {
    level: 'prek',
    label: 't8th329',
    link: `${SITE_PATH.ACCOUNT_8TH.TRIAL}/prek`,
  },
  { level: 'k', label: 't8th0440', link: `${SITE_PATH.ACCOUNT_8TH.TRIAL}/k` },
  { level: '1', label: 't8th0441', link: `${SITE_PATH.ACCOUNT_8TH.TRIAL}/1` },
  {
    level: '2-6',
    label: 't8th0442',
    link: `${SITE_PATH.ACCOUNT_8TH.TRIAL}/2-6`,
  },
]

export default function Trial({ level }: { level: TrialLevel }) {
  // @language 'common'
  const { t } = useTranslation()

  const router = useRouter()

  const { onStartStudy } = useStartTrial()
  const trialContents = useTrialContents({ level })

  const levelContents = [
    {
      id: 'prek',
      level: t('t8th329'),
      description: t('t8th0334'),
      age: t('t8th287'),
    },
    {
      id: 'k',
      level: t('t8th0335'),
      description: t('t8th0336'),
      age: t('t8th0337'),
    },
    {
      id: '1',
      level: t('t8th0338'),
      description: t('t8th0339'),
      age: t('t8th0340'),
    },
    {
      id: '2-6',
      level: t('t8th0341'),
      description: t('t8th0342'),
      age: t('t8th0343'),
    },
  ]

  const tabList = TRIAL_LEVELS.filter((item) =>
    levelContents.some((content) => content.id === item.level),
  ).map((item) => ({
    href: item.link,
    active: item.level === level,
    label: t(item.label),
  }))
  const currentLevelContent = levelContents.find((item) => item.id === level)

  const contentList = trialContents.data?.list || []
  const allContentList = contentList.flatMap((item) => item.contents)

  const onBookClick = (bookCode: string) => {
    const content = allContentList.find((item) => item.bookCode === bookCode)
    if (content) {
      onStartStudy({
        studyId: content.studyId,
        studentHistoryId: content.studentHistoryId,
        bookCode: content.bookCode,
        levelRoundId: content.levelRoundId,
        bookLevel: content.bookLevel,
      })
    }
  }

  return (
    <HpTrialContentStyled>
      <AccountRoot>
        <main className="trial-body trial-content-body">
          <h1>{t('t8th0437')}</h1>
          <p className="trial-intro">
            <span>{t('t8th0438')}</span>
            <Link
              href={SITE_PATH.ACCOUNT_8TH.SIGNIN}
              style={{ marginLeft: '4px', marginRight: '4px' }}>
              {t('t8th0026')}
            </Link>
            <span>{t('t8th0439')}</span>
          </p>

          <div className="trial-tabs">
            <LibraryTabBar
              items={tabList}
              overrideClick={(item) => {
                router.replace(item.href)
              }}
            />
          </div>

          <section
            className="trial-catalog"
            aria-labelledby="trial-level-title">
            <header className="trial-catalog-head">
              <h2 id="trial-level-title">{`${currentLevelContent?.level} · ${currentLevelContent?.description}`}</h2>
              <p> {currentLevelContent?.age}</p>
            </header>
            {level === 'prek' ? (
              <>
                {contentList.length > 0 && (
                  <div className="prek-groups">
                    {contentList.map((item) => (
                      <PreKContents
                        key={item.group}
                        title={item.group}
                        contents={item.contents}
                        onClick={onBookClick}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                {contentList.length > 0 && (
                  <div className="level-book-groups">
                    {contentList.map((item) => (
                      <BookContents
                        key={item.group}
                        title={item.group}
                        contents={item.contents}
                        onClick={onBookClick}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </section>
        </main>
      </AccountRoot>
    </HpTrialContentStyled>
  )
}

function PreKContents({
  title,
  contents,
  onClick,
}: {
  title: string
  contents: {
    title: string
    bookCode: string
    image: string
  }[]
  onClick: (bookCode: string) => void
}) {
  return (
    <section className="prek-group" key={title}>
      <h3>{`· ${title}`}</h3>
      <div className="prek-list">
        {contents.map((item) => (
          <TrialBookCard
            key={item.bookCode}
            title={item.title}
            bookCode={item.bookCode}
            image={item.image}
            onClick={onClick}
          />
        ))}
      </div>
    </section>
  )
}

function BookContents({
  title,
  contents,
  onClick,
}: {
  title: string
  contents: {
    title: string
    bookCode: string
    image: string
  }[]
  onClick: (bookCode: string) => void
}) {
  return (
    <section className="level-book-group" key={title}>
      <h3>{`· ${title}`}</h3>
      <div className="trial-book-grid">
        {contents.map((item) => (
          <TrialBookCard
            key={item.bookCode}
            title={item.title}
            bookCode={item.bookCode}
            image={item.image}
            onClick={onClick}
          />
        ))}
      </div>
    </section>
  )
}

function TrialBookCard({
  title,
  bookCode,
  image,
  onClick,
}: {
  title: string
  bookCode: string
  image: string
  onClick: (bookCode: string) => void
}) {
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null)
  const imageReady = loadedSrc === image
  const isPreK = bookCode.startsWith('EB-PK-')

  return (
    <button type="button" className={`trial-book-card${isPreK ? ' is-prek' : ''}`}>
      <span className="trial-book-cover" onClick={() => onClick(bookCode)}>
        {!isPreK && (
          <Image
            className="trial-book-backdrop"
            src={image}
            alt=""
            aria-hidden
            fill
            sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, 25vw"
          />
        )}
        <Image
          key={image}
          src={image}
          alt={title}
          width={isPreK ? 320 : 151}
          height={isPreK ? 180 : 216}
          onLoad={() => setLoadedSrc(image)}
          style={isPreK ? {
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            opacity: imageReady ? 1 : 0,
            transition: 'opacity 0.2s ease',
          } : {
            position: 'absolute',
            top: 12,
            left: '50%',
            zIndex: 1,
            transform: 'translateX(-50%)',
            boxSizing: 'border-box',
            width: 'auto',
            height: 'calc(100% - 6px)',
            maxWidth: '100%',
            aspectRatio: 'auto',
            objectFit: 'contain',
            borderRadius: '22px 22px 0 0',
            borderWidth: imageReady ? '3px 3px 0' : 0,
            borderStyle: 'solid',
            borderColor: '#f8fafc',
            borderBottom: 0,
            opacity: imageReady ? 1 : 0,
            transition: 'opacity 0.2s ease',
            boxShadow: imageReady
              ? '0 -6px 18px -4px rgba(40, 60, 90, 0.24)'
              : 'none',
          }}
        />
      </span>
      <strong>{title}</strong>
      <span>{bookCode}</span>
    </button>
  )
}
