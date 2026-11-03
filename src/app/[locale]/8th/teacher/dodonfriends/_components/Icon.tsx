import type React from 'react'

type IconName =
  | 'book'
  | 'folder'
  | 'curriculum'
  | 'search'
  | 'arrow'
  | 'close'
  | 'info'
export default function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    book: (
      <>
        <path d="M4 3h12l4 4v14H4zM15 3v5h5M8 12h8M8 16h5" />
      </>
    ),
    folder: <path d="M3 6h7l2 3h9v11H3zM3 6V4h7l2 2h8v3" />,
    curriculum: (
      <>
        <rect x="8" y="2" width="8" height="5" rx="1" />
        <rect x="2" y="17" width="7" height="5" rx="1" />
        <rect x="15" y="17" width="7" height="5" rx="1" />
        <path d="M12 7v5M5.5 17v-5h13v5" />
      </>
    ),
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 5 5" />
      </>
    ),
    arrow: <path d="m9 5 7 7-7 7" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v6M12 7v1" />
      </>
    ),
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}

