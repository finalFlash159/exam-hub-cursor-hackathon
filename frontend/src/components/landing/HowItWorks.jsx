/**
 * How It Works Section
 * Step-by-step guide showing the exam creation process
 */

import React from 'react';
import { Box, Container, Typography, Grid, Chip } from '@mui/material';
import {
  CloudUploadOutlined,
  AutoAwesomeOutlined,
  PublishOutlined,
  AnalyticsOutlined,
} from '@mui/icons-material';
import { DESIGN_SYSTEM } from '../../config/designSystem';

const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      title: 'Upload Tài Liệu Học',
      description: 'Tải lên sách giáo khoa, ghi chú, bài giảng dưới dạng PDF hoặc ảnh',
      icon: <CloudUploadOutlined sx={{ fontSize: DESIGN_SYSTEM.icons.large }} />,
      color: '#eff6ff',
      iconColor: '#3b82f6',
    },
    {
      number: '02',
      title: 'AI Tạo Đề Thi',
      description: 'AI phân tích nội dung và tạo câu hỏi đa dạng tự động',
      icon: <AutoAwesomeOutlined sx={{ fontSize: DESIGN_SYSTEM.icons.large }} />,
      color: '#f0fdf4',
      iconColor: '#10b981',
    },
    {
      number: '03',
      title: 'Làm Bài & Nhận Điểm',
      description: 'Làm bài trực tuyến, chấm điểm tức thì và xem xếp hạng',
      icon: <PublishOutlined sx={{ fontSize: DESIGN_SYSTEM.icons.large }} />,
      color: '#fef3c7',
      iconColor: '#f59e0b',
    },
    {
      number: '04',
      title: 'Xem Giải Thích & Luyện Lại',
      description: 'Đọc giải thích chi tiết, lưu câu sai để ôn tập lại',
      icon: <AnalyticsOutlined sx={{ fontSize: DESIGN_SYSTEM.icons.large }} />,
      color: '#ede9fe',
      iconColor: '#8b5cf6',
    },
  ];

  return (
    <Box sx={{ py: 10, bgcolor: 'transparent' }}>
      <Container maxWidth="lg">
        <Box textAlign="center" mb={8}>
          <Chip
            label="📋 Quy trình đơn giản"
            sx={{
              bgcolor: '#eff6ff',
              color: '#3b82f6',
              fontWeight: 600,
              fontSize: DESIGN_SYSTEM.typography.bodySmall,
              mb: 2,
            }}
          />
          <Typography
            variant="h3"
            fontWeight={700}
            color="#1f2937"
            mb={2}
            sx={{ fontSize: { xs: '1.75rem', md: '2.5rem' } }}
          >
            Cách hoạt động
          </Typography>
          <Typography
            variant="h6"
            color="#6b7280"
            maxWidth={700}
            mx="auto"
            sx={{ fontSize: DESIGN_SYSTEM.typography.bodyLarge }}
          >
            Chỉ 4 bước đơn giản để tạo bài thi chuyên nghiệp
          </Typography>
        </Box>

        <Grid 
          container 
          spacing={2}
          wrap="nowrap"
          sx={{
            overflowX: { xs: 'auto', md: 'visible' },
            '&::-webkit-scrollbar': { height: 6 },
            '&::-webkit-scrollbar-thumb': { 
              bgcolor: '#d1d5db', 
              borderRadius: 3 
            },
          }}
        >
          {steps.map((step, index) => (
            <Grid item xs="auto" sm="auto" md={3} key={index} sx={{ minWidth: { xs: 250, sm: 280, md: 'auto' } }}>
              <Box
                sx={{
                  position: 'relative',
                  textAlign: 'center',
                }}
              >
                {/* Number Badge */}
                <Box
                  sx={{
                    position: 'relative',
                    zIndex: 1,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${step.iconColor} 0%, ${step.iconColor}dd 100%)`,
                    color: 'white',
                    fontWeight: 800,
                    fontSize: '1rem',
                    mb: 2,
                    boxShadow: `0 4px 12px ${step.iconColor}40`,
                  }}
                >
                  {step.number}
                </Box>

                {/* Icon */}
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: DESIGN_SYSTEM.borderRadius.regular,
                    bgcolor: step.color,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 1.5,
                  }}
                >
                  {React.cloneElement(step.icon, { sx: { color: step.iconColor, fontSize: DESIGN_SYSTEM.icons.medium } })}
                </Box>

                {/* Title */}
                <Typography
                  variant="h6"
                  fontWeight={700}
                  color="#1f2937"
                  mb={0.5}
                  sx={{ fontSize: DESIGN_SYSTEM.typography.bodyMedium }}
                >
                  {step.title}
                </Typography>

                {/* Description */}
                <Typography
                  variant="body2"
                  color="#6b7280"
                  sx={{ fontSize: DESIGN_SYSTEM.typography.bodySmall, lineHeight: 1.5 }}
                >
                  {step.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default HowItWorks;


