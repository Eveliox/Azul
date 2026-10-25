import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { LanguageProvider } from './contexts/LanguageContext.jsx'
import './index.css'
import './agents.css'
import './theme.css'
import './brand.css'
import './hero.css'
import './hero-refinements.css'
import './hero-reference.css'
import './growth-dashboard.css'
import './home.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>,
)


import './site.css'
import './service-visuals.css'
