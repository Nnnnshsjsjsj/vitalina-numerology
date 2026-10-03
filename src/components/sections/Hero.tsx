import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react'
import { useEffect, useRef } from 'react'
import { EASE, useMediaQuery, useReducedMotion } from '@/lib/motion'
import { scrollToId } from '@/lib/scroll'
import type { BirthDate } from '@/lib/numerology'
import { SplitText } from '@/components/ui/Motion'
import { MatrixDiagram } from '@/components/matrix/MatrixDiagram'
import { DateForm } from './DateForm'
import avatar from '@/assets/photos/avatar.webp'

const STARS = Array.from({ length: 26 }, (_, i) => ({
  left: (i * 37.3) % 100,
  top: (i * 53.7) % 100,
  size: 1 + ((i * 7) % 3),
  delay: (i * 0.73) % 5,
}))

export function Hero({ ready, onSubmit }: { ready: boolean; onSubmit: (d: BirthDate) => void }) {
  const reduced = useReducedMotion()
  const desktop = useMediaQuery('(min-width: 1024px)')
  const stage = useRef<HTMLElement>(null)

  // параллакс от курсора: сцена медленно следует за указателем
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 50, damping: 18, mass: 0.7 })
  const sy = useSpring(my, { stiffness: 50, damping: 18, mass: 0.7 })
  const artX = useTransform(sx, [-1, 1], [-22, 22])
  const artY = useTransform(sy, [-1, 1], [-16, 16])
  const rotY = useTransform(sx, [-1, 1], [-7, 7])
  const rotX = useTransform(sy, [-1, 1], [6, -6])
  const glowX = useTransform(sx, [-1, 1], [40, -40])

  // уход со сцены при скролле
  const { scrollYProgress } = useScroll({ target: stage, offset: ['start start', 'end start'] })
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const lift = useTransform(scrollYProgress, [0, 1], [0, -80])

  useEffect(() => {
    const el = stage.current
    if (!el || reduced || !desktop) return
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      mx.set(((e.clientX - r.left) / r.width) * 2 - 1)
      my.set(((e.clientY - r.top) / r.height) * 2 - 1)
    }
    const onLeave = () => {
      mx.set(0)
      my.set(0)
    }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [mx, my, reduced, desktop])

  const rise = (d: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 18, filter: 'blur(8px)' },
          animate: ready ? { opacity: 1, y: 0, filter: 'blur(0px)' } : undefined,
          transition: { duration: 1, delay: d, ease: EASE },
        }

  return (
    <section ref={stage} id="top" aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      {/* фон: звёзды, сетка, свечения */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="line-grid absolute inset-0 opacity-50 [mask-image:radial-gradient(60%_55%_at_70%_45%,#000,transparent)]" />
        <motion.div style={{ x: glowX }} className="glow-rose absolute top-[2%] right-[-8%] size-[64vmax] opacity-80" />
        <div className="glow-plum absolute bottom-[-30%] left-[-20%] size-[70vmax]" />
        {STARS.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-petal animate-twinkle"
            style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, animationDelay: `${s.delay}s` }}
          />
        ))}
      </div>

      <motion.div
        style={reduced ? undefined : { opacity: fade, y: lift }}
        className="shell grid min-h-[100svh] items-center gap-10 pt-28 pb-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-6 lg:pt-24"
      >
        <div className="relative z-10 order-2 lg:order-1">
          <motion.p {...rise(0.05)} className="eyebrow flex items-center gap-3 text-mist">
            <span className="inline-block size-1.5 rounded-full bg-rose shadow-[0_0_12px_#f06a9e]" />
            Нумерология · матрица судьбы · 2026
          </motion.p>

          <SplitText
            as="h1"
            id="hero-title"
            play={ready}
            delay={0.12}
            stagger={0.07}
            text="Числа уже знают, каким будет твой *2026*"
            className="display mt-6 max-w-[12.5ch] text-[clamp(3rem,6.6vw,6.6rem)] text-ink"
          />

          <motion.p {...rise(0.5)} className="lede mt-7 max-w-[48ch]">
            Введи дату рождения — и получи число своего личного года, проверку 2026-го на «замыкания»,
            все энергии матрицы судьбы, денежный канал и девятилетний цикл. Бесплатно и сразу.
          </motion.p>

          <motion.div {...rise(0.62)} className="mt-9" id="calc">
            <DateForm onSubmit={onSubmit} />
          </motion.div>

          <motion.ul {...rise(0.78)} className="mt-10 grid max-w-[540px] grid-cols-3 gap-2.5" aria-label="Что внутри расчёта">
            {[
              ['22', 'аркана в матрице'],
              ['9', 'лет в твоём цикле'],
              ['4', 'предназначения'],
            ].map(([v, l]) => (
              <li key={l} className="card px-4 py-3.5">
                <span className="num block text-[34px] leading-none text-gold">{v}</span>
                <span className="mt-1.5 block text-[12.5px] leading-snug text-dim">{l}</span>
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div
          className="relative order-1 mx-auto w-[min(66vw,340px)] sm:w-[min(60vw,440px)] lg:order-2 lg:w-full lg:max-w-[600px]"
          initial={reduced ? false : { opacity: 0, scale: 0.92 }}
          animate={ready || reduced ? { opacity: 1, scale: 1 } : undefined}
          transition={{ duration: 1.6, delay: 0.15, ease: EASE }}
          style={{ perspective: 1200 }}
        >
          <div aria-hidden="true" className="glow-gold absolute inset-[-14%]" />
          <motion.div style={reduced || !desktop ? undefined : { x: artX, y: artY, rotateX: rotX, rotateY: rotY }}>
            <MatrixDiagram decorative animate={ready} className="p-[6%]" />
          </motion.div>

          <motion.div
            {...rise(1)}
            className="glass absolute bottom-[-3%] left-[-4%] flex items-center gap-3 rounded-full py-1.5 pr-5 pl-1.5 shadow-[var(--shadow-md)] lg:bottom-[0%] lg:left-[-8%]"
          >
            <img src={avatar} alt="" width={44} height={44} className="size-11 rounded-full object-cover ring-2 ring-rose/50" />
            <span className="leading-tight">
              <span className="block text-[14px] font-semibold text-ink">Виталина Кондрат</span>
              <span className="block text-[12.5px] text-dim">нумеролог, разборы матрицы</span>
            </span>
          </motion.div>
        </motion.div>
      </motion.div>

      {!reduced ? (
        <motion.button
          type="button"
          onClick={() => scrollToId('manifesto')}
          style={{ opacity: fade }}
          className="absolute right-[var(--gutter)] bottom-7 hidden items-center gap-3 font-mono text-[11px] tracking-[0.16em] text-dim uppercase transition-colors hover:text-ink md:flex"
        >
          <span className="relative block h-9 w-5 rounded-full border border-line-strong">
            <motion.span
              className="absolute top-1.5 left-1/2 h-2 w-[3px] -translate-x-1/2 rounded-full bg-rose"
              animate={{ y: [0, 12, 0], opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </span>
          Листай
        </motion.button>
      ) : null}
    </section>
  )
}
