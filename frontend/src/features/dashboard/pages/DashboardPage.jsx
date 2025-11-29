/**
 * Dashboard Page - Main dashboard with statistics and recent exams
 * Connected to backend API
 */

import React, { useEffect, useState } from 'react';
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
import { vi } from 'date-fns/locale';
import { getDashboardStats, getExams } from '../../../api';
import { LoadingSpinner } from '../../../components/common';

// Default fallback data matching backend response structure
const defaultDashboardStats = {
  total_exams: 0,
  total_folders: 0,
  total_attempts: 0,
  total_files: 0,
  published_exams: 0,
  draft_exams: 0,
  completed_attempts: 0,
  average_score: 0.0
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // State for dashboard data
  const [dashboardStats, setDashboardStats] = useState(defaultDashboardStats);
  const [recentExams, setRecentExams] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingExams, setLoadingExams] = useState(true);
  const [statsError, setStatsError] = useState(null);
  const [examsError, setExamsError] = useState(null);

  // Load dashboard data on component mount
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Load dashboard statistics
        setLoadingStats(true);
        const response = await getDashboardStats();
        // Extract stats from response
        setDashboardStats(response.stats || defaultDashboardStats);
        // If there are recent exams in the dashboard response, use them
        if (response.recent_exams && response.recent_exams.length > 0) {
          setRecentExams(response.recent_exams);
          setExamsError(null);
          setLoadingExams(false);
        } else {
          // Load exams separately if not in dashboard response
          try {
            setLoadingExams(true);
            const exams = await getExams(0, 5);
            setRecentExams(exams);
            setExamsError(null);
          } catch (error) {
            console.error('Failed to load recent exams:', error);
            setExamsError('Không thể tải danh sách đề thi');
            setRecentExams([]);
          } finally {
            setLoadingExams(false);
          }
        }
        setStatsError(null);
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
        setStatsError('Không thể tải dữ liệu thống kê');
        setDashboardStats(defaultDashboardStats);
      } finally {
        setLoadingStats(false);
      }
    };

    loadDashboardData();
  }, []);

  const getCurrentDate = () => {
    return format(new Date(), 'EEEE, dd MMMM yyyy', { locale: vi });
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
            Xin chào, Người dùng
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
          {loadingStats ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <LoadingSpinner />
            </Box>
          ) : statsError ? (
            <Typography color="error" sx={{ textAlign: 'center', p: 2 }}>
              {statsError}
            </Typography>
          ) : (
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
                    {dashboardStats.total_exams || 0}
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
                    {dashboardStats.completed_attempts || 0}
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
                    {dashboardStats.average_score ? `${dashboardStats.average_score}%` : '0%'}
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
                    Tổng bài thi
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: 'text.primary',
                      fontSize: DS.typography.pageTitle,
                    }}
                  >
                    {dashboardStats.total_attempts || 0}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          )}
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
                {loadingExams ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <LoadingSpinner size={24} />
                    </TableCell>
                  </TableRow>
                ) : examsError ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography color="error" sx={{ fontSize: DS.typography.bodyMedium }}>
                        {examsError}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : recentExams.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary" sx={{ fontSize: DS.typography.bodyMedium }}>
                        Chưa có đề thi nào
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  recentExams.map((exam) => (
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
                        {exam.subject || exam.description || 'Chưa có mô tả'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          color: 'text.secondary',
                          fontSize: DS.typography.bodySmall,
                        }}
                      >
                        {exam.question_count || 0}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          color: 'text.secondary',
                          fontSize: DS.typography.bodySmall,
                        }}
                      >
                        {exam.duration || 0} phút
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box
                        component="span"
                        sx={{
                          px: 1,
                          py: 0.25,
                          borderRadius: 0.5,
                          bgcolor: `${getDifficultyColor(exam.difficulty || 'medium')}.100`,
                          color: `${getDifficultyColor(exam.difficulty || 'medium')}.700`,
                          fontSize: DS.typography.bodyXSmall,
                          fontWeight: 600,
                        }}
                      >
                        {getDifficultyLabel(exam.difficulty || 'medium')}
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
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </MainLayout>
  );
};

export default DashboardPage;

