/**
 * Dashboard Page - Main dashboard with statistics and recent exams
 * UI-only version with static data
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from '@mui/material';
import {
  Add,
  Assignment,
  TrendingUp,
  InsertChart,
  ArrowForward,
  MoreVert,
  Visibility,
  PlayArrow,
} from '@mui/icons-material';
import { MainLayout } from '../../../components/layout';
import { ROUTES, buildRoute } from '../../../config/routes';
import { DESIGN_SYSTEM as DS } from '../../../config/designSystem';
import { format } from 'date-fns';

// Static mock data
const mockDashboardStats = {
  total_exams: 12,
  completed_exams: 8,
  average_score: 85.5,
  in_progress_exams: 2,
  uploaded_files_count: 5,
  passed_exams: 7,
  highest_score: 95.0
};

const mockRecentExams = [
  {
    id: 'exam-001',
    title: 'Bài kiểm tra Toán học cơ bản',
    subject: 'Toán học',
    total_questions: 20,
    duration_minutes: 60,
    difficulty: 'medium',
    created_at: '2024-01-15T10:00:00Z',
    status: 'published'
  },
  {
    id: 'exam-002',
    title: 'Kiểm tra Tiếng Anh - Unit 1',
    subject: 'Tiếng Anh',
    total_questions: 15,
    duration_minutes: 45,
    difficulty: 'easy',
    created_at: '2024-01-14T09:00:00Z',
    status: 'published'
  },
  {
    id: 'exam-003',
    title: 'Bài thi Văn học - Văn xuôi',
    subject: 'Văn học',
    total_questions: 10,
    duration_minutes: 90,
    difficulty: 'hard',
    created_at: '2024-01-13T14:00:00Z',
    status: 'published'
  },
  {
    id: 'exam-004',
    title: 'Kiểm tra Vật lý - Điện học',
    subject: 'Vật lý',
    total_questions: 25,
    duration_minutes: 75,
    difficulty: 'medium',
    created_at: '2024-01-12T11:00:00Z',
    status: 'published'
  },
  {
    id: 'exam-005',
    title: 'Bài thi Hóa học - Hữu cơ',
    subject: 'Hóa học',
    total_questions: 18,
    duration_minutes: 60,
    difficulty: 'hard',
    created_at: '2024-01-11T08:00:00Z',
    status: 'published'
  },
];

const mockUser = {
  full_name: 'Demo User',
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const getCurrentDate = () => {
    return format(new Date(), 'EEEE, dd MMMM yyyy', { locale: 'vi' });
  };

  const getDifficultyLabel = (difficulty) => {
    const labels = {
      easy: 'Dễ',
      medium: 'Trung bình',
      hard: 'Khó',
    };
    return labels[difficulty] || difficulty;
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: 'success',
      medium: 'warning',
      hard: 'error',
    };
    return colors[difficulty] || 'default';
  };

  return (
    <MainLayout>
      <Box
        sx={{
          width: '100%',
          px: DS.spacing.pageHorizontal,
          py: DS.spacing.pageTop,
          bgcolor: 'background.default',
        }}
      >
        {/* Page Header */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              fontSize: DS.typography.pageTitle,
              mb: 0.5,
            }}
          >
            Xin chào, {mockUser.full_name}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontSize: DS.typography.bodySmall,
            }}
          >
            {getCurrentDate()}
          </Typography>
        </Box>

        {/* Quick Actions */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              fontSize: DS.typography.sectionTitle,
              mb: 1.5,
            }}
          >
            {t('dashboard.quickActions') || 'Hành động nhanh'}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Paper
                component={Button}
                onClick={() => navigate(ROUTES.EXAM_CREATE)}
                sx={{
                  p: 2,
                  width: '100%',
                  textAlign: 'left',
                  textTransform: 'none',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: DS.borderRadius.regular,
                  bgcolor: 'background.paper',
                  '&:hover': {
                    bgcolor: 'primary.50',
                    borderColor: 'primary.main',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      bgcolor: 'primary.100',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Add sx={{ fontSize: 20, color: 'primary.main' }} />
                  </Box>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: 'text.primary',
                      fontSize: DS.typography.bodyMedium,
                    }}
                  >
                    Tạo đề thi mới
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper
                component={Button}
                onClick={() => navigate(ROUTES.EXAMS)}
                sx={{
                  p: 2,
                  width: '100%',
                  textAlign: 'left',
                  textTransform: 'none',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: DS.borderRadius.regular,
                  bgcolor: 'background.paper',
                  '&:hover': {
                    bgcolor: 'primary.50',
                    borderColor: 'primary.main',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      bgcolor: 'info.100',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Assignment sx={{ fontSize: 20, color: 'info.main' }} />
                  </Box>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: 'text.primary',
                      fontSize: DS.typography.bodyMedium,
                    }}
                  >
                    Xem đề thi
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper
                component={Button}
                onClick={() => navigate(ROUTES.HISTORY)}
                sx={{
                  p: 2,
                  width: '100%',
                  textAlign: 'left',
                  textTransform: 'none',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: DS.borderRadius.regular,
                  bgcolor: 'background.paper',
                  '&:hover': {
                    bgcolor: 'primary.50',
                    borderColor: 'primary.main',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      bgcolor: 'success.100',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <TrendingUp sx={{ fontSize: 20, color: 'success.main' }} />
                  </Box>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: 'text.primary',
                      fontSize: DS.typography.bodyMedium,
                    }}
                  >
                    Lịch sử thi
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper
                component={Button}
                onClick={() => navigate(ROUTES.SETTINGS)}
                sx={{
                  p: 2,
                  width: '100%',
                  textAlign: 'left',
                  textTransform: 'none',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: DS.borderRadius.regular,
                  bgcolor: 'background.paper',
                  '&:hover': {
                    bgcolor: 'primary.50',
                    borderColor: 'primary.main',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      bgcolor: 'warning.100',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <InsertChart sx={{ fontSize: 20, color: 'warning.main' }} />
                  </Box>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: 'text.primary',
                      fontSize: DS.typography.bodyMedium,
                    }}
                  >
                    Cài đặt
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Statistics Grid */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              fontSize: DS.typography.sectionTitle,
              mb: 1.5,
            }}
          >
            {t('dashboard.overview') || 'Tổng quan'}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
              <Paper
                sx={{
                  p: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: DS.borderRadius.regular,
                  bgcolor: 'background.paper',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    fontSize: DS.typography.bodySmall,
                    mb: 1,
                  }}
                >
                  {t('dashboard.totalExams') || 'Tổng số đề thi'}
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: 'text.primary',
                    fontSize: DS.typography.pageTitle,
                  }}
                >
                  {mockDashboardStats.total_exams}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} md={3}>
              <Paper
                sx={{
                  p: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: DS.borderRadius.regular,
                  bgcolor: 'background.paper',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    fontSize: DS.typography.bodySmall,
                    mb: 1,
                  }}
                >
                  {t('dashboard.completed') || 'Đã hoàn thành'}
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: 'text.primary',
                    fontSize: DS.typography.pageTitle,
                  }}
                >
                  {mockDashboardStats.completed_exams}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} md={3}>
              <Paper
                sx={{
                  p: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: DS.borderRadius.regular,
                  bgcolor: 'background.paper',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    fontSize: DS.typography.bodySmall,
                    mb: 1,
                  }}
                >
                  {t('dashboard.averageScore') || 'Điểm trung bình'}
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: 'text.primary',
                    fontSize: DS.typography.pageTitle,
                  }}
                >
                  {mockDashboardStats.average_score}%
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} md={3}>
              <Paper
                sx={{
                  p: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: DS.borderRadius.regular,
                  bgcolor: 'background.paper',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    fontSize: DS.typography.bodySmall,
                    mb: 1,
                  }}
                >
                  Đang làm
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: 'text.primary',
                    fontSize: DS.typography.pageTitle,
                  }}
                >
                  {mockDashboardStats.in_progress_exams}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Recent Exams Table */}
        <Paper
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: DS.borderRadius.regular,
            bgcolor: 'background.paper',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              p: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                fontSize: DS.typography.cardTitle,
              }}
            >
              {t('dashboard.recentActivity') || 'Đề thi gần đây'}
            </Typography>
            <Button
              size="small"
              endIcon={<ArrowForward sx={{ fontSize: 14 }} />}
              onClick={() => navigate(ROUTES.EXAMS)}
              sx={{
                textTransform: 'none',
                color: 'text.secondary',
                fontWeight: 600,
                fontSize: DS.typography.bodySmall,
              }}
            >
              Xem tất cả
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 600, fontSize: DS.typography.bodySmall, py: 1.5 }}>
                    Tiêu đề
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: DS.typography.bodySmall }}>
                    Môn học
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: DS.typography.bodySmall }}>
                    Số câu
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: DS.typography.bodySmall }}>
                    Thời gian
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: DS.typography.bodySmall }}>
                    Độ khó
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: DS.typography.bodySmall }}>
                    Ngày tạo
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: DS.typography.bodySmall }}>
                    Thao tác
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockRecentExams.map((exam) => (
                  <TableRow
                    key={exam.id}
                    sx={{
                      '&:hover': {
                        bgcolor: 'grey.50',
                      },
                    }}
                  >
                    <TableCell>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          color: 'text.primary',
                          fontSize: DS.typography.bodyMedium,
                        }}
                      >
                        {exam.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          color: 'text.secondary',
                          fontSize: DS.typography.bodySmall,
                        }}
                      >
                        {exam.subject}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          color: 'text.secondary',
                          fontSize: DS.typography.bodySmall,
                        }}
                      >
                        {exam.total_questions}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          color: 'text.secondary',
                          fontSize: DS.typography.bodySmall,
                        }}
                      >
                        {exam.duration_minutes} phút
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box
                        component="span"
                        sx={{
                          px: 1,
                          py: 0.25,
                          borderRadius: 0.5,
                          bgcolor: `${getDifficultyColor(exam.difficulty)}.100`,
                          color: `${getDifficultyColor(exam.difficulty)}.700`,
                          fontSize: DS.typography.bodyXSmall,
                          fontWeight: 600,
                        }}
                      >
                        {getDifficultyLabel(exam.difficulty)}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          color: 'text.secondary',
                          fontSize: DS.typography.bodySmall,
                        }}
                      >
                        {format(new Date(exam.created_at), 'dd/MM/yyyy')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton
                          size="small"
                          onClick={() => navigate(buildRoute(ROUTES.EXAM_DETAIL, { id: exam.id }))}
                          sx={{ color: 'primary.main' }}
                        >
                          <Visibility sx={{ fontSize: 16 }} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => navigate(buildRoute(ROUTES.EXAM_TAKE, { id: exam.id }))}
                          sx={{ color: 'success.main' }}
                        >
                          <PlayArrow sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </MainLayout>
  );
};

export default DashboardPage;

