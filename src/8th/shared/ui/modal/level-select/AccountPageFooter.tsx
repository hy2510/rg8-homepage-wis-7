'use client'

import { AccountPageFooterStyle } from '@/8th/shared/styled/SharedStyled'
import SITE_PATH, { CUSTOMER_CENTER_URL } from '@/app/site-path'
import Link from 'next/link'

const DEFAULT_FOOTER_LINKS: FooterLink[] = [
  { id: 'about', label: '회사소개', href: SITE_PATH.HOME.MAIN },
  {
    id: 'terms',
    label: '이용 약관',
    href: SITE_PATH.HOME.MEMBERSHIP_SERVICE_TERM,
  },
  {
    id: 'privacy',
    label: '개인정보 처리방침',
    href: SITE_PATH.HOME.MEMBERSHIP_PRIVACY_POLICY,
  },
  {
    id: 'customer-center',
    label: '고객센터',
    href: CUSTOMER_CENTER_URL.private,
    external: true,
  },
  {
    id: 'institution',
    label: 'B2B',
    href: 'https://util.readinggate.com/Community/BringInInstitution',
    external: true,
  },
]

type FooterLink = {
  id: string
  label: string
  href: string
  external?: boolean
}
export default function AccountPageFooter({
  links = DEFAULT_FOOTER_LINKS,
  copyrightI18nKey: copyright = '© Reading Gate. All rights reserved.',
}: {
  links?: FooterLink[]
  copyrightI18nKey?: string
}) {
  return (
    <AccountPageFooterStyle>
      <div className="footer-links">
        {links.map((link) =>
          link.external ? (
            <a
              key={link.id}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer">
              {link.label}
            </a>
          ) : (
            <Link key={link.id} href={link.href}>
              {link.label}
            </Link>
          ),
        )}
      </div>
      {copyright && <div className="copyright">{copyright}</div>}
    </AccountPageFooterStyle>
  )
}
