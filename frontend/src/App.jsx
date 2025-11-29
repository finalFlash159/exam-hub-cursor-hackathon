import React, { useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
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
            <Route path={ROUTES.FAQ} element={<div>FAQ - Coming Soon</div>} />
            <Route path={ROUTES.PRICING} element={<div>Pricing - Coming Soon</div>} />
            <Route path={ROUTES.SUBJECTS} element={<div>Subjects - Coming Soon</div>} />

            {/* Default redirect */}
            <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
          </Routes>
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
