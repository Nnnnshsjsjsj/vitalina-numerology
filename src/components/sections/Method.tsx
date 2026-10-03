import { AnimatePresence, motion, useInView } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { EASE, useReducedMotion } from '@/lib/motion'
import { Eyebrow, Reveal, SplitText } from '@/components/ui/Motion'

/** Живой пример главного правила: 23 → 2 + 3 → 5 */
function RuleDemo() {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '-20% 0px' })
  const frames = ['23', '2 + 3', '5']
  const [i, setI] = useState(reduced ? 2 : 0)

  useEffect(() => {
    if (reduced || !inView) return
    setI(0)
    const id = window.setInterval(() => setI((v) => (v + 1) % 3), 1500)
    return () => window.clearInterval(id)
  }, [inView, reduced])

  return (
    <div ref={ref} className="relative grid h-[150px] place-items-center overflow-hidden">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={i}
          initial={{ y: 50, opacity: 0, filter: 'blur(10px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: -50, opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.6, ease: EASE }}
          className={`num text-[clamp(72px,9vw,108px)] leading-none ${i === 2 ? 'text-grad-rose italic' : 'text-ink'}`}
        >
          {frames[i]}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}

function YearDemo() {
  const parts = ['1', '6', '0', '2', '2', '0', '2', '6']
  return (
    <div className="flex h-[150px] flex-col items-center justify-center gap-3">
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {parts.map((p, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <span className={`num grid size-9 place-items-center rounded-lg border text-[22px] ${i < 4 ? 'border-rose/40 text-blush' : 'border-gold/40 text-gold'}`}>
              {p}
            </span>
            {i < parts.length - 1 ? <span className="text-dim">+</span> : null}
          </span>
        ))}
      </div>
      <span className="num text-[30px] leading-none text-ink">
        = 19 → 1 + 9 = 10 → <span className="text-grad-rose italic">1</span>
      </span>
    </div>
  )
}

function SquareDemo() {
  return (
    <svg viewBox="0 0 200 150" className="mx-auto h-[150px] w-auto" aria-hidden="true">
      <path d="M100 8 182 75 100 142 18 75Z" fill="none" stroke="#f06a9e" strokeWidth="1.6" />
      <path d="M42 22h116v106H42Z" fill="none" stroke="#e9c995" strokeOpacity=".7" strokeWidth="1.4" />
      {[
        [18, 75, 'А'],
        [100, 8, 'Б'],
        [182, 75, 'В'],
        [100, 142, 'Г'],
      ].map(([x, y, l]) => (
        <g key={l as string}>
          <circle cx={x as number} cy={y as number} r="11" fill="#f06a9e" />
          <text x={x as number} y={(y as number) + 4.5} textAnchor="middle" fontSize="12" fill="#12070e" className="font-display" fontWeight="600">
            {l}
          </text>
        </g>
      ))}
      <circle cx="100" cy="75" r="13" fill="#e9c995" />
      <text x="100" y="80" textAnchor="middle" fontSize="13" fill="#12070e" className="font-display" fontWeight="600">
        Д
      </text>
    </svg>
  )
}

const STEPS = [
  {
    title: '22 энергии — 22 аркана',
    text: 'В матрице судьбы 22 энергии. Каждую можно проживать в плюсе — и тогда она даёт ресурс, или в минусе — и тогда она забирает силы.',
    art: <SquareDemo />,
  },
  {
    title: 'Главное правило',
    text: 'Если число больше 22 — складываем его цифры между собой. Если 22 или меньше — оставляем как есть. Так из любой даты получаются 22 возможные энергии.',
    art: <RuleDemo />,
  },
  {
    title: 'Личный год',
    text: 'День и месяц рождения плюс интересующий год, сумма цифр сводится к числу от 1 до 9. Пример: 16.02 и 2026 — это год 1, начало нового цикла.',
    art: <YearDemo />,
  },
]

export function Method() {
  return (
    <section id="method" aria-labelledby="method-title" className="shell py-[clamp(80px,10vw,150px)]">
      <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-14">
        <Reveal>
          <Eyebrow index="04">Метод</Eyebrow>
        </Reveal>
        <div>
          <SplitText id="method-title" text="Никакой магии ввода — только *дата*" className="display max-w-[16ch] text-[clamp(2.6rem,5.4vw,5rem)] text-ink" />
          <Reveal delay={0.1}>
            <p className="lede mt-6">
              Все числа берутся из даты рождения — по тем же правилам, по которым матрицу считают вручную на занятиях.
              Расчёт происходит прямо в браузере: дата никуда не отправляется и не сохраняется.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="mt-14 grid gap-4 lg:grid-cols-3">
        {STEPS.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.08} className="h-full">
            <article className="card flex h-full flex-col p-7 sm:p-8">
              <span className="font-mono text-[12px] tracking-[0.16em] text-blush">0{i + 1}</span>
              <div className="my-8">{s.art}</div>
              <h3 className="mt-auto font-display text-[30px] leading-none font-medium text-ink">{s.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-mist">{s.text}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
