import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import AppLoader from './layout/AppLoader'
import Footer from './layout/Footer'
import ProjectGate from './components/ProjectGate'
import RealizationDetail from './pages/RealizationDetail'
import Home from './pages/Home'

// katalog projektów dostępny po haśle — ładowany dopiero po odblokowaniu
const CatalogPage = lazy(() => import('./pages/ProjectPages').then((m) => ({ default: m.CatalogPage })))
const DetailPage = lazy(() => import('./pages/ProjectPages').then((m) => ({ default: m.DetailPage })))

export default function App() {
  return (
    <BrowserRouter>
      <AppLoader />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/projekty"
          element={
            <ProjectGate>
              <Suspense fallback={null}>
                <CatalogPage />
              </Suspense>
            </ProjectGate>
          }
        />
        <Route
          path="/projekty/:slug"
          element={
            <ProjectGate>
              <Suspense fallback={null}>
                <DetailPage />
              </Suspense>
            </ProjectGate>
          }
        />
        <Route
          path="/realizacje/:slug"
          element={<RealizationDetail />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <SubpageFooter />
    </BrowserRouter>
  )
}

// stopka na podstronach (katalog, projekt, realizacja); Home renderuje własną
function SubpageFooter() {
  const { pathname } = useLocation()
  if (pathname === '/') return null
  return <Footer key={pathname} /> // key: nowe losowe zdjęcie przy każdej podstronie
}
