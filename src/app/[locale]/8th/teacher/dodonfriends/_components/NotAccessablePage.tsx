'use client'

import { useRouter } from 'next/navigation'

const copy = {
  code: '403',
  status: 'Forbidden',
  title: 'Access denied',
  message: 'You are not authorized to access this page.',
  home: 'Home',
}

export default function NotAccessablePage() {
  const router = useRouter()

  return (
    <main className="dnf-denied">
      <style>{styles}</style>
      <section className="dnf-denied-panel" aria-labelledby="access-denied-title">
        <p className="dnf-denied-code">
          {copy.code}
          <span>{copy.status}</span>
        </p>
        <h1 id="access-denied-title">{copy.title}</h1>
        <p className="dnf-denied-message">{copy.message}</p>
        <button
          type="button"
          onClick={() => {
            router.replace('/')
          }}>
          {copy.home}
        </button>
      </section>
    </main>
  )
}

const styles = `
.dnf-denied {
  display: grid;
  place-items: center;
  min-height: 100vh;
  margin: 0;
  padding: 32px 20px;
  background: #e6e8ec;
  color: #1b1f24;
}
.dnf-denied,
.dnf-denied * {
  font-family: "Segoe UI", ui-sans-serif, system-ui, -apple-system, sans-serif;
}
.dnf-denied-panel {
  width: min(420px, 100%);
  padding: 36px 32px 28px;
  border: 1px solid #c5cad1;
  border-top: 4px solid #9f1d2c;
  border-radius: 2px;
  background: #fff;
  text-align: left;
}
.dnf-denied-code {
  margin: 0;
  color: #9f1d2c;
  font-size: 40px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.03em;
}
.dnf-denied-code span {
  display: block;
  margin-top: 8px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.dnf-denied h1 {
  margin: 20px 0 0;
  font-size: 22px;
  line-height: 1.3;
}
.dnf-denied-message {
  margin: 10px 0 0;
  color: #3c4450;
  font-size: 15px;
  line-height: 1.5;
}
.dnf-denied button {
  margin-top: 24px;
  min-width: 96px;
  height: 40px;
  padding: 0 16px;
  border: 1px solid #1b1f24;
  border-radius: 2px;
  background: #1b1f24;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.04em;
  cursor: pointer;
}
.dnf-denied button:hover {
  background: #000;
}
.dnf-denied button:focus-visible {
  outline: 2px solid #1b1f24;
  outline-offset: 3px;
}
`
