# Сайт Виталины Кондрат — «Ночь чисел»

Vite + React 19 + TypeScript + Tailwind CSS v4. Анимации — `motion`, плавный скролл — `lenis`.
Все расчёты (личный год 2026, проверки года, матрица судьбы, благополучие, предназначения, цикл)
считаются прямо в браузере — сервер не нужен, хостинг бесплатный.

## Запуск

Нужен Node.js 20+.

```bash
npm install
npm run dev        # http://localhost:5173 — разработка
npm run build      # готовый сайт в папке dist/
npm run preview    # посмотреть собранный dist/
npm test           # 22 теста формул (сверены с примерами курса)
```

`npm run build:single` — весь сайт одним файлом `dist-single/index.html` (можно открыть двойным кликом или отправить в Telegram).

## Публикация бесплатно

**Cloudflare Pages** (тот же аккаунт, что у бота):
Workers & Pages → Create → Pages → *Upload assets* → перетащить содержимое папки `dist/` → Deploy.
Сайт получит адрес вида `vitalina.pages.dev`; свой домен подключается там же во вкладке *Custom domains*.

**GitHub Pages** тоже подойдёт — в `vite.config.ts` уже стоит `base: './'`, поэтому сайт работает из любой подпапки.

## Где что менять

| Что | Файл |
|---|---|
| Ссылки на Telegram и бота, цена, кодовое слово «2026» | `src/data/content.ts` → `LINKS`, `OFFER` |
| Названия арканов 1–22 | `src/data/content.ts` → `ARCANA` |
| Тексты точек матрицы (А, Б, В, Г, Д…) | `src/data/content.ts` → `POINTS` |
| Вопросы и ответы | `src/data/content.ts` → `FAQ` |
| Описания личных лет 1–9 | `src/data/years.ts` |
| Текст «Обо мне» | `src/components/sections/About.tsx` |
| Год прогноза (сейчас 2026) | `src/lib/numerology.ts` → `TARGET_YEAR` |
| Цвета и шрифты | `src/index.css` → блок `@theme` |

## Фотографии

Лежат в `src/assets/photos/` в формате `.webp` (лучше до 1600 px по длинной стороне).
Чтобы заменить фото — положите файл с тем же именем. Чтобы добавить новое — положите файл
и импортируйте его в нужной секции, например:

```tsx
import photo from '@/assets/photos/hydrangea.webp'
<img src={photo} alt="Виталина" loading="lazy" />
```

## Ссылка на расчёт

Результатом можно поделиться: `адрес-сайта/?d=16.02.1993` сразу открывает расчёт по этой дате.

## Структура

```
src/
  lib/numerology.ts      формулы (+ numerology.test.ts)
  data/                  все тексты
  components/sections/   секции лендинга (Hero, Offer, Method, About, FAQ…)
  components/results/    вкладки результата
  components/matrix/     схема матрицы (SVG)
  components/ui/         кнопки, иконки, анимации
```
