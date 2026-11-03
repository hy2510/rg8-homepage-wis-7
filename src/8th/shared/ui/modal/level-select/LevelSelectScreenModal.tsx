import { useIsPhone } from '@/8th/application/context/ScreenModeContext'
import { Assets } from '@/8th/assets/asset-library'
import {
  useChangeStudyLearningLevel,
  useLevelTestInfo,
} from '@/8th/features/student/service/learning-query'
import { useStartLevelTest } from '@/8th/shared/hook/useStartStudy'
import {
  LevelSelectCardStyle,
  LevelSelectStyle,
} from '@/8th/shared/styled/FeaturesStyled'
import { StartButton } from '@/8th/shared/ui/Buttons'
import { TextStyle } from '@/8th/shared/ui/Misc'
import useTranslation from '@/localization/client/useTranslations'
import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'

type SelectLevel = 'Pre K' | 'K' | '1' | '2'
const LEVEL_SELECT_LIST: {
  level: SelectLevel
  target: 'PK' | 'KA' | '1A' | '2A'
  video: string
  thumbnail: string
}[] = [
  {
    level: 'Pre K',
    target: 'PK',
    video:
      'https://wcfresource.a1edu.com/newsystem/8th/level-select/prek_sample.mp4',
    thumbnail:
      'https://wcfresource.a1edu.com/newsystem/8th/level-select/prek_sample.png',
  },
  {
    level: 'K',
    target: 'KA',
    video:
      'https://wcfresource.a1edu.com/newsystem/8th/level-select/levelk_sample.mp4',
    thumbnail:
      'https://wcfresource.a1edu.com/newsystem/8th/level-select/levelk_sample.png',
  },
  {
    level: '1',
    target: '1A',
    video:
      'https://wcfresource.a1edu.com/newsystem/8th/level-select/level1_sample.mp4',
    thumbnail:
      'https://wcfresource.a1edu.com/newsystem/8th/level-select/level1_sample.png',
  },
  {
    level: '2',
    target: '2A',
    video:
      'https://wcfresource.a1edu.com/newsystem/8th/level-select/level2_sample.mp4',
    thumbnail:
      'https://wcfresource.a1edu.com/newsystem/8th/level-select/level2_sample.png',
  },
]

export default function LevelSelectScreenModal() {
  // @language 'common'
  const { t } = useTranslation()

  const isPhone = useIsPhone()

  const levelTestInfo = useLevelTestInfo()
  const onStartLevelTest = useStartLevelTest()

  const { mutate: changeStudyLevel, isPending } = useChangeStudyLearningLevel()

  const [selectIndex, setSelectIndex] = useState(0)

  const infoText = useMemo(() => {
    switch (selectIndex) {
      case 1:
        return {
          level: 'Level K',
          grade: t('t8th349'),
          description: t('t8th353'),
        }
      case 2:
        return {
          level: 'Level 1',
          grade: t('t8th350'),
          description: t('t8th354'),
        }
      case 3:
        return {
          level: 'Level 2',
          grade: t('t8th351'),
          description: t('t8th355'),
        }
      default:
        return {
          level: 'Pre K',
          grade: t('t8th348'),
          description: t('t8th352'),
        }
    }
  }, [selectIndex, t])

  const hasPrevious = selectIndex > 0
  const hasNext = selectIndex < LEVEL_SELECT_LIST.length - 1
  const onSelectChange = (index: number) => {
    if (index < 0 || index >= LEVEL_SELECT_LIST.length) {
      return
    }
    setSelectIndex(index)
  }

  return (
    <LevelSelectStyle>
      {/* <AccountPageHeader /> */}
      <div
        className="container"
        style={{ height: '100%', paddingTop: '28px', paddingBottom: '28px' }}>
        <div className="group">
          <TextStyle
            fontFamily="sans"
            fontWeight={700}
            fontColor="primary"
            fontSize={isPhone ? '1.75em' : '2em'}>
            {t('t8th344')}
          </TextStyle>
          <div className="description">
            <TextStyle fontFamily="sans" fontWeight={500} fontSize="medium">
              {t('t8th345')}
            </TextStyle>
          </div>

          <LevelSelectCardStyle>
            <div className="carousel">
              <div className={`carousel-track`}>
                <div className="carousel-slot">
                  {hasPrevious ? (
                    <div
                      key={'left'}
                      className="carousel-item side"
                      onClick={() => onSelectChange(selectIndex - 1)}>
                      <LevelSelectVideo
                        videoSrc={LEVEL_SELECT_LIST[selectIndex - 1].video}
                        thumbnailSrc={
                          LEVEL_SELECT_LIST[selectIndex - 1].thumbnail
                        }
                        isActive={false}
                      />
                    </div>
                  ) : (
                    <div className="carousel-item side spacer" aria-hidden />
                  )}
                </div>
                <div className="carousel-slot center">
                  <div className="carousel-item active" key={'center'}>
                    <LevelSelectVideo
                      videoSrc={LEVEL_SELECT_LIST[selectIndex].video}
                      thumbnailSrc={LEVEL_SELECT_LIST[selectIndex].thumbnail}
                      isActive
                    />
                  </div>
                </div>
                <div className="carousel-slot">
                  {hasNext ? (
                    <div
                      key={'right'}
                      className="carousel-item side"
                      onClick={() => onSelectChange(selectIndex + 1)}>
                      <LevelSelectVideo
                        videoSrc={LEVEL_SELECT_LIST[selectIndex + 1].video}
                        thumbnailSrc={
                          LEVEL_SELECT_LIST[selectIndex + 1].thumbnail
                        }
                        isActive={false}
                      />
                    </div>
                  ) : (
                    <div className="carousel-item side spacer" aria-hidden />
                  )}
                </div>
              </div>
            </div>

            <div className="level-nav">
              <button
                type="button"
                className="level-nav-arrow"
                onClick={() => {
                  onSelectChange(selectIndex - 1)
                }}
                disabled={selectIndex === 0}
                aria-label="Previous Level">
                <Image
                  src={Assets.Icon.chevronLeftGray}
                  alt=""
                  width={24}
                  height={24}
                />
              </button>
              <div className="level-tabs">
                {LEVEL_SELECT_LIST.map((item, index) => (
                  <button
                    key={item.level}
                    type="button"
                    className={`level-tab ${index === selectIndex ? 'active' : ''}`}
                    onClick={() => onSelectChange(index)}>
                    {item.level}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="level-nav-arrow"
                onClick={() => {
                  onSelectChange(selectIndex + 1)
                }}
                disabled={selectIndex === LEVEL_SELECT_LIST.length - 1}
                aria-label="Next Level">
                <Image
                  src={Assets.Icon.chevronRightGray}
                  alt=""
                  width={24}
                  height={24}
                />
              </button>
            </div>

            <div className="level-info">
              <TextStyle
                fontFamily="sans"
                fontWeight={700}
                fontColor="primary"
                fontSize="1.75em">
                {infoText.level}
              </TextStyle>
              <TextStyle
                fontFamily="sans"
                fontWeight={500}
                fontColor="secondary"
                fontSize="var(--font-size-medium)">
                {infoText.grade}
              </TextStyle>
              <TextStyle
                fontFamily="sans"
                fontWeight={500}
                fontColor="secondary"
                fontSize="var(--font-size-medium)">
                {infoText.description}
              </TextStyle>
            </div>

            <StartButton
              label="Start!"
              className="start-button animated"
              onClick={() => {
                if (!isPending) {
                  changeStudyLevel(LEVEL_SELECT_LIST[selectIndex].target)
                }
              }}
            />

            {!levelTestInfo.isLoading &&
              levelTestInfo.data?.isAvailableLevelTest && (
                <>
                  <div className="level-test-divide">
                    <hr className="line" />
                    <p className="text">OR</p>
                    <hr className="line" />
                  </div>
                  <div className="level-test-section">
                    <TextStyle
                      fontFamily="sans"
                      fontWeight={500}
                      fontColor="secondary"
                      fontSize="large">
                      {t('t8th346')}
                    </TextStyle>
                    <button
                      type="button"
                      className="level-test-link"
                      onClick={() => {
                        onStartLevelTest()
                      }}>
                      {t('t8th347')}
                    </button>
                  </div>
                </>
              )}
          </LevelSelectCardStyle>
        </div>

        {/* <AccountPageFooter /> */}
      </div>
    </LevelSelectStyle>
  )
}

function LevelSelectVideo({
  videoSrc,
  thumbnailSrc,
  isActive,
}: {
  videoSrc: string
  thumbnailSrc: string
  isActive: boolean
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.muted = true
    video.playsInline = true

    if (!isActive) {
      video.pause()
      return
    }

    const play = () => {
      setReady(true)

      video.play().catch(() => {
        // autoplay 실패는 정상 가능성으로 처리
      })
    }
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      play()
    } else {
      video.addEventListener('loadeddata', play, { once: true })
    }

    return () => {
      video.removeEventListener('loadeddata', play)

      video.pause()
    }
  }, [isActive, videoSrc])

  return (
    <div className="video-placeholder">
      {isActive && (
        <video
          ref={videoRef}
          src={videoSrc}
          muted
          loop
          playsInline
          preload="auto"
          controls={false}
          disablePictureInPicture
          disableRemotePlayback
          controlsList="nodownload nofullscreen noremoteplayback"
        />
      )}
      <Image
        className={`video-cover${ready ? ' is-hidden' : ''}`}
        width={1280}
        height={720}
        src={thumbnailSrc}
        alt=""
        draggable={false}
      />
    </div>
  )
}
