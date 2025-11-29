/**
 * Exam Detail Page - View exam details and questions
 * Connected to backend API
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  Card,
  CardContent,
  Stack,
  Divider,
  IconButton,
  Grid,
} from '@mui/material';
import {
  ArrowBack,
  PlayArrow,
  Edit,
  Share,
  Visibility,
  CheckCircle,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { MainLayout } from '../../../components/layout';
import { ROUTES, buildRoute } from '../../../config/routes';
import { DESIGN_SYSTEM as DS } from '../../../config/designSystem';
import { getExam } from '../../../api';
import { useApi } from '../../../hooks/useApi';
import { LoadingSpinner } from '../../../components/common';

const ExamDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const [exam, setExam] = useState(null);

  // API hooks
  const { data: examData, loading: loadingExam, error: examError, execute: loadExam } = useApi(getExam);

  // Load exam on component mount
  useEffect(() => {
    if (id) {
      loadExam(id, false); // Don't include answers for public view
    }
  }, [id]);

  // Update local state when API data changes
  useEffect(() => {
    if (examData) {
      setExam(examData);
    }
  }, [examData]);

  const getQuestionTypeLabel = (type) => {
    const labels = {
      mcq: 'Trắc nghiệm',
      true_false: 'Đúng/Sai',
      short_answer: 'Trả lời ngắn',
      essay: 'Tự luận'
    };
    return labels[type] || type;
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

  const renderQuestionInput = (question) => {
    switch (question.question_type) {
      case 'mcq':
        return (
          <Stack spacing={1}>
            {question.options?.map((option, optIndex) => (
              <Box key={optIndex} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ fontSize: DS.typography.bodySmall, minWidth: 20 }}>
                  {String.fromCharCode(65 + optIndex)}.
                </Typography>
                <Typography sx={{ fontSize: DS.typography.bodySmall }}>
                  {option}
                </Typography>
                {question.correct_answer === option && (
                  <CheckCircle sx={{ fontSize: 16, color: 'success.main' }} />
                )}
              </Box>
            ))}
          </Stack>
        );

      case 'true_false':
        return (
          <Stack spacing={1}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontSize: DS.typography.bodySmall, minWidth: 20 }}>
                A.
              </Typography>
              <Typography sx={{ fontSize: DS.typography.bodySmall }}>
                Đúng
              </Typography>
              {question.correct_answer === 'Đúng' && (
                <CheckCircle sx={{ fontSize: 16, color: 'success.main' }} />
              )}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontSize: DS.typography.bodySmall, minWidth: 20 }}>
                B.
              </Typography>
              <Typography sx={{ fontSize: DS.typography.bodySmall }}>
                Sai
              </Typography>
              {question.correct_answer === 'Sai' && (
                <CheckCircle sx={{ fontSize: 16, color: 'success.main' }} />
              )}
            </Box>
          </Stack>
        );

      case 'short_answer':
        return (
          <Box sx={{ p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography sx={{ fontSize: DS.typography.bodySmall, fontWeight: 600 }}>
              Đáp án đúng: {question.correct_answer}
            </Typography>
          </Box>
        );

      case 'essay':
        return (
          <Box sx={{ p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography sx={{ fontSize: DS.typography.bodySmall }}>
              {question.explanation || 'Bài tự luận - cần chấm điểm thủ công'}
            </Typography>
          </Box>
        );

      default:
        return null;
    }
  };

  if (loadingExam) {
    return (
      <MainLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <LoadingSpinner />
        </Box>
      </MainLayout>
    );
  }

  if (examError || !exam) {
    return (
      <MainLayout>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="error" sx={{ mb: 2 }}>
            {examError || 'Không tìm thấy bài thi'}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate(ROUTES.EXAMS)}
            startIcon={<ArrowBack />}
          >
            Quay lại danh sách
          </Button>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        <Box sx={{ py: DS.spacing.pageTop, px: DS.spacing.pageHorizontal, maxWidth: 1000, mx: 'auto' }}>

          {/* Header */}
          <Box sx={{ mb: 3 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate(ROUTES.EXAMS)}
              sx={{ mb: 2, color: 'text.secondary' }}
            >
              Quay lại danh sách
            </Button>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: 'text.primary',
                    fontSize: DS.typography.pageTitle,
                    mb: 1,
                  }}
                >
                  {exam.title}
                </Typography>
                <Typography
                  sx={{
                    color: 'text.secondary',
                    fontSize: DS.typography.bodyMedium,
                    mb: 2,
                  }}
                >
                  {exam.description}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Chip
                    label={getDifficultyLabel(exam.difficulty)}
                    color={getDifficultyColor(exam.difficulty)}
                    size="small"
                  />
                  <Chip
                    label={`${exam.questions?.length || 0} câu hỏi`}
                    variant="outlined"
                    size="small"
                  />
                  {exam.duration && (
                    <Chip
                      label={`${exam.duration} phút`}
                      variant="outlined"
                      size="small"
                    />
                  )}
                  <Chip
                    label={exam.is_published ? 'Đã xuất bản' : 'Bản nháp'}
                    color={exam.is_published ? 'success' : 'default'}
                    size="small"
                  />
                </Stack>
              </Box>

              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={() => navigate(buildRoute(ROUTES.EXAM_DETAIL, { id: exam.id }))}
                >
                  Chỉnh sửa
                </Button>
                <Button
                  variant="contained"
                  startIcon={<PlayArrow />}
                  onClick={() => navigate(buildRoute(ROUTES.EXAM_TAKE, { id: exam.id }))}
                  disabled={!exam.is_published}
                >
                  Làm bài
                </Button>
              </Stack>
            </Box>
          </Box>

          {/* Exam Stats */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 2, textAlign: 'center', border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {exam.questions?.length || 0}
                </Typography>
                <Typography sx={{ fontSize: DS.typography.bodySmall, color: 'text.secondary' }}>
                  Câu hỏi
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 2, textAlign: 'center', border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                  {exam.total_marks || 0}
                </Typography>
                <Typography sx={{ fontSize: DS.typography.bodySmall, color: 'text.secondary' }}>
                  Tổng điểm
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 2, textAlign: 'center', border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                  {exam.passing_marks || 0}
                </Typography>
                <Typography sx={{ fontSize: DS.typography.bodySmall, color: 'text.secondary' }}>
                  Điểm qua môn
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 2, textAlign: 'center', border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                  {exam.attempt_count || 0}
                </Typography>
                <Typography sx={{ fontSize: DS.typography.bodySmall, color: 'text.secondary' }}>
                  Lượt thi
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Questions */}
          <Paper sx={{ border: '1px solid', borderColor: 'divider', borderRadius: DS.borderRadius.regular }}>
            <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Danh sách câu hỏi
              </Typography>
            </Box>

            <Box sx={{ p: 3 }}>
              {exam.questions && exam.questions.length > 0 ? (
                <Stack spacing={3}>
                  {exam.questions.map((question, index) => (
                    <Card key={question.id} sx={{ border: '1px solid', borderColor: 'divider' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, minWidth: 60 }}>
                              Câu {index + 1}
                            </Typography>
                            <Chip
                              label={getQuestionTypeLabel(question.question_type)}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          </Box>
                          <Chip
                            label={`${question.marks} điểm`}
                            size="small"
                            color="success"
                          />
                        </Box>

                        <Typography sx={{ mb: 2, fontSize: DS.typography.bodyMedium }}>
                          {question.question_text}
                        </Typography>

                        {renderQuestionInput(question)}

                        {question.explanation && question.question_type === 'mcq' && (
                          <Box sx={{ mt: 2, p: 1, bgcolor: 'info.50', borderRadius: 1 }}>
                            <Typography sx={{ fontSize: DS.typography.bodyXSmall, color: 'info.main' }}>
                              Giải thích: {question.explanation}
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="text.secondary">
                    Bài thi này chưa có câu hỏi nào.
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Box>
      </Box>
    </MainLayout>
  );
};

export default ExamDetailPage;
