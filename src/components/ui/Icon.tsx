import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement> & { size?: number }

function Base({ size = 20, children, ...rest }: P & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  )
}

export const IconArrowRight = (p: P) => (
  <Base {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Base>
)
export const IconArrowUpRight = (p: P) => (
  <Base {...p}>
    <path d="M7 17 17 7M8 7h9v9" />
  </Base>
)
export const IconArrowDown = (p: P) => (
  <Base {...p}>
    <path d="M12 5v14M6 13l6 6 6-6" />
  </Base>
)
export const IconPlus = (p: P) => (
  <Base {...p}>
    <path d="M12 5v14M5 12h14" />
  </Base>
)
export const IconMinus = (p: P) => (
  <Base {...p}>
    <path d="M5 12h14" />
  </Base>
)
export const IconCheck = (p: P) => (
  <Base {...p}>
    <path d="m5 12.5 4.2 4.2L19 7" />
  </Base>
)
export const IconSparkle = (p: P) => (
  <Base {...p}>
    <path d="M12 3c.6 4.2 2.8 6.4 7 7-4.2.6-6.4 2.8-7 7-.6-4.2-2.8-6.4-7-7 4.2-.6 6.4-2.8 7-7Z" />
  </Base>
)
export const IconTelegram = (p: P) => (
  <Base {...p}>
    <path d="M21 4 3 11l6.5 2.3L18 7.5l-6.4 7.2L17 20l4-16Z" />
  </Base>
)
export const IconCopy = (p: P) => (
  <Base {...p}>
    <rect x="8" y="8" width="12" height="12" rx="3" />
    <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
  </Base>
)
export const IconLink = (p: P) => (
  <Base {...p}>
    <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
    <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
  </Base>
)
export const IconRefresh = (p: P) => (
  <Base {...p}>
    <path d="M20 11a8 8 0 0 0-14.6-4.5L4 8M4 4v4h4M4 13a8 8 0 0 0 14.6 4.5L20 16M20 20v-4h-4" />
  </Base>
)
export const IconMenu = (p: P) => (
  <Base {...p}>
    <path d="M4 8h16M4 16h16" />
  </Base>
)
export const IconClose = (p: P) => (
  <Base {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Base>
)
export const IconCoin = (p: P) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="8" />
    <path d="M14.5 9.2c-.5-.8-1.4-1.2-2.5-1.2-1.6 0-2.6.8-2.6 1.9 0 2.7 5.3 1.5 5.3 4.3 0 1.1-1.1 1.9-2.7 1.9-1.2 0-2.2-.5-2.7-1.4M12 6.5V8M12 16v1.5" />
  </Base>
)
export const IconHeart = (p: P) => (
  <Base {...p}>
    <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20Z" />
  </Base>
)
export const IconCompass = (p: P) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="m15.5 8.5-2.2 4.8-4.8 2.2 2.2-4.8 4.8-2.2Z" />
  </Base>
)
export const IconCalendar = (p: P) => (
  <Base {...p}>
    <rect x="4" y="5.5" width="16" height="14.5" rx="3" />
    <path d="M8 3.5v4M16 3.5v4M4 10h16" />
  </Base>
)
export const IconOctagram = (p: P) => (
  <Base {...p}>
    <path d="M12 2.8 21.2 12 12 21.2 2.8 12Z" />
    <rect x="5.5" y="5.5" width="13" height="13" />
    <circle cx="12" cy="12" r="1.6" />
  </Base>
)
export const IconMoon = (p: P) => (
  <Base {...p}>
    <path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5Z" />
  </Base>
)
export const IconSun = (p: P) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
  </Base>
)
export const IconWave = (p: P) => (
  <Base {...p}>
    <path d="M3 17c3 0 3-10 6-10s3 10 6 10 3-6 6-6" />
  </Base>
)

/** Символ для каждого личного года 1–9 */
export function YearGlyph({ n, size = 28, ...rest }: P & { n: number }) {
  const paths: Record<number, React.ReactNode> = {
    1: <path d="M12 21V10M12 13c0-4 3-6 7-6 0 4-3 6-7 6ZM12 15c0-3-2.4-4.8-6-4.8 0 3 2.4 4.8 6 4.8Z" />,
    2: (
      <>
        <circle cx="9" cy="12" r="5" />
        <circle cx="15" cy="12" r="5" />
      </>
    ),
    3: <path d="M12 4 20 19H4L12 4ZM12 10l3.5 6h-7L12 10Z" />,
    4: (
      <>
        <rect x="4.5" y="4.5" width="15" height="15" rx="1.5" />
        <path d="M4.5 12h15M12 4.5v15" />
      </>
    ),
    5: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="m15.5 8.5-2.2 4.8-4.8 2.2 2.2-4.8 4.8-2.2Z" />
      </>
    ),
    6: <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20Z" />,
    7: (
      <>
        <circle cx="10.5" cy="10.5" r="6" />
        <path d="m15 15 5 5M10.5 7.5v6M7.5 10.5h6" />
      </>
    ),
    8: <path d="M4 18h16M5 18 4 7l4.5 4L12 5l3.5 6L20 7l-1 11" />,
    9: <path d="M19 5C9 5 5 10 5 19c9 0 14-4 14-14ZM5 19 13 11" />,
  }
  return <Base size={size} {...rest}>{paths[n]}</Base>
}
