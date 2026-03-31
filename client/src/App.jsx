import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import WelcomePage from './pages/WelcomePage.jsx';
import TestPage from './pages/TestPage.jsx';
import ResultsPage from './pages/ResultsPage.jsx';

export default function App() {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-rose-50 flex flex-col">
      <div className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </div>
      <footer className="text-center py-5 text-xs text-rose-300 no-print space-y-1">
        <div>
          © {new Date().getFullYear()}{' '}
          <a href="https://acuity.ai" className="text-rose-500 hover:text-rose-700 font-semibold transition-colors">
            Acuity
          </a>
          {' '}· All rights reserved
        </div>
        <div>
          Powered by{' '}
          <a href="https://www.elenos.ai/" target="_blank" rel="noopener noreferrer"
            className="text-rose-400 hover:text-rose-600 font-semibold transition-colors">
            Elenos
          </a>
        </div>
      </footer>
    </div>
  );
}
