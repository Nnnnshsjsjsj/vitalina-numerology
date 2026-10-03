import { AnimatePresence } from 'motion/react'
import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { formatDate, parseDate, read, type BirthDate, type Reading } from '@/lib/numerology'
import { lockScroll, scrollToId, startSmoothScroll, stopSmoothScroll } from '@/lib/scroll'
import { Preloader, shouldShowPreloader } from '@/components/sections/Preloader'
import { Nav } from '@/components/sections/Nav'
import { Hero } from '@/components/sections/Hero'
import { Ticker } from '@/components/sections/Ticker'
import { Manifesto } from '@/components/sections/Manifesto'
import { Features } from '@/components/sections/Features'
import { Offer } from '@/components/sections/Offer'
import { Method } from '@/components/sections/Method'
import { About } from '@/components/sections/About'
import { BotPromo } from '@/components/sections/BotPromo'
import { Faq } from '@/components/sections/Faq'
import { Footer } from '@/components/sections/Footer'

// результат грузится отдельным файлом — первый экран открывается быстрее
const Results = lazy(() => import('@/components/results/Results').then((m) => ({ default: m.Results })))

/** Дата из ссылки вида ?d=16.02.1993 — чтобы результатом можно было поделиться */
function dateFromUrl(): BirthDate | null {
  try {
    const d = new URLSearchParams(window.location.search).get('d')
    return d ? parseDate(d) : null
  } catch {
    return null
  }
}

function writeUrl(d: BirthDate | null) {
  try {
    const url = new URL(window.location.href)
    if (d) url.searchParams.set('d', formatDate(d))
    else url.searchParams.delete('d')
    window.history.replaceState(null, '', url)
  } catch {
    /* в песочнице history может быть недоступна */
  }
}

export default function App() {
  const [intro, setIntro] = useState(shouldShowPreloader)
  const [reading, setReading] = useState<Reading | null>(() => {
    const d = dateFromUrl()
    return d ? read(d) : null
  })

  const finishIntro = useCallback(() => setIntro(false), [])

  useEffect(() => {
    lockScroll(intro)
    if (!intro) startSmoothScroll()
    return () => {
      if (!intro) stopSmoothScroll()
    }
  }, [intro])

  // если пришли по ссылке с датой — сразу к результату
  useEffect(() => {
    if (reading && !intro) window.setTimeout(() => scrollToId('result'), 400)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intro])

  const calculate = useCallback((d: BirthDate) => {
    setReading(read(d))
    writeUrl(d)
    window.setTimeout(() => scrollToId('result'), 80)
  }, [])

  const reset = useCallback(() => {
    writeUrl(null)
    scrollToId('top', 0)
    window.setTimeout(() => {
      const input = document.querySelector<HTMLInputElement>('#calc input')
      input?.focus({ preventScroll: true })
    }, 900)
  }, [])

  return (
    <>
      <AnimatePresence>{intro ? <Preloader key="intro" onDone={finishIntro} /> : null}</AnimatePresence>
      <div className="grain" aria-hidden="true" />

      <a
        href="#calc"
        className="sr-only z-[200] rounded-full bg-ink px-4 py-2 text-void focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        К расчёту
      </a>

      <Nav hasResult={Boolean(reading)} />
      <main>
        <Hero ready={!intro} onSubmit={calculate} />
        <Ticker />
        {reading ? (
          <Suspense fallback={<div id="result" className="min-h-[60vh]" />}>
            <Results reading={reading} onReset={reset} />
          </Suspense>
        ) : null}
        <Manifesto />
        <Features onStart={() => scrollToId('top', 0)} />
        <Offer />
        <Method />
        <About />
        <BotPromo />
        <Faq />
      </main>
      <Footer />
    </>
  )
}
