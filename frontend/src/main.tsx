import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
// kroje strony z własnego serwera (bez Google Fonts, więc przeglądarka nie łączy się z Google):
// Montserrat: cała strona; Inter Tight: tylko logo ARCHinLAND (SVG) i gruby numer telefonu
import '@fontsource-variable/montserrat'
import '@fontsource-variable/inter-tight'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
