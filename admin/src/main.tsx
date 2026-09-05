import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fortawesome/fontawesome-free/css/all.css'
import './index.css'
import App from './App.tsx'
import { ToastProvider } from './Toast.tsx'
import { I18nProvider } from './i18n.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </I18nProvider>
  </StrictMode>,
)
