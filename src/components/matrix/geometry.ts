import type { Matrix } from '@/lib/numerology'

/**
 * Геометрия октаграммы матрицы в системе координат 0..1000.
 * Расположение точек повторяет схему из урока: А слева (0 лет), Б сверху (20 лет),
 * В справа (40 лет), Г снизу (60 лет); родовые точки — в углах прямого квадрата.
 */

export const C = 500
const R = 410
const k = Math.SQRT1_2

const polar = (r: number, deg: number) => {
  const a = (deg * Math.PI) / 180
  return { x: C + r * Math.cos(a), y: C - r * Math.sin(a) }
}

export type PointKind = 'personal' | 'center' | 'family' | 'axis' | 'diag' | 'wellbeing'

export interface PointDef {
  key: keyof Matrix
  x: number
  y: number
  kind: PointKind
  /** крупная подпись (буква точки) */
  label?: string
  /** возраст на внешнем кольце */
  age?: string
  name: string
  formula: string
}

const axis = (deg: number, r: number) => polar(r, deg)
const diag = (deg: number, r: number) => polar(r, deg)

export const P = {
  A: polar(R, 180),
  E: polar(R, 135),
  B: polar(R, 90),
  Zh: polar(R, 45),
  V: polar(R, 0),
  I: polar(R, -45),
  G: polar(R, -90),
  Z: polar(R, -135),
}

const L = axis(0, R * k) // на стороне прямого квадрата
const K = axis(-90, R * k)
const M = { x: (L.x + K.x) / 2, y: (L.y + K.y) / 2 }

export const POINT_DEFS: PointDef[] = [
  // личностный квадрат (ромб)
  { key: 'A', ...P.A, kind: 'personal', label: 'А', age: '0 лет', name: 'Базовый канал', formula: 'день рождения' },
  { key: 'B', ...P.B, kind: 'personal', label: 'Б', age: '20 лет', name: 'Канал интуиции', formula: 'месяц рождения' },
  { key: 'V', ...P.V, kind: 'personal', label: 'В', age: '40 лет', name: 'Повторяющиеся события', formula: 'сумма цифр года' },
  { key: 'G', ...P.G, kind: 'personal', label: 'Г', age: '60 лет', name: 'Главная проработка', formula: 'А + Б + В' },
  { key: 'D', x: C, y: C, kind: 'center', label: 'Д', name: 'Зона комфорта', formula: 'А + Б + В + Г' },
  // родовой квадрат
  { key: 'E', ...P.E, kind: 'family', label: 'Е', age: '10 лет', name: 'Мужчины мужского рода', formula: 'А + Б' },
  { key: 'Zh', ...P.Zh, kind: 'family', label: 'Ж', age: '30 лет', name: 'Мужчины женского рода', formula: 'Б + В' },
  { key: 'I', ...P.I, kind: 'family', label: 'И', age: '50 лет', name: 'Женщины мужского рода', formula: 'В + Г' },
  { key: 'Z', ...P.Z, kind: 'family', label: 'З', age: '70 лет', name: 'Женщины женского рода', formula: 'А + Г' },
  // точки на осях
  { key: 'A2', ...axis(180, 350), kind: 'axis', name: 'Линия базового канала', formula: 'А + (А + Д)' },
  { key: 'A1', ...axis(180, R * k), kind: 'axis', name: 'Линия базового канала', formula: 'А + Д' },
  { key: 'A3', ...axis(180, 165), kind: 'axis', name: 'Линия базового канала', formula: '(А + Д) + Д' },
  { key: 'B2', ...axis(90, 350), kind: 'axis', name: 'Линия канала интуиции', formula: 'Б + (Б + Д)' },
  { key: 'B1', ...axis(90, R * k), kind: 'axis', name: 'Линия канала интуиции', formula: 'Б + Д' },
  { key: 'B3', ...axis(90, 165), kind: 'axis', name: 'Линия канала интуиции', formula: '(Б + Д) + Д' },
  { key: 'V2', ...axis(0, 350), kind: 'axis', name: 'Между точками В и Л', formula: 'В + Л' },
  { key: 'G2', ...axis(-90, 350), kind: 'axis', name: 'Между точками Г и К', formula: 'Г + К' },
  // точки на диагоналях (родовые линии)
  { key: 'E2', ...diag(135, 330), kind: 'diag', name: 'Линия мужского рода', formula: '(Д + Е) + Е' },
  { key: 'E1', ...diag(135, 265), kind: 'diag', name: 'Линия мужского рода', formula: 'Д + Е' },
  { key: 'Zh2', ...diag(45, 330), kind: 'diag', name: 'Линия женского рода', formula: '(Д + Ж) + Ж' },
  { key: 'Zh1', ...diag(45, 265), kind: 'diag', name: 'Линия женского рода', formula: 'Д + Ж' },
  { key: 'I2', ...diag(-45, 330), kind: 'diag', name: 'Линия мужского рода', formula: '(Д + И) + И' },
  { key: 'I1', ...diag(-45, 265), kind: 'diag', name: 'Линия мужского рода', formula: 'Д + И' },
  { key: 'Z2', ...diag(-135, 330), kind: 'diag', name: 'Линия женского рода', formula: '(Д + З) + З' },
  { key: 'Z1', ...diag(-135, 265), kind: 'diag', name: 'Линия женского рода', formula: 'Д + З' },
  // линия благополучия
  { key: 'L', ...L, kind: 'wellbeing', label: 'Л', name: 'Точка Л', formula: 'Д + В' },
  { key: 'K', ...K, kind: 'wellbeing', label: 'К', name: 'Точка К', formula: 'Д + Г' },
  { key: 'M', ...M, kind: 'wellbeing', label: 'М', name: 'Центр линии благополучия', formula: 'К + Л' },
  {
    key: 'money',
    x: (M.x + L.x) / 2,
    y: (M.y + L.y) / 2,
    kind: 'wellbeing',
    label: '$',
    name: 'Денежный канал',
    formula: 'М + Л',
  },
  {
    key: 'love',
    x: (K.x + M.x) / 2,
    y: (K.y + M.y) / 2,
    kind: 'wellbeing',
    label: '♥',
    name: 'Канал любви',
    formula: 'К + М',
  },
]

export const WELLBEING = { K, L, M }

/** Пути для отрисовки линий схемы */
export function linePaths() {
  const pt = (p: { x: number; y: number }) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`
  const o = [P.A, P.E, P.B, P.Zh, P.V, P.I, P.G, P.Z]
  return {
    octagon: `M ${o.map(pt).join(' L ')} Z`,
    diamond: `M ${[P.A, P.B, P.V, P.G].map(pt).join(' L ')} Z`,
    square: `M ${[P.E, P.Zh, P.I, P.Z].map(pt).join(' L ')} Z`,
    axes: `M ${pt(P.A)} L ${pt(P.V)} M ${pt(P.B)} L ${pt(P.G)}`,
    male: `M ${pt(P.E)} L ${pt(P.I)}`,
    female: `M ${pt(P.Zh)} L ${pt(P.Z)}`,
    wellbeing: `M ${pt(K)} L ${pt(L)}`,
  }
}
