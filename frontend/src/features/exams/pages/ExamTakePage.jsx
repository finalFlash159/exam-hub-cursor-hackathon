/**
 * Exam Take Page - Full-screen exam interface with timer
 * Connected to backend API
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  LinearProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Stack,
} from '@mui/material';
import {
  ArrowBack,
  ArrowForward,
  CheckCircle,
  Timer,
  Flag,
  FlagOutlined,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { MainLayout } from '../../../components/layout';
import { ROUTES, buildRoute } from '../../../config/routes';
import { DESIGN_SYSTEM as DS } from '../../../config/designSystem';
import { getExam, startAttempt, submitAttempt } from '../../../api';
import { useApi } from '../../../hooks/useApi';
import { LoadingSpinner } from '../../../components/common';

// API functions
const getExamApi = (examId) => getExam(examId, false);
const startAttemptApi = (examId, attemptData) => startAttempt(examId, attemptData);
const submitAttemptApi = (attemptId, submission) => submitAttempt(attemptId, submission);

const ExamTakePage = () => {
  const { id: examId } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // API hooks
  const { data: exam, loading: loadingExam, error: examError, execute: loadExam } = useApi(getExamApi);
  const { execute: startAttemptAction } = useApi(startAttemptApi, { showErrorToast: false });
  const { execute: submitAttemptAction, loading: submittingAttempt } = useApi(submitAttemptApi);

  // State
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [examStarted, setExamStarted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [attemptId, setAttemptId] = useState(null);

  // Load exam data on component mount
  useEffect(() => {
    console.log('Loading exam:', examId);
    loadExam(examId);
  }, [examId, loadExam]);

  // Initialize exam when data is loaded
  useEffect(() => {
    if (exam && !examStarted) {
      console.log('Exam loaded:', exam);
      setQuestions(exam.questions || []);
      setTimeRemaining((exam.duration || 60) * 60); // Default 60 minutes
      setExamStarted(true);
      setStartTime(Date.now());

      // Start the exam attempt
      startExamAttempt();
    }
  }, [exam, examStarted]);

  const startExamAttempt = useCallback(async () => {
    try {
      const attemptData = {
        student_name: 'Anonymous Student', // In a real app, get from user context
        student_email: null,
      };

      console.log('Starting exam attempt for exam:', examId);
      console.log('Attempt data:', attemptData);

      const attempt = await startAttemptAction(examId, attemptData);
      console.log('Attempt created successfully:', attempt);

      if (attempt && attempt.id) {
        setAttemptId(attempt.id);
        enqueueSnackbar('Bắt đầu làm bài!', { variant: 'info' });
      } else {
        throw new Error('Invalid attempt response');
      }
    } catch (error) {
      console.error('Error starting exam attempt:', error);
      console.error('Error details:', error.response?.data || error.message);

      // Don't show duplicate error toasts
      enqueueSnackbar('Lỗi khi bắt đầu làm bài. Vui lòng thử lại.', { variant: 'error' });
      navigate(buildRoute(ROUTES.EXAM_DETAIL, { id: examId }));
    }
  }, [examId, startAttemptAction, enqueueSnackbar, navigate]);

  const handleSubmit = useCallback(async () => {
    if (!attemptId) {
      enqueueSnackbar('Lỗi: Không thể nộp bài. Vui lòng thử lại.', { variant: 'error' });
      return;
    }

    try {
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);

      // Prepare submission data
      const submission = {
        answers: Object.entries(answers).map(([questionId, answer]) => ({
          question_id: parseInt(questionId),
          answer_text: answer,
        })),
      };

      // Submit the attempt
      const result = await submitAttemptAction(attemptId, submission);

      console.log('Submit result:', result);

      enqueueSnackbar('Đã nộp bài thành công!', { variant: 'success' });

      // Navigate to result page with attemptId
      navigate(buildRoute(ROUTES.EXAM_RESULT, { id: examId }) + `?attemptId=${attemptId}`);
    } catch (error) {
      // Error is already handled by the useApi hook
    }
  }, [attemptId, startTime, answers, examId, exam?.title, submitAttemptAction, enqueueSnackbar, navigate]);

  // Timer countdown
  useEffect(() => {
    if (!examStarted || !timeRemaining) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examStarted, timeRemaining, handleSubmit]);

  const handleAnswerChange = (questionId, answer) => {
    const question = questions.find(q => q.id === questionId);
    if (!question || !question.options) return;
    
    const optionIndex = question.options.indexOf(answer);
    const answerLetter = String.fromCharCode(65 + optionIndex);
    
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerLetter,
    }));
  };

  const toggleFlag = (questionId) => {
    setFlaggedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitClick = () => {
    setSubmitDialogOpen(true);
  };

  const handleSubmitConfirm = () => {
    setSubmitDialogOpen(false);
    handleSubmit();
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = questions.length - answeredCount;
  const flaggedCount = flaggedQuestions.size;

  // Show loading state while fetching exam
  if (loadingExam) {
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

  // Show error state if exam failed to load
  if (examError) {
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
            {examError}
          </Typography>
        </Box>
      </MainLayout>
    );
  }

  // Don't render if exam data is not available
  if (!exam || !examStarted) {
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

  return (
    <MainLayout>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        {/* Header Bar - Fixed */}
        <Paper sx={{ 
          position: 'sticky',
          top: 0,
          zIndex: 100,
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          borderRadius: 0,
          boxShadow: DS.shadows.subtle,
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography sx={{ fontSize: DS.typography.cardTitle, fontWeight: 600, mb: 0.5 }}>
                {exam?.title}
              </Typography>
              <Typography sx={{ fontSize: DS.typography.bodySmall, color: 'text.secondary' }}>
                Câu hỏi {currentQuestionIndex + 1} / {questions.length}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Timer sx={{ 
                  fontSize: DS.icons.medium, 
                  color: timeRemaining < 60 ? 'error.main' : 'primary.main' 
                }} />
                <Typography sx={{ 
                  fontSize: DS.typography.sectionTitle, 
                  fontWeight: 600, 
                  color: timeRemaining < 60 ? 'error.main' : 'primary.main',
                  minWidth: 60,
                  textAlign: 'right',
                }}>
                  {formatTime(timeRemaining)}
                </Typography>
              </Box>
              
              <Typography sx={{ fontSize: DS.typography.bodySmall, color: 'text.secondary' }}>
                Đã trả lời: {answeredCount}/{questions.length}
              </Typography>
              
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircle />}
                onClick={handleSubmitClick}
                sx={{ 
                  height: DS.heights.buttonMedium, 
                  fontSize: DS.typography.bodyMedium,
                  px: 2,
                }}
              >
                Nộp bài
              </Button>
            </Box>
          </Box>
          
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ mt: 2, height: 4, borderRadius: 2 }}
          />
        </Paper>

        {/* Main Content */}
        <Box sx={{ display: 'flex', maxWidth: 1400, mx: 'auto', p: 3, gap: 3 }}>
          {/* Left: Question Navigator */}
          <Box sx={{ 
            width: { xs: '100%', lg: 280 },
            flexShrink: 0,
          }}>
            <Paper sx={{ 
              p: 2, 
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: DS.borderRadius.regular,
              position: 'sticky',
              top: 100,
            }}>
              <Typography variant="subtitle2" fontWeight={600} mb={2} sx={{ fontSize: DS.typography.bodyMedium }}>
                Danh sách câu hỏi
              </Typography>
              
              {/* Question Grid */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, 1fr)',
                  gap: 1,
                  mb: 2,
                }}
              >
                {questions.map((q, index) => {
                  const isAnswered = answers[q.id] !== undefined;
                  const isCurrent = index === currentQuestionIndex;
                  const isFlagged = flaggedQuestions.has(q.id);

                  return (
                    <Box
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(index)}
                      sx={{
                        aspectRatio: '1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: DS.borderRadius.small,
                        cursor: 'pointer',
                        fontSize: DS.typography.bodySmall,
                        fontWeight: isCurrent ? 600 : 500,
                        position: 'relative',
                        bgcolor: isCurrent
                          ? 'primary.main'
                          : isAnswered
                            ? 'success.main'
                            : 'background.paper',
                        color: (isCurrent || isAnswered) ? 'white' : 'text.secondary',
                        border: '1px solid',
                        borderColor: isCurrent
                          ? 'primary.main'
                          : isAnswered
                            ? 'success.main'
                            : 'divider',
                        transition: 'all 0.2s',
                        '&:hover': {
                          bgcolor: isCurrent
                            ? 'primary.dark'
                            : isAnswered
                              ? 'success.dark'
                              : 'grey.100',
                          transform: 'scale(1.05)',
                        },
                      }}
                    >
                      {index + 1}
                      {isFlagged && (
                        <Flag
                          sx={{
                            position: 'absolute',
                            top: -4,
                            right: -4,
                            fontSize: 14,
                            color: 'error.main',
                            bgcolor: 'background.paper',
                            borderRadius: '50%',
                            p: 0.25,
                          }}
                        />
                      )}
                    </Box>
                  );
                })}
              </Box>

              {/* Legend */}
              <Box sx={{ pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 16, height: 16, bgcolor: 'success.main', borderRadius: DS.borderRadius.small }} />
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: DS.typography.bodyXSmall }}>
                      Đã trả lời
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 16, height: 16, bgcolor: 'primary.main', borderRadius: DS.borderRadius.small }} />
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: DS.typography.bodyXSmall }}>
                      Câu hiện tại
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 16, height: 16, border: '1px solid', borderColor: 'divider', borderRadius: DS.borderRadius.small, bgcolor: 'background.paper' }} />
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: DS.typography.bodyXSmall }}>
                      Chưa trả lời
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Flag sx={{ fontSize: 14, color: 'error.main' }} />
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: DS.typography.bodyXSmall }}>
                      Đã đánh dấu
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Paper>
          </Box>

          {/* Right: Question Content */}
          <Box sx={{ flex: 1 }}>
            {/* Question Card */}
            <Paper sx={{ 
              p: 3, 
              mb: 2, 
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: DS.borderRadius.regular,
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Typography sx={{ 
                  flex: 1, 
                  fontSize: DS.typography.headingSmall, 
                  fontWeight: 600,
                  lineHeight: 1.5,
                }}>
                  {currentQuestion?.question_text}
                </Typography>
                <Button
                  variant={flaggedQuestions.has(currentQuestion?.id) ? 'contained' : 'outlined'}
                  size="small"
                  startIcon={flaggedQuestions.has(currentQuestion?.id) ? <Flag /> : <FlagOutlined />}
                  onClick={() => toggleFlag(currentQuestion?.id)}
                  sx={{
                    ml: 2,
                    height: DS.heights.buttonSmall,
                    fontSize: DS.typography.bodySmall,
                    bgcolor: flaggedQuestions.has(currentQuestion?.id) ? 'error.main' : 'transparent',
                    color: flaggedQuestions.has(currentQuestion?.id) ? 'white' : 'error.main',
                    borderColor: 'error.main',
                    '&:hover': {
                      bgcolor: flaggedQuestions.has(currentQuestion?.id) ? 'error.dark' : 'error.50',
                      borderColor: 'error.dark',
                    }
                  }}
                >
                  {flaggedQuestions.has(currentQuestion?.id) ? 'Đã đánh dấu' : 'Đánh dấu'}
                </Button>
              </Box>

              <FormControl component="fieldset" fullWidth>
                <RadioGroup
                  value={(() => {
                    const storedAnswer = answers[currentQuestion?.id];
                    if (!storedAnswer || !currentQuestion?.options) return '';
                    const optionIndex = storedAnswer.charCodeAt(0) - 65;
                    return currentQuestion.options[optionIndex] || '';
                  })()}
                  onChange={(e) => handleAnswerChange(currentQuestion?.id, e.target.value)}
                >
                  {currentQuestion?.options?.map((option, index) => {
                    const storedAnswer = answers[currentQuestion?.id];
                    const isSelected = storedAnswer && currentQuestion?.options && 
                      currentQuestion.options[storedAnswer.charCodeAt(0) - 65] === option;
                    
                    return (
                      <FormControlLabel
                        key={index}
                        value={option}
                        control={<Radio />}
                        label={
                          <Typography sx={{ fontSize: DS.typography.bodyLarge }}>
                            {String.fromCharCode(65 + index)}. {option}
                          </Typography>
                        }
                        sx={{
                          mb: 1.5,
                          p: 2,
                          border: '1px solid',
                          borderColor: isSelected ? 'primary.main' : 'divider',
                          borderRadius: DS.borderRadius.regular,
                          bgcolor: isSelected ? 'primary.50' : 'transparent',
                          transition: 'all 0.2s',
                          '&:hover': {
                            borderColor: 'primary.main',
                            bgcolor: isSelected ? 'primary.50' : 'grey.50',
                          },
                        }}
                      />
                    );
                  })}
                </RadioGroup>
              </FormControl>
            </Paper>

            {/* Navigation */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                sx={{ 
                  height: DS.heights.buttonMedium, 
                  fontSize: DS.typography.bodyMedium,
                  px: 2,
                }}
              >
                Câu trước
              </Button>

              <Button
                variant="contained"
                endIcon={<ArrowForward />}
                onClick={handleNext}
                disabled={currentQuestionIndex === questions.length - 1}
                sx={{ 
                  height: DS.heights.buttonMedium, 
                  fontSize: DS.typography.bodyMedium,
                  px: 2,
                }}
              >
                Câu tiếp theo
              </Button>
            </Box>

            {/* Warning */}
            {currentQuestionIndex === questions.length - 1 && unansweredCount > 0 && (
              <Alert severity="warning" sx={{ mt: 3 }}>
                Bạn còn {unansweredCount} câu chưa trả lời. Hãy kiểm tra lại trước khi nộp bài.
              </Alert>
            )}
          </Box>
        </Box>
      </Box>

      {/* Submit Confirmation Dialog */}
      <Dialog
        open={submitDialogOpen}
        onClose={() => setSubmitDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontSize: DS.typography.headingSmall, fontWeight: 600 }}>
          Xác nhận nộp bài
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2, fontSize: DS.typography.bodyMedium }}>
            Bạn có chắc chắn muốn nộp bài thi này?
          </DialogContentText>
          
          <Box sx={{ 
            p: 2, 
            bgcolor: 'grey.50', 
            borderRadius: DS.borderRadius.regular,
            mb: 2,
          }}>
            <Typography sx={{ fontSize: DS.typography.bodySmall, mb: 1, fontWeight: 600 }}>
              Tóm tắt:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography sx={{ fontSize: DS.typography.bodySmall }}>
                Tổng số câu hỏi: {questions.length}
              </Typography>
              <Typography sx={{ fontSize: DS.typography.bodySmall, color: 'success.main' }}>
                Đã trả lời: {answeredCount}
              </Typography>
              <Typography sx={{ fontSize: DS.typography.bodySmall, color: 'warning.main' }}>
                Chưa trả lời: {unansweredCount}
              </Typography>
              {flaggedCount > 0 && (
                <Typography sx={{ fontSize: DS.typography.bodySmall, color: 'error.main' }}>
                  Đã đánh dấu: {flaggedCount}
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSubmitDialogOpen(false)} sx={{ fontSize: DS.typography.bodyMedium }}>
            Hủy
          </Button>
          <Button
            onClick={handleSubmitConfirm}
            variant="contained"
            color="success"
            disabled={submittingAttempt}
            sx={{ fontSize: DS.typography.bodyMedium }}
          >
            {submittingAttempt ? 'Đang nộp bài...' : 'Xác nhận nộp bài'}
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};

export default ExamTakePage;

