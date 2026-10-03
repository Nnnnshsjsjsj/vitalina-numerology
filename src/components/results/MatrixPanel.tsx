import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { EASE } from '@/lib/motion'
import type { Matrix, Reading } from '@/lib/numerology'
import { ARCANA, POINTS, ROMAN, type MainPointKey } from '@/data/content'
import { MatrixDiagram } from '@/components/matrix/MatrixDiagram'
import { POINT_DEFS } from '@/components/matrix/geometry'
import { IconArrowRight, IconHeart, IconSparkle, IconSun } from '@/components/ui/Icon'
import { Callout, EnergyCard, SectionLabel } from './shared'

const ORDER: (keyof Matrix)[] = ['A', 'B', 'V', 'G', 'D', 'E', 'Zh', 'Z', 'I', 'K', 'L', 'M', 'money', 'love']

const LEGEND = [
  { swatch: 'bg-rose', label: 'Личностный квадрат' },
  { swatch: 'bg-gold', label: 'Зона комфорта' },
  { swatch: 'border border-gold/70 bg-night', label: 'Родовой квадрат' },
  { swatch: 'bg-[#c4aaff]', label: 'Линия мужского рода', line: true },
  { swatch: 'bg-rose', label: 'Линия женского рода', line: true },
  { swatch: 'bg-petal', label: 'Линия благополучия', line: true, dashed: true },
]

export function MatrixPanel({ reading }: { reading: Reading }) {
  const m = reading.matrix
  const [sel, setSel] = useState<keyof Matrix>('D')
  const def = POINT_DEFS.find((p) => p.key === sel)!
  const meta = sel in POINTS ? POINTS[sel as MainPointKey] : null
  const value = m[sel]

  const step = (dir: 1 | -1) => {
    const i = ORDER.indexOf(sel)
    const next = i === -1 ? 0 : (i + dir + ORDER.length) % ORDER.length
    setSel(ORDER[next])
  }

  return (
    <div>
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-10">
        <div>
          <div className="card relative overflow-hidden p-[4%]">
            <div aria-hidden="true" className="glow-gold pointer-events-none absolute inset-[10%]" />
            <MatrixDiagram matrix={m} selected={sel} onSelect={setSel} className="p-[5%]" />
          </div>
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2" aria-label="Обозначения на схеме">
            {LEGEND.map((l) => (
              <li key={l.label} className="flex items-center gap-2 text-[12.5px] text-dim">
                <span
                  aria-hidden="true"
                  className={
                    l.line
                      ? `h-[3px] w-5 rounded-full ${l.swatch} ${l.dashed ? 'opacity-70 [mask-image:repeating-linear-gradient(90deg,#000_0_5px,transparent_5px_8px)]' : ''}`
                      : `size-3 rounded-full ${l.swatch}`
                  }
                />
                {l.label}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[13px] text-dim">Нажми на любую точку схемы — справа появится её расшифровка.</p>
        </div>

        {/* карточка выбранной точки */}
        <div className="lg:sticky lg:top-[150px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={sel}
              initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
              transition={{ duration: 0.45, ease: EASE }}
              className="card relative overflow-hidden p-7 sm:p-9"
              aria-live="polite"
            >
              <div aria-hidden="true" className="glow-rose pointer-events-none absolute -top-1/2 -right-1/2 size-[140%] opacity-60" />
              <div className="relative">
                <p className="eyebrow flex items-center gap-2">
                  {def.label ? <span className="text-blush">Точка {def.label}</span> : <span className="text-blush">Дополнительная точка</span>}
                  <span aria-hidden="true">·</span>
                  <span>{def.formula}</span>
                </p>
                <div className="mt-6 flex items-end gap-5">
                  <span className="num text-[clamp(110px,12vw,150px)] leading-[0.8] text-grad-gold">{value}</span>
                  <span className="mb-2 font-display text-[22px] leading-tight text-mist italic">
                    {ROMAN[value]}
                    <br />
                    {ARCANA[value]}
                  </span>
                </div>
                <h3 className="mt-7 font-display text-[clamp(30px,3vw,40px)] leading-[1.02] font-medium text-ink">{meta?.name ?? def.name}</h3>
                {meta ? <p className="mt-2 text-[15px] font-medium text-blush">{meta.short}</p> : null}
                <p className="mt-4 text-[15.5px] leading-relaxed text-mist">
                  {meta?.text ??
                    `Дополнительная точка: рассчитывается сложением соседних энергий (${def.formula}) и уточняет, как проявляется линия, на которой она стоит.`}
                </p>
                <div className="mt-7 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    className="grid size-11 place-items-center rounded-full border border-line-strong text-ink transition-colors hover:border-blush/50"
                    aria-label="Предыдущая точка"
                  >
                    <IconArrowRight size={18} className="rotate-180" />
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    className="grid size-11 place-items-center rounded-full border border-line-strong text-ink transition-colors hover:border-blush/50"
                    aria-label="Следующая точка"
                  >
                    <IconArrowRight size={18} />
                  </button>
                  <span className="ml-2 text-[13px] text-dim">листай основные точки</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <SectionLabel title="Личностный квадрат" sub="твои главные энергии — 22 аркана, у каждого свой характер" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <EnergyCard value={m.A} name={POINTS.A.name} note={POINTS.A.short} formula={POINTS.A.formula} />
        <EnergyCard value={m.B} name={POINTS.B.name} note={POINTS.B.short} formula={POINTS.B.formula} />
        <EnergyCard value={m.V} name={POINTS.V.name} note={POINTS.V.short} formula={POINTS.V.formula} />
        <EnergyCard value={m.G} name={POINTS.G.name} note={POINTS.G.short} formula={POINTS.G.formula} tone="hot" />
        <EnergyCard value={m.D} name={POINTS.D.name} note={POINTS.D.short} formula={POINTS.D.formula} tone="star" />
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <Callout icon={<IconSun size={18} />} title="Базовый канал — 60% успеха матрицы.">
          Если мы в плюсе этой энергии, вся матрица стремится к плюсу.
        </Callout>
        <Callout icon={<IconSparkle size={18} />} title="Главная проработка почти всегда в минусе.">
          Её важно начать выводить в плюс до 40 лет — после жизнь начинает говорить на материальном языке.
        </Callout>
        <Callout icon={<IconHeart size={18} />} title="Зона комфорта — точка изобилия.">
          Каналы талантов, отношений и денег работают в полную силу, когда цель души и главная проработка в плюсе.
        </Callout>
      </div>

      <SectionLabel title="Родовой квадрат" sub="с чем не справился род — и что перешло тебе" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <EnergyCard value={m.E} name={POINTS.E.name} note={POINTS.E.short} formula={POINTS.E.formula} tone="gold" />
        <EnergyCard value={m.Zh} name={POINTS.Zh.name} note={POINTS.Zh.short} formula={POINTS.Zh.formula} tone="gold" />
        <EnergyCard value={m.Z} name={POINTS.Z.name} note={POINTS.Z.short} formula={POINTS.Z.formula} tone="gold" />
        <EnergyCard value={m.I} name={POINTS.I.name} note={POINTS.I.short} formula={POINTS.I.formula} tone="gold" />
      </div>
      <div className="mt-4">
        <Callout icon={<IconSparkle size={18} />} title="Карма — это не что-то плохое.">
          Это наши выборы и накопленный опыт, которые привели нас в сегодняшнюю точку, — и то, что помогает вывести жизнь на новый
          уровень. Важно смотреть с позиции: какие уроки я прохожу и какие события повторяются.
        </Callout>
      </div>
    </div>
  )
}
