'use client'

import { LibraryFinderTabBarStyle } from '@/8th/shared/styled/FeaturesStyled'
import Link from 'next/link'

export default function LibraryTabBar({
  items,
  tabLine,
  overrideClick,
}: {
  items: { href: string; active: boolean; label: string }[]
  tabLine?: 'none'
  overrideClick?: (item: {
    href: string
    active: boolean
    label: string
  }) => void
}) {
  return (
    <LibraryFinderTabBarStyle tabLine={tabLine}>
      <div className="tabs">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`tab ${item.active ? 'active' : 'inactive'}`}
            aria-current={item.active ? 'page' : undefined}
            scroll={false}
            onClick={
              overrideClick
                ? (e) => {
                    e.preventDefault()
                    overrideClick(item)
                  }
                : undefined
            }>
            {item.label}
          </Link>
        ))}
      </div>
    </LibraryFinderTabBarStyle>
  )
}
