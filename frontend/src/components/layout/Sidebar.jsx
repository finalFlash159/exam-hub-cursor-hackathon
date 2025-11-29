/**
 * Sidebar Component - Hover-to-Expand
 * Compact sidebar with hover expand behavior
 */

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Tooltip,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../config/routes';
import { useSidebar } from '../../context/SidebarContext';
import { DESIGN_SYSTEM as DS } from '../../config/designSystem';

const Sidebar = ({ open, onClose, variant = 'permanent' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { t } = useTranslation();
  const { isExpanded, setIsHovered } = useSidebar();
  
  const drawerWidth = isExpanded ? DS.sidebar.widthExpanded : DS.sidebar.widthCollapsed;

  // Menu items with simple 2D PNG icons - using translation keys
  const mainMenuItems = [
    { text: t('sidebar.home'), icon: 'dashboard', path: ROUTES.DASHBOARD },
    { text: t('sidebar.myExams'), icon: 'exam', path: ROUTES.EXAMS },
    { text: t('sidebar.createExam'), icon: 'AI', path: ROUTES.EXAM_CREATE },
    { text: t('sidebar.history'), icon: 'history', path: ROUTES.HISTORY },
  ];
  
  const settingsMenuItem = { text: t('sidebar.settings'), icon: 'settings', path: ROUTES.SETTINGS };

  const handleNavigation = (path) => {
    navigate(path);
    if (variant === 'temporary') {
      onClose();
    }
  };
  
  // Hover handlers for expand/collapse
  const handleMouseEnter = () => {
    if (variant === 'permanent') {
      setIsHovered(true);
    }
  };
  
  const handleMouseLeave = () => {
    if (variant === 'permanent') {
      setIsHovered(false);
    }
  };

  const drawer = (
    <Box 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        bgcolor: 'background.paper',
        overflow: 'hidden'
      }}
    >
      {/* Logo Section - Fixed Position */}
      <Box
        sx={{
          p: DS.sidebar.logoPadding,
          display: 'flex',
          alignItems: 'center',
          gap: DS.sidebar.logoGap,
          justifyContent: 'flex-start', // Always left-aligned
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src="/exam-logo.png"
          alt="Exam Hub"
          sx={{
            width: DS.sidebar.logoSize,
            height: DS.sidebar.logoSize,
            objectFit: 'contain',
            flexShrink: 0, // Fixed size
          }}
        />
        <Typography
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            fontSize: DS.typography[DS.sidebar.logoTextSize],
            whiteSpace: 'nowrap',
            opacity: isExpanded ? 1 : 0,
            transition: `opacity ${DS.sidebar.transitionDuration} ${DS.sidebar.transitionEasing}`,
          }}
        >
          Exam Hub
        </Typography>
      </Box>

      {/* Main Menu Items - Compact with Tooltips */}
      <Box sx={{ flex: 1, overflowY: 'auto', py: DS.sidebar.menuListPaddingY }}>
        <List sx={{ px: isExpanded ? DS.sidebar.menuListPaddingX : 0.5 }}>
          {mainMenuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <Tooltip
                  title={item.text}
                  placement="right"
                  enterDelay={DS.sidebar.tooltipEnterDelay}
                  disableHoverListener={isExpanded} // Only show tooltip when collapsed
                >
                  <ListItemButton
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                      borderRadius: DS.sidebar.menuItemBorderRadius,
                      py: DS.sidebar.menuItemPaddingY,
                      px: isExpanded ? DS.sidebar.menuItemPaddingX : 0.5, // Less padding when collapsed
                      justifyContent: 'flex-start', // Always left-aligned, never center
                      bgcolor: isActive ? 'primary.50' : 'transparent',
                      '&:hover': {
                        bgcolor: (theme) => isActive 
                          ? (theme.palette.mode === 'dark' ? 'rgba(59, 130, 246, 0.2)' : '#dbeafe')
                          : (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#f9fafb'),
                      },
                      overflow: 'hidden',
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: DS.sidebar.menuIconMinWidth, // Fixed width always
                        justifyContent: 'flex-start',
                        flexShrink: 0, // Icon never shrinks
                      }}
                    >
                      <Box
                        component="img"
                        src={theme.palette.mode === 'dark' 
                          ? `/icons/${item.icon}-white.png` 
                          : `/icons/${item.icon}.png`}
                        alt={item.text}
                        sx={{
                          width: DS.sidebar.menuIconSize,
                          height: DS.sidebar.menuIconSize,
                          objectFit: 'contain',
                          opacity: isActive ? 1 : 0.6,
                          filter: isActive ? 'none' : 'grayscale(20%)',
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      sx={{
                        opacity: isExpanded ? 1 : 0, // Fade in/out instead of mount/unmount
                        transition: `opacity ${DS.sidebar.transitionDuration} ${DS.sidebar.transitionEasing}`,
                        '& .MuiTypography-root': {
                          fontWeight: isActive ? 600 : 500,
                          color: isActive ? 'primary.main' : 'text.secondary',
                          fontSize: DS.typography[DS.sidebar.menuTextSize],
                          whiteSpace: 'nowrap',
                        },
                      }}
                    />
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Settings Menu Item - Separated at Bottom */}
      <Box sx={{ py: 1 }}>
        <List sx={{ px: isExpanded ? DS.sidebar.menuListPaddingX : 0.5 }}>
          <ListItem disablePadding>
            <Tooltip
              title={settingsMenuItem.text}
              placement="right"
              enterDelay={DS.sidebar.tooltipEnterDelay}
              disableHoverListener={isExpanded}
            >
              <ListItemButton
                onClick={() => handleNavigation(settingsMenuItem.path)}
                sx={{
                  borderRadius: DS.sidebar.menuItemBorderRadius,
                  py: DS.sidebar.menuItemPaddingY,
                  px: isExpanded ? DS.sidebar.menuItemPaddingX : 0.5,
                  justifyContent: 'flex-start',
                  bgcolor: location.pathname === settingsMenuItem.path ? 'primary.50' : 'transparent',
                  '&:hover': {
                    bgcolor: (theme) => location.pathname === settingsMenuItem.path 
                      ? (theme.palette.mode === 'dark' ? 'rgba(59, 130, 246, 0.2)' : '#dbeafe')
                      : (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#f9fafb'),
                  },
                  overflow: 'hidden',
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: DS.sidebar.menuIconMinWidth,
                    justifyContent: 'flex-start',
                    flexShrink: 0,
                  }}
                >
                  <Box
                    component="img"
                    src={theme.palette.mode === 'dark' 
                      ? `/icons/${settingsMenuItem.icon}-white.png` 
                      : `/icons/${settingsMenuItem.icon}.png`}
                    alt={settingsMenuItem.text}
                    sx={{
                      width: DS.sidebar.menuIconSize,
                      height: DS.sidebar.menuIconSize,
                      objectFit: 'contain',
                      opacity: location.pathname === settingsMenuItem.path ? 1 : 0.6,
                      filter: location.pathname === settingsMenuItem.path ? 'none' : 'grayscale(20%)',
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={settingsMenuItem.text}
                  sx={{
                    opacity: isExpanded ? 1 : 0,
                    transition: `opacity ${DS.sidebar.transitionDuration} ${DS.sidebar.transitionEasing}`,
                    '& .MuiTypography-root': {
                      fontWeight: location.pathname === settingsMenuItem.path ? 600 : 500,
                      color: location.pathname === settingsMenuItem.path ? 'primary.main' : 'text.secondary',
                      fontSize: DS.typography[DS.sidebar.menuTextSize],
                      whiteSpace: 'nowrap',
                    },
                  }}
                />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        </List>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        transition: `width ${DS.sidebar.transitionDuration} ${DS.sidebar.transitionEasing}`,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: (theme) => `1px solid ${theme.palette.divider}`,
          bgcolor: 'background.paper',
          transition: `width ${DS.sidebar.transitionDuration} ${DS.sidebar.transitionEasing}`,
          overflowX: 'hidden',
        },
      }}
    >
      {drawer}
    </Drawer>
  );
};

export default Sidebar;


