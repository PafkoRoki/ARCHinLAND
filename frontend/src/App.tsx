import { lazy, Suspense, useMemo } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import AppLoader from './layout/AppLoader'
import Footer from './layout/Footer'
import ProjectGate from './components/ProjectGate'
import RealizationDetail from './pages/RealizationDetail'
import Home from './pages/Home'
import { projects } from './data/realizations'
import { useSeo } from './hooks/useSeo'
import { homeMeta, realizationMeta } from './seo/meta'

// katalog projektów dostępny po haśle — ładowany dopiero po odblokowaniu
const CatalogPage = lazy(() => import('./pages/ProjectPages').then((m) => ({ default: m.CatalogPage })))
const DetailPage = lazy(() => import('./pages/ProjectPages').then((m) => ({ default: m.DetailPage })))

export default function App() {
  return (
    <BrowserRouter>
      <AppLoader />
      <RouteSeo />

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

// tytuł karty, opis i Open Graph zależne od adresu (te same dane co w plikach HTML z prerender.mjs)
function RouteSeo() {
  const { pathname } = useLocation()
  const page = useMemo(() => {
    const realization = pathname.match(/^\/realizacje\/([^/]+)/)
    if (realization) {
      const project = projects.find((p) => p.slug === realization[1])
      return project ? realizationMeta(project) : null
    }
    if (pathname.startsWith('/projekty')) {
      // katalog za hasłem — poza wyszukiwarką
      return { ...homeMeta(), path: pathname, title: 'Katalog projektów | ARCHinLAND', noindex: true }
    }
    return homeMeta()
  }, [pathname])
  useSeo(page)
  return null
}
