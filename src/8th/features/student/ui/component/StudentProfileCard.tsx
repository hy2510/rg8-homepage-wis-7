'use client'

import { Assets } from '@/8th/assets/asset-library'
import { StudentProfileCardStyle } from '@/8th/shared/styled/FeaturesStyled'
import { WidgetBoxStyle } from '@/8th/shared/styled/SharedStyled'
import { AvatarSync } from '@/8th/shared/ui/Avatar'
import { BoxStyle, TextStyle } from '@/8th/shared/ui/Misc'
import useTranslation from '@/localization/client/useTranslations'
import LevelUtils from '@/util/level-utils'
import NumberUtils from '@/util/number-utils'
import Image from 'next/image'

/**
 * 리딩유닛, 아바타, 이름 나오는 카드
 */

interface StudentProfileCardProps {
  studentName: string
  book: number
  point: number
  todo: number
  favorite: number
  isChangeableLevel: boolean
  isOpenTodo: boolean
  isOpenFavorite: boolean
  level?: string
  levelMasterProgress?: number
  rank?: number
  medal?: 'bronze' | 'silver' | 'gold' | 'platinum' | 'titanium'
  onMenuClick?: (
    menuId: 'activity' | 'level' | 'todo' | 'favorite' | 'avatar' | 'rank',
  ) => void
}

export default function StudentProfileCard({
  studentName,
  level = '',
  levelMasterProgress = 0,
  rank = -1,
  book,
  point,
  todo,
  favorite,
  isChangeableLevel = true,
  isOpenTodo = true,
  isOpenFavorite = true,
  medal,
  onMenuClick,
}: StudentProfileCardProps) {
  // @Language 'common'
  const { t } = useTranslation()
  const frameImage = medal
    ? Assets.HallOfFame.Profile[`${medal}Large`].src
    : undefined

  return (
    <WidgetBoxStyle>
      <StudentProfileCardStyle>
        <div className="header">
          <button
            type="button"
            className="avatar profile-action"
            aria-label={t('t037')}
            onClick={() => onMenuClick?.('avatar')}>
            <div className="wrapper">
              {frameImage && (
                <Image
                  className="frame"
                  src={frameImage}
                  alt=""
                  width={174}
                  height={174}
                />
              )}
              <div className="avatar-image" style={{ width: 120, height: 120 }}>
                <AvatarSync size="large" />
              </div>
            </div>
          </button>
          <BoxStyle
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={3}>
            <BoxStyle
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap={5}>
              {/* <div className="rank">#{pointRank}</div> */}
              <div className="name">{studentName}</div>
            </BoxStyle>
            {!!level && (
              <TextStyle
                className="profile-level-rank"
                fontSize="0.75em"
                fontColor="lightBlue"
                textAlign="center">
                <button
                  type="button"
                  className="profile-action"
                  disabled={!isChangeableLevel}
                  onClick={() => onMenuClick?.('level')}>
                  Lv. {`${LevelUtils.getLevelLabel(level)} (${Math.min(levelMasterProgress, 100)}%)`}
                </button>
                {0 < rank && rank < 1000 && (
                  <>
                    <span className="profile-separator"> · </span>
                    <button
                      type="button"
                      className="profile-action"
                      onClick={() => onMenuClick?.('rank')}>
                      Rank {rank}
                    </button>
                  </>
                )}
              </TextStyle>
            )}
          </BoxStyle>
        </div>
        <div className="body">
          <div className="label">
            <Image
              src={Assets.Icon.Side.booksRead}
              alt=""
              width={28}
              height={28}
            />
            {t('t8th247')}
          </div>
          <div className="value">{book}</div>
          <div className="label">
            <Image
              src={Assets.Icon.Side.earnedPoints}
              alt=""
              width={28}
              height={28}
            />
            {t('t8th248')}
          </div>
          <div className="value">{NumberUtils.toRgDecimalPoint(point)}P</div>
          {isOpenTodo && (
            <>
              <div className="label">
                <Image
                  src={Assets.Icon.Side.toDo}
                  alt=""
                  width={28}
                  height={28}
                />
                {t('t8th268')}
              </div>
              <div
                className="value link"
                onClick={() => {
                  if (onMenuClick) {
                    onMenuClick('todo')
                  }
                }}>
                {todo}
              </div>
            </>
          )}
          {isOpenFavorite && (
            <>
              <div className="label">
                <Image
                  src={Assets.Icon.Side.favorite}
                  alt=""
                  width={28}
                  height={28}
                />
                {t('t8th269')}
              </div>
              <div
                className="value link"
                onClick={() => {
                  if (onMenuClick) {
                    onMenuClick('favorite')
                  }
                }}>
                {favorite}
              </div>
            </>
          )}
        </div>
      </StudentProfileCardStyle>
    </WidgetBoxStyle>
  )
}
