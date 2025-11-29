import React, { useMemo, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { PreferencesProvider, usePreferences } from './contexts/PreferencesContext';
import { SidebarProvider } from './context/SidebarContext';
import { ErrorBoundary } from './components/common';
import { ROUTES } from './config/routes';
import { neumorphicTheme } from './theme/neumorphicTheme';
import { darkTheme } from './theme/darkTheme';
import LandingPage from './features/landing/pages/LandingPage';
import DashboardPage from './features/dashboard/pages/DashboardPage';
import ExamListPage from './features/exams/pages/ExamListPage';
import ExamCreatePage from './features/exams/pages/ExamCreatePage';
import ExamTakePage from './features/exams/pages/ExamTakePage';
import ExamResultPage from './features/exams/pages/ExamResultPage';
import HistoryPage from './features/history/pages/HistoryPage';
import ProfilePage from './features/profile/pages/ProfilePage';
import SettingsPage from './features/settings/pages/SettingsPage';
import FAQPage from './pages/FAQPage';
import PricingPage from './pages/PricingPage';
import SubjectsPage from './pages/SubjectsPage';

// Loading component
const LoadingFallback = () => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      bgcolor: '#f9fafb',
    }}
  >
    <Box sx={{ textAlign: 'center' }}>
      <Box
        sx={{
          width: 40,
          height: 40,
          border: '4px solid #e5e7eb',
          borderTopColor: '#3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto',
          '@keyframes spin': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' },
          },
        }}
      />
    </Box>
  </Box>
);

/**
 * AppContent Component - Handles routing and theme switching
 * Placed inside PreferencesProvider to access usePreferences hook
 */
function AppContent() {
  const { preferences } = usePreferences();

  // Determine theme based on preferences
  const theme = useMemo(() => {
    if (preferences.theme === 'dark') {
      return darkTheme;
    }
    return neumorphicTheme;
  }, [preferences.theme]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Router>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Public routes */}
              <Route path={ROUTES.HOME} element={<LandingPage />} />
              
              {/* Main routes - all accessible without auth */}
              <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
              <Route path={ROUTES.EXAMS} element={<ExamListPage />} />
              <Route path={ROUTES.EXAM_CREATE} element={<ExamCreatePage />} />
              <Route path={ROUTES.EXAM_TAKE} element={<ExamTakePage />} />
              <Route path={ROUTES.EXAM_RESULT} element={<ExamResultPage />} />
              <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
              <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
              <Route path={ROUTES.HISTORY} element={<HistoryPage />} />
              <Route path={ROUTES.FAQ} element={<FAQPage />} />
              <Route path={ROUTES.PRICING} element={<PricingPage />} />
              <Route path={ROUTES.SUBJECTS} element={<SubjectsPage />} />

              {/* Default redirect */}
              <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
            </Routes>
          </Suspense>
        </Router>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <PreferencesProvider>
        <SidebarProvider>
          <AppContent />
        </SidebarProvider>
      </PreferencesProvider>
    </ErrorBoundary>
  );
}

export default App;
