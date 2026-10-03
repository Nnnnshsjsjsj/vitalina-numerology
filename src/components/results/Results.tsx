import { AnimatePresence, motion } from 'motion/react'
import { useRef, useState } from 'react'
import { cn } from '@/lib/cn'
import { EASE } from '@/lib/motion'
import { scrollToId } from '@/lib/scroll'
import { formatDate, TARGET_YEAR, type Reading } from '@/lib/numerology'
import { YEARS } from '@/data/years'
import { ARCANA, LINKS, OFFER } from '@/data/content'
import { Button } from '@/components/ui/Button'
import { IconArrowUpRight, IconCalendar, IconCoin, IconCompass, IconCopy, IconLink, IconOctagram, IconRefresh, IconSparkle } from '@/components/ui/Icon'
import { YearPanel } from './YearPanel'
import { MatrixPanel } from './MatrixPanel'
import { WellbeingPanel } from './WellbeingPanel'
import { PurposePanel } from './PurposePanel'
import { CyclePanel } from './CyclePanel'

const TABS = [
  { id: 'year', label: 'Личный год', icon: IconSparkle },
  { id: 'matrix', label: 'Матрица', icon: IconOctagram },
  { id: 'wealth', label: 'Благополучие', icon: IconCoin },
  { id: 'purpose', label: 'Предназначения', icon: IconCompass },
  { id: 'cycle', label: 'Цикл', icon: IconCalendar },
] as const
type TabId = (typeof TABS)[number]['id']

function summary(r: Reading): string {
  const m = r.matrix
  const y = YEARS[r.year]
  return [
    `Мой расчёт по дате ${formatDate(r.date)}`,
    `Личный год ${TARGET_YEAR}: ${r.year} — ${y.title.toLowerCase()}`,
    `Матрица: А ${m.A} · Б ${m.B} · В ${m.V} · Г ${m.G} · зона комфорта ${m.D} (${ARCANA[m.D]})`,
    `Денежный канал ${m.money} · канал любви ${m.love}`,
    `Предназначения: ${m.p1} · ${m.p2} · ${m.p3} · ${m.p4}`,
  ].join('\n')
}

export function Results({ reading, onReset }: { reading: Reading; onReset: () => void }) {
  const [tab, setTab] = useState<TabId>('year')
  const [toast, setToast] = useState<string | null>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const flash = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2200)
  }

  const copy = async (text: string, ok: string) => {
    try {
      await navigator.clipboard.writeText(text)
      flash(ok)
    } catch {
      flash('Не получилось скопировать — выдели текст вручную')
    }
  }

  const tablistRef = useRef<HTMLDivElement>(null)

  const select = (id: TabId, i: number) => {
    setTab(id)
    // активная вкладка всегда видна в прокручиваемой ленте (телефоны)
    const list = tablistRef.current
    const btn = tabRefs.current[i]
    if (list && btn) list.scrollTo({ left: btn.offsetLeft - (list.clientWidth - btn.clientWidth) / 2, behavior: 'smooth' })
    // если панель уже уехала вверх — возвращаем к началу новой вкладки
    const anchor = document.getElementById('result-anchor')
    if (anchor && anchor.getBoundingClientRect().top < 0) scrollToId('result-anchor', -84)
  }

  // клавиатура: стрелки переключают вкладки (паттерн WAI-ARIA tabs)
  const onKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    e.preventDefault()
    const next = (i + (e.key === 'ArrowRight' ? 1 : -1) + TABS.length) % TABS.length
    select(TABS[next].id, next)
    tabRefs.current[next]?.focus()
  }

  const date = formatDate(reading.date)

  return (
    <section id="result" aria-labelledby="result-title" className="relative scroll-mt-24 pt-[clamp(80px,10vw,130px)] pb-[clamp(60px,8vw,110px)]">
      <div aria-hidden="true" className="glow-rose pointer-events-none absolute top-0 left-1/2 -z-10 size-[80vmax] -translate-x-1/2 -translate-y-1/3 opacity-60" />

      <div className="shell">
        <motion.div
          key={date}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <p className="eyebrow flex items-center gap-3">
              <span className="text-blush">Твой расчёт</span>
              <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
              <span>дата рождения</span>
            </p>
            <h2 id="result-title" className="display mt-5 text-[clamp(3.2rem,8vw,7.2rem)] tracking-[-0.03em] text-ink">
              {date}
            </h2>
            <p className="mt-4 text-[16px] text-mist">
              Личный год {TARGET_YEAR} — <span className="text-blush">число {reading.year}</span>, зона комфорта —{' '}
              <span className="text-gold">
                {reading.matrix.D}, {ARCANA[reading.matrix.D]}
              </span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" icon={<IconLink size={16} />} onClick={() => copy(window.location.href, 'Ссылка на расчёт скопирована')}>
              Ссылка
            </Button>
            <Button variant="ghost" icon={<IconCopy size={16} />} onClick={() => copy(summary(reading), 'Итог скопирован — можно вставить в сообщение')}>
              Скопировать итог
            </Button>
            <Button variant="ghost" icon={<IconRefresh size={16} />} onClick={onReset}>
              Другая дата
            </Button>
          </div>
        </motion.div>

        {/* вкладки: якорь стоит перед липкой панелью — у липкого элемента нельзя брать позицию */}
        <div id="result-anchor" aria-hidden="true" className="mt-12" />
        <div id="result-tabs" className="sticky top-[76px] z-30 -mx-[var(--gutter)] px-[var(--gutter)] py-3">
          <div
            ref={tablistRef}
            role="tablist"
            aria-label="Разделы расчёта"
            className="no-scrollbar flex w-full gap-1 overflow-x-auto rounded-full border border-line bg-[rgb(18_7_14/0.92)] p-1.5 shadow-[var(--shadow-md)] backdrop-blur-xl sm:w-fit"
          >
            {TABS.map((t, i) => {
              const Icon = t.icon
              const on = tab === t.id
              return (
                <button
                  key={t.id}
                  ref={(el) => {
                    tabRefs.current[i] = el
                  }}
                  role="tab"
                  id={`tab-${t.id}`}
                  aria-selected={on}
                  aria-controls={`panel-${t.id}`}
                  tabIndex={on ? 0 : -1}
                  onClick={() => select(t.id, i)}
                  onKeyDown={(e) => onKey(e, i)}
                  className={cn(
                    'relative flex h-11 shrink-0 items-center gap-2 rounded-full px-4 text-[14px] font-semibold transition-colors duration-300',
                    on ? 'text-void' : 'text-mist hover:text-ink',
                  )}
                >
                  {on ? (
                    <motion.span
                      layoutId="tab-pill"
                      className="absolute inset-0 rounded-full bg-ink"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  ) : null}
                  <Icon size={16} className="relative" />
                  <span className="relative">{t.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab + date}
              role="tabpanel"
              id={`panel-${tab}`}
              aria-labelledby={`tab-${tab}`}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              {tab === 'year' ? <YearPanel reading={reading} /> : null}
              {tab === 'matrix' ? <MatrixPanel reading={reading} /> : null}
              {tab === 'wealth' ? <WellbeingPanel reading={reading} /> : null}
              {tab === 'purpose' ? <PurposePanel reading={reading} /> : null}
              {tab === 'cycle' ? <CyclePanel reading={reading} /> : null}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* мягкий переход к разбору */}
        <div className="mt-10 flex flex-col items-start justify-between gap-5 rounded-[28px] border border-rose/30 bg-[linear-gradient(110deg,rgb(240_106_158/0.14),rgb(233_201_149/0.06))] p-6 sm:flex-row sm:items-center sm:p-8">
          <p className="max-w-[60ch] text-[16px] leading-relaxed text-mist">
            <b className="font-semibold text-ink">Это канва.</b> Внутри года есть твоя личная задача, сильные месяцы и проверки — они у
            каждого свои. Напиши «{OFFER.keyword}», и я сделаю разбор за {OFFER.price}.
          </p>
          <Button href={LINKS.telegram} external magnetic iconRight={<IconArrowUpRight size={16} />}>
            Написать «{OFFER.keyword}»
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {toast ? (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="glass fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-full px-5 py-3 text-[14px] text-ink shadow-[var(--shadow-lg)]"
          >
            {toast}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  )
}
