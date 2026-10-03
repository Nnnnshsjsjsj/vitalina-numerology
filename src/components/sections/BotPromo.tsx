import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { EASE, useReducedMotion } from '@/lib/motion'
import { LINKS } from '@/data/content'
import { Button } from '@/components/ui/Button'
import { Eyebrow, Reveal, SplitText } from '@/components/ui/Motion'
import { IconArrowUpRight, IconTelegram } from '@/components/ui/Icon'
import avatar from '@/assets/photos/avatar.webp'

function Bubble({ me, children, delay }: { me?: boolean; children: ReactNode; delay: number }) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 12, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.5, delay, ease: EASE }}
      className={cn(
        'max-w-[86%] rounded-[18px] px-3.5 py-2.5 text-[13px] leading-snug',
        me ? 'self-end rounded-br-md bg-rose text-void' : 'self-start rounded-bl-md bg-[#2b1622] text-ink',
      )}
    >
      {children}
    </motion.div>
  )
}

export function BotPromo() {
  return (
    <section aria-labelledby="bot-title" className="shell py-[clamp(80px,10vw,140px)]">
      <div className="card relative grid items-center gap-12 overflow-hidden p-8 sm:p-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:p-16">
        <div aria-hidden="true" className="glow-plum pointer-events-none absolute -right-1/4 -bottom-1/2 size-[90%]" />
        <div className="relative">
          <Reveal>
            <Eyebrow index="05">Бот в Телеграме</Eyebrow>
          </Reveal>
          <SplitText id="bot-title" text="Тот же расчёт — *прямо в чате*" className="display mt-6 max-w-[13ch] text-[clamp(2.6rem,5vw,4.6rem)] text-ink" />
          <Reveal delay={0.1}>
            <p className="lede mt-6">
              Отправь дату — бот пришлёт прогноз на 2026 год и матрицу судьбы. Удобно посчитать себя и близких и держать результат под
              рукой.
            </p>
          </Reveal>
          <Reveal delay={0.2} className="mt-9 flex flex-wrap gap-3">
            <Button href={LINKS.bot} external size="lg" magnetic icon={<IconTelegram size={18} />}>
              Открыть бота
            </Button>
            <Button href={LINKS.telegram} external size="lg" variant="ghost" iconRight={<IconArrowUpRight size={16} />}>
              Написать Виталине
            </Button>
          </Reveal>
        </div>

        {/* макет телефона */}
        <Reveal delay={0.1} className="relative mx-auto w-full max-w-[320px]">
          <div className="rounded-[44px] border border-line-strong bg-void p-3 shadow-[var(--shadow-lg)]">
            <div className="overflow-hidden rounded-[34px] bg-[#170911]">
              <div className="flex items-center gap-3 border-b border-line px-4 py-3">
                <img src={avatar} alt="" className="size-9 rounded-full object-cover" />
                <div className="leading-tight">
                  <p className="text-[13.5px] font-semibold text-ink">Матрица Судьбы | Виталина</p>
                  <p className="text-[11.5px] text-dim">бот</p>
                </div>
              </div>
              <div className="flex min-h-[390px] flex-col gap-2 px-3 py-4">
                <Bubble delay={0.1}>Привет! Отправь дату рождения в формате ДД.ММ.ГГГГ ✍️</Bubble>
                <Bubble me delay={0.4}>
                  16.02.1993
                </Bubble>
                <Bubble delay={0.7}>Отлично! Что рассчитать?</Bubble>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.9 }}
                  className="flex flex-col gap-1.5 self-start"
                >
                  <span className="rounded-xl bg-[#2b1622]/70 px-3.5 py-2 text-center text-[12.5px] text-blush">Прогноз на 2026</span>
                  <span className="rounded-xl bg-[#2b1622]/70 px-3.5 py-2 text-center text-[12.5px] text-blush">Матрица судьбы</span>
                </motion.div>
                <Bubble delay={1.2}>
                  <b>ЛИЧНЫЙ ГОД 2026</b>
                  <br />
                  Твоё число года — 1. Год новых начинаний ✨
                </Bubble>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
