'use client'

import IframeResizeble from '@/8th/shared/ui/IframeResizeble'
import useTranslation from '@/localization/client/useTranslations'
import { useEffect } from 'react'

export type PolicyDocsId =
  | 'refund-policy'
  | 'privacy-policy-private'
  | 'privacy-policy-private-vn'
  | 'privacy-policy-school'
  | 'terms-policy'
  | 'terms-policy-vn'

const policyDocs: Record<PolicyDocsId, string> = {
  'refund-policy':
    '/src/html/page-contents/pc/rg-membership/membership_03_refund_policy.html',
  'privacy-policy-private':
    '/src/html/page-contents/pc/rg-membership/membership_05_privacy_policy.html',
  'privacy-policy-private-vn':
    '/src/html/page-contents/pc/rg-membership-vn/membership_05_privacy_policy.html',
  'privacy-policy-school':
    '/src/html/page-contents/pc/rg-membership/membership_06_school_privacy_policy.html',
  'terms-policy':
    '/src/html/page-contents/pc/rg-membership/membership_04_terms_of_use.html',
  'terms-policy-vn':
    '/src/html/page-contents/pc/rg-membership-vn/membership_04_terms_of_use.html',
}

export default function PolicyDocs({ id }: { id: PolicyDocsId }) {
  // @language 'common'
  const { t } = useTranslation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const url = policyDocs[id]
  const title = getTitle(id, t)

  return (
    <div className="board">
      <section>
        <h2 className="section-title">{title}</h2>
        <div className="refund-frame">
          <IframeResizeble
            fitContentHeight
            className="iframe-container"
            src={url}
          />
        </div>
      </section>
    </div>
  )
}
function getTitle(id: PolicyDocsId, t: (key: string) => string): string {
  switch (id) {
    case 'refund-policy':
      return t('t8th0192')
    case 'privacy-policy-private':
    case 'privacy-policy-private-vn':
    case 'privacy-policy-school':
      return t('t8th0350')
    case 'terms-policy':
    case 'terms-policy-vn':
      return t('t8th0033')
    default:
      return 'Document'
  }
}
