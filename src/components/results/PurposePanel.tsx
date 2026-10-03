import { cn } from '@/lib/cn'
import type { Reading } from '@/lib/numerology'
import { ARCANA, ROMAN } from '@/data/content'
import { Reveal } from '@/components/ui/Motion'

function Chip({ label, value, tone }: { label: string; value: number; tone?: 'gold' | 'rose' }) {
  return (
    <span className="inline-flex items-baseline gap-2 rounded-full border border-line-strong bg-void/40 px-3.5 py-1.5">
      <span className="text-[12.5px] text-dim">{label}</span>
      <span className={cn('num text-[20px] leading-none', tone === 'gold' ? 'text-gold' : tone === 'rose' ? 'text-blush' : 'text-ink')}>
        {value}
      </span>
    </span>
  )
}

export function PurposePanel({ reading }: { reading: Reading }) {
  const m = reading.matrix
  const items = [
    {
      n: '1',
      title: 'Поиск себя',
      age: 'примерно 20–40 лет',
      text: 'Соединение мужского и женского. Выстраивание взаимоотношений. Способности, навыки, умения.',
      value: m.p1,
      parts: [
        { label: 'Небо', value: m.sky, tone: 'gold' as const },
        { label: 'Земля', value: m.earth, tone: 'rose' as const },
      ],
      how: 'Небо — канал интуиции + главная проработка (Б + Г). Земля — базовый канал + повторяющиеся события (А + В).',
    },
    {
      n: '2',
      title: 'Социализация',
      age: 'примерно 40–60 лет',
      text: 'Социальная и родовая системы. Результаты и признание в социуме.',
      value: m.p2,
      parts: [
        { label: 'По мужскому роду', value: m.male, tone: 'gold' as const },
        { label: 'По женскому роду', value: m.female, tone: 'rose' as const },
      ],
      how: 'По мужскому роду — точки Е + И. По женскому роду — точки Ж + З.',
    },
    {
      n: '3',
      title: 'Духовная гармония',
      age: 'после 60 лет',
      text: 'Духовный зачёт. Кто я для Бога? Где божественное во мне?',
      value: m.p3,
      parts: [
        { label: 'Первое', value: m.p1, tone: 'gold' as const },
        { label: 'Второе', value: m.p2, tone: 'rose' as const },
      ],
      how: 'Складываем первое и второе предназначения.',
    },
    {
      n: '4',
      title: 'Планетарное',
      age: 'масштаб влияния',
      text: 'Планетарное предназначение человека.',
      value: m.p4,
      parts: [
        { label: 'Второе', value: m.p2, tone: 'gold' as const },
        { label: 'Третье', value: m.p3, tone: 'rose' as const },
      ],
      how: 'Складываем второе и третье предназначения.',
    },
  ]

  return (
    <ol className="flex flex-col gap-4">
      {items.map((it, i) => (
        <Reveal as="li" key={it.n} delay={i * 0.05}>
          <div className="card grid gap-6 p-6 sm:grid-cols-[80px_minmax(0,1fr)_auto] sm:items-center sm:p-8">
            <span className="relative z-10 grid size-14 place-items-center rounded-full border border-rose/40 bg-night font-display text-[26px] text-blush sm:size-20 sm:text-[34px]">
              {it.n}
            </span>
            <div>
              <p className="eyebrow">{it.age}</p>
              <h3 className="mt-2 font-display text-[clamp(30px,3vw,40px)] leading-none font-medium text-ink">{it.title}</h3>
              <p className="mt-3 max-w-[56ch] text-[15.5px] leading-relaxed text-mist">{it.text}</p>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                {it.parts.map((p, j) => (
                  <span key={p.label} className="flex items-center gap-2">
                    {j ? <span className="text-dim">+</span> : null}
                    <Chip label={p.label} value={p.value} tone={p.tone} />
                  </span>
                ))}
                <span className="text-dim">=</span>
                <Chip label="итог" value={it.value} />
              </div>
              <p className="mt-3 text-[13px] text-dim">{it.how}</p>
            </div>
            <div className="text-left sm:text-right">
              <span className="num block text-[clamp(84px,9vw,120px)] leading-[0.8] text-grad-gold">{it.value}</span>
              <span className="mt-2 block font-display text-[19px] text-mist italic">
                {ROMAN[it.value]} · {ARCANA[it.value]}
              </span>
            </div>
          </div>
        </Reveal>
      ))}
    </ol>
  )
}
