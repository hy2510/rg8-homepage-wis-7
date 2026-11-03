'use client'

import { Assets } from '@/8th/assets/asset-library'
import { SearchBarStyle } from '@/8th/shared/styled/FeaturesStyled'
import { BoxStyle } from '@/8th/shared/ui/Misc'
import useTranslation from '@/localization/client/useTranslations'
import Image from 'next/image'
import { useState } from 'react'

export default function SearchBar({
  defaultValue,
  onSearch,
}: {
  defaultValue?: string
  onSearch?: (keyword: string) => void
}) {
  // @Language 'common'
  const { t } = useTranslation()

  const [searchKeyword, setSearchKeyword] = useState(defaultValue || '')

  const handleSearch = () => {
    const keyword = encodeURIComponent(searchKeyword.trim())
    if (onSearch) {
      onSearch(keyword)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <SearchBarStyle>
      {/* 
      검색 선택 옵션 제거
      <BoxStyle className="search-option">
        <TextStyle fontSize="medium" fontColor="secondary">
          Title
        </TextStyle>
        <Image
          src={Assets.Icon.chevronDownGraySmall}
          alt="search-bar-icon"
          width={14}
          height={14}
        />
      </BoxStyle> 
      */}
      <BoxStyle display="flex" gap={10}>
        <BoxStyle className="search-input">
          <input
            type="text"
            placeholder={t('t8th001')}
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={handleKeyPress}
          />
        </BoxStyle>
        <button className="search-button" onClick={handleSearch}>
          <Image
            src={Assets.Icon.searchBlack}
            alt="search"
            width={20}
            height={20}
          />
        </button>
      </BoxStyle>
    </SearchBarStyle>
  )
}
