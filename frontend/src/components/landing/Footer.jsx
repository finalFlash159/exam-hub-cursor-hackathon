/**
 * Enhanced Footer Component
 * Multi-column footer with links and social media
 */

import React from 'react';
import { Box, Container, Grid, Typography, Stack, IconButton } from '@mui/material';
import { Facebook, Twitter, LinkedIn, Instagram } from '@mui/icons-material';
import { DESIGN_SYSTEM } from '../../config/designSystem';

const Footer = () => {
  const footerSections = [
    {
      title: 'Sản phẩm',
      links: ['Tính năng', 'Bảng giá', 'Tích hợp', 'API'],
    },
    {
      title: 'Tài nguyên',
      links: ['Blog', 'Hướng dẫn', 'Video', 'FAQs'],
    },
    {
      title: 'Công ty',
      links: ['Về chúng tôi', 'Liên hệ', 'Tuyển dụng', 'Đối tác'],
    },
    {
      title: 'Pháp lý',
      links: ['Điều khoản', 'Bảo mật', 'Cookies', 'GDPR'],
    },
  ];

  return (
    <Box sx={{ bgcolor: '#1f2937', color: 'white', pt: 8, pb: 4 }}>
      <Container maxWidth="lg">
        {/* Top Section */}
        <Grid container spacing={4} mb={6}>
          {/* Brand Column */}
          <Grid item xs={12} md={4}>
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <Box
                component="img"
                src="/exam-logo.png"
                alt="Exam Hub Logo"
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: DESIGN_SYSTEM.borderRadius.small,
                }}
              />
              <Typography variant="h6" fontWeight={700}>
                Exam Hub
              </Typography>
            </Stack>
            <Typography
              variant="body2"
              color="rgba(255, 255, 255, 0.7)"
              mb={3}
              sx={{ fontSize: DESIGN_SYSTEM.typography.bodyMedium, lineHeight: 1.6 }}
            >
              Nền tảng tạo và quản lý bài thi trực tuyến thông minh, được hỗ trợ bởi AI.
            </Typography>
            {/* Social Icons */}
            <Stack direction="row" spacing={1}>
              <IconButton
                size="small"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)', color: 'white' },
                }}
              >
                <Facebook fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)', color: 'white' },
                }}
              >
                <Twitter fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)', color: 'white' },
                }}
              >
                <LinkedIn fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)', color: 'white' },
                }}
              >
                <Instagram fontSize="small" />
              </IconButton>
            </Stack>
          </Grid>

          {/* Links Columns */}
          {footerSections.map((section, index) => (
            <Grid item xs={6} sm={3} md={2} key={index}>
              <Typography
                variant="subtitle2"
                fontWeight={700}
                mb={2}
                sx={{ fontSize: DESIGN_SYSTEM.typography.bodyMedium }}
              >
                {section.title}
              </Typography>
              <Stack spacing={1.5}>
                {section.links.map((link, linkIndex) => (
                  <Typography
                    key={linkIndex}
                    variant="body2"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: DESIGN_SYSTEM.typography.bodySmall,
                      cursor: 'pointer',
                      transition: 'color 0.2s',
                      '&:hover': { color: 'white' },
                    }}
                  >
                    {link}
                  </Typography>
                ))}
              </Stack>
            </Grid>
          ))}
        </Grid>

        {/* Bottom Section */}
        <Box
          sx={{
            pt: 4,
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography
            variant="body2"
            color="rgba(255, 255, 255, 0.6)"
            sx={{ fontSize: DESIGN_SYSTEM.typography.bodySmall }}
          >
            © 2025 Exam Hub. Tất cả quyền được bảo lưu.
          </Typography>
          <Stack direction="row" spacing={3}>
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: DESIGN_SYSTEM.typography.bodySmall,
                cursor: 'pointer',
                '&:hover': { color: 'white' },
              }}
            >
              Tiếng Việt
            </Typography>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;

