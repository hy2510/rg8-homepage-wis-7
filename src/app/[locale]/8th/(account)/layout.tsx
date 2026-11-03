import { GuardGuestOnly } from '@/8th/shared/auth/GuardAuth'
import {
  HpAccountSelectStyled,
  HpBaseStyled,
} from '@/8th/shared/styled/HpFeaturesStyled'
import SITE_PATH from '@/app/site-path'
import React from 'react'

export default function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <main>
      <GuardGuestOnly redirectTo={SITE_PATH.ACCOUNT_8TH.FORWARDER}>
        <HpBaseStyled>
          <HpAccountSelectStyled>{children}</HpAccountSelectStyled>
        </HpBaseStyled>
      </GuardGuestOnly>
    </main>
  )
}
