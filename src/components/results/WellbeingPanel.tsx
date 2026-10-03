import type { Reading } from '@/lib/numerology'
import { ARCANA, POINTS, ROMAN } from '@/data/content'
import { Counter } from '@/components/ui/Motion'
import { IconCoin, IconHeart, IconSparkle } from '@/components/ui/Icon'
import { Block, Callout, EnergyCard } from './shared'
import { cn } from '@/lib/cn'

function Big({
  value,
  title,
  sub,
  text,
  icon,
  tone,
}: {
  value: number
  title: string
  sub: string
  text: string
  icon: React.ReactNode
  tone: 'money' | 'love'
}) {
  return (
    <div
      className={cn(
        'card relative overflow-hidden p-8 sm:p-10',
        tone === 'money' ? 'border-ok/25' : 'border-rose/30',
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute -top-1/3 -right-1/3 size-[110%]',
          tone === 'money'
            ? 'bg-[radial-gradient(closest-side,rgb(143_224_180/0.16),transparent_70%)]'
            : 'bg-[radial-gradient(closest-side,rgb(240_106_158/0.22),transparent_70%)]',
        )}
      />
      <div className="relative">
        <div className="flex items-center justify-between">
          <span className={cn('grid size-12 place-items-center rounded-full', tone === 'money' ? 'bg-ok/15 text-ok' : 'bg-rose/15 text-blush')}>
            {icon}
          </span>
          <span className="eyebrow">{sub}</span>
        </div>
        <div className="mt-10 flex items-end gap-5">
          <Counter
            value={value}
            className={cn('num text-[clamp(120px,14vw,180px)] leading-[0.8]', tone === 'money' ? 'text-ok' : 'text-grad-rose italic')}
          />
          <span className="mb-2 font-display text-[22px] leading-tight text-mist italic">
            {ROMAN[value]}
            <br />
            {ARCANA[value]}
          </span>
        </div>
        <h3 className="mt-8 font-display text-[clamp(30px,3vw,40px)] leading-none font-medium text-ink">{title}</h3>
        <p className="mt-3 max-w-[44ch] text-[15.5px] leading-relaxed text-mist">{text}</p>
      </div>
    </div>
  )
}

export function WellbeingPanel({ reading }: { reading: Reading }) {
  const m = reading.matrix
  return (
    <div className="flex flex-col gap-4">
      <Block>
        <p className="max-w-[78ch] text-[16px] leading-relaxed text-mist">
          <b className="font-semibold text-ink">Линия благополучия</b> — пять важнейших точек матрицы, которые наполняют и усиливают
          жизнь. На схеме она отмечена пунктиром между точками К и Л, а над ней нарисованы знак доллара и сердечко — поэтому две её
          главные энергии называют денежным каналом и каналом любви.
        </p>
      </Block>

      <div className="grid gap-4 md:grid-cols-2">
        <Big
          tone="money"
          value={m.money}
          title={POINTS.money.name}
          sub="«под долларом» · М + Л"
          text={POINTS.money.text}
          icon={<IconCoin size={22} />}
        />
        <Big
          tone="love"
          value={m.love}
          title={POINTS.love.name}
          sub="«под сердцем» · К + М"
          text={POINTS.love.text}
          icon={<IconHeart size={22} />}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <EnergyCard value={m.K} name={POINTS.K.name} note={POINTS.K.short} formula={POINTS.K.formula} />
        <EnergyCard value={m.L} name={POINTS.L.name} note={POINTS.L.short} formula={POINTS.L.formula} />
        <EnergyCard value={m.M} name={POINTS.M.name} note={POINTS.M.short} formula={POINTS.M.formula} />
      </div>

      <Callout icon={<IconSparkle size={18} />} title="Важно из методики:">
        дополнительные каналы — таланты, отношения, денежный канал — не работают в полную меру, если цель души и главная проработка в
        минусе. Поэтому разбор всегда начинается с них.
      </Callout>
    </div>
  )
}
