import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
// kroje strony (lokalnie, bez Google Fonts): Inter Tight — nagłówki, Inter — tekst
import '@fontsource-variable/inter'
import '@fontsource-variable/inter-tight'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
