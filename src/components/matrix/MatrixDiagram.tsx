import { motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { EASE, useReducedMotion } from '@/lib/motion'
import type { Matrix } from '@/lib/numerology'
import { ARCANA, ROMAN } from '@/data/content'
import { C, POINT_DEFS, linePaths, WELLBEING, type PointDef } from './geometry'

const PATHS = linePaths()

interface Props {
  matrix?: Matrix | null
  selected?: keyof Matrix | null
  onSelect?: (key: keyof Matrix) => void
  /** декоративный режим — без чисел, для первого экрана и заставки */
  decorative?: boolean
  className?: string
  /** анимировать появление */
  animate?: boolean
}

const SIZE: Record<PointDef['kind'], number> = {
  personal: 9.2,
  center: 10.8,
  family: 8.4,
  axis: 6.4,
  diag: 5.9,
  wellbeing: 6.4,
}

const TONE: Record<PointDef['kind'], string> = {
  personal:
    'bg-[radial-gradient(circle_at_30%_25%,#ffd0e2,#f06a9e_55%,#b23a6c)] text-void border-transparent shadow-[0_0_40px_-6px_rgb(240_106_158/0.75)]',
  center:
    'bg-[radial-gradient(circle_at_30%_25%,#fff1d6,#e9c995_55%,#a9844e)] text-void border-transparent shadow-[0_0_56px_-4px_rgb(233_201_149/0.7)]',
  family: 'bg-night text-ink border-gold/50 shadow-[0_0_30px_-10px_rgb(233_201_149/0.45)]',
  axis: 'bg-plum text-mist border-line-strong',
  diag: 'bg-plum text-mist border-line-strong',
  wellbeing: 'bg-wine text-petal border-rose/45',
}

export function MatrixDiagram({ matrix, selected, onSelect, decorative, className, animate = true }: Props) {
  const reduced = useReducedMotion()
  const play = animate && !reduced

  const draw = (delay: number) =>
    play
      ? {
          initial: { pathLength: 0, opacity: 0 },
          animate: { pathLength: 1, opacity: 1 },
          transition: { duration: 1.6, delay, ease: EASE },
        }
      : {}

  return (
    <div className={cn('@container relative aspect-square w-full select-none', className)}>
      <svg viewBox="0 0 1000 1000" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
        <defs>
          <linearGradient id="mx-rose" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fde3ec" />
            <stop offset="0.5" stopColor="#f06a9e" />
            <stop offset="1" stopColor="#d9487f" />
          </linearGradient>
          <linearGradient id="mx-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f6e3c2" />
            <stop offset="1" stopColor="#c9a36a" />
          </linearGradient>
          <radialGradient id="mx-core">
            <stop offset="0" stopColor="rgb(233 201 149 / 0.35)" />
            <stop offset="1" stopColor="rgb(233 201 149 / 0)" />
          </radialGradient>
        </defs>

        <circle cx={C} cy={C} r={260} fill="url(#mx-core)" />
        <motion.circle cx={C} cy={C} r={290} fill="none" stroke="rgb(251 239 244 / 0.09)" strokeWidth={1.5} {...draw(0.1)} />
        <motion.path d={PATHS.octagon} fill="none" stroke="rgb(251 239 244 / 0.22)" strokeWidth={2} {...draw(0)} />
        <motion.path d={PATHS.axes} fill="none" stroke="rgb(251 239 244 / 0.12)" strokeWidth={1.5} {...draw(0.25)} />
        <motion.path d={PATHS.square} fill="none" stroke="url(#mx-gold)" strokeOpacity={0.75} strokeWidth={2.5} {...draw(0.15)} />
        <motion.path d={PATHS.diamond} fill="none" stroke="url(#mx-rose)" strokeWidth={2.8} {...draw(0.05)} />
        <motion.path d={PATHS.male} fill="none" stroke="rgb(196 170 255 / 0.55)" strokeWidth={2} {...draw(0.35)} />
        <motion.path d={PATHS.female} fill="none" stroke="rgb(240 106 158 / 0.55)" strokeWidth={2} {...draw(0.35)} />
        <motion.path
          d={PATHS.wellbeing}
          fill="none"
          stroke="rgb(253 227 236 / 0.55)"
          strokeWidth={2}
          strokeDasharray="10 12"
          {...draw(0.5)}
        />

        {/* знаки над линией благополучия */}
        {!decorative ? (
          <g fontSize={34} textAnchor="middle" className="font-display">
            <text x={WELLBEING.M.x + 52} y={WELLBEING.M.y - 52} fill="#9fe3bd">
              $
            </text>
            <text x={WELLBEING.M.x - 12} y={WELLBEING.M.y + 72} fill="#f06a9e">
              ♥
            </text>
          </g>
        ) : null}

        {/* кольцо из 22 арканов — только в декоративном режиме */}
        {decorative ? (
          <g className={cn(!reduced && 'origin-center animate-spin-slow')} style={{ transformBox: 'view-box' }}>
            {Array.from({ length: 22 }, (_, i) => {
              const a = (i / 22) * Math.PI * 2 - Math.PI / 2
              const r = 478
              return (
                <text
                  key={i}
                  x={C + r * Math.cos(a)}
                  y={C + r * Math.sin(a)}
                  fill="rgb(233 201 149 / 0.55)"
                  fontSize={20}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="font-display"
                  transform={`rotate(${(i / 22) * 360} ${C + r * Math.cos(a)} ${C + r * Math.sin(a)})`}
                >
                  {ROMAN[i + 1]}
                </text>
              )
            })}
          </g>
        ) : null}
      </svg>

      {/* точки */}
      {POINT_DEFS.map((p, i) => {
        const value = matrix ? matrix[p.key] : null
        const size = SIZE[p.kind] * (decorative ? 0.55 : 1)
        const isSel = selected === p.key
        const label = value ?? (decorative ? '' : p.label ?? '')
        const common = cn(
          'absolute grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border',
          'transition-[box-shadow,transform,outline-color] duration-300',
          TONE[p.kind],
          decorative && p.kind !== 'personal' && p.kind !== 'center' && 'opacity-70',
          isSel && 'z-10 outline-2 outline-offset-4 outline-blush',
        )
        const style = {
          left: `${p.x / 10}%`,
          top: `${p.y / 10}%`,
          width: `${size}cqw`,
          height: `${size}cqw`,
        }
        const numberClass = cn(
          'num leading-none',
          p.kind === 'personal' || p.kind === 'center' ? 'text-[4.4cqw] font-semibold' : 'text-[3.3cqw] font-semibold',
          p.kind === 'family' && 'text-[3.8cqw]',
        )
        const enter = play
          ? {
              initial: { opacity: 0, scale: 0.4 },
              animate: { opacity: 1, scale: 1 },
              transition: { duration: 0.7, delay: 0.6 + i * 0.03, ease: EASE },
            }
          : {}

        if (decorative || !onSelect) {
          return (
            <motion.span key={p.key} className={common} style={style} {...enter} aria-hidden="true">
              <span className={numberClass}>{label}</span>
            </motion.span>
          )
        }

        const aria = `${p.name}: ${value ?? '—'}${value ? `, аркан ${ARCANA[value]}` : ''}. Формула: ${p.formula}`
        return (
          <motion.button
            key={p.key}
            type="button"
            className={cn(common, 'cursor-pointer hover:scale-110 focus-visible:scale-110')}
            style={style}
            onClick={() => onSelect(p.key)}
            aria-label={aria}
            aria-pressed={isSel}
            {...enter}
          >
            <span className={numberClass}>{label}</span>
          </motion.button>
        )
      })}

      {/* возрастные подписи */}
      {!decorative
        ? POINT_DEFS.filter((p) => p.age).map((p) => {
            const dx = (p.x - C) / 410
            const dy = (p.y - C) / 410
            return (
              <span
                key={`age-${p.key}`}
                aria-hidden="true"
                className="absolute -translate-x-1/2 -translate-y-1/2 font-mono text-[1.9cqw] tracking-wider whitespace-nowrap text-dim"
                style={{ left: `${(C + dx * 488) / 10}%`, top: `${(C + dy * 488) / 10}%` }}
              >
                {p.age}
              </span>
            )
          })
        : null}
    </div>
  )
}
