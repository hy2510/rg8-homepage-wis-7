'use client'

import { useIsPhone } from '@/8th/application/context/ScreenModeContext'
import { Assets } from '@/8th/assets/asset-library'
import { TodoBook } from '@/8th/features/todo/model/todo-book'
import {
  BookListEmptyStateStyle,
  BookListStyle,
  RecentlyViewedStyle,
} from '@/8th/shared/styled/FeaturesStyled'
import { RoundedFullButton } from '@/8th/shared/ui/Buttons'
import { BoxStyle, TextStyle } from '@/8th/shared/ui/Misc'
import useTranslation from '@/localization/client/useTranslations'
import DateUtils from '@/util/date-utils'
import Image from 'next/image'
import Link from 'next/link'
import BookItem from './BookItem'

/**
 * Recently Viewed 메뉴
 */
export default function TodoViewed({
  todos,
  todoLink,
  moreTodo,
  onClickBook,
}: {
  todos?: TodoBook[]
  todoLink?: string
  moreTodo?: boolean
  onClickBook?: (studyId: string) => void
}) {
  // @Language 'common'
  const { t } = useTranslation()

  const isPhone = useIsPhone()

  return (
    <RecentlyViewedStyle>
      <BoxStyle display="flex" gap={isPhone ? 5 : 10} alignItems="center">
        {/* <Image
          src={Assets.Icon.Study.recentlyViewed}
          alt="recently-viewed"
          width={28}
          height={28}
        /> */}
        <TextStyle fontSize="large" fontColor="primary">
          {`· ${t('t8th028')}`}
        </TextStyle>
      </BoxStyle>

      {!!todos && (
        <ContinueTodoBookList
          todos={todos}
          todoLink={todoLink}
          moreTodo={!!moreTodo}
          onClickBook={onClickBook}
        />
      )}
    </RecentlyViewedStyle>
  )
}

function ContinueTodoBookList({
  todos,
  moreTodo,
  todoLink,
  onClickBook,
}: {
  todos: TodoBook[]
  moreTodo: boolean
  todoLink?: string
  onClickBook?: (studyId: string) => void
}) {
  // @Language 'common'
  const { t } = useTranslation()

  const isPhone = useIsPhone()

  if (todos.length === 0) {
    return (
      <BookListEmptyStateStyle>
        <p>{t('t8th009')}</p>
      </BookListEmptyStateStyle>
    )
  }

  return (
    <>
      {isPhone && (
        <BoxStyle
          className="list mobile-slider todo-books-slider"
          display="flex"
          gap={10}>
          {todos.map((book) => (
            <div key={book.studyId} className="slider-item">
              {renderBookItem(book, onClickBook)}
            </div>
          ))}
        </BoxStyle>
      )}
      {!isPhone && (
        <BookListStyle>
          {todos.map((book) => renderBookItem(book, onClickBook))}
        </BookListStyle>
      )}
      {moreTodo && !!todoLink && (
        <Link href={todoLink}>
          <RoundedFullButton
            onClick={undefined}
            fontColor="var(--font-color-primary)">
            <BoxStyle
              display="flex"
              alignItems="center"
              flexDirection="row"
              gap={5}>
              <TextStyle
                fontSize="medium"
                fontWeight="bolder"
                fontFamily="sans">
                {t('t8th333')}
              </TextStyle>
              <Image
                src={Assets.Icon.arrowRightBlack}
                alt="right-arrow"
                width={14}
                height={14}
              />
            </BoxStyle>
          </RoundedFullButton>
        </Link>
      )}
    </>
  )
}

function renderBookItem(
  book: TodoBook,
  onClickBook?: (studyId: string) => void,
) {
  const isInProgressInTodo =
    book.statusCode !== '025001' || book.answerCount !== 0

  let displayDate: string | undefined = undefined
  if (book.homeworkYn) {
    if (book.openDate) {
      displayDate = book.openDate
    } else if (book.assignDate) {
      displayDate = book.assignDate
    }
  } else {
    if (book.assignDate) {
      displayDate = book.assignDate
    } else if (book.openDate) {
      displayDate = book.openDate
    }
  }
  if (!!displayDate) {
    displayDate = `+ ${DateUtils.toRgDateEnglishFormat(displayDate, 'MD')}`
  }

  return (
    <BookItem
      key={book.studyId}
      title={book.title}
      passCount={0}
      addYn={false}
      movieYn={!!book.animationPath}
      point={book.getableRgPoint}
      src={book.surfaceImagePath}
      levelName={book.levelName}
      displayDate={displayDate}
      homeworkYn={book.homeworkYn}
      recommendedAge={book.recommendedAge}
      isCheckable={false}
      isDisabled={false}
      isChecked={false}
      isInProgressInTodo={isInProgressInTodo}
      onClick={() => {
        if (onClickBook) {
          onClickBook(book.studyId)
        }
      }}
    />
  )
}
