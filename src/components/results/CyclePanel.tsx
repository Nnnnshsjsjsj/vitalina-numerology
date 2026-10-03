import { motion } from 'motion/react'
import { useRef, useState } from 'react'
import { cn } from '@/lib/cn'
import { EASE, useMediaQuery, useReducedMotion } from '@/lib/motion'
import type { Reading } from '@/lib/numerology'
import { YEARS } from '@/data/years'
import { YearGlyph } from '@/components/ui/Icon'
import { Block } from './shared'

const PAD = { l: 40, r: 40, t: 46, b: 46 }

/**
 * Волна энергии девятилетнего цикла: одна серия, без легенды (её называет заголовок),
 * перекрестие и подсказка при наведении; карточки ниже — та же информация текстом.
 */
export function CyclePanel({ reading }: { reading: Reading }) {
  const reduced = useReducedMotion()
  // на телефоне — более узкая система координат, чтобы подписи оставались читаемыми
  const narrow = useMediaQuery('(max-width: 639px)')
  const W = narrow ? 520 : 1000
  const H = narrow ? 300 : 280
  const fs = narrow ? { year: 17, n: 30, peak: 17 } : { year: 16, n: 22, peak: 15 }
  const data = reading.cycle
  const [active, setActive] = useState(0)
  const svgRef = useRef<SVGSVGElement>(null)

  const x = (i: number) => PAD.l + (i * (W - PAD.l - PAD.r)) / (data.length - 1)
  const y = (e: number) => PAD.t + ((5 - e) * (H - PAD.t - PAD.b)) / 4
  const line = data.map((d, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(d.energy).toFixed(1)}`).join(' ')
  const area = `${line} L ${x(data.length - 1)} ${H - PAD.b} L ${x(0)} ${H - PAD.b} Z`

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current
    if (!svg) return
    const r = svg.getBoundingClientRect()
    const px = ((e.clientX - r.left) / r.width) * W
    const i = Math.round(((px - PAD.l) / (W - PAD.l - PAD.r)) * (data.length - 1))
    setActive(Math.max(0, Math.min(data.length - 1, i)))
  }

  const a = data[active]
  const tipLeft = (x(active) / W) * 100

  return (
    <div className="flex flex-col gap-4">
      <Block>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="font-display text-[clamp(26px,2.6vw,34px)] leading-tight font-medium text-ink">
              Энергия твоего цикла, {data[0].year}–{data[data.length - 1].year}
            </h3>
            <p className="mt-1.5 max-w-[66ch] text-[14.5px] text-dim">
              Годы всегда идут по порядку: год 1 — начало цикла, год 9 — завершение. С 1 по 5 энергия нарастает, с 6 по 9 — спадает.
            </p>
          </div>
        </div>

        <div className="relative mt-20 sm:mt-24">
          {/* подсказка */}
          <div
            className="pointer-events-none absolute -top-2 z-10 -translate-x-1/2 -translate-y-full rounded-2xl border border-line-strong bg-night/95 px-4 py-2.5 shadow-[var(--shadow-md)] backdrop-blur transition-[left] duration-200"
            style={{ left: `clamp(104px, ${tipLeft}%, calc(100% - 104px))` }}
            aria-hidden="true"
          >
            <span className="block font-mono text-[11px] tracking-wider text-dim">{a.year}</span>
            <span className="block text-[14px] font-semibold whitespace-nowrap text-ink">
              Год {a.n} · {YEARS[a.n].title.replace(/^Год /, '').toLowerCase()}
            </span>
          </div>

          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            className="h-auto w-full touch-pan-y overflow-visible"
            onPointerMove={onMove}
            role="img"
            aria-label={`Волна энергии цикла: ${data.map((d) => `${d.year} — год ${d.n}`).join(', ')}`}
          >
            <defs>
              <linearGradient id="cy-area" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="rgb(240 106 158 / 0.30)" />
                <stop offset="1" stopColor="rgb(240 106 158 / 0)" />
              </linearGradient>
            </defs>
            {/* сетка: только базовая линия и пик — сдержанно */}
            {[1, 3, 5].map((e) => (
              <line key={e} x1={PAD.l} x2={W - PAD.r} y1={y(e)} y2={y(e)} stroke="rgb(251 239 244 / 0.07)" strokeWidth={1} />
            ))}
            <text x={PAD.l - 14} y={y(5) + 5} textAnchor="end" fontSize={fs.peak} fill="#a78795" className="font-mono">
              пик
            </text>

            <motion.path
              d={area}
              fill="url(#cy-area)"
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
            />
            <motion.path
              d={line}
              fill="none"
              stroke="#f06a9e"
              strokeWidth={2.5}
              strokeLinejoin="round"
              initial={reduced ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.4, ease: EASE }}
            />

            {/* перекрестие */}
            <line x1={x(active)} x2={x(active)} y1={PAD.t - 20} y2={H - PAD.b} stroke="rgb(251 239 244 / 0.25)" strokeDasharray="4 6" />

            {data.map((d, i) => (
              <g key={d.year}>
                <circle
                  cx={x(i)}
                  cy={y(d.energy)}
                  r={i === active ? 9 : i === 0 ? 7 : 5}
                  fill={i === 0 ? '#fde3ec' : '#f06a9e'}
                  stroke="#1b0b15"
                  strokeWidth={3}
                />
                <text x={x(i)} y={H - PAD.b + 30} textAnchor="middle" fontSize={fs.year} fill={i === active ? '#fbeff4' : '#a78795'} className="font-mono">
                  {narrow ? `’${String(d.year).slice(2)}` : d.year}
                </text>
                <text
                  x={x(i)}
                  y={y(d.energy) - (narrow ? 20 : 18)}
                  textAnchor="middle"
                  fontSize={fs.n}
                  fill={i === active || i === 0 ? '#fbeff4' : 'rgb(215 186 198 / 0.7)'}
                  className="font-display"
                >
                  {d.n}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </Block>

      {/* текстовое представление — те же данные карточками */}
      <div className="no-scrollbar -mx-[var(--gutter)] flex snap-x snap-mandatory gap-3 overflow-x-auto px-[var(--gutter)] pb-2 lg:mx-0 lg:grid lg:grid-cols-9 lg:overflow-visible lg:px-0">
        {data.map((d, i) => (
          <button
            key={d.year}
            type="button"
            onClick={() => setActive(i)}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            aria-pressed={i === active}
            className={cn(
              'card flex w-[172px] shrink-0 snap-start flex-col p-4 text-left transition-[border-color,background-color] duration-300 lg:w-auto',
              i === active ? 'border-rose/50 bg-rose/[0.08]' : 'hover:border-line-strong',
              i === 0 && 'ring-1 ring-gold/40',
            )}
          >
            <span className="flex items-center justify-between">
              <span className="font-mono text-[11.5px] tracking-wider text-dim">{d.year}</span>
              {i === 0 ? <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10.5px] font-semibold text-gold">сейчас</span> : null}
            </span>
            <span className="mt-3 flex items-center justify-between">
              <span className="num text-[44px] leading-none text-ink">{d.n}</span>
              <YearGlyph n={d.n} size={22} className="text-blush" />
            </span>
            <span className="mt-3 text-[13px] leading-snug font-semibold text-ink">{YEARS[d.n].title.replace(/^Год /, '')}</span>
            <span className="mt-1 text-[12px] leading-snug text-dim">{d.rising ? 'энергия растёт' : 'энергия спадает'}</span>
          </button>
        ))}
      </div>
      <p className="text-[13.5px] text-dim">
        Для больших начинаний лучше всего подходят годы 1 и 8, для отдыха и переосмысления — 7 и 9.
      </p>
    </div>
  )
}
