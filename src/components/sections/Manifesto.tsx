import { motion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useRef } from 'react'
import { cn } from '@/lib/cn'
import { useReducedMotion } from '@/lib/motion'
import { Eyebrow, Reveal } from '@/components/ui/Motion'

const TEXT =
  'Дата рождения — не случайность. Это *карта:* твой характер, твои повторяющиеся сценарии, твои сильные и уязвимые годы. Я помогаю её прочитать — и прожить свою матрицу в *плюсе.*'

function Word({ word, accent, progress, range }: { word: string; accent: boolean; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.16, 1])
  return (
    <motion.span style={{ opacity }} className={cn('inline', accent && 'italic text-grad-rose')}>
      {word}{' '}
    </motion.span>
  )
}

export function Manifesto() {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] })

  const words: { w: string; accent: boolean }[] = []
  for (const seg of TEXT.split(/(\*[^*]+\*)/g).filter(Boolean)) {
    const accent = seg.startsWith('*')
    for (const w of (accent ? seg.slice(1, -1) : seg).split(/\s+/).filter(Boolean)) words.push({ w, accent })
  }

  return (
    <section id="manifesto" aria-label="О подходе" className="shell py-[clamp(96px,14vw,180px)]">
      <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-14">
        <Reveal>
          <Eyebrow index="01">Зачем это всё</Eyebrow>
        </Reveal>
        <div>
          <p
            ref={ref}
            className="display max-w-[22ch] text-[clamp(2.2rem,5vw,4.6rem)] leading-[1.04] text-ink"
            aria-label={TEXT.replace(/\*/g, '')}
          >
            {reduced
              ? words.map((x, i) => (
                  <span key={i} className={cn(x.accent && 'italic text-grad-rose')}>
                    {x.w}{' '}
                  </span>
                ))
              : words.map((x, i) => (
                  <Word key={i} word={x.w} accent={x.accent} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
                ))}
          </p>
          <Reveal delay={0.1} className="mt-14 grid max-w-3xl gap-8 text-[15.5px] leading-relaxed text-mist sm:grid-cols-2">
            <p>
              Прогнозы помогают понять, что приготовил тот или иной период: на что обратить внимание, чем эффективнее
              заняться и что лучше отложить. Если следовать им — обстоятельства складываются наилучшим образом: нужные люди,
              важные инсайты, лучший результат.
            </p>
            <p>
              Любую энергию матрицы можно проживать в плюсе или в минусе. Число — не приговор, а подсказка: где твоя сила,
              какие уроки повторяются и куда стремится душа. Расчёт ниже — бесплатный и полный, по методике, по которой я
              работаю на консультациях.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
