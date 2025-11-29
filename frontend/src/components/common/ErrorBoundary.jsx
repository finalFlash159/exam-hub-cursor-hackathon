/**
 * Error Boundary Component
 * Catches and handles React errors gracefully
 */

import React from 'react';
import { Box, Button, Container, Typography, Paper } from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.default',
          }}
        >
          <Container maxWidth="sm">
            <Paper 
              elevation={0}
              sx={{ 
                p: 4, 
                borderRadius: 3, 
                textAlign: 'center',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: '#fee2e2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                }}
              >
                <ErrorIcon sx={{ fontSize: 40, color: '#dc2626' }} />
              </Box>
              <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                  fontWeight: 700,
                  color: 'text.primary',
                  fontSize: '1.75rem',
                  mb: 1,
                }}
              >
                Rất tiếc! Đã có lỗi xảy ra
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Ứng dụng gặp lỗi không mong muốn. Vui lòng thử lại sau.
              </Typography>
              {import.meta.env.DEV && this.state.error && (
                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'grey.100',
                    borderRadius: 2,
                    textAlign: 'left',
                    overflow: 'auto',
                    maxHeight: 200,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Typography 
                    variant="caption" 
                    component="pre" 
                    sx={{ 
                      fontSize: '0.7rem',
                      color: 'error.main',
                      fontFamily: 'monospace',
                    }}
                  >
                    {this.state.error.toString()}
                    {'\n'}
                    {this.state.errorInfo?.componentStack}
                  </Typography>
                </Box>
              )}
              <Button
                variant="contained"
                size="large"
                onClick={this.handleReset}
                sx={{
                  mt: 3,
                  bgcolor: '#3b82f6',
                  color: 'white',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  boxShadow: 'none',
                  '&:hover': {
                    bgcolor: '#2563eb',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                  },
                }}
              >
                Về trang chủ
              </Button>
            </Paper>
          </Container>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;


