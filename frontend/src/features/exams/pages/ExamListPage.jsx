/**
 * Exam List Page - Table view with folders and filtering
 * UI-only version with static data
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Checkbox,
  Select,
  FormControl,
  InputLabel,
  Pagination,
  Chip,
  Divider,
} from '@mui/material';
import {
  Search,
  Add,
  MoreVert,
  Edit,
  Delete,
  PlayArrow,
  Visibility,
  Archive,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { MainLayout, FolderSidebar } from '../../../components/layout';
import { ROUTES, buildRoute } from '../../../config/routes';
import { DESIGN_SYSTEM as DS } from '../../../config/designSystem';
import { format } from 'date-fns';

// Static mock data
const mockExams = [
  {
    id: 'exam-001',
    title: 'Bài kiểm tra Toán học cơ bản',
    subject: 'Toán học',
    total_questions: 20,
    duration_minutes: 60,
    difficulty: 'medium',
    is_public: true,
    folder_id: 'folder-001',
    status: 'published',
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 'exam-002',
    title: 'Kiểm tra Tiếng Anh - Unit 1',
    subject: 'Tiếng Anh',
    total_questions: 15,
    duration_minutes: 45,
    difficulty: 'easy',
    is_public: true,
    folder_id: 'folder-002',
    status: 'published',
    created_at: '2024-01-14T09:00:00Z'
  },
  {
    id: 'exam-003',
    title: 'Bài thi Văn học - Văn xuôi',
    subject: 'Văn học',
    total_questions: 10,
    duration_minutes: 90,
    difficulty: 'hard',
    is_public: false,
    folder_id: 'folder-003',
    status: 'published',
    created_at: '2024-01-13T14:00:00Z'
  },
  {
    id: 'exam-004',
    title: 'Kiểm tra Vật lý - Điện học',
    subject: 'Vật lý',
    total_questions: 25,
    duration_minutes: 75,
    difficulty: 'medium',
    is_public: true,
    folder_id: null,
    status: 'published',
    created_at: '2024-01-12T11:00:00Z'
  },
  {
    id: 'exam-005',
    title: 'Bài thi Hóa học - Hữu cơ',
    subject: 'Hóa học',
    total_questions: 18,
    duration_minutes: 60,
    difficulty: 'hard',
    is_public: true,
    folder_id: 'folder-001',
    status: 'draft',
    created_at: '2024-01-11T08:00:00Z'
  },
  {
    id: 'exam-006',
    title: 'Kiểm tra Sinh học - Tế bào',
    subject: 'Sinh học',
    total_questions: 22,
    duration_minutes: 50,
    difficulty: 'medium',
    is_public: true,
    folder_id: null,
    status: 'published',
    created_at: '2024-01-10T15:00:00Z'
  },
  {
    id: 'exam-007',
    title: 'Bài thi Lịch sử - Việt Nam',
    subject: 'Lịch sử',
    total_questions: 30,
    duration_minutes: 90,
    difficulty: 'hard',
    is_public: false,
    folder_id: null,
    status: 'archived',
    created_at: '2024-01-09T10:00:00Z'
  },
  {
    id: 'exam-008',
    title: 'Kiểm tra Địa lý - Địa hình',
    subject: 'Địa lý',
    total_questions: 16,
    duration_minutes: 45,
    difficulty: 'easy',
    is_public: true,
    folder_id: 'folder-002',
    status: 'published',
    created_at: '2024-01-08T13:00:00Z'
  },
  {
    id: 'exam-009',
    title: 'Bài thi GDCD - Đạo đức',
    subject: 'GDCD',
    total_questions: 12,
    duration_minutes: 40,
    difficulty: 'easy',
    is_public: true,
    folder_id: null,
    status: 'published',
    created_at: '2024-01-07T09:00:00Z'
  },
  {
    id: 'exam-010',
    title: 'Kiểm tra Tin học - Excel',
    subject: 'Tin học',
    total_questions: 20,
    duration_minutes: 60,
    difficulty: 'medium',
    is_public: true,
    folder_id: 'folder-001',
    status: 'published',
    created_at: '2024-01-06T11:00:00Z'
  },
  {
    id: 'exam-011',
    title: 'Bài thi Công nghệ - Điện',
    subject: 'Công nghệ',
    total_questions: 14,
    duration_minutes: 50,
    difficulty: 'easy',
    is_public: false,
    folder_id: null,
    status: 'draft',
    created_at: '2024-01-05T14:00:00Z'
  },
  {
    id: 'exam-012',
    title: 'Kiểm tra Thể dục - Lý thuyết',
    subject: 'Thể dục',
    total_questions: 8,
    duration_minutes: 30,
    difficulty: 'easy',
    is_public: true,
    folder_id: null,
    status: 'published',
    created_at: '2024-01-04T10:00:00Z'
  },
];

const DRAWER_WIDTH = 220;

const ExamListPage = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  
  // State
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedExams, setSelectedExams] = useState([]);

  // Filter exams by folder, search, and status
  const filteredExams = useMemo(() => {
    return mockExams.filter((exam) => {
      // Folder filter
      if (selectedFolder === 'all') {
        // Show all exams
      } else if (selectedFolder === 'root') {
        // Show exams not in any folder
        if (exam.folder_id) return false;
      } else {
        // Show exams in specific folder
        if (exam.folder_id !== selectedFolder) return false;
      }
      
      // Search filter
      if (searchTerm && !exam.title?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Status filter
      if (statusFilter !== 'all') {
        if (statusFilter === 'published' && exam.status !== 'published') return false;
        if (statusFilter === 'archived' && exam.status !== 'archived') return false;
        if (statusFilter === 'draft' && exam.status !== 'draft') return false;
      }
      
      return true;
    });
  }, [selectedFolder, searchTerm, statusFilter]);

  // Pagination
  const paginatedExams = filteredExams.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const totalPages = Math.ceil(filteredExams.length / rowsPerPage);

  // Bulk actions
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedExams(paginatedExams.map(e => e.id));
    } else {
      setSelectedExams([]);
    }
  };
  
  const handleSelectExam = (examId) => {
    if (selectedExams.includes(examId)) {
      setSelectedExams(selectedExams.filter(id => id !== examId));
    } else {
      setSelectedExams([...selectedExams, examId]);
    }
  };

  // Actions menu
  const handleMenuOpen = (event, exam) => {
    setAnchorEl(event.currentTarget);
    setSelectedExam(exam);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedExam(null);
  };

  const handleView = () => {
    if (selectedExam) {
      navigate(buildRoute(ROUTES.EXAM_DETAIL, { id: selectedExam.id }));
    }
    handleMenuClose();
  };

  const handleEdit = () => {
    if (selectedExam) {
      navigate(buildRoute(ROUTES.EXAM_DETAIL, { id: selectedExam.id }));
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    if (selectedExam && window.confirm('Bạn có chắc muốn xóa đề thi này?')) {
      enqueueSnackbar('Đã xóa đề thi', { variant: 'success' });
    }
    handleMenuClose();
  };

  const handleTakeExam = () => {
    if (selectedExam) {
      navigate(buildRoute(ROUTES.EXAM_TAKE, { id: selectedExam.id }));
    }
    handleMenuClose();
  };

  const handleArchive = () => {
    if (selectedExam) {
      enqueueSnackbar('Đã lưu trữ đề thi', { variant: 'success' });
    }
    handleMenuClose();
  };

  const handleBulkDelete = () => {
    if (selectedExams.length > 0 && window.confirm(`Bạn có chắc muốn xóa ${selectedExams.length} đề thi?`)) {
      enqueueSnackbar(`Đã xóa ${selectedExams.length} đề thi`, { variant: 'success' });
      setSelectedExams([]);
    }
  };

  const handleBulkArchive = () => {
    if (selectedExams.length > 0) {
      enqueueSnackbar(`Đã lưu trữ ${selectedExams.length} đề thi`, { variant: 'success' });
      setSelectedExams([]);
    }
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

  const getStatusLabel = (status) => {
    const labels = {
      published: 'Đã xuất bản',
      draft: 'Bản nháp',
      archived: 'Đã lưu trữ',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      published: 'success',
      draft: 'warning',
      archived: 'default',
    };
    return colors[status] || 'default';
  };

  return (
    <MainLayout>
      <Box sx={{ display: 'flex', height: '100%' }}>
        {/* Left Sidebar - Folders */}
        <FolderSidebar
          selectedFolder={selectedFolder}
          onFolderSelect={setSelectedFolder}
          drawerWidth={DRAWER_WIDTH}
        />

        {/* Main Content */}
        <Box sx={{ flexGrow: 1, bgcolor: 'background.default', overflow: 'auto' }}>
          <Box sx={{ px: DS.spacing.pageHorizontal, py: DS.spacing.pageTop }}>
            {/* Header */}
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: 'text.primary',
                  fontSize: DS.typography.pageTitle,
                }}
              >
                {t('exams.myExams') || 'Đề thi của tôi'}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                  size="small"
                  placeholder={t('exams.searchPlaceholder') || 'Tìm kiếm đề thi...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ fontSize: 16 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    width: { xs: 140, sm: 180 },
                    '& .MuiInputBase-root': {
                      height: 32,
                      fontSize: DS.typography.bodySmall
                    }
                  }}
                />
                
                <FormControl size="small" sx={{ minWidth: { xs: 100, sm: 120 } }}>
                  <InputLabel sx={{ fontSize: DS.typography.bodySmall }}>Trạng thái</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Trạng thái"
                    onChange={(e) => setStatusFilter(e.target.value)}
                    sx={{ 
                      height: 32,
                      fontSize: DS.typography.bodySmall
                    }}
                  >
                    <MenuItem value="all" sx={{ fontSize: DS.typography.bodySmall }}>Tất cả</MenuItem>
                    <MenuItem value="published" sx={{ fontSize: DS.typography.bodySmall }}>Đã xuất bản</MenuItem>
                    <MenuItem value="draft" sx={{ fontSize: DS.typography.bodySmall }}>Bản nháp</MenuItem>
                    <MenuItem value="archived" sx={{ fontSize: DS.typography.bodySmall }}>Đã lưu trữ</MenuItem>
                  </Select>
                </FormControl>

                <Button
                  variant="contained"
                  size="small"
                  startIcon={<Add sx={{ fontSize: 18 }} />}
                  onClick={() => navigate(ROUTES.EXAM_CREATE)}
                  sx={{ 
                    fontSize: DS.typography.bodyMedium,
                    height: 32,
                    px: 1.5
                  }}
                >
                  {t('exams.createNew') || 'Tạo đề thi'}
                </Button>
              </Box>
            </Box>

            {/* Bulk actions bar */}
            {selectedExams.length > 0 && (
              <Paper sx={{ 
                p: 1.5, 
                mb: 2, 
                bgcolor: 'primary.50', 
                border: '1px solid',
                borderColor: 'primary.200',
                borderRadius: DS.borderRadius.regular
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: DS.typography.bodySmall }}>
                    Đã chọn {selectedExams.length} đề thi
                  </Typography>
                  <Button 
                    size="small" 
                    startIcon={<Archive sx={{ fontSize: 16 }} />} 
                    variant="outlined" 
                    onClick={handleBulkArchive}
                    sx={{ fontSize: DS.typography.bodySmall, height: 28, px: 1 }}
                  >
                    Lưu trữ
                  </Button>
                  <Button 
                    size="small" 
                    startIcon={<Delete sx={{ fontSize: 16 }} />} 
                    variant="outlined" 
                    color="error" 
                    onClick={handleBulkDelete}
                    sx={{ fontSize: DS.typography.bodySmall, height: 28, px: 1 }}
                  >
                    Xóa
                  </Button>
                  <Button 
                    size="small" 
                    onClick={() => setSelectedExams([])}
                    sx={{ fontSize: DS.typography.bodySmall, height: 28, px: 1 }}
                  >
                    Hủy
                  </Button>
                </Box>
              </Paper>
            )}

            {/* Table */}
            <Paper sx={{ 
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: DS.borderRadius.regular,
              boxShadow: DS.shadows.subtle,
              overflow: 'hidden',
            }}>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.50' }}>
                      <TableCell padding="checkbox" sx={{ py: 1 }}>
                        <Checkbox
                          size="small"
                          indeterminate={selectedExams.length > 0 && selectedExams.length < paginatedExams.length}
                          checked={paginatedExams.length > 0 && selectedExams.length === paginatedExams.length}
                          onChange={handleSelectAll}
                        />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: DS.typography.bodySmall }}>
                        {t('exams.title') || 'Tiêu đề'}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: DS.typography.bodySmall, display: { xs: 'none', sm: 'table-cell' } }}>
                        {t('exams.category') || 'Môn học'}
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600, fontSize: DS.typography.bodySmall, display: { xs: 'none', md: 'table-cell' } }}>
                        Số câu
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600, fontSize: DS.typography.bodySmall, display: { xs: 'none', md: 'table-cell' } }}>
                        Thời gian
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: DS.typography.bodySmall }}>
                        Độ khó
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: DS.typography.bodySmall }}>
                        Trạng thái
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, fontSize: DS.typography.bodySmall }}>
                        {t('exams.actions') || 'Thao tác'}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedExams.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                          <Typography color="text.secondary" sx={{ fontSize: DS.typography.bodyMedium, mb: 1 }}>
                            {searchTerm ? 'Không tìm thấy đề thi' : 'Chưa có đề thi nào'}
                          </Typography>
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<Add sx={{ fontSize: 18 }} />}
                            onClick={() => navigate(ROUTES.EXAM_CREATE)}
                            sx={{ fontSize: DS.typography.bodyMedium, height: 32 }}
                          >
                            Tạo đề thi đầu tiên
                          </Button>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedExams.map((exam) => (
                        <TableRow
                          key={exam.id}
                          hover
                          selected={selectedExams.includes(exam.id)}
                          sx={{ 
                            '&:hover': {
                              bgcolor: 'grey.50'
                            }
                          }}
                        >
                          <TableCell padding="checkbox" sx={{ py: 1 }}>
                            <Checkbox
                              size="small"
                              checked={selectedExams.includes(exam.id)}
                              onChange={() => handleSelectExam(exam.id)}
                            />
                          </TableCell>
                          <TableCell sx={{ py: 1 }}>
                            <Box
                              sx={{
                                cursor: 'pointer',
                                '&:hover': { color: 'primary.main' },
                              }}
                              onClick={() => navigate(buildRoute(ROUTES.EXAM_DETAIL, { id: exam.id }))}
                            >
                              <Typography sx={{ fontWeight: 600, fontSize: DS.typography.bodyMedium, mb: 0.25 }}>
                                {exam.title}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: 'text.secondary',
                                  fontSize: DS.typography.bodyXSmall,
                                }}
                              >
                                {format(new Date(exam.created_at), 'dd/MM/yyyy')}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ py: 1, display: { xs: 'none', sm: 'table-cell' } }}>
                            <Typography sx={{ fontSize: DS.typography.bodySmall, color: 'text.secondary' }}>
                              {exam.subject}
                            </Typography>
                          </TableCell>
                          <TableCell align="center" sx={{ py: 1, display: { xs: 'none', md: 'table-cell' } }}>
                            <Typography sx={{ fontSize: DS.typography.bodySmall, color: 'text.secondary' }}>
                              {exam.total_questions}
                            </Typography>
                          </TableCell>
                          <TableCell align="center" sx={{ py: 1, display: { xs: 'none', md: 'table-cell' } }}>
                            <Typography sx={{ fontSize: DS.typography.bodySmall, color: 'text.secondary' }}>
                              {exam.duration_minutes} phút
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ py: 1 }}>
                            <Chip
                              label={getDifficultyLabel(exam.difficulty)}
                              size="small"
                              color={getDifficultyColor(exam.difficulty)}
                              sx={{ fontSize: DS.typography.bodyXSmall, height: 20 }}
                            />
                          </TableCell>
                          <TableCell sx={{ py: 1 }}>
                            <Chip
                              label={getStatusLabel(exam.status)}
                              size="small"
                              color={getStatusColor(exam.status)}
                              sx={{ fontSize: DS.typography.bodyXSmall, height: 20 }}
                            />
                          </TableCell>
                          <TableCell align="right" sx={{ py: 1 }}>
                            <IconButton
                              size="small"
                              onClick={(e) => handleMenuOpen(e, exam)}
                              sx={{ color: 'text.secondary' }}
                            >
                              <MoreVert sx={{ fontSize: 18 }} />
                            </IconButton>
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
                    size="small"
                  />
                </Box>
              )}
            </Paper>
          </Box>
        </Box>
      </Box>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        slotProps={{
          paper: {
            sx: {
              minWidth: 180,
              boxShadow: DS.shadows.hover,
            }
          }
        }}
      >
        <MenuItem onClick={handleView} sx={{ fontSize: DS.typography.bodySmall, py: 0.75 }}>
          <Visibility sx={{ fontSize: 16, mr: 1.5 }} />
          Xem
        </MenuItem>
        <MenuItem onClick={handleEdit} sx={{ fontSize: DS.typography.bodySmall, py: 0.75 }}>
          <Edit sx={{ fontSize: 16, mr: 1.5 }} />
          Chỉnh sửa
        </MenuItem>
        <MenuItem onClick={handleTakeExam} sx={{ fontSize: DS.typography.bodySmall, py: 0.75 }}>
          <PlayArrow sx={{ fontSize: 16, mr: 1.5 }} />
          Làm bài
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleArchive} sx={{ fontSize: DS.typography.bodySmall, py: 0.75 }}>
          <Archive sx={{ fontSize: 16, mr: 1.5 }} />
          Lưu trữ
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ fontSize: DS.typography.bodySmall, py: 0.75, color: 'error.main' }}>
          <Delete sx={{ fontSize: 16, mr: 1.5 }} />
          Xóa
        </MenuItem>
      </Menu>
    </MainLayout>
  );
};

export default ExamListPage;

