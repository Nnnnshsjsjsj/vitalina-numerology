import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { setSpotlight } from '@/lib/motion'
import { ARCANA, ROMAN } from '@/data/content'

export function Block({ children, className, tone = 'default' }: { children: ReactNode; className?: string; tone?: 'default' | 'good' | 'bad' | 'gold' }) {
  return (
    <div
      className={cn(
        'card p-6 sm:p-8',
        tone === 'good' && 'border-ok/25 bg-[linear-gradient(180deg,rgb(143_224_180/0.08),rgb(143_224_180/0.02))]',
        tone === 'bad' && 'border-bad/25 bg-[linear-gradient(180deg,rgb(255_143_160/0.08),rgb(255_143_160/0.02))]',
        tone === 'gold' && 'border-gold/30 bg-[linear-gradient(180deg,rgb(233_201_149/0.09),rgb(233_201_149/0.02))]',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function BlockTitle({ title, sub, icon }: { title: string; sub?: string; icon?: ReactNode }) {
  return (
    <div className="mb-5">
      <h3 className="flex items-center gap-3 font-display text-[clamp(24px,2.4vw,30px)] leading-tight font-medium text-ink">
        {icon ? <span className="grid size-9 place-items-center rounded-full bg-wine text-blush">{icon}</span> : null}
        {title}
      </h3>
      {sub ? <p className="mt-1.5 text-[14px] text-dim">{sub}</p> : null}
    </div>
  )
}

export function List({ items, mark, markClass }: { items: string[]; mark: ReactNode; markClass?: string }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((t) => (
        <li key={t} className="grid grid-cols-[22px_1fr] items-start gap-3 text-[15.5px] leading-relaxed text-mist">
          <span className={cn('mt-[3px] grid size-[22px] place-items-center rounded-full', markClass)} aria-hidden="true">
            {mark}
          </span>
          <span>{t}</span>
        </li>
      ))}
    </ul>
  )
}

/** Карточка одной энергии: число, название аркана, роль точки */
export function EnergyCard({
  value,
  name,
  note,
  formula,
  tone = 'default',
  className,
}: {
  value: number
  name: string
  note: string
  formula?: string
  tone?: 'default' | 'star' | 'hot' | 'gold'
  className?: string
}) {
  return (
    <div
      onPointerMove={setSpotlight}
      className={cn(
        'card spotlight relative flex flex-col p-5 transition-[border-color] duration-300 hover:border-line-strong',
        tone === 'star' && 'border-gold/40 bg-[radial-gradient(120%_120%_at_0%_0%,rgb(233_201_149/0.18),transparent_60%)]',
        tone === 'hot' && 'border-rose/35 bg-[radial-gradient(120%_120%_at_0%_0%,rgb(240_106_158/0.16),transparent_60%)]',
        tone === 'gold' && 'border-gold/25',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            'num text-[52px] leading-[0.9]',
            tone === 'star' ? 'text-gold' : tone === 'hot' ? 'text-blush' : 'text-ink',
          )}
        >
          {value}
        </span>
        <span className="mt-1 text-right font-display text-[15px] leading-tight text-dim italic">
          {ROMAN[value]}
          <br />
          {ARCANA[value]}
        </span>
      </div>
      <span className="mt-4 text-[15px] font-semibold text-ink">{name}</span>
      <span className="mt-1 text-[13.5px] leading-snug text-dim">{note}</span>
      {formula ? <span className="mt-3 font-mono text-[11px] tracking-wider text-dim/80 uppercase">{formula}</span> : null}
    </div>
  )
}

export function Callout({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[40px_1fr] items-start gap-4 rounded-[20px] border border-line bg-white/[0.02] p-5">
      <span className="grid size-10 place-items-center rounded-full bg-wine text-gold">{icon}</span>
      <p className="text-[15px] leading-relaxed text-mist">
        <b className="font-semibold text-ink">{title}</b> {children}
      </p>
    </div>
  )
}

export function SectionLabel({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mt-14 mb-5 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
      <h3 className="font-display text-[clamp(28px,3vw,38px)] leading-tight font-medium text-ink">{title}</h3>
      <p className="text-[14px] text-dim">{sub}</p>
    </div>
  )
}
