import { AnimatePresence, motion } from 'motion/react'
import { useId, useState } from 'react'
import { cn } from '@/lib/cn'
import { EASE } from '@/lib/motion'
import { FAQ } from '@/data/content'
import { Eyebrow, Reveal, SplitText } from '@/components/ui/Motion'
import { IconPlus } from '@/components/ui/Icon'

function Item({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  const id = useId()
  return (
    <div className={cn('border-b border-line transition-colors', open && 'border-line-strong')}>
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={id}
          className="flex w-full items-center justify-between gap-6 py-6 text-left"
        >
          <span className="font-display text-[clamp(22px,2.2vw,28px)] leading-tight text-ink">{q}</span>
          <span
            className={cn(
              'grid size-10 shrink-0 place-items-center rounded-full border border-line-strong text-blush transition-transform duration-500',
              open && 'rotate-45 border-blush/50',
            )}
          >
            <IconPlus size={18} />
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={id}
            role="region"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="max-w-[70ch] pb-7 text-[16px] leading-relaxed text-mist">{a}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section id="faq" aria-labelledby="faq-title" className="shell py-[clamp(80px,10vw,140px)]">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
        <div>
          <Reveal>
            <Eyebrow index="06">Вопросы</Eyebrow>
          </Reveal>
          <SplitText id="faq-title" text="Коротко *о важном*" className="display mt-6 text-[clamp(2.6rem,5vw,4.6rem)] text-ink" />
        </div>
        <Reveal delay={0.1}>
          <div className="border-t border-line">
            {FAQ.map((f, i) => (
              <Item key={f.q} q={f.q} a={f.a} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
