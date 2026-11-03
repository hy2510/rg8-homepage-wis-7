'use client'

import { Assets } from '@/8th/assets/asset-library'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import LanguageSelect from './LanguageSelect'

type AccountNavigationContextValue = {
  subscribe: (id: string, listener: () => void) => void
  unsubscribe: (id: string) => void
  showBack: () => void
  hideBack: () => void
}

const AccountNavigationContext = createContext<
  AccountNavigationContextValue | undefined
>(undefined)

export default function AccountNav({
  children,
  onBack,
  locale,
  languages,
  onSelectLanguage,
}: {
  children?: React.ReactNode
  onBack?: () => void
  locale: string
  languages: { code: string; label: string }[]
  onSelectLanguage?: (locale: string) => void
}) {
  const [isBackVisible, setIsBackVisible] = useState(true)
  const router = useRouter()
  const listenersRef = useRef(new Map<string, () => void>())

  const subscribe = useCallback((id: string, listener: () => void) => {
    if (listenersRef.current.has(id)) {
      throw new Error(`Already subscribed: ${id}`)
    }
    listenersRef.current.set(id, listener)
  }, [])

  const unsubscribe = useCallback((id: string) => {
    listenersRef.current.delete(id)
  }, [])

  const handleBack = () => {
    const ids = Array.from(listenersRef.current.keys())
    const lastId = ids.at(-1)
    if (!lastId) {
      if (onBack) {
        onBack()
        return
      }
      router.back()
      return
    }
    listenersRef.current.get(lastId)?.()
  }

  const navigation = useMemo(
    () => ({ subscribe, unsubscribe }),
    [subscribe, unsubscribe],
  )
  const showBack = useCallback(() => {
    setIsBackVisible(true)
  }, [])
  const hideBack = useCallback(() => {
    setIsBackVisible(false)
  }, [])

  return (
    <AccountNavigationContext.Provider
      value={{ ...navigation, showBack, hideBack }}>
      <header className="chrome">
        {isBackVisible ? (
          <button
            type="button"
            className="home-button"
            aria-label="Home"
            onClick={handleBack}>
            <Image
              src={Assets.Icon.arrowLeftBlack}
              alt=""
              width={28}
              height={28}
            />
          </button>
        ) : (
          <div></div>
        )}
        <LanguageSelect
          locale={locale}
          languages={languages}
          onSelectLanguage={onSelectLanguage}
        />
      </header>
      {children}
    </AccountNavigationContext.Provider>
  )
}

export function useAccountNavigationBack(id: string, onBack: () => void) {
  const navigation = useContext(AccountNavigationContext)
  const onBackRef = useRef(onBack)
  onBackRef.current = onBack

  useLayoutEffect(() => {
    if (!navigation) return
    navigation.subscribe(id, () => {
      onBackRef.current()
    })
    return () => navigation.unsubscribe(id)
  }, [navigation, id])

  if (!navigation) {
    throw new Error('useAccountNavigationBack must be used within AccountNav')
  }
}

export function useAccountNavigationVisibleController() {
  const navigation = useContext(AccountNavigationContext)
  if (!navigation) {
    throw new Error(
      'useAccountNavigationVisibleController must be used within AccountNav',
    )
  }
  return {
    show: () => {
      navigation.showBack()
    },
    hide: () => {
      navigation.hideBack()
    },
  }
}
