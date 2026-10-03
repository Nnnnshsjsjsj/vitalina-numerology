import Lenis from 'lenis'
import { prefersReducedMotion } from './motion'

let lenis: Lenis | null = null
let raf = 0

/** Инерционный скролл (как в референсах) — выключен при «уменьшить движение» */
export function startSmoothScroll() {
  if (lenis || prefersReducedMotion()) return
  lenis = new Lenis({ duration: 1.1, smoothWheel: true })
  const loop = (t: number) => {
    lenis?.raf(t)
    raf = requestAnimationFrame(loop)
  }
  raf = requestAnimationFrame(loop)
}

export function stopSmoothScroll() {
  cancelAnimationFrame(raf)
  lenis?.destroy()
  lenis = null
}

export function scrollToId(id: string, offset = -88) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) lenis.scrollTo(el, { offset, duration: 1.3 })
  else {
    const top = el.getBoundingClientRect().top + window.scrollY + offset
    window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }
}

export function lockScroll(locked: boolean) {
  if (lenis) {
    if (locked) lenis.stop()
    else lenis.start()
  }
  document.documentElement.style.overflow = locked ? 'hidden' : ''
}
