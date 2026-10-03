import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { useReducedMotion } from '@/lib/motion'
import { LINKS, OFFER } from '@/data/content'
import { Button } from '@/components/ui/Button'
import { Eyebrow, Reveal, SplitText } from '@/components/ui/Motion'
import { IconArrowUpRight, IconCheck, IconTelegram } from '@/components/ui/Icon'
import heart from '@/assets/photos/heart-sit.webp'

const GIVES = ['что вообще происходит', 'почему это происходит', 'что тебя ждёт', 'какие уроки нужно пройти, чтобы взять от 2026 года максимум']

export function Offer() {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const photoY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])
  const ringRot = useTransform(scrollYProgress, [0, 1], [-20, 30])

  return (
    <section ref={ref} id="offer" aria-labelledby="offer-title" className="relative overflow-hidden py-[clamp(96px,12vw,170px)]">
      <div aria-hidden="true" className="glow-rose pointer-events-none absolute top-1/4 -left-1/4 size-[70vmax] opacity-70" />
      <div className="shell grid items-center gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
        {/* фото в арке */}
        <div className="relative mx-auto w-full max-w-[460px]">
          <motion.div
            aria-hidden="true"
            style={reduced ? undefined : { rotate: ringRot }}
            className="absolute -inset-6 rounded-[999px_999px_40px_40px] border border-gold/30"
          />
          <div className="relative aspect-[3/4] overflow-hidden rounded-[999px_999px_32px_32px] shadow-[var(--shadow-lg)]">
            <motion.img
              src={heart}
              alt="Виталина Кондрат на фотосессии с розовым сердцем"
              loading="lazy"
              style={reduced ? undefined : { y: photoY, scale: 1.18 }}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-void/70 via-transparent to-transparent" />
          </div>
          <div className="glass absolute -right-2 bottom-8 rounded-[24px] px-5 py-4 shadow-[var(--shadow-md)] sm:-right-8">
            <span className="eyebrow block text-[10.5px]">символическая стоимость</span>
            <span className="num mt-1 block text-[30px] leading-none text-ink">{OFFER.price}</span>
          </div>
        </div>

        <div>
          <Reveal>
            <Eyebrow index="03">Персональный разбор</Eyebrow>
          </Reveal>
          <SplitText
            id="offer-title"
            text="Хочешь узнать *свою* задачу года?"
            className="display mt-6 max-w-[13ch] text-[clamp(2.8rem,5.6vw,5.4rem)] text-ink"
          />
          <Reveal delay={0.1}>
            <p className="lede mt-7">
              Расчёт на сайте показывает канву. На разборе я смотрю твою матрицу целиком и даю другой подход — понимание,
              которое помогает не упустить 2026 год:
            </p>
          </Reveal>
          <ul className="mt-7 flex flex-col gap-3">
            {GIVES.map((g, i) => (
              <Reveal as="li" key={g} delay={0.12 + i * 0.05} className="flex items-start gap-3 text-[16.5px] text-ink">
                <span className="mt-1 grid size-6 shrink-0 place-items-center rounded-full bg-rose/15 text-blush">
                  <IconCheck size={14} />
                </span>
                {g}
              </Reveal>
            ))}
          </ul>
          <Reveal delay={0.35} className="mt-10 flex flex-wrap items-center gap-3">
            <Button href={LINKS.telegram} external size="lg" magnetic icon={<IconTelegram size={18} />} iconRight={<IconArrowUpRight size={16} />}>
              Написать «{OFFER.keyword}»
            </Button>
            <span className="text-[14px] text-dim">
              в Телеграм <span className="text-mist">{LINKS.telegramHandle}</span>
            </span>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
