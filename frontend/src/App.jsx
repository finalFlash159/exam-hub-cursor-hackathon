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
            <Route path={ROUTES.HOME} element={<div>Landing Page - Coming Soon</div>} />
            
            {/* Main routes - all accessible without auth */}
            <Route path={ROUTES.DASHBOARD} element={<div>Dashboard - Coming Soon</div>} />
            <Route path={ROUTES.EXAMS} element={<div>Exam List - Coming Soon</div>} />
            <Route path={ROUTES.EXAM_CREATE} element={<div>Create Exam - Coming Soon</div>} />
            <Route path={ROUTES.EXAM_TAKE} element={<div>Take Exam - Coming Soon</div>} />
            <Route path={ROUTES.EXAM_RESULT} element={<div>Exam Result - Coming Soon</div>} />
            <Route path={ROUTES.PROFILE} element={<div>Profile - Coming Soon</div>} />
            <Route path={ROUTES.SETTINGS} element={<div>Settings - Coming Soon</div>} />
            <Route path={ROUTES.HISTORY} element={<div>History - Coming Soon</div>} />
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
