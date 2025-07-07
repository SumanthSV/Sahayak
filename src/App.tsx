import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './hooks/useAuth';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { LanguageProvider } from './contexts/LanguageContext';
import { LoadingSpinner } from './components/UI/LoadingSpinner';
import { OfflineIndicator } from './components/UI/OfflineIndicator';

// Lazy load components for better performance
const LoginForm = React.lazy(() => import('./components/Auth/LoginForm'));
const SignupForm = React.lazy(() => import('./components/Auth/SignupForm'));
const Layout = React.lazy(() => import('./components/Layout/Layout'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const StoryGenerator = React.lazy(() => import('./pages/StoryGenerator'));
const WorksheetGenerator = React.lazy(() => import('./pages/WorksheetGenerator'));
const ConceptExplainer = React.lazy(() => import('./pages/ConceptExplainer'));
const VisualAids = React.lazy(() => import('./pages/VisualAids'));
const VoiceAssessment = React.lazy(() => import('./pages/VoiceAssessment'));
const LessonPlanner = React.lazy(() => import('./pages/LessonPlanner'));
const StudentTracker = React.lazy(() => import('./pages/StudentTracker'));
const Settings = React.lazy(() => import('./pages/Settings'));

function App() {
  const { user, loading } = useAuth();
  const isOnline = useOnlineStatus();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <OfflineIndicator isOnline={isOnline} />
        
        <AnimatePresence mode="wait">
          <Suspense fallback={<LoadingSpinner />}>
            {!user ? (
              <Routes>
                <Route path="/signup" element={
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SignupForm />
                  </motion.div>
                } />
                <Route path="/*" element={
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <LoginForm />
                  </motion.div>
                } />
              </Routes>
            ) : (
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="stories" element={<StoryGenerator />} />
                  <Route path="worksheets" element={<WorksheetGenerator />} />
                  <Route path="concepts" element={<ConceptExplainer />} />
                  <Route path="visuals" element={<VisualAids />} />
                  <Route path="assessment" element={<VoiceAssessment />} />
                  <Route path="planner" element={<LessonPlanner />} />
                  <Route path="tracking" element={<StudentTracker />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            )}
          </Suspense>
        </AnimatePresence>
      </div>
    </LanguageProvider>
  );
}

export default App;