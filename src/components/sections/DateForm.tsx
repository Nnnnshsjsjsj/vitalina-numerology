import { AnimatePresence, motion } from 'motion/react'
import { useId, useState } from 'react'
import { cn } from '@/lib/cn'
import { parseDate, type BirthDate } from '@/lib/numerology'
import { Button } from '@/components/ui/Button'
import { IconArrowRight } from '@/components/ui/Icon'

/** Расставляет точки по мере ввода: 16021993 → 16.02.1993 */
function mask(raw: string): string {
  const v = raw.replace(/\D/g, '').slice(0, 8)
  let out = v.slice(0, 2)
  if (v.length > 2) out += '.' + v.slice(2, 4)
  if (v.length > 4) out += '.' + v.slice(4, 8)
  return out
}

export function DateForm({
  onSubmit,
  initial = '',
  compact,
}: {
  onSubmit: (d: BirthDate) => void
  initial?: string
  compact?: boolean
}) {
  const id = useId()
  const [value, setValue] = useState(initial)
  const [error, setError] = useState<string | null>(null)

  const validate = (v: string): BirthDate | null => {
    if (v.replace(/\D/g, '').length < 8) {
      setError('Нужна полная дата: день, месяц и год — например, 22.01.1988')
      return null
    }
    const d = parseDate(v)
    if (!d) {
      setError('Такой даты нет в календаре — проверь день и месяц')
      return null
    }
    setError(null)
    return d
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const d = validate(value)
    if (d) onSubmit(d)
  }

  return (
    <form onSubmit={submit} noValidate className={cn('w-full', compact ? 'max-w-[520px]' : 'max-w-[540px]')}>
      <label htmlFor={id} className="eyebrow mb-3 block text-mist">
        Дата рождения
      </label>
      <div
        className={cn(
          'flex flex-col gap-2 rounded-[28px] border bg-night/70 p-2 backdrop-blur-md transition-[border-color,box-shadow] duration-300 sm:flex-row sm:items-center',
          error
            ? 'border-bad/70 shadow-[0_0_0_4px_rgb(255_143_160/0.12)]'
            : 'border-line-strong focus-within:border-blush/60 focus-within:shadow-[0_0_0_4px_rgb(240_106_158/0.14)]',
        )}
      >
        <input
          id={id}
          value={value}
          onChange={(e) => {
            setValue(mask(e.target.value))
            if (error) setError(null)
          }}
          onBlur={() => value.length > 0 && value.replace(/\D/g, '').length === 8 && validate(value)}
          inputMode="numeric"
          autoComplete="bday"
          placeholder="ДД.ММ.ГГГГ"
          maxLength={10}
          aria-invalid={Boolean(error)}
          aria-describedby={`${id}-hint ${error ? `${id}-err` : ''}`}
          className="num h-14 min-w-0 flex-1 rounded-full bg-transparent px-5 text-[26px] tracking-[0.08em] text-ink placeholder:text-dim/70 focus:outline-none"
        />
        <Button type="submit" size="lg" magnetic iconRight={<IconArrowRight size={18} />} className="w-full sm:w-auto">
          Рассчитать
        </Button>
      </div>
      <AnimatePresence initial={false}>
        {error ? (
          <motion.p
            id={`${id}-err`}
            role="alert"
            className="mt-3 pl-2 text-[14px] text-bad"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {error}
          </motion.p>
        ) : null}
      </AnimatePresence>
      <p id={`${id}-hint`} className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 pl-2 text-[13.5px] text-dim">
        <span>10 секунд</span>
        <span aria-hidden="true" className="size-1 rounded-full bg-dim/60" />
        <span>без регистрации</span>
        <span aria-hidden="true" className="size-1 rounded-full bg-dim/60" />
        <span>считается прямо в браузере</span>
        <button
          type="button"
          onClick={() => {
            setValue('16.02.1993')
            setError(null)
            const d = parseDate('16.02.1993')
            if (d) onSubmit(d)
          }}
          className="ml-auto rounded-full text-blush underline decoration-blush/40 underline-offset-4 transition-colors hover:text-petal"
        >
          посмотреть пример
        </button>
      </p>
    </form>
  )
}
