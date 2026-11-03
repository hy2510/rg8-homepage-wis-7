'use client'

import { useCustomerConfiguration } from '@/8th/application/context/CustomerContext'
import {
  useSchoolSubjectLessonInfo,
  useSchoolSubjectPublisher,
} from '@/8th/features/library/service/library-query'
import { useSearchSchoolSubject } from '@/8th/features/library/service/search-query'
import BookItem, {
  SkeletonBookItem,
} from '@/8th/features/library/ui/component/BookItem'
import ActionBar, {
  ActionBarDropdownItem,
} from '@/8th/features/library/ui/component/LibraryActionBar'
import {
  SchoolSubjectOption,
  SchoolSubjectSelectHeader,
} from '@/8th/features/library/ui/component/SchoolSubjectSelectHeader'
import {
  useSchoolSubjectOption,
  useSchoolSubjectOptionSave,
  useStudent,
  useStudentHistoryList,
} from '@/8th/features/student/service/student-query'
import {
  ExportActionType,
  PickItemType,
  useExportItems,
} from '@/8th/shared/hook/useActionBarDropdownOption'
import {
  VocabularyOption,
  useExportPanelSearch,
} from '@/8th/shared/hook/useExportPanel'
import {
  BookListEmptyStateStyle,
  BookListStyle,
} from '@/8th/shared/styled/FeaturesStyled'
import { SubPageNavHeader } from '@/8th/shared/ui/SubPageNavHeader'
import { openWindow } from '@/8th/shared/utils/open-window'
import SITE_PATH from '@/app/site-path'
import useTranslation from '@/localization/client/useTranslations'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import SchoolSubjectChooseOptionInfo from '../component/SchoolSubjectChooseOptionInfo'
import BookInfoModal from '../modal/BookInfoModal'
import PrintVocabularyModal from '../modal/PrintVocabularyModal'
import SchoolSubjectLessonInfoModal from '../modal/SchoolSubjectLessonInfoModal'
import SelectStudentHistoryModal from '../modal/SelectStudentHistoryModal'

const GRADES = [
  {
    key: '3',
    label: '초등 3',
  },
  {
    key: '4',
    label: '초등 4',
  },
  {
    key: '5',
    label: '초등 5',
  },
  {
    key: '6',
    label: '초등 6',
  },
]

export default function SearchSchoolSubjectBookList({
  bookType,
  grade,
  publisher,
  lesson,
}: {
  bookType: 'eb' | 'pb'
  grade?: string
  publisher?: string
  lesson?: string
}) {
  return (
    <LibraryBookListDependency
      bookType={bookType.toUpperCase() as 'EB' | 'PB'}
      grade={grade}
      publisher={publisher}
      lesson={lesson}
    />
  )
}

function LibraryBookListDependency({
  bookType,
  grade,
  publisher,
  lesson,
}: {
  bookType: 'EB' | 'PB'
  grade?: string
  publisher?: string
  lesson?: string
}) {
  // @Language 'common'
  const { t } = useTranslation()

  const router = useRouter()
  const student = useStudent()
  const schoolSubjectOption = useSchoolSubjectOption()
  const [isParamLoading, setParamLoading] = useState(true)

  useEffect(() => {
    if (
      !student.isLoading &&
      !schoolSubjectOption.isLoading &&
      schoolSubjectOption.data
    ) {
      if (!grade || !publisher || !lesson) {
        const gradeValue = schoolSubjectOption.data.grade
        const publisherValue = schoolSubjectOption.data.publisher
        const lessonValue = schoolSubjectOption.data.lesson

        if (gradeValue && publisherValue && lessonValue) {
          router.replace(
            `${SITE_PATH.STUDENT_8TH.EB_SCHOOL_SUBJECTS}?grade=${gradeValue}&publisher=${publisherValue}&lesson=${lessonValue}`,
          )
        }
        setParamLoading(false)
      } else {
        setParamLoading(false)
      }
    }
  }, [
    grade,
    publisher,
    lesson,
    student.isLoading,
    router,
    schoolSubjectOption.isLoading,
    schoolSubjectOption.data,
  ])

  if (isParamLoading) {
    return <></>
  }

  return (
    <>
      <SubPageNavHeader
        title={`${t('t8th313')}`}
        titleFontFamily="sans"
        parentPath={
          bookType === 'EB'
            ? SITE_PATH.STUDENT_8TH.EB
            : SITE_PATH.STUDENT_8TH.PB
        }
      />
      <LibraryBookList
        bookType={bookType}
        grade={grade}
        publisher={publisher}
        lesson={lesson}
      />
    </>
  )
}

type SearchBookExportType =
  | 'none'
  | 'Vocabulary'
  | 'ToDo'
  | 'Favorite'
  | 'BookList'

function LibraryBookList({
  bookType,
  grade,
  publisher,
  lesson,
}: {
  bookType: 'EB' | 'PB'
  grade?: string
  publisher?: string
  lesson?: string
}) {
  // @Language 'common'
  const { t } = useTranslation()

  const router = useRouter()
  const { setting } = useCustomerConfiguration()

  const [schoolSubjectSearch, setSchoolSubjectSearch] = useState<{
    bookType: 'EB' | 'PB'
    grade: string
    publisher: string
    lesson: string
    page: number
  }>({
    bookType,
    grade: grade || '',
    publisher: publisher || '',
    lesson: lesson || '',
    page: 1,
  })
  const [isLessonInfoModalOpen, setLessonInfoModalOpen] = useState(false)

  const isOptionActive =
    !!schoolSubjectSearch.grade &&
    !!schoolSubjectSearch.publisher &&
    !!schoolSubjectSearch.lesson
  const search = useSearchSchoolSubject(schoolSubjectSearch, {
    enabled: isOptionActive,
  })

  useEffect(() => {
    if (!!grade && !!publisher && !!lesson) {
      setSchoolSubjectSearch({
        bookType: bookType,
        grade: grade,
        publisher: publisher,
        lesson: lesson,
        page: 1,
      })
    }
  }, [bookType, grade, publisher, lesson])

  const publisherList = useSchoolSubjectPublisher(
    { grade: schoolSubjectSearch.grade },
    {
      enabled: !!schoolSubjectSearch.grade,
    },
  )
  const lessonInfo = useSchoolSubjectLessonInfo(
    {
      grade: schoolSubjectSearch.grade,
      publisher: schoolSubjectSearch.publisher,
      lesson: schoolSubjectSearch.lesson,
    },
    {
      enabled: isOptionActive,
    },
  )
  const { mutate: changeSchoolSubjectOption } = useSchoolSubjectOptionSave()

  const [exportMode, setExportMode] = useState<SearchBookExportType>('none')
  const [vocabularyOption, setVocabularyOption] = useState<boolean>(false)

  const {
    selectedItemCount,
    setSelectItemChange,
    resetSelectedItem,
    isSelectedItem,
    onActionAddTodo,
    onActionAddFavorite,
    onActionVocabulary,
    onActionBookList,
  } = useExportPanelSearch()

  const [bookInfo, setBookInfo] = useState<
    | {
        levelRoundId: string
        surfaceImagePath: string
        title: string
        bookCode: string
      }
    | undefined
  >(undefined)

  const student = useStudent()
  const studentHistory = useStudentHistoryList()
  const defaultStudentHistoryId =
    studentHistory.data?.list && studentHistory.data?.list.length > 0
      ? studentHistory.data.list[0].studentHistoryId
      : undefined
  const bookWizardStudentHistoryCount =
    studentHistory.data?.list?.filter((item) => item.isBookWizard).length || 0
  const defaultBookWizardStudentHistoryId =
    bookWizardStudentHistoryCount > 0
      ? studentHistory.data?.list?.filter((item) => item.isBookWizard)[0]
          .studentHistoryId
      : undefined
  const isBookWizard = bookWizardStudentHistoryCount > 0
  const [isSelectStudentHistory, setSelectStudentHistory] =
    useState<boolean>(false)

  const exportOption: {
    action: ExportActionType
    pick?: PickItemType[]
  } = {
    action: 'exclude',
    pick: [],
  }
  if (isBookWizard && setting.printVocabulary) {
    exportOption.pick = ['AllBooksList']
  } else {
    const pick = exportOption.pick || []
    if (!isBookWizard) {
      pick.push('ToDo')
    }
    if (!setting.printVocabulary) {
      pick.push('Vocabulary')
    }
    pick.push('AllBooksList')
    exportOption.pick = pick
  }
  const exportItems = useExportItems(exportOption)

  if (studentHistory.isLoading) {
    return <div></div>
  }

  if (search.isLoading || (isOptionActive && lessonInfo.isLoading)) {
    return (
      <BookListStyle>
        {Array.from({ length: 12 }).map((_, index) => (
          <SkeletonBookItem key={`skeleton-${index}`} />
        ))}
      </BookListStyle>
    )
  }

  const isExportMode = exportMode !== 'none'
  const onChangeExportMode = (item: SearchBookExportType) => {
    setExportMode(item)
    if (item === 'none') {
      resetSelectedItem()
    }
  }
  const onConfirmVocabularyOption = (vocabularyOption: VocabularyOption) => {
    if (!defaultStudentHistoryId) {
      return
    }

    onActionVocabulary(
      {
        studentHistoryId: defaultStudentHistoryId,
        vocabularyOption,
      },
      (success, url, error) => {
        if (success) {
          onChangeExportMode('none')
          setVocabularyOption(false)
          openWindow(url, {
            external: true,
            target: '_blank',
            feature: 'noopener, noreferrer',
          })
        } else if (error) {
          alert(error)
        } else {
          onChangeExportMode('none')
          setVocabularyOption(false)
        }
      },
    )
  }
  const onConfirmExport = () => {
    if (selectedItemCount > 0 && defaultStudentHistoryId) {
      if (
        exportMode === 'ToDo' &&
        isBookWizard &&
        bookWizardStudentHistoryCount > 1
      ) {
        setSelectStudentHistory(true)
      } else {
        onConfirmExportWithStudentHistoryId(
          defaultBookWizardStudentHistoryId || defaultStudentHistoryId,
        )
      }
    }
  }
  const onConfirmExportWithStudentHistoryId = (studentHistoryId: string) => {
    if (selectedItemCount > 0) {
      if (exportMode === 'Vocabulary') {
        setVocabularyOption(true)
      } else if (exportMode === 'ToDo') {
        onActionAddTodo(studentHistoryId, (success, error) => {
          if (success) {
            alert(t('t8th010'))
            onChangeExportMode('none')
          } else if (error) {
            try {
              const errorPayload = JSON.parse((error as any).message) as {
                message: string
              }
              alert(errorPayload.message)
            } catch (e) {
              alert('도서 추가 실패 Error')
            }
          } else {
            onChangeExportMode('none')
          }
        })
      } else if (exportMode === 'Favorite') {
        onActionAddFavorite((success, error) => {
          if (success) {
            alert(t('t8th011'))
            onChangeExportMode('none')
          } else if (error) {
            try {
              const errorPayload = JSON.parse((error as any).message) as {
                message: string
              }
              alert(errorPayload.message)
            } catch (e) {
              alert('Favorite 추가 실패 Error')
            }
          } else {
            onChangeExportMode('none')
          }
        })
      } else if (exportMode === 'BookList') {
        onActionBookList((success, url, error) => {
          if (success) {
            openWindow(url, {
              external: true,
              target: '_blank',
              feature: 'noopener, noreferrer',
            })
            onChangeExportMode('none')
          } else if (error) {
            alert(error)
          } else {
            onChangeExportMode('none')
          }
        })
      }
    }
  }

  const onExportItemClick = (item: ActionBarDropdownItem) => {
    if (isStudyEnd) {
      onStudyEndMessage()
      return
    }

    if (item.key !== 'ExportAllBooksList') {
      setExportMode(item.key.substring(6) as SearchBookExportType)
    }
  }

  // TODO: 학습이 가능한 경우에만 열리도록 하는 기능이 필요.
  const isStudyEnd = student?.data?.studyState?.isStudyEnd || false
  const onStudyEndMessage = () => {
    const message = student?.data?.studyState?.studyEndMessage || ''
    if (message) {
      alert(message)
    }
  }

  const searchCount = search.data?.book?.length || 0

  // 필터 선택 연동
  const currentGrade = GRADES.find(
    (item) => item.key === schoolSubjectSearch.grade,
  )
  const gradeOptions: SchoolSubjectOption = {
    current: currentGrade?.label || '',
    options: GRADES.map((item) => ({
      key: item.key,
      label: item.label,
    })),
    onChange: (value) => {
      setSchoolSubjectSearch({
        ...schoolSubjectSearch,
        grade: value.key,
        publisher: '',
        lesson: '',
      })
    },
  }
  const currentPublisher = publisherList?.data?.publishers?.find(
    (item) => item.publisherCode === schoolSubjectSearch.publisher,
  )
  const publisherOptions: SchoolSubjectOption = {
    current: currentPublisher?.publisher || '',
    options:
      publisherList?.data?.publishers?.map((item) => ({
        key: item.publisherCode,
        label: item.publisher,
      })) || [],
    onChange: (value) => {
      setSchoolSubjectSearch({
        ...schoolSubjectSearch,
        publisher: value.key,
        lesson: '',
      })
    },
  }
  const lessonList = currentPublisher?.maxLessons
    ? Array.from(
        { length: currentPublisher.maxLessons },
        (_, index) => index + 1,
      ).map((item) => ({
        key: item.toString(),
        label: `${item} ${'단원'}`,
      }))
    : []
  const lessonOptions: SchoolSubjectOption = {
    current:
      currentPublisher && schoolSubjectSearch.lesson
        ? `${schoolSubjectSearch.lesson} ${'단원'}`
        : '',
    options: lessonList,
    onChange: (value) => {
      setSchoolSubjectSearch({
        ...schoolSubjectSearch,
        lesson: value.key,
      })
      changeSchoolSubjectOption({
        grade: schoolSubjectSearch.grade,
        publisher: schoolSubjectSearch.publisher,
        lesson: value.key,
      })
      router.replace(
        `${SITE_PATH.STUDENT_8TH.EB_SCHOOL_SUBJECTS}?grade=${schoolSubjectSearch.grade}&publisher=${schoolSubjectSearch.publisher}&lesson=${value.key}`,
      )
    },
  }

  const onLessonInfoClick = () => {
    setLessonInfoModalOpen(true)
  }

  return (
    <>
      <SchoolSubjectSelectHeader
        grade={gradeOptions}
        publisher={publisherOptions}
        lesson={lessonOptions}
        lessonTitle={lessonInfo.data?.lessonInfo?.title}
        onLessonInfoClick={
          lessonInfo.data?.lessonInfo?.infoCount &&
          lessonInfo.data?.lessonInfo?.infoCount > 0
            ? onLessonInfoClick
            : undefined
        }
        actionBar={
          isOptionActive ? (
            <ActionBar
              count={searchCount}
              dropdowns={[
                {
                  title: t('t8th014'),
                  items: exportItems,
                  onItemClick: onExportItemClick,
                },
              ]}
              exportPanel={{
                isOpen: isExportMode,
                title: `${t('t8th014')} / ${exportItems.find((item) => item.key === `Export${exportMode}`)?.label || exportMode}`,
                count: selectedItemCount,
                onCancel: () => onChangeExportMode('none'),
                onConfirm: onConfirmExport,
              }}
            />
          ) : undefined
        }
      />
      {isOptionActive ? (
        <>
          {searchCount > 0 ? (
            <>
              <BookListStyle>
                {search.data?.book?.map((book) => (
                  <BookItem
                    key={book.levelRoundId}
                    title={book.topicTitle}
                    passCount={book.rgPointCount}
                    addYn={!book.addYn}
                    movieYn={!!book.animationPath}
                    point={book.getableRgPoint}
                    src={book.surfaceImagePath}
                    levelName={book.levelName}
                    recommendedAge={book.recommendedAge}
                    isCheckable={isExportMode}
                    isChecked={
                      isExportMode && isSelectedItem(book.levelRoundId)
                    }
                    onClick={() => {
                      if (isExportMode) {
                        const currentFlag = isSelectedItem(book.levelRoundId)
                        setSelectItemChange(
                          book.levelRoundId,
                          {
                            levelRoundId: book.levelRoundId,
                            isAddableYn: book.addYn,
                          },
                          !currentFlag,
                        )
                      } else {
                        if (isStudyEnd) {
                          onStudyEndMessage()
                        } else {
                          setBookInfo({
                            levelRoundId: book.levelRoundId,
                            surfaceImagePath: book.surfaceImagePath,
                            title: book.topicTitle,
                            bookCode: book.levelName,
                          })
                        }
                      }
                    }}
                  />
                ))}
              </BookListStyle>
              {bookInfo && (
                <BookInfoModal
                  onClickClose={() => {
                    setBookInfo(undefined)
                  }}
                  title={bookInfo.title}
                  bookCode={bookInfo.bookCode}
                  imgSrc={bookInfo.surfaceImagePath}
                  levelRoundId={bookInfo.levelRoundId}
                />
              )}
              {vocabularyOption && (
                <PrintVocabularyModal
                  onConfirm={onConfirmVocabularyOption}
                  onClickClose={() => setVocabularyOption(false)}
                />
              )}
              {isSelectStudentHistory && (
                <SelectStudentHistoryModal
                  studentHistoryList={
                    studentHistory.data?.list?.filter(
                      (item) => item.isBookWizard,
                    ) || []
                  }
                  onCloseModal={() => {
                    setSelectStudentHistory(false)
                  }}
                  onSelectStudentHistoryId={(studentHistoryId) => {
                    setSelectStudentHistory(false)
                    onConfirmExportWithStudentHistoryId(studentHistoryId)
                  }}
                />
              )}
            </>
          ) : (
            <BookListEmptyStateStyle>
              <p>{t('t8th009')}</p>
            </BookListEmptyStateStyle>
          )}
          {isLessonInfoModalOpen && !!lessonInfo.data?.lessonInfo && (
            <SchoolSubjectLessonInfoModal
              title={lessonInfo.data.lessonInfo.title}
              subject={lessonInfo.data.lessonInfo.subject}
              lessons={lessonInfo.data.lessonInfo.infos}
              onClickClose={() => setLessonInfoModalOpen(false)}
            />
          )}
        </>
      ) : (
        <>
          {/* 검색할 대상이 없을 경우 빈 상태 UI 표시 */}
          <SchoolSubjectChooseOptionInfo />
        </>
      )}
    </>
  )
}
