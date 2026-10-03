import { motion, animate, useMotionValue, useTransform } from 'motion/react'
import { useEffect, useRef } from 'react'
import { EASE } from '@/lib/motion'

const KEY = 'vk-intro-seen'

export function shouldShowPreloader(): boolean {
  if (typeof window === 'undefined') return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  try {
    return sessionStorage.getItem(KEY) !== '1'
  } catch {
    return true
  }
}

/**
 * Заставка: октаграмма матрицы рисует сама себя, счётчик бежит 00 → 22 (по числу арканов),
 * затем занавес уходит вверх. Клик, тап или Esc — пропустить. Показывается раз за сессию.
 */
export function Preloader({ onDone }: { onDone: () => void }) {
  const count = useMotionValue(0)
  const shown = useTransform(count, (v) => String(Math.round(v)).padStart(2, '0'))
  const done = useRef(false)

  useEffect(() => {
    try {
      sessionStorage.setItem(KEY, '1')
    } catch {
      /* хранилище недоступно — не страшно */
    }
    const finish = () => {
      if (done.current) return
      done.current = true
      onDone()
    }
    const controls = animate(count, 22, { duration: 1.5, ease: [0.65, 0, 0.35, 1] })
    const t = window.setTimeout(finish, 1750)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') finish()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      controls.stop()
      window.clearTimeout(t)
      window.removeEventListener('keydown', onKey)
    }
  }, [count, onDone])

  const stroke = (delay: number) => ({
    initial: { pathLength: 0 },
    animate: { pathLength: 1 },
    transition: { duration: 1.25, delay, ease: [0.65, 0, 0.35, 1] as const },
  })

  return (
    <motion.div
      role="status"
      aria-label="Загрузка"
      className="fixed inset-0 z-[100] flex cursor-pointer flex-col justify-between bg-void p-[var(--gutter)]"
      initial={{ y: 0 }}
      exit={{ y: '-100%', transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] } }}
      onClick={() => {
        if (!done.current) {
          done.current = true
          onDone()
        }
      }}
    >
      <div className="flex items-center justify-between">
        <span className="eyebrow text-mist">Виталина Кондрат</span>
        <span className="eyebrow">нумерология</span>
      </div>

      <div className="mx-auto w-[min(56vw,300px)]">
        <svg viewBox="0 0 200 200" className="w-full overflow-visible" aria-hidden="true">
          <defs>
            <linearGradient id="pl-rose" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#fde3ec" />
              <stop offset="1" stopColor="#f06a9e" />
            </linearGradient>
          </defs>
          <motion.path d="M100 14 186 100 100 186 14 100Z" fill="none" stroke="url(#pl-rose)" strokeWidth="1.6" {...stroke(0)} />
          <motion.path d="M39 39H161V161H39Z" fill="none" stroke="#e9c995" strokeOpacity="0.8" strokeWidth="1.4" {...stroke(0.12)} />
          <motion.path d="M14 100H186M100 14V186" fill="none" stroke="rgb(251 239 244 / .2)" strokeWidth="1" {...stroke(0.3)} />
          <motion.circle
            cx="100"
            cy="100"
            r="7"
            fill="#e9c995"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9, ease: EASE }}
          />
        </svg>
      </div>

      <div className="flex items-end justify-between gap-6">
        <div>
          <motion.span className="num block text-[clamp(64px,12vw,140px)] leading-none text-ink">{shown}</motion.span>
          <span className="eyebrow mt-2 block">из 22 арканов</span>
        </div>
        <span className="eyebrow hidden sm:block">нажми, чтобы пропустить</span>
      </div>
    </motion.div>
  )
}
