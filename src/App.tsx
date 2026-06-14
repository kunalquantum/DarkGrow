import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { AppShell } from '@/components/layout/app-shell'
import HomePage from '@/pages/home'
import TimelinePage from '@/pages/timeline'
import InsightsPage from '@/pages/insights'
import SearchPage from '@/pages/search'
import ObjectDetailPage from '@/pages/object-detail'
import JournalPage from '@/pages/journal'

function App() {
  const location = useLocation()

  return (
    <AppShell>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
        >
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/timeline" element={<TimelinePage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/journal" element={<JournalPage />} />
            <Route path="/object/:id" element={<ObjectDetailPage />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </AppShell>
  )
}

export default App
