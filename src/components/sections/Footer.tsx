import { LINKS } from '@/data/content'
import { scrollToId } from '@/lib/scroll'
import { IconArrowUpRight } from '@/components/ui/Icon'

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line pt-20 pb-10">
      <div className="shell">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <p className="font-display text-[34px] leading-none text-ink">Виталина Кондрат</p>
            <p className="mt-3 max-w-[40ch] text-[14.5px] text-dim">
              Нумерология и матрица судьбы. Расчёты — для самопознания и вдохновения, а не вместо собственных решений.
            </p>
          </div>
          <nav aria-label="Разделы">
            <p className="eyebrow mb-4">Разделы</p>
            <ul className="flex flex-col gap-2.5 text-[15px] text-mist">
              {[
                ['top', 'Расчёт'],
                ['method', 'Метод'],
                ['about', 'Обо мне'],
                ['faq', 'Вопросы'],
              ].map(([id, label]) => (
                <li key={id}>
                  <button type="button" onClick={() => scrollToId(id, id === 'top' ? 0 : -88)} className="transition-colors hover:text-ink">
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="eyebrow mb-4">Связаться</p>
            <ul className="flex flex-col gap-2.5 text-[15px] text-mist">
              <li>
                <a href={LINKS.telegram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 transition-colors hover:text-ink">
                  Телеграм {LINKS.telegramHandle} <IconArrowUpRight size={14} />
                </a>
              </li>
              <li>
                <a href={LINKS.bot} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 transition-colors hover:text-ink">
                  Бот {LINKS.botHandle} <IconArrowUpRight size={14} />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <p
        aria-hidden="true"
        className="pointer-events-none mt-16 text-center font-display text-[clamp(84px,19vw,300px)] leading-[0.8] tracking-[-0.03em] whitespace-nowrap text-white/[0.035] italic select-none"
      >
        Виталина
      </p>

      <div className="shell mt-8 flex flex-col gap-2 text-[13px] text-dim sm:flex-row sm:justify-between">
        <span>© 2026 Виталина Кондрат</span>
        <span>Расчёт выполняется в браузере — дата никуда не отправляется</span>
      </div>
    </footer>
  )
}
