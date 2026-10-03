import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { setSpotlight } from '@/lib/motion'
import { Eyebrow, Reveal, SplitText } from '@/components/ui/Motion'
import { Button } from '@/components/ui/Button'
import { MatrixDiagram } from '@/components/matrix/MatrixDiagram'
import { IconArrowRight, IconCoin, IconHeart, IconOctagram, IconSparkle, IconWave } from '@/components/ui/Icon'

function Card({
  className,
  icon,
  kicker,
  title,
  text,
  art,
  delay = 0,
}: {
  className?: string
  icon: ReactNode
  kicker: string
  title: string
  text: string
  art?: ReactNode
  delay?: number
}) {
  return (
    <Reveal delay={delay} className={cn('h-full', className)}>
      <article
        onPointerMove={setSpotlight}
        className="card spotlight flex h-full flex-col overflow-hidden p-7 transition-[border-color,transform] duration-500 hover:-translate-y-0.5 hover:border-line-strong sm:p-8"
      >
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full bg-wine text-blush">{icon}</span>
          <span className="eyebrow">{kicker}</span>
        </div>
        {art ? <div className="my-7 flex-1">{art}</div> : <div className="flex-1" />}
        <h3 className="mt-6 font-display text-[clamp(26px,2.4vw,32px)] leading-[1.05] font-medium text-ink">{title}</h3>
        <p className="mt-3 max-w-[46ch] text-[15px] leading-relaxed text-mist">{text}</p>
      </article>
    </Reveal>
  )
}

/* ---- маленькие иллюстрации в карточках ---- */

function ArtYear() {
  return (
    <div className="flex items-end gap-[clamp(6px,1.2vw,14px)]" aria-hidden="true">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
        <span
          key={n}
          className={cn(
            'num leading-none transition-colors',
            n === 5 ? 'text-[clamp(72px,8vw,112px)] text-grad-rose italic' : 'text-[clamp(26px,3vw,40px)] text-dim/60',
          )}
        >
          {n}
        </span>
      ))}
    </div>
  )
}

function ArtCheck() {
  return (
    <div className="grid grid-cols-2 gap-3 font-display" aria-hidden="true">
      {[
        ['дата рождения', '38 · 11', '36 · 9'],
        ['в году прогноза', '40 · 4', '38 · 11'],
      ].map(([l, a, b], i) => (
        <div key={l} className={cn('rounded-2xl border p-4', i ? 'border-gold/40 bg-gold/[0.06]' : 'border-line')}>
          <span className="eyebrow block text-[10px]">{l}</span>
          <span className="num mt-2 block text-[26px] leading-none text-ink">{a}</span>
          <span className={cn('num mt-1 block text-[26px] leading-none', i ? 'text-gold' : 'text-ink')}>{b}</span>
        </div>
      ))}
    </div>
  )
}

function ArtMatrix() {
  return (
    <div className="mx-auto w-[min(100%,250px)]" aria-hidden="true">
      <MatrixDiagram decorative animate={false} className="p-[7%]" />
    </div>
  )
}

function ArtMoney() {
  return (
    <div className="flex items-center gap-4" aria-hidden="true">
      <span className="grid size-20 place-items-center rounded-full border border-ok/40 bg-ok/10 num text-[34px] text-ok">18</span>
      <span className="grid size-20 place-items-center rounded-full border border-rose/40 bg-rose/10 num text-[34px] text-rose">9</span>
    </div>
  )
}

function ArtMonths() {
  return (
    <ul className="flex flex-col gap-2" aria-hidden="true">
      {[
        ['Август', 'задача прошлого года'],
        ['Сентябрь', 'число года'],
        ['Октябрь', 'проекция будущего'],
      ].map(([m, t], i) => (
        <li key={m} className={cn('flex items-baseline justify-between gap-3 rounded-xl border px-4 py-2.5', i === 1 ? 'border-rose/40 bg-rose/[0.07]' : 'border-line')}>
          <span className="font-display text-[20px] text-ink">{m}</span>
          <span className="text-[12.5px] text-dim">{t}</span>
        </li>
      ))}
    </ul>
  )
}

function ArtWave() {
  const pts = [1, 2, 3, 4, 5, 4, 3, 2, 1]
  const w = 900
  const h = 120
  const step = w / (pts.length - 1)
  const y = (v: number) => h - 14 - ((v - 1) / 4) * (h - 34)
  const d = pts.map((v, i) => `${i ? 'L' : 'M'}${(i * step).toFixed(1)} ${y(v).toFixed(1)}`).join(' ')
  return (
    <svg viewBox={`0 -6 ${w} ${h + 12}`} className="h-[110px] w-full overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id="wave-f" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="rgb(240 106 158 / 0.32)" />
          <stop offset="1" stopColor="rgb(240 106 158 / 0)" />
        </linearGradient>
      </defs>
      <path d={`${d} L ${w} ${h} L 0 ${h} Z`} fill="url(#wave-f)" />
      <path d={d} fill="none" stroke="#f06a9e" strokeWidth="2.5" />
      {pts.map((v, i) => (
        <circle key={i} cx={i * step} cy={y(v)} r={i === 0 ? 7 : 4} fill={i === 0 ? '#fde3ec' : '#f06a9e'} />
      ))}
    </svg>
  )
}

export function Features({ onStart }: { onStart: () => void }) {
  return (
    <section aria-labelledby="features-title" className="shell pb-[clamp(96px,12vw,160px)]">
      <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Reveal>
            <Eyebrow index="02">Что внутри расчёта</Eyebrow>
          </Reveal>
          <SplitText
            id="features-title"
            text="Шесть ответов из *одной* даты"
            className="display mt-5 max-w-[14ch] text-[clamp(2.6rem,5.4vw,5rem)] text-ink"
          />
        </div>
        <Reveal delay={0.1}>
          <Button onClick={onStart} variant="ghost" iconRight={<IconArrowRight size={16} />}>
            Рассчитать бесплатно
          </Button>
        </Reveal>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card
          className="lg:col-span-2"
          icon={<IconSparkle size={18} />}
          kicker="Личный год"
          title="Число твоего 2026 года"
          text="День и месяц рождения плюс 2026 — и год раскрывается: его канва, что благоприятно, сила года и какие события возможны в плюсе и в минусе."
          art={<ArtYear />}
        />
        <Card
          delay={0.05}
          icon={<IconOctagram size={18} />}
          kicker="Проверка года"
          title="Ресурсный год или замыкание"
          text="Сравниваем дополнительные числа даты рождения и 2026 года: год максимальной реализации, прямое или обратное замыкание."
          art={<ArtCheck />}
        />
        <Card
          icon={<IconOctagram size={18} />}
          kicker="Матрица судьбы"
          title="Все точки октаграммы"
          text="Базовый канал, интуиция, урок души, зона комфорта, родовой квадрат и дополнительные точки — на интерактивной схеме."
          art={<ArtMatrix />}
        />
        <Card
          delay={0.05}
          icon={<IconCoin size={18} />}
          kicker="Благополучие"
          title="Деньги и любовь"
          text="Две главные энергии линии благополучия — «под долларом» и «под сердцем»."
          art={<ArtMoney />}
        />
        <Card
          delay={0.1}
          icon={<IconHeart size={18} />}
          kicker="Ключевые месяцы"
          title="Август, сентябрь, октябрь"
          text="Самый важный период года: месяц, когда задача года может быть выполнена на 100%."
          art={<ArtMonths />}
        />
        <Card
          className="md:col-span-2 lg:col-span-3"
          icon={<IconWave size={18} />}
          kicker="Эпицикл"
          title="Твой девятилетний цикл с 2026 по 2034"
          text="С 1 по 5 год энергия нарастает, с 6 по 9 — спадает к завершению. Видно, на какие годы планировать большое, а какие оставить для отдыха и переосмысления."
          art={<ArtWave />}
        />
      </div>
    </section>
  )
}
