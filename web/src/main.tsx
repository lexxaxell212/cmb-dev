import '@fontsource-variable/inter'
import '@fontsource-variable/playfair-display'
import '@fontsource-variable/lora'
import '@fontsource/courier-prime/400.css'
import '@fontsource/courier-prime/700.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LanguageProvider } from './i18n/LanguageContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
)
