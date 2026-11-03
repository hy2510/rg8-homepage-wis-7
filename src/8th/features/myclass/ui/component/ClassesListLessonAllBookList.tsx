'use client'

import { Assets } from '@/8th/assets/asset-library'
import BookItem from '@/8th/features/library/ui/component/BookItem'
import { BookListStyle } from '@/8th/shared/styled/FeaturesStyled'
import { BoxStyle } from '@/8th/shared/ui/Misc'
import useTranslation from '@/localization/client/useTranslations'
import Image from 'next/image'

export type LessonBookItemProps = {
  title: string
  levelName: string
  levelRoundId: string
  imagePath: string
  bookPoint: number
  earnedPoint: number
  passCount: number
  getableRgPoint: number
}

export default function ClassesListLessonAllBookList({
  books,
  onClick,
}: {
  books: LessonBookItemProps[]
  onClick?: (id: string) => void
}) {
  return (
    <BoxStyle display="flex" flexDirection="column" gap={20}>
      {books.length === 0 ? (
        <LessonBookListEmpty />
      ) : (
        <LessonBookList books={books} onClick={onClick} />
      )}
    </BoxStyle>
  )
}

function LessonBookListEmpty() {
  // @Language 'common'
  const { t } = useTranslation()

  return (
    <div className="cl-empty-state" role="status" aria-live="polite">
      <Image src={Assets.Image.emptyResults} alt="" width={120} height={120} />
      <p className="cl-empty-state-message">{t('t8thdf013')}</p>
    </div>
  )
}

function LessonBookList({
  books,
  onClick,
}: {
  books: LessonBookItemProps[]
  onClick?: (id: string) => void
}) {
  return (
    <BookListStyle>
      {books.map((book) => (
        <BookItem
          key={book.levelRoundId}
          title={book.title}
          passCount={book.passCount}
          point={book.getableRgPoint}
          addYn={false}
          movieYn={false}
          src={book.imagePath}
          levelName={book.levelName}
          recommendedAge={''}
          onClick={() => {
            if (onClick) {
              onClick(book.levelRoundId)
            }
          }}
        />
      ))}
    </BookListStyle>
  )
}
