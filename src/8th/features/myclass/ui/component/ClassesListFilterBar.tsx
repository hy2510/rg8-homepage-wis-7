'use client'

import { useIsPhone } from '@/8th/application/context/ScreenModeContext'
import ActionBar, {
  ActionBarDropdown,
  type ActionBarDropdownProps,
} from '@/8th/shared/ui/ActionBar'
import useTranslation from '@/localization/client/useTranslations'

type FilterOption = 'lesson' | 'booksOnly'

type Props = {
  value: FilterOption
  onChange: (value: FilterOption) => void
  totalCount: number
  summaryTitle?: string
  dropdowns?: ActionBarDropdownProps[]
}

export default function ClassesListFilterBar({
  value,
  onChange,
  totalCount,
  summaryTitle = 'ALL',
  dropdowns,
}: Props) {
  // @Language 'common'
  const { t } = useTranslation()

  const isPhone = useIsPhone()

  const lessonFilterOptions: { value: FilterOption; label: string }[] = [
    { value: 'lesson', label: t('t8thdf014') },
    { value: 'booksOnly', label: t('t8thdf015') },
  ]

  const showFooter = value === 'lesson'

  return (
    <ActionBar
      body={
        <div
          className="cl-filter-options"
          role="radiogroup"
          aria-label="Lesson filter">
          {lessonFilterOptions.map(({ value: optionValue, label }) => {
            const active = value === optionValue
            return (
              <label
                key={optionValue}
                className="cl-filter-option"
                data-active={active}
                role="radio"
                aria-checked={active}>
                <input
                  type="radio"
                  className="cl-filter-radio"
                  name="classes-list-filter"
                  checked={active}
                  onChange={() => onChange(optionValue)}
                />
                <span className="cl-filter-dot" aria-hidden />
                <span className="cl-filter-label">{label}</span>
              </label>
            )
          })}
        </div>
      }
      footer={
        showFooter ? (
          <div className="cl-filter-footer">
            <div className="cl-filter-summary">
              <span className="cl-filter-summary-title">{summaryTitle}</span>
              {totalCount >= 0 && (
                <span className="cl-filter-summary-count">({totalCount})</span>
              )}
            </div>
            {dropdowns && dropdowns.length > 0 && (
              <div className="cl-filter-dropdowns">
                {dropdowns.map((dropdown, i) => (
                  <ActionBarDropdown
                    key={`${dropdown.title}-${i}`}
                    title={dropdown.title}
                    position={isPhone ? (i > 1 ? 'right' : 'left') : undefined}
                    items={dropdown.items}
                    isActiveMakerVisible={dropdown.isActiveMakerVisible}
                    onItemClick={dropdown.onItemClick}
                  />
                ))}
              </div>
            )}
          </div>
        ) : undefined
      }
    />
  )
}
