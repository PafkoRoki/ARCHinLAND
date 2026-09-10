import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppLoader from './components/AppLoader'
import { ProjectCatalog } from './components/ProjectCatalog/ProjectCatalog'
import { ProjectDetail } from './components/ProjectCatalog/ProjectDetail'
import { projects } from './data/projects'
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}