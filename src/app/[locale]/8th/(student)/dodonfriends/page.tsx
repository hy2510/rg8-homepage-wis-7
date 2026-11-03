'use client'

import SITE_PATH from '@/app/site-path'
import Link from 'next/link'

export default function Page() {
  return (
    <div>
      <h1>{'Dodo & Friends'}</h1>
      <hr />
      <div>
        <h2 style={{ margin: '10px' }}>{'My Class'}</h2>
        <h3 style={{ margin: '10px', marginTop: '30px' }}>{'My Lesson'}</h3>
        <ul style={{ margin: '10px' }}>
          <li style={{ margin: '16px' }}>
            <Link href={SITE_PATH.DODON_FRIENDS.MY_LESSON}>{'My Lesson'}</Link>
          </li>
          <li style={{ margin: '16px', marginLeft: '32px' }}>
            <Link href={SITE_PATH.DODON_FRIENDS.MY_LESSON_DAY}>
              {'Lesson Day'}
            </Link>
          </li>
        </ul>
        <h3 style={{ margin: '10px', marginTop: '30px' }}>{'Classes'}</h3>
        <ul style={{ margin: '10px' }}>
          <li style={{ margin: '16px' }}>
            <Link href={SITE_PATH.DODON_FRIENDS.CLASSES}>{'Classes'}</Link>
          </li>
          <li style={{ margin: '16px', marginLeft: '32px' }}>
            <Link href={SITE_PATH.DODON_FRIENDS.COURSE}>{'Course'}</Link>
          </li>
        </ul>
        <h3 style={{ margin: '10px', marginTop: '30px' }}>{'Calendar'}</h3>
        <ul style={{ margin: '10px' }}>
          <li style={{ margin: '16px' }}>
            <Link href={'/8th/dodonfriends/myclass/calendar'}>
              {'Calendar'}
            </Link>
          </li>
        </ul>
      </div>
      <hr />
      <div>
        <h2 style={{ margin: '10px' }}>{'Library'}</h2>
        <li style={{ margin: '16px' }}>
          <Link href={SITE_PATH.DODON_FRIENDS.EB}>{'EBook'}</Link>
          <li style={{ margin: '16px' }}>
            <Link href={`${SITE_PATH.DODON_FRIENDS.EB_LEVEL}/kc`}>
              {'Level'}
            </Link>
          </li>
        </li>
        <li style={{ margin: '16px' }}>
          <Link href={SITE_PATH.DODON_FRIENDS.PB}>{'PBook'}</Link>
          <li style={{ margin: '16px' }}>
            <Link href={`${SITE_PATH.DODON_FRIENDS.PB_LEVEL}/1a`}>
              {'Level'}
            </Link>
          </li>
        </li>
      </div>
      <hr />
      <div>
        <h2 style={{ margin: '10px' }}>{'My Page'}</h2>
        <li style={{ margin: '16px' }}>
          <Link href={SITE_PATH.DODON_FRIENDS.ACTIVITY}>{'My Page'}</Link>
        </li>
      </div>
      <hr />
      <div>
        <h2 style={{ margin: '10px' }}>{'Account'}</h2>
        <li style={{ margin: '16px' }}>
          <Link href={SITE_PATH.DODON_FRIENDS.ACCOUNTINFO_SETTING}>
            {'Account Setting'}
          </Link>
        </li>
        <li style={{ margin: '16px' }}>
          <Link href={SITE_PATH.DODON_FRIENDS.ACCOUNTINFO}>
            {'Account Info'}
          </Link>
        </li>
      </div>
    </div>
  )
}
