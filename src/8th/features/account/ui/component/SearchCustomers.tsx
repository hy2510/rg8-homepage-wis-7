'use client'

import { Assets } from '@/8th/assets/asset-library'
import { Gap } from '@/8th/shared/ui/Misc'
import useTranslation from '@/localization/client/useTranslations'
import Image from 'next/image'
import { useState } from 'react'

export default function SearchCustomers({
  searchKeyword,
  isSearching,
  isEmpty,
  customers,
  onSearch,
  onSelect,
}: {
  searchKeyword: string
  isSearching: boolean
  isEmpty: boolean
  customers: { customerId: string; name: string; customerUseCode: string }[]
  onSearch: (keyword: string) => void
  onSelect: (customer: {
    customerId: string
    name: string
    customerUseCode: string
  }) => void
}) {
  // @language 'common'
  const { t } = useTranslation()

  const [keyword, setKeyword] = useState(searchKeyword)

  const handleSearch = () => {
    onSearch(keyword)
  }

  return (
    <>
      <div className="body is-group">
        <h1>{t('t8th0070')}</h1>
        <div className="group-box">
          <p>{t('t8th0071')}</p>
          <div className="group-field">
            <input
              type="search"
              value={keyword}
              onChange={(event) => {
                setKeyword(event.target.value)
              }}
              onKeyDown={(event) => {
                if (event.key !== 'Enter') return
                event.preventDefault()
                handleSearch()
              }}
              placeholder={t('t8th0072')}
              aria-label={t('t8th0072')}
            />
            <button
              type="button"
              className="group-search-button"
              aria-label={t('t8th0073')}
              disabled={keyword.length === 0 || isSearching}
              onClick={handleSearch}>
              <Image
                src={Assets.Icon.searchBlack}
                alt=""
                width={20}
                height={20}
              />
            </button>
          </div>
        </div>

        {!isSearching && isEmpty && (
          <p className="group-empty">{t('t8th0074')}</p>
        )}
        {customers.length > 0 && (
          <div className="group-schools">
            {customers.map((customer) => (
              <button
                type="button"
                className="group-school"
                key={customer.customerId}
                onClick={() => onSelect(customer)}>
                {customer.name}
              </button>
            ))}
          </div>
        )}
      </div>
      <Gap size={60} />
    </>
  )
}
