import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { cn } from '@/lib/cn'
import { EASE } from '@/lib/motion'
import { TARGET_YEAR, type ClosureKind, type Reading } from '@/lib/numerology'
import { YEARS } from '@/data/years'
import { Counter } from '@/components/ui/Motion'
import { IconArrowDown, IconCheck, IconMinus, IconPlus, IconSparkle, YearGlyph } from '@/components/ui/Icon'
import { Block, BlockTitle, List } from './shared'

const CLOSURES: Record<ClosureKind | 'none', { chip: string; title: string; text: string; tone: string; chipTone: string }> = {
  resource: {
    chip: 'Ресурсный год',
    title: 'Год максимальной реализации',
    text: 'Дополнительные числа твоей даты рождения совпадают с числами 2026 года. Такой год встречается редко: он ресурсный, удача на твоей стороне. Важно планировать большое и действовать.',
    tone: 'border-ok/30 bg-[radial-gradient(120%_140%_at_0%_0%,rgb(143_224_180/0.14),transparent_60%)]',
    chipTone: 'bg-ok text-void',
  },
  direct: {
    chip: 'Прямое замыкание',
    title: 'Сложный год больших перемен',
    text: 'Базовое число твоей даты рождения совпадает с родовым числом 2026 года. Как было раньше — больше не будет: меняются взгляды на жизнь, приходят крупные перемены, и от этого может быть тревожно. Важно проживать год в плюсе, с позитивным мышлением — тогда ничего не страшно.',
    tone: 'border-warn/30 bg-[radial-gradient(120%_140%_at_0%_0%,rgb(242_196_107/0.14),transparent_60%)]',
    chipTone: 'bg-warn text-void',
  },
  reverse: {
    chip: 'Обратное замыкание',
    title: 'Год-проверка',
    text: 'Родовое число твоей даты рождения совпадает с базовым числом 2026 года. Родовое выходит наружу: год усиливает и сильные, и теневые стороны. Если проживать его осознанно, проверки превращаются в рост; если в минусе — по проблемной сфере будут проверки.',
    tone: 'border-bad/30 bg-[radial-gradient(120%_140%_at_0%_0%,rgb(255_143_160/0.14),transparent_60%)]',
    chipTone: 'bg-bad text-void',
  },
  none: {
    chip: 'Ровный год',
    title: 'Без замыканий',
    text: 'Совпадений дополнительных чисел с 2026 годом нет: год проживается по канве своего числа, без усилений. Описание личного года ниже — твоя главная навигация.',
    tone: '',
    chipTone: 'bg-wine text-blush',
  },
}

export function YearPanel({ reading }: { reading: Reading }) {
  const n = reading.year
  const y = YEARS[n]
  const [open, setOpen] = useState(false)
  const kinds: (ClosureKind | 'none')[] = reading.check.kinds.length ? reading.check.kinds : ['none']
  const { birth, target } = reading.check

  return (
    <div className="flex flex-col gap-4">
      {/* главная карточка года */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <Block className="relative overflow-hidden">
          <div aria-hidden="true" className="glow-rose pointer-events-none absolute -top-1/3 -right-1/4 size-[120%]" />
          <div className="relative flex flex-col gap-8 sm:flex-row sm:items-end">
            <div className="flex items-end gap-4">
              <Counter value={n} duration={1.2} className="num text-[clamp(140px,18vw,220px)] leading-[0.78] text-grad-rose italic" />
              <span className="mb-3 grid size-14 place-items-center rounded-full border border-rose/40 bg-rose/10 text-blush">
                <YearGlyph n={n} size={26} />
              </span>
            </div>
            <div className="pb-2">
              <p className="eyebrow">Личный год {TARGET_YEAR}</p>
              <h3 className="mt-3 font-display text-[clamp(30px,3.4vw,44px)] leading-[1.02] font-medium text-ink">{y.title}</h3>
              <p className="mt-2 text-[15px] text-mist">{y.short}</p>
              <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-line-strong px-3.5 py-1.5 text-[13px] text-mist">
                <IconSparkle size={14} className="text-gold" />
                {y.energy}
              </span>
            </div>
          </div>
        </Block>

        <Block>
          <BlockTitle title="Три ключевых месяца" sub="Сейчас мы подходим к самому важному периоду года" />
          <ul className="flex flex-col gap-2.5">
            {reading.keyMonths.map((m, i) => (
              <li
                key={m.month}
                className={cn(
                  'grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-2xl border px-4 py-3',
                  i === 1 ? 'border-rose/40 bg-rose/[0.07]' : 'border-line',
                )}
              >
                <span className="font-display text-[22px] leading-none text-ink">{m.month}</span>
                <span className="text-[13px] leading-snug text-dim">
                  {m.note}
                  <span className="block text-mist">
                    {m.year}: {YEARS[m.n].title.toLowerCase()}
                  </span>
                </span>
                <span className={cn('num text-[34px] leading-none', i === 1 ? 'text-blush' : 'text-gold')}>{m.n}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[13.5px] leading-relaxed text-dim">
            Сентябрь — месяц, когда задача года может быть выполнена на 100%. Если уроки выучены — жди инсайтов.
          </p>
        </Block>
      </div>

      {/* проверка года */}
      {kinds.map((k) => {
        const c = CLOSURES[k]
        return (
          <Block key={k} className={c.tone}>
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div>
                <span className={cn('inline-block rounded-full px-3.5 py-1 text-[12.5px] font-bold tracking-wide', c.chipTone)}>
                  {c.chip}
                </span>
                <h3 className="mt-4 font-display text-[clamp(26px,2.6vw,34px)] leading-tight font-medium text-ink">{c.title}</h3>
                <p className="mt-3 max-w-[70ch] text-[15.5px] leading-relaxed text-mist">{c.text}</p>
              </div>
              <dl className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Твоя дата', nums: birth },
                  { label: `Дата в ${TARGET_YEAR}`, nums: target },
                ].map((col) => (
                  <div key={col.label} className="rounded-2xl border border-line bg-void/40 px-5 py-4">
                    <dt className="eyebrow text-[10.5px]">{col.label}</dt>
                    <dd className="num mt-2 text-[24px] leading-tight text-ink">
                      {col.nums.n1} · <span className="text-gold">{col.nums.n2}</span>
                      <br />
                      {col.nums.n3} · <span className="text-blush">{col.nums.n4}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <p className="mt-5 text-[12.5px] text-dim">
              <span className="text-gold">Золотое</span> — базовое число, <span className="text-blush">розовое</span> — родовое.
              Дополнительные числа считаются по дате рождения и по той же дате в {TARGET_YEAR} году.
            </p>
          </Block>
        )
      })}

      {/* описание года */}
      <Block>
        <BlockTitle title="О чём этот год" sub="Канва года — основа, всё остальное оттенки" />
        <div className="relative">
          <motion.div
            initial={false}
            animate={{ height: open ? 'auto' : 300 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="flex max-w-[72ch] flex-col gap-4 text-[16px] leading-[1.75] text-mist">
              {y.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </motion.div>
          <AnimatePresence>
            {!open ? (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#1d0c17] to-transparent"
              />
            ) : null}
          </AnimatePresence>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="mt-5 inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-2.5 text-[14px] font-semibold text-ink transition-colors hover:border-blush/50"
        >
          {open ? 'Свернуть' : 'Читать полностью'}
          <IconArrowDown size={16} className={cn('transition-transform duration-300', open && 'rotate-180')} />
        </button>
      </Block>

      <div className="grid gap-4 md:grid-cols-2">
        <Block>
          <BlockTitle title="Благоприятно" sub="чем стоит заняться в этом году" />
          <List items={y.good} mark={<IconCheck size={14} />} markClass="bg-gold/15 text-gold" />
        </Block>
        <Block>
          <BlockTitle title="Сила года" sub="что стоит в себе развивать" />
          <List items={y.power} mark={<IconSparkle size={13} />} markClass="bg-rose/15 text-blush" />
        </Block>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Block tone="good">
          <BlockTitle title="Если год в плюсе" sub="возможные события, если проживать его осознанно" />
          <List items={y.plus} mark={<IconPlus size={14} />} markClass="bg-ok/15 text-ok" />
        </Block>
        <Block tone="bad">
          <BlockTitle title="Если год в минусе" sub="на это стоит обратить внимание" />
          <List items={y.minus} mark={<IconMinus size={14} />} markClass="bg-bad/15 text-bad" />
        </Block>
      </div>
    </div>
  )
}
