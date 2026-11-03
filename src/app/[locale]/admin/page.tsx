'use client'

import styles from './signin.module.css'
import { useRouter } from 'next/navigation'
import { type FormEvent, useEffect, useState } from 'react'

type Host = {
  CountryCode: string
  CustomerId: string
  CustomerUseCode: string
  HomepageUrl: string
  LogoFilename: string
  Name: string
  UseStudentNoYn: boolean
  token: string
}

const STORAGE_KEY = 'signin-host'

// 메인: 단계 관리
export default function LoginPage() {
  const [host, setHost] = useState<Host | null>(null)
  const [step, setStep] = useState<1 | 2>(1)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)

      if (saved) {
        const value = JSON.parse(saved)

        if (typeof value?.name === 'string' && typeof value?.url === 'string') {
          setHost(value)
          setStep(2)
        }
      }
    } catch {
      // 저장된 값이 없거나 잘못된 경우 Step 1부터 시작
    } finally {
      setInitialized(true)
    }
  }, [])

  const handleSelectHost = (selected: Host) => {
    setHost(selected)
    setStep(2)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selected))
  }

  return (
    <main className={styles.container}>
      <section className={styles.card}>
        {!initialized ? (
          <p className={styles.notice}>고객사 정보를 확인하는 중...</p>
        ) : step === 1 || !host ? (
          <HostSearchStep
            previousHost={host}
            onSelect={handleSelectHost}
            onBack={() => setStep(2)}
          />
        ) : (
          <SignInStep host={host} onChangeHost={() => setStep(1)} />
        )}
      </section>
    </main>
  )
}

// Step 1: Host 검색 및 선택
function HostSearchStep({
  previousHost,
  onSelect,
  onBack,
}: {
  previousHost: Host | null
  onSelect: (host: Host) => void
  onBack: () => void
}) {
  const [keyword, setKeyword] = useState('')
  const [results, setResults] = useState<Host[] | null>(null)

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const query = keyword.trim().toLowerCase()

    const fetchHosts = async (keyword: string) => {
      const response = await fetch(`/api/customer/search?keyword=${keyword}`)
      const data = await response.json()
      setResults(data.Customers)
    }
    fetchHosts(query)
  }

  return (
    <>
      <header className={styles.header}>
        <h1>고객사 검색</h1>
        <p>접속할 고객사를 검색하고 선택하세요.</p>
      </header>

      <form className={styles.form} onSubmit={handleSearch}>
        <div className={styles.field}>
          <label htmlFor="keyword">고객사 검색</label>

          <div className={styles.searchRow}>
            <input
              id="keyword"
              type="search"
              placeholder="학교 또는 학원"
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value)
                setResults(null)
              }}
              required
            />

            <button type="submit" className={styles.searchButton}>
              검색
            </button>
          </div>
        </div>
      </form>

      {results !== null && (
        <div className={styles.results}>
          <div className={styles.resultsHeader}>
            <span>검색 결과</span>
            <span>{results.length}건</span>
          </div>

          {results.length > 0 ? (
            results.map((item) => (
              <button
                key={item.HomepageUrl}
                type="button"
                className={styles.resultItem}
                onClick={() => onSelect(item)}>
                <span className={styles.hostInfo}>
                  <strong>{item.Name}</strong>
                  <small>{item.HomepageUrl}</small>
                </span>
                <span className={styles.resultArrow}>{`›`}</span>
              </button>
            ))
          ) : (
            <p className={styles.notice}>
              검색 결과가 없습니다.
              <br />
              다른 키워드로 검색해주세요.
            </p>
          )}
        </div>
      )}

      {previousHost && (
        <button type="button" className={styles.backButton} onClick={onBack}>
          이전에 선택한 서비스로 돌아가기
        </button>
      )}
    </>
  )
}

// Step 2: 계정 로그인
function SignInStep({
  host,
  onChangeHost,
}: {
  host: Host
  onChangeHost: () => void
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const form = new FormData(e.currentTarget)
    const id = String(form.get('id') ?? '').trim()
    const password = String(form.get('password') ?? '')

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/account/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Customer: host.token,
        },
        body: JSON.stringify({
          id,
          password,
          deviceType: 'web',
          t: 'all',
        }),
      })

      if (!response.ok) {
        throw new Error('로그인에 실패했습니다.')
      }
      router.replace('/')
    } catch (err) {
      setError(
        err instanceof Error ? err.message : '로그인 오류가 발생했습니다.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <header className={styles.header}>
        <h1>로그인</h1>
        <p>계정 정보를 입력하세요.</p>
      </header>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.selectedHost}>
          <div className={styles.hostInfo}>
            <strong>{host.Name}</strong>
            <small>{host.HomepageUrl}</small>
          </div>

          <button
            type="button"
            className={styles.changeButton}
            onClick={onChangeHost}>
            변경
          </button>
        </div>

        <div className={styles.field}>
          <label htmlFor="id">ID</label>
          <input
            id="id"
            name="id"
            type="text"
            placeholder="아이디를 입력하세요"
            autoComplete="username"
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="비밀번호를 입력하세요"
            autoComplete="current-password"
            required
          />
        </div>

        {error && (
          <p className={styles.errorMessage} role="alert">
            {error}
          </p>
        )}

        <button className={styles.loginButton} type="submit" disabled={loading}>
          {loading ? '로그인 중...' : '로그인'}
        </button>
      </form>
    </>
  )
}
