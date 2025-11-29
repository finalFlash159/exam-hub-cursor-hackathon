/**
 * Header Component - With Sidebar Toggle
 * Clean white header with blue accents and sidebar control
 */

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  InputBase,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Person,
  Settings,
  Search,
  ChevronLeft,
  ChevronRight,
} from '@mui/icons-material';
import { useSidebar } from '../../context/SidebarContext';
import { ROUTES } from '../../config/routes';
import { DESIGN_SYSTEM as DS } from '../../config/designSystem';

// Hardcoded user data (no auth)
const mockUser = {
  id: 'user-001',
  full_name: 'Demo User',
  email: 'demo@example.com',
  avatar: '/avatars/avatar-001.jpg',
};

const Header = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { collapsed, isExpanded, toggleSidebar } = useSidebar();
  const [anchorEl, setAnchorEl] = React.useState(null);
  
  const sidebarWidth = isExpanded ? DS.sidebar.widthExpanded : DS.sidebar.widthCollapsed;

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        top: 0,
        zIndex: (theme) => theme.zIndex.appBar,
        bgcolor: 'background.paper',
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        width: '100%',
        transition: `all ${DS.sidebar.transitionDuration} ${DS.sidebar.transitionEasing}`,
      }}
    >
      <Toolbar sx={{ minHeight: '40px !important', px: 3, py: 0.5 }}>
        {/* Desktop: Sidebar Toggle Button */}
        <IconButton
          onClick={toggleSidebar}
          sx={{
            mr: 2,
            display: { xs: 'none', md: 'block' },
            color: 'text.secondary',
            transition: 'transform 0.3s ease',
          }}
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
        
        {/* Mobile menu button */}
        {onMenuClick && (
          <IconButton
            edge="start"
            onClick={onMenuClick}
            sx={{
              mr: 2,
              display: { xs: 'block', md: 'none' },
              color: 'text.secondary',
            }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Search Bar - Compact Version */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            maxWidth: 280,
            mr: 'auto',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#f9fafb',
              borderRadius: 1.5,
              px: 1.5,
              py: 0.5,
              width: '100%',
              '&:hover': {
                bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : '#f3f4f6',
              },
            }}
          >
            <Search sx={{ color: 'text.secondary', mr: 1, fontSize: 18 }} />
            <InputBase
              placeholder="Tìm kiếm bài thi..."
              sx={{
                flex: 1,
                color: 'text.primary',
                fontSize: '0.813rem',
                '& input::placeholder': {
                  color: 'text.secondary',
                },
              }}
            />
          </Box>
        </Box>

        {/* Right side actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {/* Profile Section */}
          <Box
            onClick={handleMenuOpen}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              px: 1,
              py: 0.5,
              borderRadius: 1,
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#f9fafb',
              },
            }}
          >
            <Avatar
              src={mockUser?.avatar || undefined}
              sx={{
                width: 32,
                height: 32,
                bgcolor: 'primary.main',
                fontSize: DS.typography.bodySmall,
                fontWeight: 700,
              }}
            >
              {!mockUser?.avatar && (mockUser?.full_name?.[0]?.toUpperCase() || mockUser?.email?.[0]?.toUpperCase())}
            </Avatar>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: DS.typography.bodySmall,
                  color: 'text.primary',
                  lineHeight: 1,
                }}
              >
                {mockUser?.full_name || 'User'}
              </Typography>
            </Box>
          </Box>

          {/* Profile Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            slotProps={{
              paper: {
                sx: {
                  mt: 1,
                  minWidth: 200,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                },
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5, borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}>
              <Typography sx={{ fontWeight: 600, fontSize: DS.typography.bodyMedium }}>
                {mockUser?.full_name || 'User'}
              </Typography>
              <Typography sx={{ fontSize: DS.typography.bodyXSmall, color: 'text.secondary' }}>
                {mockUser?.email}
              </Typography>
            </Box>
            
            <MenuItem
              onClick={() => {
                handleMenuClose();
                navigate(ROUTES.PROFILE);
              }}
              sx={{ py: 1, fontSize: DS.typography.bodySmall }}
            >
              <Person sx={{ fontSize: 18, mr: 1.5 }} />
              Hồ sơ
            </MenuItem>
            
            <MenuItem
              onClick={() => {
                handleMenuClose();
                navigate(ROUTES.SETTINGS);
              }}
              sx={{ py: 1, fontSize: DS.typography.bodySmall }}
            >
              <Settings sx={{ fontSize: 18, mr: 1.5 }} />
              Cài đặt
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;


