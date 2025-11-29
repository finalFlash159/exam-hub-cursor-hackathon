/**
 * Exam Result Page - Shows exam results with score and detailed review
 * Connected to backend API
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Chip,
  CircularProgress,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Stack,
} from '@mui/material';
import {
  ArrowBack,
  Replay,
  Share,
  CheckCircle,
  Cancel,
  Timer,
  TrendingUp,
  ExpandMore,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import Confetti from 'react-confetti';
import { MainLayout } from '../../../components/layout';
import { ROUTES, buildRoute } from '../../../config/routes';
import { DESIGN_SYSTEM as DS } from '../../../config/designSystem';
import { format } from 'date-fns';
import { getAttempt } from '../../../api';
import { useApi } from '../../../hooks/useApi';
import { LoadingSpinner } from '../../../components/common';

// API functions
const getAttemptApi = (attemptId) => getAttempt(attemptId);

const ExamResultPage = () => {
  const { id: examId } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [searchParams] = useSearchParams();

  // API hooks
  const { data: attemptData, loading: loadingAttempt, error: attemptError, execute: loadAttempt } = useApi(getAttemptApi);

  const [result, setResult] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Try to get attemptId from URL query parameter
    const attemptIdParam = searchParams.get('attemptId');

    if (attemptIdParam) {
      // Load attempt data from API
      console.log('Loading attempt from URL:', attemptIdParam);
      loadAttempt(parseInt(attemptIdParam));
    } else {
      // If no attemptId in URL, show error
      console.error('No attemptId found in URL');
      enqueueSnackbar('Không tìm thấy kết quả bài thi. Vui lòng làm bài trước.', { variant: 'warning' });
      navigate(buildRoute(ROUTES.EXAM_DETAIL, { id: examId }));
    }
  }, [examId, searchParams, loadAttempt, navigate, enqueueSnackbar]);

  // Set window size for confetti
  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  // Handle attempt data when loaded from API
  useEffect(() => {
    if (attemptData) {
      console.log('Attempt data loaded:', attemptData);
      
      // Process the attempt data from API
      const score = attemptData.score || 0;
      const percentage = attemptData.percentage || 0;
      const passed = attemptData.passed || false;
      
      // Get time taken
      const startedAt = attemptData.started_at ? new Date(attemptData.started_at) : null;
      const completedAt = attemptData.completed_at ? new Date(attemptData.completed_at) : null;
      const timeTaken = startedAt && completedAt 
        ? Math.floor((completedAt - startedAt) / 1000) 
        : 0;

      // Process questions and answers
      const questions = attemptData.answers || [];
      const correctAnswers = questions.filter(q => q.is_correct).length;
      const totalQuestions = questions.length;
      const incorrectAnswers = totalQuestions - correctAnswers;

      setResult({
        exam_id: examId,
        exam_title: attemptData.exam?.title || 'Bài thi',
        score,
        max_score: attemptData.exam?.total_marks || totalQuestions,
        percentage: Math.round(percentage),
        total_questions: totalQuestions,
        correct_answers: correctAnswers,
        incorrect_answers: incorrectAnswers,
        time_taken: timeTaken,
        passed,
        completed_at: attemptData.completed_at,
        questions: questions.map(answer => ({
          id: answer.question_id,
          question_text: answer.question?.question_text || '',
          options: answer.question?.options || [],
          correct_answer: answer.question?.correct_answer || '',
          user_answer_letter: answer.answer_text || '',
          is_correct: answer.is_correct || false,
          explanation: answer.question?.explanation || null,
        })),
      });

      // Show confetti for good scores
      if (percentage >= 80) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
    }
  }, [attemptData, examId]);

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'warning';
    return 'error';
  };

  const getScoreLabel = (percentage) => {
    if (percentage >= 90) return 'Xuất sắc';
    if (percentage >= 80) return 'Tốt';
    if (percentage >= 70) return 'Khá';
    if (percentage >= 60) return 'Trung bình';
    return 'Cần cải thiện';
  };

  const handleRetake = () => {
    navigate(buildRoute(ROUTES.EXAM_TAKE, { id: examId }));
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Kết quả bài thi: ${result?.exam_title}`,
        text: `Tôi đã đạt ${result?.percentage}% trong bài thi này!`,
      }).catch(() => {});
    } else {
      enqueueSnackbar('Đã sao chép link chia sẻ', { variant: 'success' });
    }
  };

  const handleExportPDF = () => {
    enqueueSnackbar('Tính năng xuất PDF đang được phát triển', { variant: 'info' });
  };

  if (!result) {
    return (
      <MainLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  // Show loading state while fetching attempt data
  if (loadingAttempt) {
    return (
      <MainLayout>
        <Box sx={{
          bgcolor: 'background.default',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <LoadingSpinner />
        </Box>
      </MainLayout>
    );
  }

  // Show error state if attempt failed to load
  if (attemptError && !result) {
    return (
      <MainLayout>
        <Box sx={{
          bgcolor: 'background.default',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4
        }}>
          <Typography color="error" align="center">
            {attemptError}
          </Typography>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
        />
      )}
      
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: DS.spacing.pageTop }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: DS.spacing.pageHorizontal }}>
          {/* Hero Section */}
          <Paper sx={{ 
            p: 4, 
            mb: 3, 
            textAlign: 'center',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: DS.borderRadius.regular,
            bgcolor: 'background.paper',
          }}>
            <Box sx={{ display: 'inline-flex', position: 'relative', mb: 2 }}>
              <CircularProgress
                variant="determinate"
                value={result.percentage}
                size={200}
                thickness={4}
                sx={{
                  color: `${getScoreColor(result.percentage)}.main`,
                  transform: 'rotate(-90deg)',
                }}
              />
              <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
              }}>
                <Typography sx={{ 
                  fontSize: '3rem', 
                  fontWeight: 700, 
                  color: `${getScoreColor(result.percentage)}.main`,
                  lineHeight: 1,
                }}>
                  {result.percentage}%
                </Typography>
                <Typography sx={{ fontSize: DS.typography.bodySmall, color: 'text.secondary', mt: 0.5 }}>
                  {result.score}/{result.max_score} điểm
                </Typography>
              </Box>
            </Box>
            
            <Chip 
              label={getScoreLabel(result.percentage)} 
              color={getScoreColor(result.percentage)}
              sx={{ mb: 2, fontWeight: 600, fontSize: DS.typography.bodyMedium, height: 32 }}
            />
            
            <Typography sx={{ fontSize: DS.typography.headingSmall, fontWeight: 600, mb: 1 }}>
              {result.exam_title}
            </Typography>
            
            <Typography sx={{ fontSize: DS.typography.bodyMedium, color: 'text.secondary', mb: 2 }}>
              Bạn đã trả lời đúng {result.correct_answers}/{result.total_questions} câu hỏi
            </Typography>

            <Chip
              label={result.passed ? 'Đạt' : 'Chưa đạt'}
              color={result.passed ? 'success' : 'warning'}
              sx={{ fontWeight: 600, fontSize: DS.typography.bodySmall }}
            />
          </Paper>

          {/* Statistics Cards */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
            gap: 2, 
            mb: 3 
          }}>
            <Card>
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <CheckCircle sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                <Typography sx={{ fontSize: DS.typography.headingSmall, fontWeight: 600, mb: 0.5 }}>
                  {result.correct_answers}
                </Typography>
                <Typography sx={{ fontSize: DS.typography.bodySmall, color: 'text.secondary' }}>
                  Câu đúng
                </Typography>
              </CardContent>
            </Card>

            <Card>
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <Cancel sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
                <Typography sx={{ fontSize: DS.typography.headingSmall, fontWeight: 600, mb: 0.5 }}>
                  {result.incorrect_answers}
                </Typography>
                <Typography sx={{ fontSize: DS.typography.bodySmall, color: 'text.secondary' }}>
                  Câu sai
                </Typography>
              </CardContent>
            </Card>

            <Card>
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <Timer sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                <Typography sx={{ fontSize: DS.typography.headingSmall, fontWeight: 600, mb: 0.5 }}>
                  {formatDuration(result.time_taken)}
                </Typography>
                <Typography sx={{ fontSize: DS.typography.bodySmall, color: 'text.secondary' }}>
                  Thời gian
                </Typography>
              </CardContent>
            </Card>

            <Card>
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <TrendingUp sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography sx={{ fontSize: DS.typography.headingSmall, fontWeight: 600, mb: 0.5 }}>
                  {result.percentage}%
                </Typography>
                <Typography sx={{ fontSize: DS.typography.bodySmall, color: 'text.secondary' }}>
                  Độ chính xác
                </Typography>
              </CardContent>
            </Card>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => navigate(ROUTES.EXAMS)}
              sx={{ fontSize: DS.typography.bodyMedium }}
            >
              Quay lại danh sách
            </Button>
            <Button
              variant="outlined"
              startIcon={<Replay />}
              onClick={handleRetake}
              sx={{ fontSize: DS.typography.bodyMedium }}
            >
              Làm lại
            </Button>
            <Button
              variant="outlined"
              startIcon={<Share />}
              onClick={handleShare}
              sx={{ fontSize: DS.typography.bodyMedium }}
            >
              Chia sẻ
            </Button>
            <Button
              variant="outlined"
              onClick={handleExportPDF}
              sx={{ fontSize: DS.typography.bodyMedium }}
            >
              Xuất PDF
            </Button>
          </Box>

          {/* Question Review */}
          <Paper sx={{ 
            p: 3, 
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: DS.borderRadius.regular,
          }}>
            <Typography sx={{ fontSize: DS.typography.headingSmall, fontWeight: 600, mb: 3 }}>
              Xem lại chi tiết câu hỏi
            </Typography>

            <Stack spacing={2}>
              {result.questions.map((question, index) => {
                const optionLabels = ['A', 'B', 'C', 'D'];
                const correctAnswerIndex = question.options.indexOf(question.correct_answer);
                const correctAnswerLabel = correctAnswerIndex !== -1 ? optionLabels[correctAnswerIndex] : '';
                const userAnswerIndex = question.user_answer_letter 
                  ? question.user_answer_letter.charCodeAt(0) - 65 
                  : -1;

                return (
                  <Accordion key={question.id} defaultExpanded={!question.is_correct}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                        {question.is_correct ? (
                          <CheckCircle sx={{ color: 'success.main', fontSize: 24 }} />
                        ) : (
                          <Cancel sx={{ color: 'error.main', fontSize: 24 }} />
                        )}
                        <Typography sx={{ fontWeight: 600, fontSize: DS.typography.bodyMedium }}>
                          Câu {index + 1}: {question.question_text}
                        </Typography>
                        <Chip
                          label={question.is_correct ? 'Đúng' : 'Sai'}
                          color={question.is_correct ? 'success' : 'error'}
                          size="small"
                          sx={{ ml: 'auto' }}
                        />
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Stack spacing={2}>
                        {question.options.map((option, optIndex) => {
                          const isCorrect = option === question.correct_answer;
                          const isUserAnswer = optIndex === userAnswerIndex;
                          const label = optionLabels[optIndex];

                          return (
                            <Box
                              key={optIndex}
                              sx={{
                                p: 1.5,
                                border: '1px solid',
                                borderColor: isCorrect
                                  ? 'success.main'
                                  : isUserAnswer && !isCorrect
                                    ? 'error.main'
                                    : 'divider',
                                borderRadius: DS.borderRadius.small,
                                bgcolor: isCorrect
                                  ? 'success.50'
                                  : isUserAnswer && !isCorrect
                                    ? 'error.50'
                                    : 'transparent',
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography sx={{ 
                                  fontWeight: 600, 
                                  fontSize: DS.typography.bodySmall,
                                  minWidth: 24,
                                  color: isCorrect ? 'success.main' : isUserAnswer ? 'error.main' : 'text.secondary',
                                }}>
                                  {label}.
                                </Typography>
                                <Typography sx={{ fontSize: DS.typography.bodyMedium, flex: 1 }}>
                                  {option}
                                </Typography>
                                {isCorrect && (
                                  <Chip label="Đáp án đúng" color="success" size="small" />
                                )}
                                {isUserAnswer && !isCorrect && (
                                  <Chip label="Đáp án của bạn" color="error" size="small" />
                                )}
                              </Box>
                            </Box>
                          );
                        })}

                        {question.explanation && (
                          <Box sx={{ 
                            p: 2, 
                            bgcolor: 'info.50', 
                            borderRadius: DS.borderRadius.small,
                            border: '1px solid',
                            borderColor: 'info.main',
                          }}>
                            <Typography sx={{ 
                              fontSize: DS.typography.bodySmall, 
                              fontWeight: 600,
                              color: 'info.main',
                              mb: 0.5,
                            }}>
                              Giải thích:
                            </Typography>
                            <Typography sx={{ fontSize: DS.typography.bodySmall, color: 'text.secondary' }}>
                              {question.explanation}
                            </Typography>
                          </Box>
                        )}
                      </Stack>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </Stack>
          </Paper>
        </Box>
      </Box>
    </MainLayout>
  );
};

export default ExamResultPage;

