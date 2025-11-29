/**
 * EmptyState Component
 * Displays when no data is available
 */

import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  illustration,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 400,
        textAlign: 'center',
        px: 3,
        py: 6,
      }}
    >
      {/* Icon or Illustration */}
      {illustration ? (
        <Box
          component="img"
          src={illustration}
          alt={title}
          sx={{
            width: 240,
            height: 240,
            mb: 3,
            opacity: 0.9,
          }}
        />
      ) : Icon ? (
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            bgcolor: 'primary.light',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
            opacity: 0.2,
          }}
        >
          <Icon sx={{ fontSize: 48, color: 'primary.main' }} />
        </Box>
      ) : null}

      {/* Title */}
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontWeight: 600,
          color: 'text.primary',
          mb: 1,
        }}
      >
        {title}
      </Typography>

      {/* Description */}
      <Typography
        variant="body1"
        sx={{
          color: 'text.secondary',
          maxWidth: 500,
          mb: 4,
        }}
      >
        {description}
      </Typography>

      {/* Action Button */}
      {actionLabel && onAction && (
        <Button
          variant="contained"
          size="large"
          onClick={onAction}
          sx={{
            px: 4,
            py: 1.5,
          }}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;


