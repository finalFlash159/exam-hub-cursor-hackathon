/**
 * Main Layout Component
 * Layout wrapper with header, sidebar (with hover expand), and content area
 */

import React, { useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import { useSidebar } from '../../context/SidebarContext';
import { DESIGN_SYSTEM as DS } from '../../config/designSystem';

const MainLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isExpanded } = useSidebar();
  
  const sidebarWidth = isExpanded ? DS.sidebar.widthExpanded : DS.sidebar.widthCollapsed;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {isMobile ? (
        <Sidebar
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
        />
      ) : (
        <Sidebar variant="permanent" />
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${sidebarWidth}px)` },
          bgcolor: 'background.default',
          transition: `width ${DS.sidebar.transitionDuration} ${DS.sidebar.transitionEasing}`,
          height: '100vh',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Header onMenuClick={isMobile ? handleDrawerToggle : null} />
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;


