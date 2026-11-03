'use client'

import { Assets } from '@/8th/assets/asset-library'
import SITE_PATH from '@/app/site-path'
import { StaticImageData } from 'next/image'

const MENU_ITEM_RG_TRACK = {
  title: 'RG TRACK',
  icon: Assets.Icon.Gnb.readingPath,
}
const MENU_ITEM_MYCLASS = {
  title: 'MY CLASS',
  icon: Assets.Icon.Gnb.myClass,
}
const MENU_ITEM_LIBRARY = {
  title: 'LIBRARY',
  icon: Assets.Icon.Gnb.library,
}
const MENU_ITEM_EB = {
  title: 'E-BOOK',
  icon: Assets.Icon.Gnb.ebooks,
}
const MENU_ITEM_PB = {
  title: 'P-BOOK QUIZ',
  icon: Assets.Icon.Gnb.bookQuiz,
}
const MENU_ITEM_ACTIVITY = {
  title: 'MY PAGE',
  icon: Assets.Icon.Gnb.myActivity,
}
const MENU_ITEM_CALENDAR = {
  title: 'CALENDAR',
  icon: Assets.Icon.Gnb.calendar,
}
const MENU_ITEM_DUBBING = {
  title: 'DUBBING',
  icon: Assets.Icon.Gnb.dubbing,
}
const MENU_ITEM_MOVIES = {
  title: 'MOVIES',
  icon: Assets.Icon.Gnb.movies,
}
const MENU_ITEM_WORD_PRACTICE = {
  title: 'PRACTICE',
  icon: Assets.Icon.Gnb.wordPractice,
}

const MENU_ITEM_MORE = {
  title: 'MORE',
  icon: Assets.Icon.Gnb.more,
}

export const MENU_ITEM = {
  RgTrack: MENU_ITEM_RG_TRACK,
  Library: MENU_ITEM_LIBRARY,
  EB: MENU_ITEM_EB,
  PB: MENU_ITEM_PB,
  Activity: MENU_ITEM_ACTIVITY,
  Calendar: MENU_ITEM_CALENDAR,
  WordPractice: MENU_ITEM_WORD_PRACTICE,
  More: MENU_ITEM_MORE,
  MyClass: MENU_ITEM_MYCLASS,
  Dubbing: MENU_ITEM_DUBBING,
  Movies: MENU_ITEM_MOVIES,
}

export function getMenuItem(pathname: string) {
  let item: { title: string; icon: StaticImageData } | null = null
  if (pathname.endsWith(SITE_PATH.STUDENT_8TH.DAILY_RG)) {
    item = MENU_ITEM.RgTrack
  } else if (
    pathname.endsWith(SITE_PATH.STUDENT_8TH.LIBRARY) ||
    pathname.endsWith(SITE_PATH.DODON_FRIENDS.EB) ||
    pathname.endsWith(SITE_PATH.STUDENT_8TH.EB) ||
    pathname.endsWith(SITE_PATH.DODON_FRIENDS.PB) ||
    pathname.endsWith(SITE_PATH.STUDENT_8TH.PB)
  ) {
    item = MENU_ITEM.Library
    // } else if (pathname.endsWith(SITE_PATH.STUDENT_8TH.EB)) {
    //   item = MENU_ITEM.EB
    // } else if (pathname.endsWith(SITE_PATH.STUDENT_8TH.PB)) {
    //   item = MENU_ITEM.PB
  } else if (
    pathname.endsWith(SITE_PATH.STUDENT_8TH.ACTIVITY) ||
    pathname.endsWith(SITE_PATH.DODON_FRIENDS.ACTIVITY)
  ) {
    item = MENU_ITEM.Activity
  } else if (
    pathname.endsWith(SITE_PATH.DODON_FRIENDS.MY_CLASS) ||
    pathname.endsWith(SITE_PATH.DODON_FRIENDS.MY_LESSON) ||
    pathname.endsWith(SITE_PATH.DODON_FRIENDS.CLASSES)
  ) {
    item = MENU_ITEM.MyClass
  } else if (pathname.endsWith(SITE_PATH.DODON_FRIENDS.DUBBING)) {
    item = MENU_ITEM.Dubbing
  } else if (pathname.endsWith(SITE_PATH.DODON_FRIENDS.MOVIES)) {
    item = MENU_ITEM.Movies
  } else if (
    pathname.endsWith(SITE_PATH.STUDENT_8TH.WORD_PRACTICE) ||
    pathname.endsWith(SITE_PATH.STUDENT_8TH.WORD_PRACTICE_EB) ||
    pathname.endsWith(SITE_PATH.STUDENT_8TH.WORD_PRACTICE_PB)
  ) {
    item = MENU_ITEM.WordPractice
  }
  return item
}
