'use client'

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <div role="alert"><p>We couldn’t load the lessons. Please try again.</p><button onClick={reset}>Try Again</button></div>
}
