import { Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout/app-shell'
import HomePage from '@/pages/home'
import TimelinePage from '@/pages/timeline'
import InsightsPage from '@/pages/insights'
import SearchPage from '@/pages/search'
import ObjectDetailPage from '@/pages/object-detail'

function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/timeline" element={<TimelinePage />} />
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/object/:id" element={<ObjectDetailPage />} />
      </Routes>
    </AppShell>
  )
}

export default App
