/**
 * Professional Card Component
 * Clean white card with thin border and subtle shadow
 * Following OnlineExamMaker design principles
 */

import React from 'react';
import { Card as MuiCard, CardContent, CardHeader, CardActions } from '@mui/material';

const Card = ({
  children,
  title = null,
  actions = null,
  sx = {},
  headerSx = {},
  contentSx = {},
  elevation = 0,
  ...props
}) => {
  return (
    <MuiCard
      elevation={elevation}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1.5,
        boxShadow: (theme) => theme.palette.mode === 'dark' 
          ? '0 2px 4px rgba(0, 0, 0, 0.3)' 
          : '0 2px 4px rgba(0, 0, 0, 0.08)',
        backgroundColor: 'background.paper',
        ...sx,
      }}
      {...props}
    >
      {title && (
        <CardHeader
          title={title}
          sx={{
            borderBottom: '1px solid',
            borderColor: 'divider',
            '& .MuiCardHeader-title': {
              fontSize: '1.125rem',
              fontWeight: 600,
              color: 'text.primary',
            },
            ...headerSx,
          }}
        />
      )}
      <CardContent sx={{ p: 3, ...contentSx }}>
        {children}
      </CardContent>
      {actions && (
        <CardActions sx={{ borderTop: '1px solid', borderColor: 'divider', p: 2 }}>
          {actions}
        </CardActions>
      )}
    </MuiCard>
  );
};

export default Card;

