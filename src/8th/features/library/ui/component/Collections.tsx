'use client'

import { useIsPhone } from '@/8th/application/context/ScreenModeContext'
import { Assets } from '@/8th/assets/asset-library'
import {
  CollectionItemStyled,
  CollectionsStyled,
} from '@/8th/shared/styled/FeaturesStyled'
import { BoxStyle, TextStyle } from '@/8th/shared/ui/Misc'
import useTranslation from '@/localization/client/useTranslations'
import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'

type CollectionItem =
  | 'NewBooks'
  | 'Movie'
  | 'Theme'
  | 'Series'
  | 'Workbook'
  | 'SchoolSubjects'

const collectionItemStyle: Record<
  CollectionItem,
  {
    iconSrc: string | StaticImageData
    iconWidth: number
    iconHeight: number
    iconBgColor: string
    labelI18nKey: string
  }
> = {
  NewBooks: {
    iconSrc: Assets.Icon.Study.newBooks,
    iconWidth: 26,
    iconHeight: 26,
    iconBgColor: '#F53259',
    labelI18nKey: 't8th005',
  },
  Movie: {
    iconSrc: Assets.Icon.Study.movie,
    iconWidth: 22,
    iconHeight: 22,
    iconBgColor: '#FFA400',
    labelI18nKey: 't8th006',
  },
  Theme: {
    iconSrc: Assets.Icon.Study.theme,
    iconWidth: 24,
    iconHeight: 24,
    iconBgColor: '#23C1EB',
    labelI18nKey: 't8th008',
  },
  Series: {
    iconSrc: Assets.Icon.Study.series,
    iconWidth: 24,
    iconHeight: 24,
    iconBgColor: '#A1CE05',
    labelI18nKey: 't8th039',
  },
  Workbook: {
    iconSrc: Assets.Icon.Study.workbook,
    iconWidth: 24,
    iconHeight: 24,
    iconBgColor: '#E37EFF',
    labelI18nKey: 't8th007',
  },
  SchoolSubjects: {
    iconSrc: Assets.Icon.Study.schoolSubjects,
    iconWidth: 24,
    iconHeight: 24,
    iconBgColor: '#8C6CFF',
    labelI18nKey: 't8th313',
  },
}

export default function Collections({
  list,
}: {
  list: { item: CollectionItem; link: string }[]
}) {
  // @Language 'common'
  const { t } = useTranslation()

  const isPhone = useIsPhone()

  return (
    <CollectionsStyled>
      <BoxStyle className="title" display="flex" gap={10}>
        {/* <Image
          alt="collections"
          src={Assets.Icon.Study.collections}
          width={28}
          height={28}
        /> */}
        <span>{`· ${t('t8th004')}`}</span>
      </BoxStyle>
      <BoxStyle
        display="grid"
        gridTemplateColumns={`repeat(${isPhone ? 1 : 2}, 1fr)`}
        gap={10}>
        <CollectionList list={list} />
      </BoxStyle>
    </CollectionsStyled>
  )
}

function CollectionList({
  list,
}: {
  list: { item: CollectionItem; link: string }[]
}) {
  // @Language 'common'
  const { t } = useTranslation()

  const collections = list.filter((listItem) => {
    const filterList = [
      'NewBooks',
      'Movie',
      'Series',
      'Theme',
      'Workbook',
      'SchoolSubjects',
    ] as CollectionItem[]
    return filterList.includes(listItem.item)
  })

  return (
    <>
      {collections.map((collection) => {
        const { iconSrc, iconWidth, iconHeight, iconBgColor, labelI18nKey } =
          collectionItemStyle[collection.item as CollectionItem]

        const href = collection.link
        return (
          <CollectionItem
            key={collection.item}
            href={href}
            iconSrc={iconSrc}
            iconWidth={iconWidth}
            iconHeight={iconHeight}
            iconBgColor={iconBgColor}
            fontWeight={700}>
            {t(labelI18nKey)}
          </CollectionItem>
        )
      })}
    </>
  )
}

interface CollectionItemProps {
  children: React.ReactNode
  iconSrc?: string | StaticImageData
  iconWidth?: number
  iconHeight?: number
  iconBgColor?: string
  fontWeight?: number
  href: string
}

export function CollectionItem({
  children,
  iconSrc = Assets.Icon.Study.collections,
  iconWidth = 24,
  iconHeight = 24,
  iconBgColor = '#f0f0f0',
  fontWeight = 500,
  href,
}: CollectionItemProps) {
  return (
    <CollectionItemStyled iconBgColor={iconBgColor}>
      <Link href={href}>
        <BoxStyle
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          gap={5}
          width="100%">
          <BoxStyle
            display="flex"
            alignItems="center"
            gap={12}
            flex="1"
            minWidth="0">
            <div className="icon-box">
              <Image
                src={iconSrc}
                alt="collection-icon"
                width={iconWidth}
                height={iconHeight}
              />
            </div>
            <TextStyle
              className="label"
              fontFamily={'sans'}
              fontWeight={fontWeight}
              fontColor="primary"
              width="100%">
              {children}
            </TextStyle>
          </BoxStyle>
          <Image
            src={Assets.Icon.chevronRightGray}
            alt="chevron-right"
            width={22}
            height={22}
          />
        </BoxStyle>
      </Link>
    </CollectionItemStyled>
  )
}
