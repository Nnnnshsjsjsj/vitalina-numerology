import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// шрифты — только латиница и кириллица, чтобы не тянуть лишние наборы
import '@fontsource/cormorant/cyrillic-400.css'
import '@fontsource/cormorant/latin-400.css'
import '@fontsource/cormorant/cyrillic-500.css'
import '@fontsource/cormorant/latin-500.css'
import '@fontsource/cormorant/cyrillic-600.css'
import '@fontsource/cormorant/latin-600.css'
import '@fontsource/cormorant/cyrillic-400-italic.css'
import '@fontsource/cormorant/latin-400-italic.css'
import '@fontsource/cormorant/cyrillic-500-italic.css'
import '@fontsource/cormorant/latin-500-italic.css'
import '@fontsource-variable/onest/wght.css'
import '@fontsource/jetbrains-mono/cyrillic-400.css'
import '@fontsource/jetbrains-mono/latin-400.css'
import '@fontsource/jetbrains-mono/latin-500.css'

import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
