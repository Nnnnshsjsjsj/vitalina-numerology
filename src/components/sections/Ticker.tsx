import { Marquee } from '@/components/ui/Motion'
import { IconSparkle } from '@/components/ui/Icon'

const WORDS = [
  'Личный год',
  'Матрица судьбы',
  'Денежный канал',
  'Канал любви',
  'Зона комфорта',
  'Родовой квадрат',
  'Предназначение',
  'Эпицикл',
]

export function Ticker() {
  return (
    <div className="relative border-y border-line bg-night/60 py-5" aria-hidden="true">
      <Marquee duration={56}>
        {WORDS.map((w) => (
          <span key={w} className="flex items-center">
            <span className="px-7 font-display text-[clamp(26px,3.4vw,42px)] leading-none text-mist italic">{w}</span>
            <IconSparkle size={18} className="text-gold" />
          </span>
        ))}
      </Marquee>
    </div>
  )
}
