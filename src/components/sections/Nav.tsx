import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/cn'
import { EASE } from '@/lib/motion'
import { lockScroll, scrollToId } from '@/lib/scroll'
import { LINKS } from '@/data/content'
import { IconArrowUpRight, IconClose, IconMenu, IconOctagram } from '@/components/ui/Icon'

interface Props {
  hasResult: boolean
}

export function Nav({ hasResult }: Props) {
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setSolid(y > 24)
    setHidden(y > 480 && y > prev && !open)
  })

  useEffect(() => {
    lockScroll(open)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const links = [
    ...(hasResult ? [{ id: 'result', label: 'Мой расчёт' }] : [{ id: 'calc', label: 'Расчёт' }]),
    { id: 'method', label: 'Метод' },
    { id: 'about', label: 'Обо мне' },
    { id: 'faq', label: 'Вопросы' },
  ]

  const go = (id: string) => {
    setOpen(false)
    window.setTimeout(() => scrollToId(id), open ? 280 : 0)
  }

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50 pt-3"
        animate={{ y: hidden ? '-120%' : '0%' }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <div className="shell">
          <nav
            aria-label="Основная навигация"
            className={cn(
              'flex h-[58px] items-center gap-3 rounded-full pr-2 pl-4 transition-[background-color,border-color,box-shadow] duration-500',
              solid ? 'glass shadow-[0_20px_60px_-30px_rgb(0_0_0/0.9)]' : 'border border-transparent',
            )}
          >
            <button
              type="button"
              onClick={() => scrollToId('top', 0)}
              className="flex items-center gap-2.5 rounded-full py-1 pr-2 text-left"
              aria-label="Наверх"
            >
              <span className="grid size-8 place-items-center rounded-full bg-wine text-blush">
                <IconOctagram size={18} />
              </span>
              <span className="font-display text-[19px] leading-none font-medium tracking-[-0.01em] text-ink">
                Виталина Кондрат
              </span>
            </button>

            <ul className="ml-auto hidden items-center gap-1 md:flex">
              {links.map((l) => (
                <li key={l.id}>
                  <button
                    type="button"
                    onClick={() => go(l.id)}
                    className="rounded-full px-3.5 py-2 text-[14px] text-mist transition-colors hover:bg-white/[0.05] hover:text-ink"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>

            <a
              href={LINKS.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto hidden h-10 items-center gap-1.5 rounded-full bg-ink px-4 text-[14px] font-semibold text-void transition-colors hover:bg-petal sm:inline-flex md:ml-2"
            >
              Разбор
              <IconArrowUpRight size={16} />
            </a>

            <button
              type="button"
              className="ml-auto grid size-11 place-items-center rounded-full text-ink sm:ml-1 md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
            >
              {open ? <IconClose size={22} /> : <IconMenu size={22} />}
            </button>
          </nav>
        </div>
      </motion.header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col bg-void/95 px-[var(--gutter)] pt-28 pb-10 backdrop-blur-xl md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
          >
            <ul className="flex flex-col gap-1">
              {links.map((l, i) => (
                <motion.li
                  key={l.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i, duration: 0.6, ease: EASE }}
                >
                  <button
                    type="button"
                    onClick={() => go(l.id)}
                    className="w-full py-3 text-left font-display text-[42px] leading-none text-ink"
                  >
                    {l.label}
                  </button>
                </motion.li>
              ))}
            </ul>
            <div className="mt-auto flex flex-col gap-3">
              <a
                href={LINKS.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-14 items-center justify-center gap-2 rounded-full bg-rose font-semibold text-void"
              >
                Записаться на разбор <IconArrowUpRight size={18} />
              </a>
              <a
                href={LINKS.bot}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-14 items-center justify-center gap-2 rounded-full border border-line-strong text-ink"
              >
                Бот в Телеграме
              </a>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
