'use client'

import styles from './resources.module.css'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import logo from '../_assets/logo_top.svg'
import TeacherNavigation from '../_components/TeacherNavigation'
import { TeacherShell } from '../_components/TeacherStyles'
import useTranslation from '../_i18n/useTranslation'
import { TEACHER } from '../site-path'
import type { ResourceLink } from './_data/get-resource'
import { getResources } from './_data/get-resource'

function ResourceItem({
  item,
  compact = false,
}: {
  item: ResourceLink
  compact?: boolean
}) {
  // @language 'teacher'
  const { t } = useTranslation()
  const className = compact
    ? `${styles.book}${item.startNewRow ? ` ${styles.newRow}` : ''}`
    : styles.material
  return item.url ? (
    <a
      className={className}
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('tch046', { title: item.title })}>
      <span>{item.title}</span>
      <span aria-hidden="true">↗</span>
    </a>
  ) : (
    <button
      className={className}
      type="button"
      disabled
      aria-label={item.title}>
      <span>{item.title}</span>
    </button>
  )
}

export default function ResourcesView() {
  // @language 'teacher'
  const { t } = useTranslation()

  const {
    data: catalog,
    isLoading: isResourcesLoading,
    isError: isResourcesError,
  } = useQuery({
    queryKey: ['dodonfriends-techer', 'resources'],
    queryFn: () => getResources(),
  })

  return (
    <TeacherShell className={styles.shell}>
      <a className="skip-link" href="#resources-content">
        {t('tch039')}
      </a>
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <Link href={TEACHER.HOME} aria-label={t('tch003')}>
              <Image src={logo} alt="DODO & FRIENDS" priority />
            </Link>
            <span className="teacher-badge">{t('tch001')}</span>
          </div>
          <TeacherNavigation active="resources" />
        </div>
      </header>
      <main id="resources-content" className={styles.main}>
        <h1 className={styles.srOnly}>{t('tch040')}</h1>
        <section aria-labelledby="materials-heading">
          <div className={styles.sectionTitle}>
            <h2 id="materials-heading">{t('tch041')}</h2>
          </div>
          <div className={styles.cards}>
            {catalog?.materialGroups.map((group) => (
              <article
                className={styles.card}
                key={group.id}
                style={
                  {
                    '--resource-color': getResourceColor(group.id),
                  } as CSSProperties
                }>
                {group.subtitle && (
                  <p className={styles.subtitle}>{group.subtitle}</p>
                )}
                <h3>{group.title}</h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={item.id}>
                      <ResourceItem item={item} />
                    </li>
                  ))}
                </ul>
                {!group.items.length && !isResourcesLoading && (
                  <p className={styles.empty}>{t('tch042')}</p>
                )}
              </article>
            ))}
          </div>
          {!catalog?.materialGroups.length && !isResourcesLoading && (
            <p className={styles.empty}>{t('tch043')}</p>
          )}
        </section>
        <section
          className={styles.answerSection}
          aria-labelledby="answers-heading">
          <div className={styles.sectionTitle}>
            <h2 id="answers-heading">{t('tch044')}</h2>
          </div>
          <div className={styles.answers}>
            {catalog?.answerKeyGroups.map((group) => (
              <div
                className={styles.answerGroup}
                key={group.id}
                style={
                  {
                    '--resource-color': getResourceColor(group.id),
                  } as CSSProperties
                }>
                <h3>{group.title}</h3>
                <div className={styles.books}>
                  {group.items.map((item) => (
                    <ResourceItem key={item.id} item={item} compact />
                  ))}
                </div>
                {!group.items.length && !isResourcesLoading && (
                  <p className={styles.empty}>{t('tch045')}</p>
                )}
              </div>
            ))}
            {!catalog?.answerKeyGroups.length && !isResourcesLoading && (
              <p className={styles.empty}>{t('tch045')}</p>
            )}
          </div>
        </section>
      </main>
    </TeacherShell>
  )
}

function getResourceColor(id: string) {
  switch (id) {
    case 'alphabet':
      return '#e5a935'
    case 'phonics':
      return '#d64d7c'
    case 'sight-words':
      return '#2bb0bd'
    case 'readers-a':
      return '#244d7e'
    case 'readers-b':
      return '#218560'
    case 'common':
      return '#168765'
  }
  return '#cdcdcd'
}
