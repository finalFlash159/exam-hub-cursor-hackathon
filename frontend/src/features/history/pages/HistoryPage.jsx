/**
 * History Page - Table showing all past exam attempts
 * Connected to backend API
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  LinearProgress,
  Pagination,
} from '@mui/material';
import {
  Search,
  Visibility,
  TrendingUp,
  Assessment,
  Timer,
  EmojiEvents,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { MainLayout } from '../../../components/layout';
import { ROUTES, buildRoute } from '../../../config/routes';
import { DESIGN_SYSTEM as DS } from '../../../config/designSystem';
import { format } from 'date-fns';
import { getExams, getExamAttempts } from '../../../api';
import { useApi } from '../../../hooks/useApi';
import { LoadingSpinner } from '../../../components/common';

// API functions
const getExamsApi = (skip, limit) => getExams(skip, limit);
const getExamAttemptsApi = (examId, skip, limit) => getExamAttempts(examId, skip, limit);

// Mock history data for now (will be replaced with actual API aggregation)
const mockHistory = [
  {
    id: 'attempt-001',
    exam_id: 'exam-001',
    exam_title: 'Bài kiểm tra Toán học cơ bản',
    subject: 'Toán học',
    score: 18,
    max_score: 20,
    percentage: 90,
    time_taken: 3200,
    passed: true,
    completed_at: '2024-01-25T15:45:00Z',
    difficulty: 'medium'
  },
  {
    id: 'attempt-002',
    exam_id: 'exam-002',
    exam_title: 'Kiểm tra Tiếng Anh - Unit 1',
    subject: 'Tiếng Anh',
    score: 12,
    max_score: 15,
    percentage: 80,
    time_taken: 2400,
    passed: true,
    completed_at: '2024-01-24T14:30:00Z',
    difficulty: 'easy'
  },
  {
    id: 'attempt-003',
    exam_id: 'exam-003',
    exam_title: 'Bài thi Văn học - Văn xuôi',
    subject: 'Văn học',
    score: 7,
    max_score: 10,
    percentage: 70,
    time_taken: 4800,
    passed: true,
    completed_at: '2024-01-23T16:20:00Z',
    difficulty: 'hard'
  },
  {
    id: 'attempt-004',
    exam_id: 'exam-004',
    exam_title: 'Kiểm tra Vật lý - Điện học',
    subject: 'Vật lý',
    score: 20,
    max_score: 25,
    percentage: 80,
    time_taken: 3600,
    passed: true,
    completed_at: '2024-01-22T10:15:00Z',
    difficulty: 'medium'
  },
  {
    id: 'attempt-005',
    exam_id: 'exam-005',
    exam_title: 'Bài thi Hóa học - Hữu cơ',
    subject: 'Hóa học',
    score: 14,
    max_score: 18,
    percentage: 78,
    time_taken: 3300,
    passed: true,
    completed_at: '2024-01-21T09:00:00Z',
    difficulty: 'hard'
  },
  {
    id: 'attempt-006',
    exam_id: 'exam-006',
    exam_title: 'Kiểm tra Sinh học - Tế bào',
    subject: 'Sinh học',
    score: 16,
    max_score: 22,
    percentage: 73,
    time_taken: 2800,
    passed: true,
    completed_at: '2024-01-20T11:30:00Z',
    difficulty: 'medium'
  },
  {
    id: 'attempt-007',
    exam_id: 'exam-007',
    exam_title: 'Bài thi Lịch sử - Việt Nam',
    subject: 'Lịch sử',
    score: 18,
    max_score: 30,
    percentage: 60,
    time_taken: 4500,
    passed: false,
    completed_at: '2024-01-19T13:45:00Z',
    difficulty: 'hard'
  },
  {
    id: 'attempt-008',
    exam_id: 'exam-008',
    exam_title: 'Kiểm tra Địa lý - Địa hình',
    subject: 'Địa lý',
    score: 12,
    max_score: 16,
    percentage: 75,
    time_taken: 2100,
    passed: true,
    completed_at: '2024-01-18T15:20:00Z',
    difficulty: 'easy'
  },
  {
    id: 'attempt-009',
    exam_id: 'exam-009',
    exam_title: 'Bài thi GDCD - Đạo đức',
    subject: 'GDCD',
    score: 9,
    max_score: 12,
    percentage: 75,
    time_taken: 1800,
    passed: true,
    completed_at: '2024-01-17T08:30:00Z',
    difficulty: 'easy'
  },
  {
    id: 'attempt-010',
    exam_id: 'exam-010',
    exam_title: 'Kiểm tra Tin học - Excel',
    subject: 'Tin học',
    score: 17,
    max_score: 20,
    percentage: 85,
    time_taken: 3000,
    passed: true,
    completed_at: '2024-01-16T14:10:00Z',
    difficulty: 'medium'
  },
  {
    id: 'attempt-011',
    exam_id: 'exam-001',
    exam_title: 'Bài kiểm tra Toán học cơ bản',
    subject: 'Toán học',
    score: 19,
    max_score: 20,
    percentage: 95,
    time_taken: 3100,
    passed: true,
    completed_at: '2024-01-15T16:00:00Z',
    difficulty: 'medium'
  },
  {
    id: 'attempt-012',
    exam_id: 'exam-002',
    exam_title: 'Kiểm tra Tiếng Anh - Unit 1',
    subject: 'Tiếng Anh',
    score: 13,
    max_score: 15,
    percentage: 87,
    time_taken: 2200,
    passed: true,
    completed_at: '2024-01-14T10:25:00Z',
    difficulty: 'easy'
  },
];

const HistoryPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // TODO: Replace with actual API call when user attempts endpoint is available
  // For now, using mock data. In production, this should aggregate attempts from all user's exams
  const [history, setHistory] = useState(mockHistory);
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Load history data (currently using mock data)
  useEffect(() => {
    const loadHistory = async () => {
      setLoading(true);
      try {
        // TODO: Implement proper API call to get user attempts
        // For now, just use mock data
        setHistory(mockHistory);
      } catch (error) {
        console.error('Failed to load history:', error);
        enqueueSnackbar('Không thể tải lịch sử thi', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  // Filter history
  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const matchesSearch = item.exam_title?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || 
        (filterStatus === 'passed' && item.passed) ||
        (filterStatus === 'failed' && !item.passed);
      const matchesDifficulty = filterDifficulty === 'all' || item.difficulty === filterDifficulty;
      return matchesSearch && matchesStatus && matchesDifficulty;
    });
  }, [searchQuery, filterStatus, filterDifficulty]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = filteredHistory.length;
    const passed = filteredHistory.filter(item => item.passed).length;
    const averageScore = filteredHistory.length > 0
      ? Math.round(filteredHistory.reduce((sum, item) => sum + item.percentage, 0) / filteredHistory.length)
      : 0;
    const bestScore = filteredHistory.length > 0
      ? Math.max(...filteredHistory.map(item => item.percentage))
      : 0;
    const totalTime = filteredHistory.reduce((sum, item) => sum + (item.time_taken || 0), 0);

    return { total, passed, averageScore, bestScore, totalTime };
  }, [filteredHistory]);

  // Pagination
  const paginatedHistory = filteredHistory.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  const totalPages = Math.ceil(filteredHistory.length / rowsPerPage);

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
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

  const handleViewResult = (attempt) => {
    navigate(buildRoute(ROUTES.EXAM_RESULT, { id: attempt.exam_id }));
  };

  return (
    <MainLayout>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: DS.spacing.pageTop }}>
        <Box sx={{ maxWidth: 1400, mx: 'auto', px: DS.spacing.pageHorizontal }}>
          {/* Page Header */}
          <Box sx={{ mb: 3 }}>
            <Typography
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                fontSize: DS.typography.pageTitle,
                mb: 0.5,
              }}
            >
              {t('history.title') || 'Lịch sử làm bài'}
            </Typography>
            <Typography
              sx={{
                color: 'text.secondary',
                fontSize: DS.typography.bodySmall,
              }}
            >
              Xem lại tất cả các bài thi đã làm
            </Typography>
          </Box>

          {/* Statistics Cards */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
            gap: 2, 
            mb: 3 
          }}>
            <Card>
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <Assessment sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography sx={{ fontSize: DS.typography.headingSmall, fontWeight: 600, mb: 0.5 }}>
                  {stats.total}
                </Typography>
                <Typography sx={{ fontSize: DS.typography.bodySmall, color: 'text.secondary' }}>
                  Tổng số lần làm
                </Typography>
              </CardContent>
            </Card>

            <Card>
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <TrendingUp sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                <Typography sx={{ fontSize: DS.typography.headingSmall, fontWeight: 600, mb: 0.5 }}>
                  {stats.averageScore}%
                </Typography>
                <Typography sx={{ fontSize: DS.typography.bodySmall, color: 'text.secondary' }}>
                  Điểm trung bình
                </Typography>
              </CardContent>
            </Card>

            <Card>
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <EmojiEvents sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                <Typography sx={{ fontSize: DS.typography.headingSmall, fontWeight: 600, mb: 0.5 }}>
                  {stats.bestScore}%
                </Typography>
                <Typography sx={{ fontSize: DS.typography.bodySmall, color: 'text.secondary' }}>
                  Điểm cao nhất
                </Typography>
              </CardContent>
            </Card>

            <Card>
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <Timer sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                <Typography sx={{ fontSize: DS.typography.headingSmall, fontWeight: 600, mb: 0.5 }}>
                  {formatDuration(stats.totalTime)}
                </Typography>
                <Typography sx={{ fontSize: DS.typography.bodySmall, color: 'text.secondary' }}>
                  Tổng thời gian
                </Typography>
              </CardContent>
            </Card>
          </Box>

          {/* Search & Filter Bar */}
          <Paper sx={{ p: 2, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: DS.borderRadius.regular }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <TextField
                size="small"
                placeholder="Tìm kiếm theo tên đề thi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ fontSize: 16 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ flex: 1, minWidth: 200 }}
              />
              
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={filterStatus}
                  label="Trạng thái"
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="passed">Đạt</MenuItem>
                  <MenuItem value="failed">Chưa đạt</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Độ khó</InputLabel>
                <Select
                  value={filterDifficulty}
                  label="Độ khó"
                  onChange={(e) => setFilterDifficulty(e.target.value)}
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="easy">Dễ</MenuItem>
                  <MenuItem value="medium">Trung bình</MenuItem>
                  <MenuItem value="hard">Khó</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Paper>

          {/* History Table */}
          <Paper sx={{ border: '1px solid', borderColor: 'divider', borderRadius: DS.borderRadius.regular, overflow: 'hidden' }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell sx={{ fontWeight: 600, fontSize: DS.typography.bodySmall, py: 1.5 }}>
                      Tên đề thi
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: DS.typography.bodySmall, py: 1.5 }}>
                      Môn học
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: DS.typography.bodySmall, py: 1.5 }}>
                      Điểm số
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: DS.typography.bodySmall, py: 1.5 }}>
                      Thời gian
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: DS.typography.bodySmall, py: 1.5 }}>
                      Ngày làm
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: DS.typography.bodySmall, py: 1.5 }}>
                      Trạng thái
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, fontSize: DS.typography.bodySmall, py: 1.5 }}>
                      Thao tác
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                        <LoadingSpinner />
                      </TableCell>
                    </TableRow>
                  ) : paginatedHistory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary" sx={{ fontSize: DS.typography.bodyMedium }}>
                          Không tìm thấy lịch sử nào
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedHistory.map((item) => (
                      <TableRow
                        key={item.id}
                        hover
                        sx={{
                          '&:hover': {
                            bgcolor: 'grey.50',
                          }
                        }}
                      >
                        <TableCell sx={{ py: 1.5 }}>
                          <Typography sx={{ fontWeight: 600, fontSize: DS.typography.bodyMedium }}>
                            {item.exam_title}
                          </Typography>
                          <Chip
                            label={getDifficultyLabel(item.difficulty)}
                            size="small"
                            color={getDifficultyColor(item.difficulty)}
                            sx={{ mt: 0.5, fontSize: DS.typography.bodyXSmall, height: 20 }}
                          />
                        </TableCell>
                        <TableCell sx={{ py: 1.5 }}>
                          <Typography sx={{ fontSize: DS.typography.bodySmall, color: 'text.secondary' }}>
                            {item.subject}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 1.5 }}>
                          <Box>
                            <Typography sx={{ fontWeight: 600, fontSize: DS.typography.bodyMedium, mb: 0.5 }}>
                              {item.score}/{item.max_score}
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={item.percentage}
                              sx={{
                                height: 6,
                                borderRadius: 3,
                                bgcolor: 'grey.200',
                                '& .MuiLinearProgress-bar': {
                                  bgcolor: item.percentage >= 80 ? 'success.main' : item.percentage >= 60 ? 'warning.main' : 'error.main',
                                }
                              }}
                            />
                            <Typography sx={{ fontSize: DS.typography.bodyXSmall, color: 'text.secondary', mt: 0.5 }}>
                              {item.percentage}%
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ py: 1.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Timer sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography sx={{ fontSize: DS.typography.bodySmall }}>
                              {formatDuration(item.time_taken)}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ py: 1.5 }}>
                          <Typography sx={{ fontSize: DS.typography.bodySmall, color: 'text.secondary' }}>
                            {formatDate(item.completed_at)}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 1.5 }}>
                          <Chip
                            label={item.passed ? 'Đạt' : 'Chưa đạt'}
                            color={item.passed ? 'success' : 'error'}
                            size="small"
                            sx={{ fontSize: DS.typography.bodyXSmall, height: 20 }}
                          />
                        </TableCell>
                        <TableCell align="right" sx={{ py: 1.5 }}>
                          <Button
                            size="small"
                            startIcon={<Visibility sx={{ fontSize: 16 }} />}
                            onClick={() => handleViewResult(item)}
                            sx={{ fontSize: DS.typography.bodySmall }}
                          >
                            Xem kết quả
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', borderTop: '1px solid', borderColor: 'divider' }}>
                <Pagination
                  count={totalPages}
                  page={page + 1}
                  onChange={(event, value) => setPage(value - 1)}
                  color="primary"
                />
              </Box>
            )}
          </Paper>
        </Box>
      </Box>
    </MainLayout>
  );
};

export default HistoryPage;

