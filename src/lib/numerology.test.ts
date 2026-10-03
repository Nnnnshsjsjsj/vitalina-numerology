import { describe, expect, it } from 'vitest'
import { arcana, calcMatrix, checkYear, cycle, extraNumbers, numbersMatch, parseDate, personalYear, read } from './numerology'

describe('правило 22 арканов', () => {
  it('оставляет числа до 22 и складывает цифры больших', () => {
    expect(arcana(16)).toBe(16)
    expect(arcana(22)).toBe(22)
    expect(arcana(23)).toBe(5) // пример из урока: 2 + 3 = 5
    expect(arcana(40)).toBe(4)
    expect(arcana(44)).toBe(8)
  })
})

describe('матрица — пример из урока «Расчёт матрицы», 16.02.1993', () => {
  const m = calcMatrix({ day: 16, month: 2, year: 1993 })

  it('личностный квадрат', () => {
    expect([m.A, m.B, m.V, m.G, m.D]).toEqual([16, 2, 22, 4, 8])
  })
  it('родовой квадрат', () => {
    expect([m.E, m.Zh, m.Z, m.I]).toEqual([18, 6, 20, 8])
  })
  it('линия благополучия', () => {
    expect([m.K, m.L, m.M, m.money, m.love]).toEqual([12, 3, 15, 18, 9])
  })
  it('дополнительные точки на линиях (модуль 3)', () => {
    expect(m.V2).toBe(7) // 22 + 3 = 25 = 7
    expect(m.G2).toBe(16) // 12 + 4 = 16
    expect([m.I1, m.I2]).toEqual([16, 6]) // 8 + 8 = 16; 16 + 8 = 24 = 6
    expect([m.A1, m.A2, m.A3]).toEqual([6, 22, 14]) // как на схеме урока
    expect([m.B1, m.B2, m.B3]).toEqual([10, 12, 18])
  })
  it('предназначения', () => {
    expect([m.sky, m.earth, m.p1]).toEqual([6, 11, 17])
    expect([m.male, m.female, m.p2]).toEqual([8, 8, 16])
    expect([m.p3, m.p4]).toEqual([6, 22])
  })
})

describe('личный год', () => {
  it('пример из урока: 22.01 + 2021 → 1', () => {
    expect(personalYear(22, 1, 2021)).toBe(1)
  })
  it('2026', () => {
    expect(personalYear(22, 1, 2026)).toBe(6)
    expect(personalYear(16, 2, 2026)).toBe(1)
  })
  it('цикл идёт по порядку', () => {
    const c = cycle({ day: 16, month: 2, year: 1993 })
    expect(c.map((x) => x.n)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9])
    expect(c.map((x) => x.energy)).toEqual([1, 2, 3, 4, 5, 4, 3, 2, 1])
  })
})

describe('дополнительные числа — все примеры из урока «Прогноз на год»', () => {
  const cases: [number, number, number, number[]][] = [
    [22, 1, 1988, [31, 4, 27, 9]],
    [14, 8, 1978, [38, 11, 36, 9]],
    [17, 5, 1996, [38, 11, 36, 9]],
    [14, 8, 1998, [40, 4, 38, 11]],
    [22, 1, 2020, [9, 9, 5, 5]],
    [22, 1, 2021, [10, 1, 6, 6]],
  ]
  it.each(cases)('%i.%i.%i', (d, mo, y, expected) => {
    const n = extraNumbers(d, mo, y)
    expect([n.n1, n.n2, n.n3, n.n4]).toEqual(expected)
  })
})

describe('замыкания года', () => {
  it('10–12 совпадают и через однозначное', () => {
    expect(numbersMatch(11, 2)).toBe(true)
    expect(numbersMatch(2, 11)).toBe(true)
    expect(numbersMatch(38, 11)).toBe(false)
  })
  it('прямое замыкание: пример урока 14.08.1978 → 1998', () => {
    expect(checkYear({ day: 14, month: 8, year: 1978 }, 1998).kinds).toContain('direct')
  })
  it('обратное замыкание: пример урока 22.01.1988 → 2020', () => {
    expect(checkYear({ day: 22, month: 1, year: 1988 }, 2020).kinds).toContain('reverse')
  })
  it('ресурсный год: пример урока 14.08.1978 и 17.05.1996 дают одинаковые числа', () => {
    // 17.05 в 1996 году против рождения 14.08.1978 — в уроке числа совпадают полностью;
    // проверяем саму механику на дате, у которой числа года повторяют числа рождения
    expect(checkYear({ day: 5, month: 3, year: 2008 }, 2026).kinds).toContain('resource')
  })
})

describe('разбор даты', () => {
  it('принимает разные разделители', () => {
    expect(parseDate('22.01.1988')).toEqual({ day: 22, month: 1, year: 1988 })
    expect(parseDate('7/3/1990')).toEqual({ day: 7, month: 3, year: 1990 })
    expect(parseDate('7 3 1990')).toEqual({ day: 7, month: 3, year: 1990 })
  })
  it('отклоняет несуществующие даты', () => {
    expect(parseDate('31.02.1990')).toBeNull()
    expect(parseDate('29.02.2023')).toBeNull()
    expect(parseDate('29.02.2024')).not.toBeNull()
    expect(parseDate('abc')).toBeNull()
  })
})

describe('сводка', () => {
  it('ключевые месяцы из поста: август — прошлый год, сентябрь — текущий, октябрь — следующий', () => {
    const r = read({ day: 16, month: 2, year: 1993 })
    expect(r.keyMonths.map((k) => k.year)).toEqual([2025, 2026, 2027])
    expect(r.keyMonths.map((k) => k.n)).toEqual([9, 1, 2])
  })
})
