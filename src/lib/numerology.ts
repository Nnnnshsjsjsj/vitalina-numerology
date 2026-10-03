/**
 * Расчётное ядро. Все формулы взяты из материалов школы «PRO Числа»:
 *  - «Модуль 1, урок 2 — Расчёт матрицы» (точки А–И)
 *  - «Модуль 3, урок 1 — Метод расчёта дополнительных точек» (линия благополучия, предназначения)
 *  - «Урок 2.1 — Прогноз на год» (личный год, дополнительные числа, замыкания)
 * Каждая формула проверена на примерах из этих материалов — см. numerology.test.ts.
 */

export interface BirthDate {
  day: number
  month: number
  year: number
}

export const TARGET_YEAR = 2026

/* ------------------------------------------------------------------ базовые операции */

/** Сумма цифр числа: 1993 → 22 */
export function digitSum(n: number): number {
  return String(Math.abs(n))
    .split('')
    .reduce((s, d) => s + Number(d), 0)
}

/** Сведение к 1–9 (для личного года) */
export function reduceTo9(n: number): number {
  let v = n
  while (v > 9) v = digitSum(v)
  return v
}

/** Главное правило матрицы: в матрице 22 аркана — если число больше 22, складываем его цифры. */
export function arcana(n: number): number {
  let v = n
  while (v > 22) v = digitSum(v)
  return v
}

/* ------------------------------------------------------------------ дата */

/** Принимает «22.01.1988», «22/1/1988», «22 01 1988». Возвращает null, если даты не существует. */
export function parseDate(text: string): BirthDate | null {
  const m = text.trim().match(/^(\d{1,2})[.,/\-\s]+(\d{1,2})[.,/\-\s]+(\d{4})$/)
  if (!m) return null
  const day = Number(m[1])
  const month = Number(m[2])
  const year = Number(m[3])
  if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1) return null
  const daysInMonth = new Date(year, month, 0).getDate()
  if (day > daysInMonth) return null
  return { day, month, year }
}

export function formatDate(d: BirthDate, yearOverride?: number): string {
  const p = (n: number) => String(n).padStart(2, '0')
  return `${p(d.day)}.${p(d.month)}.${yearOverride ?? d.year}`
}

/* ------------------------------------------------------------------ личный год */

/** Личный год = день + месяц рождения + интересующий год, сведённые к 1–9. */
export function personalYear(day: number, month: number, year: number = TARGET_YEAR): number {
  return reduceTo9(digitSum(day) + digitSum(month) + digitSum(year))
}

/** Девятилетний цикл (эпицикл), начиная с указанного года */
export function cycle(d: BirthDate, from: number = TARGET_YEAR, length = 9) {
  return Array.from({ length }, (_, i) => {
    const year = from + i
    const n = personalYear(d.day, d.month, year)
    // 1–5 — нарастание энергии, 6–9 — спад
    const energy = n <= 5 ? n : 10 - n
    return { year, n, energy, rising: n <= 5 }
  })
}

/* ------------------------------------------------------------------ дополнительные числа и замыкания */

export interface ExtraNumbers {
  /** 1-е: сумма всех цифр даты */
  n1: number
  /** 2-е — базовое: сумма цифр 1-го */
  n2: number
  /** 3-е: 1-е минус удвоенная первая цифра дня */
  n3: number
  /** 4-е — родовое: сумма цифр 3-го */
  n4: number
}

export function extraNumbers(day: number, month: number, year: number): ExtraNumbers {
  const all = `${day}${String(month).padStart(2, '0')}${year}`
  const n1 = digitSum(Number(all))
  const n2 = digitSum(n1)
  const firstDayDigit = Number(String(day)[0])
  const n3 = Math.max(0, n1 - 2 * firstDayDigit)
  const n4 = digitSum(n3)
  return { n1, n2, n3, n4 }
}

/** 10, 11 и 12 могут совпадать и сами по себе, и через приведение к однозначному (1, 2, 3). */
export function numbersMatch(a: number, b: number): boolean {
  if (a === b) return true
  const reducible = (x: number) => x >= 10 && x <= 12
  if (reducible(a) && digitSum(a) === b) return true
  if (reducible(b) && digitSum(b) === a) return true
  return false
}

export type ClosureKind = 'resource' | 'direct' | 'reverse'

export interface YearCheck {
  birth: ExtraNumbers
  target: ExtraNumbers
  kinds: ClosureKind[]
}

/**
 * Сравнение дополнительных чисел даты рождения и той же даты в целевом году:
 *  - ресурсный год: дополнительные числа совпадают полностью (или через базовое и родовое)
 *  - прямое замыкание: базовое из даты рождения = родовому числу года
 *  - обратное замыкание: родовое из даты рождения = базовому числу года
 */
export function checkYear(d: BirthDate, targetYear: number = TARGET_YEAR): YearCheck {
  const birth = extraNumbers(d.day, d.month, d.year)
  const target = extraNumbers(d.day, d.month, targetYear)
  const kinds: ClosureKind[] = []
  const full = birth.n1 === target.n1 && birth.n3 === target.n3
  const viaBase = numbersMatch(birth.n2, target.n2) && numbersMatch(birth.n4, target.n4)
  if (full || viaBase) kinds.push('resource')
  if (numbersMatch(birth.n2, target.n4)) kinds.push('direct')
  if (numbersMatch(birth.n4, target.n2)) kinds.push('reverse')
  return { birth, target, kinds }
}

/* ------------------------------------------------------------------ матрица */

export interface Matrix {
  // личностный квадрат
  A: number // базовый канал — день
  B: number // канал интуиции — месяц
  V: number // повторяющиеся события — год
  G: number // главная проработка — А+Б+В
  D: number // зона комфорта — А+Б+В+Г
  // родовой квадрат
  E: number // мужчины мужского рода — А+Б
  Zh: number // мужчины женского рода — Б+В
  Z: number // женщины женского рода — А+Г
  I: number // женщины мужского рода — В+Г
  // линия благополучия
  K: number // Д+Г
  L: number // Д+В
  M: number // К+Л
  money: number // «под долларом» — М+Л
  love: number // «под сердцем» — К+М
  // дополнительные точки на линиях (по тому же принципу сложения)
  A1: number // А+Д
  A2: number // А+А1
  A3: number // А1+Д
  B1: number // Б+Д
  B2: number // Б+Б1
  B3: number // Б1+Д
  V2: number // В+Л
  G2: number // Г+К
  E1: number // Д+Е
  E2: number // Е1+Е
  Zh1: number
  Zh2: number
  Z1: number
  Z2: number
  I1: number
  I2: number
  // предназначения
  sky: number // небо — Б+Г
  earth: number // земля — А+В
  p1: number // поиск себя — небо+земля
  male: number // по мужскому роду — Е+И
  female: number // по женскому роду — Ж+З
  p2: number // социализация — муж.+жен.
  p3: number // духовная гармония — 1-е+2-е
  p4: number // планетарное — 2-е+3-е
}

export function calcMatrix(d: BirthDate): Matrix {
  const A = arcana(d.day)
  const B = arcana(d.month)
  const V = arcana(digitSum(d.year))
  const G = arcana(A + B + V)
  const D = arcana(A + B + V + G)

  const E = arcana(A + B)
  const Zh = arcana(B + V)
  const Z = arcana(A + G)
  const I = arcana(V + G)

  const K = arcana(D + G)
  const L = arcana(D + V)
  const M = arcana(K + L)
  const money = arcana(M + L)
  const love = arcana(K + M)

  const A1 = arcana(A + D)
  const A2 = arcana(A + A1)
  const A3 = arcana(A1 + D)
  const B1 = arcana(B + D)
  const B2 = arcana(B + B1)
  const B3 = arcana(B1 + D)
  const V2 = arcana(V + L)
  const G2 = arcana(G + K)

  const E1 = arcana(D + E)
  const E2 = arcana(E1 + E)
  const Zh1 = arcana(D + Zh)
  const Zh2 = arcana(Zh1 + Zh)
  const Z1 = arcana(D + Z)
  const Z2 = arcana(Z1 + Z)
  const I1 = arcana(D + I)
  const I2 = arcana(I1 + I)

  const sky = arcana(B + G)
  const earth = arcana(A + V)
  const p1 = arcana(sky + earth)
  const male = arcana(E + I)
  const female = arcana(Zh + Z)
  const p2 = arcana(male + female)
  const p3 = arcana(p1 + p2)
  const p4 = arcana(p2 + p3)

  return {
    A, B, V, G, D, E, Zh, Z, I, K, L, M, money, love,
    A1, A2, A3, B1, B2, B3, V2, G2, E1, E2, Zh1, Zh2, Z1, Z2, I1, I2,
    sky, earth, p1, male, female, p2, p3, p4,
  }
}

/* ------------------------------------------------------------------ сводка */

export interface Reading {
  date: BirthDate
  year: number
  keyMonths: { month: string; note: string; year: number; n: number }[]
  check: YearCheck
  matrix: Matrix
  cycle: ReturnType<typeof cycle>
}

/** Всё, что нужно странице результата, одним вызовом. */
export function read(d: BirthDate): Reading {
  return {
    date: d,
    year: personalYear(d.day, d.month, TARGET_YEAR),
    // из поста Виталины: август — задача прошлого года, сентябрь — число года, октябрь — проекция следующего
    keyMonths: [
      { month: 'Август', note: 'совпадает с задачей прошлого года', year: TARGET_YEAR - 1, n: personalYear(d.day, d.month, TARGET_YEAR - 1) },
      { month: 'Сентябрь', note: 'совпадает с числом года — самый важный месяц', year: TARGET_YEAR, n: personalYear(d.day, d.month, TARGET_YEAR) },
      { month: 'Октябрь', note: 'проекция будущего года', year: TARGET_YEAR + 1, n: personalYear(d.day, d.month, TARGET_YEAR + 1) },
    ],
    check: checkYear(d, TARGET_YEAR),
    matrix: calcMatrix(d),
    cycle: cycle(d, TARGET_YEAR),
  }
}
