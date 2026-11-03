'use client'

export default function ResourcesError({ reset }: { reset: () => void }) {
  return <section role="alert" style={{ padding: 40, textAlign: 'center' }}><h1>Resources</h1><p>자료를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p><button type="button" onClick={reset}>다시 시도</button></section>
}
