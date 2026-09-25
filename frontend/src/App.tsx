import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppLoader from './layout/AppLoader'
import { ProjectCatalog } from './components/ProjectCatalog'
import { ProjectDetail } from './pages/ProjectDetail'
import { projects } from './data/projects'
import RealizationDetail from './pages/RealizationDetail'
import Home from './pages/Home'

export default function App() {
  return (
    <BrowserRouter>
      <AppLoader />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/projekty"
          element={<ProjectCatalog projects={projects} />}
        />
        <Route
          path="/projekty/:slug"
          element={<ProjectDetail projects={projects} />}
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