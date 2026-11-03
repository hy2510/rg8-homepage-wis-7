import Link from 'next/link'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type NextLinkProps = ComponentPropsWithoutRef<typeof Link>

type ConditionalLinkProps = Omit<NextLinkProps, 'href' | 'children'> & {
  href?: NextLinkProps['href']
  children: ReactNode
}

// 조건부 링크 삽입 컴포넌트. 링크가 존재하는 경우 링크를 삽입한다.
export function ConditionalLink({
  href,
  children,
  ...linkProps
}: ConditionalLinkProps) {
  if (!href) {
    return <>{children}</>
  }
  return (
    <Link href={href} {...linkProps}>
      {children}
    </Link>
  )
}
