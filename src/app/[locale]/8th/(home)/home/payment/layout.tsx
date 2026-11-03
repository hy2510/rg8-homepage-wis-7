import PaymentLayout from '@/8th/features/payment/ui/page/PaymentLayout'
import React from 'react'

export default function Layout({ children }: { children?: React.ReactNode }) {
  return <PaymentLayout>{children}</PaymentLayout>
}
