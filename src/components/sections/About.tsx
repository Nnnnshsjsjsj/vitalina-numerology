import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { useReducedMotion } from '@/lib/motion'
import { Eyebrow, Reveal, SplitText } from '@/components/ui/Motion'
import street from '@/assets/photos/street-laugh.webp'
import pillow from '@/assets/photos/pillow-smile.webp'

export function About() {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const bigY = useTransform(scrollYProgress, [0, 1], ['6%', '-6%'])
  const smallY = useTransform(scrollYProgress, [0, 1], ['30%', '-30%'])

  return (
    <section ref={ref} id="about" aria-labelledby="about-title" className="relative overflow-hidden py-[clamp(80px,10vw,150px)]">
      <div className="shell grid items-center gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
        <div className="relative order-2 lg:order-1">
          <SplitText id="about-title" text="Привет, я *Виталина*" className="display text-[clamp(3rem,6vw,5.8rem)] text-ink" />
          <Reveal delay={0.1} className="mt-8 flex max-w-[54ch] flex-col gap-5 text-[16.5px] leading-[1.75] text-mist">
            <p>
              Я нумеролог, и я верю, что дата рождения — это карта, с которой намного проще понимать себя: свои сильные стороны,
              свои повторяющиеся сценарии и свои лучшие периоды.
            </p>
            <p>
              Расчёт на этой странице — настоящий, по той же методике, по которой я работаю на консультациях. Он бесплатный,
              потому что первый шаг к себе не должен ничего стоить. А если захочешь глубины — приходи на разбор, посмотрим твою
              матрицу вместе.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <figure className="mt-10 border-l-2 border-rose/50 pl-6">
              <blockquote className="font-display text-[clamp(24px,2.4vw,30px)] leading-[1.25] text-ink italic">
                «Если мы следуем указаниям прогноза — обстоятельства складываются наилучшим образом: нужные люди, важные инсайты,
                лучший результат.»
              </blockquote>
              <figcaption className="eyebrow mt-4">Виталина Кондрат</figcaption>
            </figure>
          </Reveal>
        </div>

        <div className="relative order-1 mx-auto w-full max-w-[520px] lg:order-2">
          <Reveal className="relative">
            <div className="aspect-[4/5] overflow-hidden rounded-[32px] shadow-[var(--shadow-lg)]">
              <motion.img
                src={street}
                alt="Виталина Кондрат смеётся на улице, в бежевом пальто"
                loading="lazy"
                style={reduced ? undefined : { y: bigY, scale: 1.12 }}
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
          <motion.div
            style={reduced ? undefined : { y: smallY }}
            className="absolute -bottom-10 -left-6 w-[42%] overflow-hidden rounded-[999px_999px_24px_24px] border-4 border-void shadow-[var(--shadow-lg)] sm:-left-12"
          >
            <img src={pillow} alt="" loading="lazy" className="aspect-[3/4] w-full object-cover" />
          </motion.div>
          <div className="absolute -top-5 -right-3 hidden sm:block">
            <Eyebrow className="glass rounded-full px-4 py-2 text-mist">нумеролог · матрица судьбы</Eyebrow>
          </div>
        </div>
      </div>
    </section>
  )
}
