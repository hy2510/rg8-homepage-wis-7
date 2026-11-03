'use client'

import {
  useDubbingInfo,
  useDubbingSearchAndMyVideo,
  useDubbingTags,
} from '@/8th/features/dubbing/service/dubbing-query'
import DubbingCard from '@/8th/features/dubbing/ui/component/DubbingCard'
import DubbingCategoriesHeader from '@/8th/features/dubbing/ui/component/DubbingCategoriesHeader'
import LibraryActionBar, {
  ActionBarDropdownItem,
} from '@/8th/features/library/ui/component/LibraryActionBar'
import LibraryTabBar from '@/8th/features/library/ui/component/LibraryTabBar'
import { useStudentHistoryList } from '@/8th/features/student/service/student-query'
import { useStartDubbing } from '@/8th/shared/hook/useStartStudy'
import { DubbingCategoriesStyle } from '@/8th/shared/styled/FeaturesStyled'
import { Gap } from '@/8th/shared/ui/Misc'
import SITE_PATH from '@/app/site-path'
import useTranslation from '@/localization/client/useTranslations'
import { useMemo, useState } from 'react'

export default function DubbingList({ level }: { level?: string }) {
  return <DubbingContentDependency level={level} />
}

function DubbingContentDependency({ level }: { level?: string }) {
  // @Language 'common'
  const { t } = useTranslation()

  const dubbingInfo = useDubbingInfo()
  const dubbingTags = useDubbingTags()

  if (dubbingInfo.isLoading || dubbingTags.isLoading) {
    return null
  }
  let targetLevel: string | undefined = undefined
  if (!!level || !!dubbingInfo.data?.dubbingRoomLevel) {
    if (!!level) {
      targetLevel = getFixedLevel(level)
    }
    if (!targetLevel && !!dubbingInfo.data?.dubbingRoomLevel) {
      targetLevel = getFixedLevel(dubbingInfo.data.dubbingRoomLevel)
    }
  }
  if (!targetLevel) {
    targetLevel = 'KA'
  }

  const levelList: { key: string; label: string }[] = []
  if (!!dubbingTags.data?.levels && dubbingTags.data.levels.length > 0) {
    dubbingTags.data.levels.forEach((level) => {
      const levelGrade = getLevelGrade(level.level)
      let levelLabel: string
      if (levelGrade === 'D') {
        levelLabel = t('t8thdf022')
      } else {
        levelLabel = t('t8thdf021', { grade: levelGrade })
      }
      levelList.push({
        key: level.level,
        label: levelLabel,
      })
    })
  }

  return <DubbingContentList level={targetLevel} levelList={levelList} />
}

function DubbingContentList({
  level,
  levelList,
}: {
  level: string
  levelList: { key: string; label: string }[]
}) {
  // @Language 'common'
  const { t } = useTranslation()

  const studentHistory = useStudentHistoryList()
  const defaultStudentHistoryId =
    studentHistory.data?.list && studentHistory.data?.list.length > 0
      ? studentHistory.data.list[0].studentHistoryId
      : undefined
  const defaultClassId =
    studentHistory.data?.list && studentHistory.data?.list.length > 0
      ? studentHistory.data.list[0].classId
      : undefined
  const isStudentHistoryActive = !!defaultClassId && !!defaultStudentHistoryId

  const dubbingSearchAndMyVideoList = useDubbingSearchAndMyVideo({ level })
  const { onStartDubbing } = useStartDubbing()

  const [status, setStatus] = useState('All')

  const dubbingContents = useMemo(() => {
    if (dubbingSearchAndMyVideoList.isLoading) {
      return []
    }
    const allList = dubbingSearchAndMyVideoList.data ?? []
    if (allList.length === 0) {
      return []
    }

    if (status === 'complete') {
      return allList.filter((item) => !!item.soloStudy && !!item.fullStudy)
    } else if (status === 'incomplete') {
      return allList.filter((item) => !item.soloStudy && !item.fullStudy)
    } else if (status === 'incompleteOr1stTry') {
      return allList.filter(
        (item) =>
          (!item.soloStudy && !item.fullStudy) ||
          (!!item.soloStudy && !item.fullStudy) ||
          (!!item.fullStudy && !item.soloStudy),
      )
    } else if (status === '1stTry') {
      return allList.filter(
        (item) =>
          (!!item.soloStudy && !item.fullStudy) ||
          (!!item.fullStudy && !item.soloStudy),
      )
    } else if (status === 'solo') {
      return allList.filter((item) => !!item.soloStudy && !item.fullStudy)
    } else if (status === 'full') {
      return allList.filter((item) => !item.soloStudy && !!item.fullStudy)
    } else {
      return allList
    }
  }, [
    dubbingSearchAndMyVideoList.isLoading,
    dubbingSearchAndMyVideoList.data,
    status,
  ])

  const tabBarItems = levelList.map((item) => ({
    href: `${SITE_PATH.STUDENT_8TH.DUBBING}?level=${item.key}`,
    label: item.label,
    level: item.key,
    active: item.key === level,
  }))

  if (dubbingSearchAndMyVideoList.isLoading) {
    return null
  }

  if (!isStudentHistoryActive) {
    // 소속반이 없음.
    return null
  }

  const statusItems = [
    {
      key: 'All',
      label: t('t8thdf025'),
      isActive: status === 'All',
    },
    {
      key: 'incomplete',
      label: t('t8thdf026'),
      isActive: status === 'incomplete',
    },
    {
      key: 'incompleteOr1stTry',
      label: t('t8thdf027'),
      isActive: status === 'incompleteOr1stTry',
    },
    {
      key: '1stTry',
      label: t('t8thdf028'),
      isActive: status === '1stTry',
    },
    {
      key: 'full',
      label: t('t8thdf030'),
      isActive: status === 'full',
    },
    {
      key: 'solo',
      label: t('t8thdf029'),
      isActive: status === 'solo',
    },
    {
      key: 'complete',
      label: t('t8thdf031'),
      isActive: status === 'complete',
    },
  ]
  const actionBarTitle = statusItems.find((item) => item.isActive)?.label ?? ''

  const onStatusItemClick = (item: ActionBarDropdownItem) => {
    setStatus(item.key)
  }

  const onClickCard = (levelRoundId: string) => {
    const item = dubbingContents.find(
      (item) => item.levelRoundId === levelRoundId,
    )
    if (!!item && defaultStudentHistoryId) {
      onStartDubbing({
        levelRoundId,
        studentHistoryId: defaultStudentHistoryId,
        levelName: item.levelName,
        soloStudy: item.soloStudy,
        fullStudy: item.fullStudy,
      })
    }
  }
  const onClickMode = (levelRoundId: string, mode: 'solo' | 'full') => {
    onClickCard(levelRoundId)
  }

  return (
    <DubbingCategoriesStyle>
      <DubbingCategoriesHeader />

      <Gap size={10} />

      <LibraryTabBar items={tabBarItems} tabLine="none" />

      <LibraryActionBar
        title={actionBarTitle}
        count={dubbingContents.length}
        dropdowns={[
          {
            title: t('t8th012'),
            isActiveMakerVisible: true,
            items: statusItems,
            onItemClick: onStatusItemClick,
          },
        ]}
      />

      <Gap size={30} />

      <div className="dubbing-grid">
        {dubbingContents.map((item) => (
          <DubbingCard
            key={item.levelRoundId}
            order={item.order}
            levelRoundId={item.levelRoundId}
            levelGrade={item.levelGrade}
            levelName={item.levelName}
            topicTitle={item.topicTitle}
            studyImagePath={item.studyImagePath}
            soloStudy={item.soloStudy}
            fullStudy={item.fullStudy}
            onClickCard={onClickCard}
            onClickMode={onClickMode}
          />
        ))}
      </div>

      <Gap size={30} />
    </DubbingCategoriesStyle>
  )
}

function getLevelGrade(level: string) {
  const lowerLevel = level.toLowerCase()
  if (lowerLevel === 'ka') {
    return 'A'
  } else if (lowerLevel === 'kb') {
    return 'B'
  } else if (lowerLevel === 'kc') {
    return 'C'
  }
  return level
}
function getFixedLevel(level: string) {
  let targetLevel: string | undefined = undefined
  const lowerLevel = level.toLowerCase()
  if (lowerLevel === 'ka') {
    targetLevel = 'KA'
  } else if (lowerLevel === 'kb') {
    targetLevel = 'KB'
  } else if (lowerLevel === 'kc') {
    targetLevel = 'KC'
  }
  return targetLevel
}
