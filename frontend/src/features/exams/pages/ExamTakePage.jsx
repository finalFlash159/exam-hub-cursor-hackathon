/**
 * Exam Take Page - Full-screen exam interface with timer
 * UI-only version with static data
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

// Static mock exam data
const mockExamData = {
  id: 'exam-001',
  title: 'Bài kiểm tra Toán học cơ bản',
  subject: 'Toán học',
  duration_minutes: 60,
  questions: [
    {
      id: 'q-001',
      question_text: 'Tính tổng: 2 + 2 = ?',
      options: ['2', '3', '4', '5'],
      correct_answer: '4',
      points: 1
    },
    {
      id: 'q-002',
      question_text: 'Tính tích: 3 × 4 = ?',
      options: ['10', '11', '12', '13'],
      correct_answer: '12',
      points: 1
    },
    {
      id: 'q-003',
      question_text: 'Giải phương trình: x + 5 = 10',
      options: ['x = 3', 'x = 4', 'x = 5', 'x = 6'],
      correct_answer: 'x = 5',
      points: 2
    },
    {
      id: 'q-004',
      question_text: 'Tính diện tích hình chữ nhật có chiều dài 5cm và chiều rộng 3cm',
      options: ['8 cm²', '15 cm²', '16 cm²', '20 cm²'],
      correct_answer: '15 cm²',
      points: 2
    },
    {
      id: 'q-005',
      question_text: 'Tính đạo hàm của hàm số f(x) = x²',
      options: ['x', '2x', 'x²', '2x²'],
      correct_answer: '2x',
      points: 3
    },
    {
      id: 'q-006',
      question_text: 'Tính tích phân ∫x dx',
      options: ['x²/2', 'x²', 'x', '2x'],
      correct_answer: 'x²/2',
      points: 3
    },
    {
      id: 'q-007',
      question_text: 'Tìm giá trị của sin(90°)',
      options: ['0', '0.5', '1', '√2/2'],
      correct_answer: '1',
      points: 2
    },
    {
      id: 'q-008',
      question_text: 'Tính logarit cơ số 10 của 100',
      options: ['1', '2', '10', '100'],
      correct_answer: '2',
      points: 2
    },
    {
      id: 'q-009',
      question_text: 'Tính căn bậc hai của 16',
      options: ['2', '4', '8', '16'],
      correct_answer: '4',
      points: 1
    },
    {
      id: 'q-010',
      question_text: 'Tính giá trị của 2³',
      options: ['4', '6', '8', '9'],
      correct_answer: '8',
      points: 1
    },
  ]
};

const ExamTakePage = () => {
  const { id: examId } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [exam] = useState(mockExamData);
  const [questions] = useState(mockExamData.questions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  const [timeRemaining, setTimeRemaining] = useState(mockExamData.duration_minutes * 60);
  const [examStarted, setExamStarted] = useState(true);
  const [startTime] = useState(Date.now());
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);

  const handleSubmit = useCallback(() => {
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    
    // Store answers in localStorage for result page
    const examResult = {
      exam_id: examId,
      exam_title: exam.title,
      answers,
      time_taken: timeTaken,
      submitted_at: new Date().toISOString(),
    };
    localStorage.setItem(`exam_result_${examId}`, JSON.stringify(examResult));
    
    enqueueSnackbar('Đã nộp bài thành công!', { variant: 'success' });
    
    // Navigate to result page
    navigate(buildRoute(ROUTES.EXAM_RESULT, { id: examId }));
  }, [startTime, examId, answers, exam.title, enqueueSnackbar, navigate]);

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
            sx={{ fontSize: DS.typography.bodyMedium }}
          >
            Xác nhận nộp bài
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};

export default ExamTakePage;

