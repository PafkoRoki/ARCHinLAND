import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppLoader from './layout/AppLoader'
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
    </BrowserRouter>
  )
}
