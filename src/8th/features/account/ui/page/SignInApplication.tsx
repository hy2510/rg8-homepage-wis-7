'use client'

import {
  useChangeCustomerId,
  useCustomerInfo,
} from '@/8th/application/context/CustomerContext'
import { useAccountNavigationBack } from '@/8th/features/account/ui/component/AccountNavigation'
import { useSearchCustomer } from '@/8th/features/customer/service/customer-query'
import useTranslation from '@/localization/client/useTranslations'
import { useState } from 'react'
import AddAccountSelectType from '../component/AddAccountSelectType'
import SearchCustomers from '../component/SearchCustomers'
import SelectNation from '../component/SelectNation'
import SignInAcademy from './SignInAcademy'
import SignInPrivate from './SignInPrivate'
import SignInSchool from './SignInSchool'

const COUNTRY_ORDER = ['KR', 'VN']
function getNationLabel(countryCode: string, customerName: string) {
  if (customerName.toLowerCase() === 'other') {
    return 'Other Countries'
  }
  if (countryCode === 'KR') {
    return '대한민국'
  } else if (countryCode === 'ID') {
    return 'Indonesia'
  } else if (countryCode === 'VN') {
    return 'Việt Nam'
  }
  return ''
}

function getCustomerType(
  customerUseCode?: string,
): 'Private' | 'Academy' | 'School' | undefined {
  if (!customerUseCode) {
    return undefined
  }
  switch (customerUseCode) {
    case '008001':
    case '008002':
      return 'Academy'
    case '008003':
    case '008004':
      return 'School'
  }
  return 'Private'
}

export default function SignInApplication() {
  const [view, setView] = useState<'none' | 'nation' | 'group'>('none')

  const customerId = useCustomerInfo().customerId
  const changeCustomerId = useChangeCustomerId()
  const isSignInAvailable = customerId !== ''

  if (view === 'none') {
    return <SelectCustomerType onSelect={(type) => setView(type)} />
  } else if (view === 'nation') {
    return (
      <NationSearch
        isSignInAvailable={isSignInAvailable}
        onSelectCustomer={(customerId) => changeCustomerId(customerId)}
        onCancel={() => setView('none')}
      />
    )
  } else if (view === 'group') {
    return (
      <GroupSearch
        isSignInAvailable={isSignInAvailable}
        onSelectCustomer={(customerId) => changeCustomerId(customerId)}
        onCancel={() => setView('none')}
      />
    )
  }
  return null
}

function SelectCustomerType({
  onSelect,
}: {
  onSelect: (type: 'nation' | 'group') => void
}) {
  return <AddAccountSelectType onSelect={onSelect} />
}

function NationSearch({
  isSignInAvailable,
  onSelectCustomer,
  onCancel,
}: {
  isSignInAvailable: boolean
  onSelectCustomer: (customerId: string) => void
  onCancel: () => void
}) {
  // @language 'common'
  const { t } = useTranslation()

  const handleBack = () => {
    if (!selectNation) {
      onCancel()
    } else {
      setSelectNation(null)
    }
  }
  useAccountNavigationBack('nation-search', handleBack)

  const [selectNation, setSelectNation] = useState<{
    customerId: string
    name: string
    customerUseCode: string
  } | null>(null)

  const { data: customers } = useSearchCustomer({
    type: 'Private',
  })
  const orderCustomers = []
  if (customers && customers.customers?.length > 0) {
    orderCustomers.push(
      ...[...customers.customers].sort((a, b) => {
        const aIndex = COUNTRY_ORDER.indexOf(a.countryCode)
        const bIndex = COUNTRY_ORDER.indexOf(b.countryCode)

        return (
          (aIndex === -1 ? Infinity : aIndex) -
          (bIndex === -1 ? Infinity : bIndex)
        )
      }),
    )
    const krCountry = orderCustomers.find((item) => item.countryCode === 'KR')
    if (krCountry) {
      orderCustomers.push({ ...krCountry, name: 'Other' })
    }
  }
  const handleSelectNation = (nation: {
    customerId: string
    name: string
    customerUseCode: string
  }) => {
    onSelectCustomer(nation.customerId)
    setSelectNation(nation)
  }

  const isSignInPrivate = isSignInAvailable && !!selectNation

  return (
    <>
      {isSignInPrivate ? (
        <SignInPrivate />
      ) : (
        <SelectNation
          nationCustomers={orderCustomers.map((customer) => ({
            customerId: customer.customerId,
            name: customer.name,
            label: getNationLabel(customer.countryCode, customer.name),
            customerUseCode: customer.customerUseCode,
          }))}
          onSelect={handleSelectNation}
        />
      )}
    </>
  )
}

function GroupSearch({
  isSignInAvailable,
  onSelectCustomer,
  onCancel,
}: {
  isSignInAvailable: boolean
  onSelectCustomer: (customerId: string) => void
  onCancel: () => void
}) {
  // @language 'common'
  const { t } = useTranslation()

  const handleBack = () => {
    if (!selectCustomer) {
      onCancel()
    } else {
      setSelectCustomer(null)
    }
  }
  useAccountNavigationBack('group-search', handleBack)

  const [selectCustomer, setSelectCustomer] = useState<{
    customerId: string
    name: string
    customerUseCode: string
  } | null>(null)

  const [searchKeyword, setSearchKeyword] = useState<string>('')
  const searchCustomer = useSearchCustomer(
    {
      keyword: searchKeyword,
    },
    {
      enabled: !!searchKeyword,
    },
  )

  const isSearching = searchCustomer.isFetching || searchCustomer.isLoading
  const customers = searchCustomer.data?.customers || []
  const selectedCustomerType = getCustomerType(selectCustomer?.customerUseCode)

  return (
    <>
      {isSignInAvailable && selectCustomer && selectedCustomerType ? (
        selectedCustomerType === 'School' ? (
          <SignInSchool />
        ) : (
          <SignInAcademy />
        )
      ) : (
        <SearchCustomers
          searchKeyword={searchKeyword}
          isSearching={isSearching}
          isEmpty={!isSearching && !!searchKeyword && customers.length === 0}
          customers={customers}
          onSearch={(keyword) => {
            setSearchKeyword(keyword)
          }}
          onSelect={(customer) => {
            onSelectCustomer(customer.customerId)
            setSelectCustomer(customer)
          }}
        />
      )}
    </>
  )
}
