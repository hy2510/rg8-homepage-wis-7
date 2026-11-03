'use client'

import { useCustomerConfiguration } from '@/8th/application/context/CustomerContext'
import { useLevelBooks } from '@/8th/features/achieve/service/achieve-query'
import LibraryTabBar from '@/8th/features/library/ui/component/LibraryTabBar'
import { useStudentDailyLearning } from '@/8th/features/student/service/learning-query'
import {
  useWordPracticeSummary,
  useWordPracticeWordList,
} from '@/8th/features/wordpractice/service/wordpractice-query'
import PracticeDonutChart from '@/8th/features/wordpractice/ui/component/WordPracticeDonutChart'
import PracticeHeader from '@/8th/features/wordpractice/ui/component/WordPracticeHeader'
import PracticeLevelTabs from '@/8th/features/wordpractice/ui/component/WordPracticeLevelTabs'
import PracticeWordList from '@/8th/features/wordpractice/ui/component/WordPracticeList'
import { useStartWordPractice } from '@/8th/shared/hook/useStartStudy'
import { PracticeHomeStyle } from '@/8th/shared/styled/FeaturesStyled'
import { BoxStyle, TextStyle } from '@/8th/shared/ui/Misc'
import Pagenation from '@/8th/shared/ui/Pagenation'
import SITE_PATH from '@/app/site-path'
import useTranslation from '@/localization/client/useTranslations'
import LevelUtils from '@/util/level-utils'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { WordStatus } from '../wordStatusData'

const EB_LEVEL_GROUP = [
  { key: 'K', name: 'Lv. KA · KB · KC', Levels: ['KA', 'KB', 'KC'] },
  { key: '1', name: 'LV. 1A · 1B · 1C', Levels: ['1A', '1B', '1C'] },
  { key: '2', name: 'LV. 2A · 2B · 2C', Levels: ['2A', '2B', '2C'] },
  { key: '3', name: 'LV. 3A · 3B · 3C', Levels: ['3A', '3B', '3C'] },
  { key: '4', name: 'LV. 4A · 4B · 4C', Levels: ['4A', '4B', '4C'] },
  { key: '5', name: 'LV. 5A · 5B · 5C', Levels: ['5A', '5B', '5C'] },
  { key: '6', name: 'LV. 6A · 6B', Levels: ['6A', '6B'] },
]
const PB_LEVEL_GROUP = [
  { key: 'K', name: 'LV. KC', Levels: ['KC'] },
  { key: '1', name: 'LV. 1A · 1B · 1C', Levels: ['1A', '1B', '1C'] },
  { key: '2', name: 'LV. 2A · 2B · 2C', Levels: ['2A', '2B', '2C'] },
  { key: '3', name: 'LV. 3A · 3B · 3C', Levels: ['3A', '3B', '3C'] },
  { key: '4', name: 'LV. 4A · 4B · 4C', Levels: ['4A', '4B', '4C'] },
  { key: '5', name: 'LV. 5A · 5B · 5C', Levels: ['5A', '5B', '5C'] },
  { key: '6', name: 'LV. 6A · 6B · 6C', Levels: ['6A', '6B', '6C'] },
]

export default function WordPractice({
  bookType,
  level,
}: {
  bookType: 'eb' | 'pb'
  level?: string
}) {
  const { menu } = useCustomerConfiguration()

  // @Language 'common'
  const { t } = useTranslation()

  const router = useRouter()

  const [isWordPracticeStartable, setIsWordPracticeStartable] = useState(false)
  const onWordPracticeStartableChange = useCallback(
    (isStartable: boolean) => {
      setIsWordPracticeStartable(isStartable)
    },
    [setIsWordPracticeStartable],
  )

  const userSetting = useStudentDailyLearning()
  const levels = useLevelBooks()
  const { onStartWordPractice } = useStartWordPractice()

  const tabBarItems: React.ComponentProps<typeof LibraryTabBar>['items'] = []
  if (menu.wordPractice.eb.open) {
    tabBarItems.push({
      href: `${SITE_PATH.STUDENT_8TH.WORD_PRACTICE_EB}`,
      active: bookType === 'eb',
      label: t('t8th325'),
    })
  }
  if (menu.wordPractice.pb.open) {
    tabBarItems.push({
      href: `${SITE_PATH.STUDENT_8TH.WORD_PRACTICE_PB}`,
      label: t('t8th326'),
      active: bookType === 'pb',
    })
  }

  const stages: {
    stageId: string
    stageName: string
    subText: string
    levels: { level: string; label?: string }[]
  }[] = useMemo(() => {
    if (levels.isLoading) {
      return []
    }
    if (!levels.data) {
      return []
    }
    const findSubTxt = (levelGroup: string) => {
      if (levelGroup === 'K') {
        return t('t8th288')
      } else if (levelGroup === '1') {
        return t('t8th289')
      } else if (levelGroup === '2') {
        return t('t8th290')
      } else if (levelGroup === '3') {
        return t('t8th291')
      } else if (
        levelGroup === '4' ||
        levelGroup === '5' ||
        levelGroup === '6'
      ) {
        return t('t8th292')
      }
      return ''
    }
    const baseLevel = bookType === 'eb' ? EB_LEVEL_GROUP : PB_LEVEL_GROUP
    return baseLevel.map((levelGroup) => {
      return {
        stageId: levelGroup.key,
        stageName: levelGroup.name,
        subText: findSubTxt(levelGroup.key),
        levels: levelGroup.Levels.map((level) => ({ level, label: level })),
      }
    })
  }, [bookType, levels.isLoading, levels.data, t])

  const onDailyLevelChange = (level: string) => {
    if (bookType === 'eb') {
      router.replace(`${SITE_PATH.STUDENT_8TH.WORD_PRACTICE_EB}?level=${level}`)
    } else {
      router.replace(`${SITE_PATH.STUDENT_8TH.WORD_PRACTICE_PB}?level=${level}`)
    }
  }

  const onDailyStageChange = (stageId: string) => {
    const stage = stages.find((stage) => stage.stageId === stageId)
    if (!stage) return

    let targetLevel = userSetting.data?.settingLevelName || 'PK'
    const userLevelIndex = LevelUtils.getLevelIndex(targetLevel)
    const stageMinLevelIndex = LevelUtils.getLevelIndex(stage.levels[0].level)
    if (userLevelIndex < stageMinLevelIndex) {
      targetLevel = stage.levels[0].level
    } else if (userLevelIndex > stageMinLevelIndex) {
      targetLevel = stage.levels[stage.levels.length - 1].level
    }
    if (bookType === 'eb') {
      router.replace(
        `${SITE_PATH.STUDENT_8TH.WORD_PRACTICE_EB}?level=${targetLevel}`,
      )
    } else {
      router.replace(
        `${SITE_PATH.STUDENT_8TH.WORD_PRACTICE_PB}?level=${targetLevel}`,
      )
    }
  }

  let tmpUserLevel: string | undefined = level
  if (!tmpUserLevel && userSetting.data) {
    tmpUserLevel = userSetting.data.settingLevelName || 'PK'
  }
  if (tmpUserLevel) {
    const stage = stages.find((stage) =>
      stage.levels.some((level) => level.level === tmpUserLevel),
    )
    if (!stage) {
      tmpUserLevel = undefined
    }
  }
  if (!tmpUserLevel) {
    if (bookType === 'eb') {
      tmpUserLevel = EB_LEVEL_GROUP[0].Levels[0]
    } else {
      tmpUserLevel = PB_LEVEL_GROUP[0].Levels[0]
    }
  }
  const queryLevel = tmpUserLevel
  const currentStageId =
    stages.find((stage) =>
      stage.levels.some((level) => level.level === queryLevel),
    )?.stageId || ''

  const onStartClick = () => {
    if (!isWordPracticeStartable) {
      alert(t('t8th369'))
      return
    }
    if (queryLevel) {
      onStartWordPractice({
        bookType: bookType.toUpperCase() as 'EB' | 'PB',
        level: queryLevel,
      })
    }
  }

  return (
    <PracticeHomeStyle>
      <PracticeHeader
        startLevel={queryLevel}
        bookType={bookType}
        onStartClick={onStartClick}
      />
      <LibraryTabBar items={tabBarItems} />
      <PracticeLevelTabs
        activeLevel={queryLevel}
        currentStageId={currentStageId}
        stages={stages}
        onLevelChange={onDailyLevelChange}
        onStageChange={onDailyStageChange}
      />
      <WordPracticeWordData
        bookType={bookType}
        level={queryLevel}
        onWordPracticeStartableChange={onWordPracticeStartableChange}
      />
    </PracticeHomeStyle>
  )
}

function WordPracticeWordData({
  bookType,
  level,
  onWordPracticeStartableChange,
}: {
  bookType: 'eb' | 'pb'
  level: string
  onWordPracticeStartableChange?: (isStartable: boolean) => void
}) {
  // @Language 'common'
  const { t } = useTranslation()

  const [wordListOptions, setWordListOptions] = useState<{
    filter: WordStatus | 'all'
    page: number
  }>({ filter: 'all', page: 1 })

  const wordSummary = useWordPracticeSummary()
  const wordList = useWordPracticeWordList({
    level,
    bookType: bookType.toUpperCase() as 'EB' | 'PB',
    proficiency: wordListOptions.filter,
    page: wordListOptions.page,
  })
  const [wordSound, setWordSound] = useState<{
    word: string
    audioUrl: string
  } | null>(null)
  const { play: playWordSound, setSource: setWordSoundSource } = useAudio({
    onEnded: () => setWordSound(null),
  })

  const targetSummary = wordSummary.data?.summaryList?.find(
    (item) =>
      item.studyTypeName === bookType.toUpperCase() && item.levelName === level,
  )
  const summaries = targetSummary
    ? [
        { status: 'weak' as WordStatus, count: targetSummary.weaknessCount },
        { status: 'normal' as WordStatus, count: targetSummary.normalCount },
        { status: 'strong' as WordStatus, count: targetSummary.strongCount },
        { status: 'perfect' as WordStatus, count: targetSummary.perfectCount },
      ]
    : []
  const summaryWordCount = summaries.reduce((acc, item) => acc + item.count, 0)
  const wordPoolCount = summaries
    .filter((item) => item.status !== 'perfect')
    .reduce((acc, item) => acc + item.count, 0)

  useEffect(() => {
    if (!onWordPracticeStartableChange) {
      return
    }
    if (wordPoolCount > 10) {
      onWordPracticeStartableChange(true)
    } else {
      onWordPracticeStartableChange(false)
    }
  }, [wordPoolCount, onWordPracticeStartableChange])

  const filters = [
    { key: 'all', label: t('t8th360') },
    { key: 'weak', label: t('t8th361') },
    { key: 'normal', label: t('t8th362') },
    { key: 'strong', label: t('t8th363') },
    { key: 'perfect', label: t('t8th364') },
  ]

  const currentPage = wordList.data?.page?.page || 0
  const maxPage = wordList.data?.page?.totalPages || 0
  const totalWords = wordList.data?.page?.totalRecords || 0

  const words =
    wordList.data?.words.map((word) => {
      return {
        word: word.word,
        status: word.proficiency.toLowerCase() as WordStatus,
        audioUrl: word.wordSoundPath,
      }
    }) || []

  if (summaryWordCount === 0) {
    return (
      <BoxStyle
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={20}
        minHeight="200px">
        <TextStyle fontFamily="sans" fontSize="medium" fontColor="secondary">
          {t('t8th369')}
        </TextStyle>
      </BoxStyle>
    )
  }

  return (
    <>
      <PracticeDonutChart
        level={level}
        bookType={bookType}
        summaries={summaries}
        totalWords={summaryWordCount}
      />
      <PracticeWordList
        words={words}
        totalWords={totalWords}
        playingWord={wordSound?.word}
        onPlayWord={(word) => {
          if (
            word.word !== wordSound?.word ||
            word.audioUrl !== wordSound?.audioUrl
          ) {
            setWordSound({ word: word.word, audioUrl: word.audioUrl })
            setWordSoundSource(word.audioUrl)
            playWordSound()
          } else {
            playWordSound(true)
          }
        }}
        currentFilter={wordListOptions.filter}
        filters={filters}
        onFilterChange={(value) => {
          setWordListOptions({
            filter: value.key as WordStatus | 'all',
            page: 1,
          })
        }}
      />
      {maxPage >= 1 && (
        <Pagenation
          maxPage={maxPage}
          currentPage={currentPage}
          onPageChange={(page) => {
            setWordListOptions({ ...wordListOptions, page })
          }}
        />
      )}
    </>
  )
}

export function useAudio(props?: {
  onEnded?: () => void
  onError?: (error: unknown) => void
}) {
  const { onEnded, onError } = props || {}

  const audioRef = useRef<HTMLAudioElement | null>(null)

  const onEndedRef = useRef(onEnded)
  const onErrorRef = useRef(onError)

  const [isPlaying, setIsPlaying] = useState(false)

  // 최신 callback 유지
  useEffect(() => {
    onEndedRef.current = onEnded
  }, [onEnded])

  useEffect(() => {
    onErrorRef.current = onError
  }, [onError])

  // Audio 객체 생성 및 이벤트 등록
  useEffect(() => {
    const audio = new Audio()

    audio.preload = 'auto'
    audioRef.current = audio

    const handlePlay = () => {
      setIsPlaying(true)
    }

    const handlePause = () => {
      setIsPlaying(false)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      onEndedRef.current?.()
    }

    const handleError = () => {
      setIsPlaying(false)

      onErrorRef.current?.(audio.error ?? new Error('Audio playback error'))
    }

    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)

    return () => {
      audio.pause()

      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)

      audio.removeAttribute('src')
      audio.load()

      audioRef.current = null
    }
  }, [])

  const setSource = useCallback((src: string) => {
    const audio = audioRef.current
    if (!audio) return

    audio.pause()
    audio.currentTime = 0

    audio.src = src
  }, [])

  const play = useCallback(async (reset = false) => {
    const audio = audioRef.current

    if (!audio || !audio.src) {
      return false
    }

    try {
      if (reset) {
        audio.currentTime = 0
      }
      await audio.play()
      return true
    } catch (error) {
      // src 교체 등으로 play가 취소된 경우는 정상적인 상황일 수 있음
      if (error instanceof DOMException && error.name === 'AbortError') {
        return false
      }

      onErrorRef.current?.(error)
      return false
    }
  }, [])

  const pause = useCallback(() => {
    audioRef.current?.pause()
  }, [])

  const stop = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.pause()
    audio.currentTime = 0
  }, [])

  return {
    isPlaying,
    setSource,
    play,
    pause,
    stop,
  }
}
