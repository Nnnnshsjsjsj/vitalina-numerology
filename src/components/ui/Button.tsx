import { motion, useMotionValue, useSpring } from 'motion/react'
import { useRef, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { useReducedMotion } from '@/lib/motion'

type Variant = 'primary' | 'ghost' | 'gold'
type Size = 'md' | 'lg'

interface Props {
  children: ReactNode
  variant?: Variant
  size?: Size
  href?: string
  external?: boolean
  onClick?: () => void
  type?: 'button' | 'submit'
  iconRight?: ReactNode
  icon?: ReactNode
  magnetic?: boolean
  className?: string
  ariaLabel?: string
}

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-rose text-void shadow-[0_14px_40px_-12px_rgb(240_106_158/0.7),inset_0_1px_0_rgb(255_255_255/0.35)] hover:bg-blush',
  ghost: 'border border-line-strong bg-white/[0.03] text-ink hover:border-blush/50 hover:bg-white/[0.07]',
  gold: 'bg-gold text-void shadow-[0_14px_40px_-14px_rgb(233_201_149/0.6),inset_0_1px_0_rgb(255_255_255/0.4)] hover:bg-[#f3dcb4]',
}

const SIZES: Record<Size, string> = {
  md: 'h-11 px-5 text-[14.5px] gap-2',
  lg: 'h-14 px-7 text-[15.5px] gap-2.5',
}

/** Кнопка/ссылка. magnetic — мягко тянется за курсором (как в референсах), выключается при reduced motion. */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  external,
  onClick,
  type = 'button',
  iconRight,
  icon,
  magnetic,
  className,
  ariaLabel,
}: Props) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 })
  const live = magnetic && !reduced

  const onMove = (e: React.PointerEvent) => {
    if (!live || e.pointerType !== 'mouse' || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * 0.22)
    y.set((e.clientY - (r.top + r.height / 2)) * 0.32)
  }
  const onLeave = () => {
    x.set(0)
    y.set(0)
  }

  const classes = cn(
    'relative inline-flex select-none items-center justify-center rounded-full font-semibold tracking-[-0.01em] whitespace-nowrap',
    'transition-[background-color,border-color,color,box-shadow] duration-300 ease-[var(--ease-silk)]',
    'active:scale-[0.98] cursor-pointer',
    VARIANTS[variant],
    SIZES[size],
    className,
  )

  const inner = (
    <>
      {icon}
      <span>{children}</span>
      {iconRight}
    </>
  )

  const style = live ? { x: sx, y: sy } : undefined

  if (href) {
    return (
      <motion.a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        aria-label={ariaLabel}
        className={classes}
        style={style}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        onClick={onClick}
      >
        {inner}
      </motion.a>
    )
  }
  return (
    <motion.button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      aria-label={ariaLabel}
      className={classes}
      style={style}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onClick={onClick}
    >
      {inner}
    </motion.button>
  )
}
