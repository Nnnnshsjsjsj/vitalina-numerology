import { animate, motion, useInView, useMotionValue, useTransform } from 'motion/react'
import { useEffect, useRef, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { EASE, useReducedMotion } from '@/lib/motion'

/* ------------------------------------------------------------------ Reveal */

export function Reveal({
  children,
  delay = 0,
  y = 22,
  className,
  as = 'div',
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  as?: 'div' | 'section' | 'li' | 'p' | 'span'
}) {
  const reduced = useReducedMotion()
  const Comp = motion[as]
  if (reduced) {
    const Plain = as
    return <Plain className={className}>{children}</Plain>
  }
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </Comp>
  )
}

/* ------------------------------------------------------------------ SplitText */

/**
 * Заголовок, который «вырастает» по словам. Фрагменты в *звёздочках* набираются
 * курсивом с розовым градиентом.
 */
export function SplitText({
  text,
  as = 'h2',
  className,
  play = true,
  delay = 0,
  stagger = 0.06,
  id,
}: {
  text: string
  as?: 'h1' | 'h2' | 'h3' | 'p'
  className?: string
  play?: boolean
  delay?: number
  stagger?: number
  id?: string
}) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLHeadingElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const go = play && inView

  // разбиваем на сегменты: обычные и *акцентные*
  const segments = text.split(/(\*[^*]+\*)/g).filter(Boolean)
  const words: { w: string; accent: boolean }[] = []
  for (const s of segments) {
    const accent = s.startsWith('*')
    const clean = accent ? s.slice(1, -1) : s
    for (const w of clean.split(/\s+/).filter(Boolean)) words.push({ w, accent })
  }

  const Tag = as
  return (
    <Tag ref={ref} id={id} className={className} aria-label={text.replace(/\*/g, '')}>
      {words.map((item, i) => (
        <span key={i} aria-hidden="true" className="inline-block overflow-hidden pb-[0.12em] align-bottom">
          <motion.span
            className={cn('inline-block', item.accent && 'italic text-grad-rose pr-[0.04em]')}
            initial={reduced ? false : { y: '110%', rotate: 3 }}
            animate={reduced || go ? { y: '0%', rotate: 0 } : undefined}
            transition={{ duration: 1, delay: delay + i * stagger, ease: EASE }}
          >
            {item.w}
          </motion.span>
          {i < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </Tag>
  )
}

/* ------------------------------------------------------------------ Counter */

export function Counter({ value, duration = 1.4, className }: { value: number; duration?: number; className?: string }) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const mv = useMotionValue(reduced ? value : 0)
  const rounded = useTransform(mv, (v) => Math.round(v))

  useEffect(() => {
    if (reduced) {
      mv.set(value)
      return
    }
    if (!inView) return
    const controls = animate(mv, value, { duration, ease: EASE })
    return () => controls.stop()
  }, [inView, value, duration, reduced, mv])

  return (
    <motion.span ref={ref} className={className}>
      {rounded}
    </motion.span>
  )
}

/* ------------------------------------------------------------------ Eyebrow */

export function Eyebrow({ index, children, className }: { index?: string; children: ReactNode; className?: string }) {
  return (
    <p className={cn('eyebrow flex items-center gap-3', className)}>
      {index ? <span className="text-blush">{index}</span> : null}
      {index ? <span aria-hidden="true" className="h-px w-8 bg-line-strong" /> : null}
      <span>{children}</span>
    </p>
  )
}

/* ------------------------------------------------------------------ Marquee */

export function Marquee({
  children,
  duration = 48,
  reverse,
  className,
}: {
  children: ReactNode
  duration?: number
  reverse?: boolean
  className?: string
}) {
  return (
    <div className={cn('edge-fade overflow-hidden', className)}>
      <div
        className="flex w-max animate-marquee"
        style={
          {
            '--marquee-duration': `${duration}s`,
            animationDirection: reverse ? 'reverse' : 'normal',
          } as React.CSSProperties
        }
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  )
}
