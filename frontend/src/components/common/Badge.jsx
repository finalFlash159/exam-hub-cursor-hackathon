/**
 * Professional Badge/Chip Component
 * Clean status badges with semantic colors
 * No animations, simple and clear
 */

import React from 'react';
import { Chip as MuiChip } from '@mui/material';

const Badge = ({
  label,
  status = 'default', // default, success, warning, error, info
  size = 'medium',
  onDelete = null,
  icon = null,
  sx = {},
  ...props
}) => {
  const getStatusStyles = (theme) => {
    const isDark = theme.palette.mode === 'dark';
    
    switch (status) {
      case 'success':
        return {
          backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : '#d4edda',
          color: isDark ? '#10b981' : '#1e7e34',
          borderColor: isDark ? '#10b981' : '#c3e6cb',
        };
      case 'warning':
        return {
          backgroundColor: isDark ? 'rgba(245, 158, 11, 0.2)' : '#fff3cd',
          color: isDark ? '#f59e0b' : '#856404',
          borderColor: isDark ? '#f59e0b' : '#ffeeba',
        };
      case 'error':
        return {
          backgroundColor: isDark ? 'rgba(239, 68, 68, 0.2)' : '#f8d7da',
          color: isDark ? '#ef4444' : '#721c24',
          borderColor: isDark ? '#ef4444' : '#f5c6cb',
        };
      case 'info':
        return {
          backgroundColor: isDark ? 'rgba(59, 130, 246, 0.2)' : '#d1ecf1',
          color: isDark ? '#3b82f6' : '#0c5460',
          borderColor: isDark ? '#3b82f6' : '#bee5eb',
        };
      case 'primary':
        return {
          backgroundColor: isDark ? 'rgba(59, 130, 246, 0.2)' : '#dbeafe',
          color: 'primary.main',
          borderColor: 'primary.light',
        };
      default:
        return {
          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#f8f9fa',
          color: 'text.secondary',
          borderColor: 'divider',
        };
    }
  };

  return (
    <MuiChip
      label={label}
      size={size}
      onDelete={onDelete}
      icon={icon}
      sx={{
        borderRadius: 1,
        fontWeight: 500,
        border: '1px solid',
        ...(theme => getStatusStyles(theme)),
        ...sx,
      }}
      {...props}
    />
  );
};

export default Badge;


