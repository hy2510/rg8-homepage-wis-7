'use client'

import { LibraryFinderTabBarStyle } from '@/8th/shared/styled/FeaturesStyled'

type Props = {
  units: {
    key: string
    label: string
  }[]
  activeUnit: string
  onUnitChange: (unit: { key: string; label: string }) => void
}

export default function ClassesListUnitTabs({
  units,
  activeUnit,
  onUnitChange,
}: Props) {
  return (
    <LibraryFinderTabBarStyle role="tablist" aria-label="Unit">
      <div className="tabs">
        {units.map((u) => {
          const active = activeUnit === u.key
          return (
            <button
              key={u.key}
              type="button"
              role="tab"
              aria-selected={active}
              className={`tab ${active ? 'active' : 'inactive'}`}
              onClick={() => onUnitChange(u)}>
              {u.label}
            </button>
          )
        })}
      </div>
    </LibraryFinderTabBarStyle>
  )
}
