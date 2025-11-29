/**
 * Pricing Page - Pricing plans display with feature comparison
 * UI-only version with static data
 */

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
  Divider,
} from '@mui/material';
import {
  Check,
  Close,
  Star,
  Business,
  CardGiftcard,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { MainLayout } from '../components/layout';
import { DESIGN_SYSTEM as DS } from '../config/designSystem';

// Static pricing plans data
const pricingPlans = [
  {
    id: 'free',
    name: 'Miễn phí',
    price: 0,
    period: 'vĩnh viễn',
    description: 'Phù hợp cho người dùng cá nhân',
    icon: <CardGiftcard sx={{ fontSize: 40 }} />,
    color: 'default',
    popular: false,
    features: {
      exams: '10 đề thi',
      questions: 'Không giới hạn',
      storage: '1GB',
      aiGeneration: false,
      analytics: false,
      support: 'Cộng đồng',
      export: 'PDF cơ bản',
      folders: true,
      publicExams: true,
    },
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 199000,
    period: 'tháng',
    description: 'Dành cho giáo viên và tổ chức nhỏ',
    icon: <Star sx={{ fontSize: 40 }} />,
    color: 'primary',
    popular: true,
    features: {
      exams: 'Không giới hạn',
      questions: 'Không giới hạn',
      storage: '10GB',
      aiGeneration: true,
      analytics: true,
      support: 'Email ưu tiên',
      export: 'PDF nâng cao',
      folders: true,
      publicExams: true,
    },
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 999000,
    period: 'tháng',
    description: 'Giải pháp cho tổ chức lớn',
    icon: <Business sx={{ fontSize: 40 }} />,
    color: 'secondary',
    popular: false,
    features: {
      exams: 'Không giới hạn',
      questions: 'Không giới hạn',
      storage: 'Không giới hạn',
      aiGeneration: true,
      analytics: true,
      support: 'Hỗ trợ 24/7',
      export: 'Tất cả định dạng',
      folders: true,
      publicExams: true,
    },
  },
];

const featureLabels = {
  exams: 'Số lượng đề thi',
  questions: 'Số lượng câu hỏi',
  storage: 'Dung lượng lưu trữ',
  aiGeneration: 'Tạo câu hỏi bằng AI',
  analytics: 'Phân tích chi tiết',
  support: 'Hỗ trợ khách hàng',
  export: 'Xuất kết quả',
  folders: 'Tổ chức thư mục',
  publicExams: 'Chia sẻ đề thi công khai',
};

const PricingPage = () => {
  const { enqueueSnackbar } = useSnackbar();

  const handleSelectPlan = (planId) => {
    enqueueSnackbar(`Đã chọn gói ${planId === 'free' ? 'Miễn phí' : planId === 'pro' ? 'Pro' : 'Enterprise'}`, { variant: 'info' });
  };

  const formatPrice = (price) => {
    if (price === 0) return 'Miễn phí';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <MainLayout>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: DS.spacing.pageTop }}>
        <Box sx={{ maxWidth: 1400, mx: 'auto', px: DS.spacing.pageHorizontal }}>
          {/* Page Header */}
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                fontSize: DS.typography.pageTitle,
                mb: 1,
              }}
            >
              Bảng giá
            </Typography>
            <Typography
              sx={{
                color: 'text.secondary',
                fontSize: DS.typography.bodyLarge,
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              Chọn gói dịch vụ phù hợp với nhu cầu của bạn
            </Typography>
          </Box>

          {/* Pricing Cards */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, 
            gap: 3, 
            mb: 5 
          }}>
            {pricingPlans.map((plan) => (
              <Card
                key={plan.id}
                sx={{
                  position: 'relative',
                  border: plan.popular ? '2px solid' : '1px solid',
                  borderColor: plan.popular ? 'primary.main' : 'divider',
                  borderRadius: DS.borderRadius.regular,
                  overflow: 'visible',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: DS.shadows.hover,
                  },
                }}
              >
                {plan.popular && (
                  <Chip
                    label="Phổ biến"
                    color="primary"
                    sx={{
                      position: 'absolute',
                      top: -12,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontWeight: 600,
                    }}
                  />
                )}
                
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Box sx={{ 
                      display: 'inline-flex',
                      p: 2,
                      borderRadius: '50%',
                      bgcolor: `${plan.color}.100`,
                      color: `${plan.color}.main`,
                      mb: 2,
                    }}>
                      {plan.icon}
                    </Box>
                    
                    <Typography sx={{ 
                      fontSize: DS.typography.headingSmall, 
                      fontWeight: 600,
                      mb: 0.5,
                    }}>
                      {plan.name}
                    </Typography>
                    
                    <Typography sx={{ 
                      fontSize: DS.typography.bodySmall,
                      color: 'text.secondary',
                      mb: 2,
                    }}>
                      {plan.description}
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography sx={{ 
                        fontSize: '2rem', 
                        fontWeight: 700,
                        color: 'text.primary',
                        lineHeight: 1,
                      }}>
                        {formatPrice(plan.price)}
                      </Typography>
                      {plan.price > 0 && (
                        <Typography sx={{ 
                          fontSize: DS.typography.bodySmall,
                          color: 'text.secondary',
                        }}>
                          / {plan.period}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  <Stack spacing={1.5} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Check sx={{ fontSize: 20, color: 'success.main' }} />
                      <Typography sx={{ fontSize: DS.typography.bodySmall }}>
                        {plan.features.exams}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Check sx={{ fontSize: 20, color: 'success.main' }} />
                      <Typography sx={{ fontSize: DS.typography.bodySmall }}>
                        {plan.features.questions}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Check sx={{ fontSize: 20, color: 'success.main' }} />
                      <Typography sx={{ fontSize: DS.typography.bodySmall }}>
                        Lưu trữ: {plan.features.storage}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {plan.features.aiGeneration ? (
                        <Check sx={{ fontSize: 20, color: 'success.main' }} />
                      ) : (
                        <Close sx={{ fontSize: 20, color: 'text.disabled' }} />
                      )}
                      <Typography sx={{ 
                        fontSize: DS.typography.bodySmall,
                        color: plan.features.aiGeneration ? 'text.primary' : 'text.disabled',
                      }}>
                        Tạo câu hỏi bằng AI
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {plan.features.analytics ? (
                        <Check sx={{ fontSize: 20, color: 'success.main' }} />
                      ) : (
                        <Close sx={{ fontSize: 20, color: 'text.disabled' }} />
                      )}
                      <Typography sx={{ 
                        fontSize: DS.typography.bodySmall,
                        color: plan.features.analytics ? 'text.primary' : 'text.disabled',
                      }}>
                        Phân tích chi tiết
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Check sx={{ fontSize: 20, color: 'success.main' }} />
                      <Typography sx={{ fontSize: DS.typography.bodySmall }}>
                        Hỗ trợ: {plan.features.support}
                      </Typography>
                    </Box>
                  </Stack>

                  <Button
                    variant={plan.popular ? 'contained' : 'outlined'}
                    fullWidth
                    onClick={() => handleSelectPlan(plan.id)}
                    sx={{
                      py: 1.5,
                      fontSize: DS.typography.bodyMedium,
                      fontWeight: 600,
                    }}
                  >
                    {plan.price === 0 ? 'Bắt đầu miễn phí' : 'Chọn gói'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Feature Comparison Table */}
          <Paper sx={{ 
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: DS.borderRadius.regular,
            overflow: 'hidden',
          }}>
            <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography sx={{ 
                fontSize: DS.typography.headingSmall, 
                fontWeight: 600,
              }}>
                So sánh các tính năng
              </Typography>
            </Box>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell sx={{ fontWeight: 600, fontSize: DS.typography.bodyMedium, py: 2 }}>
                      Tính năng
                    </TableCell>
                    {pricingPlans.map((plan) => (
                      <TableCell 
                        key={plan.id}
                        align="center"
                        sx={{ 
                          fontWeight: 600, 
                          fontSize: DS.typography.bodyMedium,
                          py: 2,
                          bgcolor: plan.popular ? 'primary.50' : 'transparent',
                        }}
                      >
                        {plan.name}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(featureLabels).map(([key, label]) => (
                    <TableRow key={key} hover>
                      <TableCell sx={{ 
                        fontWeight: 500, 
                        fontSize: DS.typography.bodySmall,
                        py: 1.5,
                      }}>
                        {label}
                      </TableCell>
                      {pricingPlans.map((plan) => {
                        const value = plan.features[key];
                        const isBoolean = typeof value === 'boolean';
                        
                        return (
                          <TableCell 
                            key={plan.id}
                            align="center"
                            sx={{ 
                              py: 1.5,
                              bgcolor: plan.popular ? 'primary.50' : 'transparent',
                            }}
                          >
                            {isBoolean ? (
                              value ? (
                                <Check sx={{ fontSize: 24, color: 'success.main' }} />
                              ) : (
                                <Close sx={{ fontSize: 24, color: 'text.disabled' }} />
                              )
                            ) : (
                              <Typography sx={{ fontSize: DS.typography.bodySmall }}>
                                {value}
                              </Typography>
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* FAQ Section */}
          <Box sx={{ mt: 5, textAlign: 'center' }}>
            <Typography sx={{ 
              fontSize: DS.typography.headingSmall, 
              fontWeight: 600,
              mb: 2,
            }}>
              Câu hỏi thường gặp về giá
            </Typography>
            <Typography sx={{ 
              fontSize: DS.typography.bodyMedium,
              color: 'text.secondary',
              maxWidth: 600,
              mx: 'auto',
            }}>
              Bạn có thể nâng cấp hoặc hạ cấp gói dịch vụ bất cứ lúc nào. 
              Không có phí ẩn, hủy bất cứ lúc nào.
            </Typography>
          </Box>
        </Box>
      </Box>
    </MainLayout>
  );
};

export default PricingPage;

