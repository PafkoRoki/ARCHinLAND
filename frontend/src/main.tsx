import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
// kroje strony (lokalnie, bez Google Fonts):
// Space Grotesk — nagłówki, Inter Tight — logo ARCHinLAND,
// Inter — tekst, Space Mono — etykiety uppercase (styl BLAMAZ)
import '@fontsource-variable/inter'
import '@fontsource-variable/inter-tight'
import '@fontsource-variable/space-grotesk'
import '@fontsource/space-mono'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
