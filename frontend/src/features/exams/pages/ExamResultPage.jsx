/**
 * Exam Result Page - Shows exam results with score and detailed review
 * Connected to backend API
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

// Mock attempt data for now (will be replaced with actual API call)
const mockAttemptData = {
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
      explanation: 'Phép cộng cơ bản: 2 cộng 2 bằng 4',
      points: 1
    },
    {
      id: 'q-002',
      question_text: 'Tính tích: 3 × 4 = ?',
      options: ['10', '11', '12', '13'],
      correct_answer: '12',
      explanation: 'Phép nhân: 3 nhân 4 bằng 12',
      points: 1
    },
    {
      id: 'q-003',
      question_text: 'Giải phương trình: x + 5 = 10',
      options: ['x = 3', 'x = 4', 'x = 5', 'x = 6'],
      correct_answer: 'x = 5',
      explanation: 'x = 10 - 5 = 5',
      points: 2
    },
    {
      id: 'q-004',
      question_text: 'Tính diện tích hình chữ nhật có chiều dài 5cm và chiều rộng 3cm',
      options: ['8 cm²', '15 cm²', '16 cm²', '20 cm²'],
      correct_answer: '15 cm²',
      explanation: 'Diện tích = dài × rộng = 5 × 3 = 15 cm²',
      points: 2
    },
    {
      id: 'q-005',
      question_text: 'Tính đạo hàm của hàm số f(x) = x²',
      options: ['x', '2x', 'x²', '2x²'],
      correct_answer: '2x',
      explanation: 'Đạo hàm của x² là 2x',
      points: 3
    },
    {
      id: 'q-006',
      question_text: 'Tính tích phân ∫x dx',
      options: ['x²/2', 'x²', 'x', '2x'],
      correct_answer: 'x²/2',
      explanation: 'Tích phân của x là x²/2',
      points: 3
    },
    {
      id: 'q-007',
      question_text: 'Tìm giá trị của sin(90°)',
      options: ['0', '0.5', '1', '√2/2'],
      correct_answer: '1',
      explanation: 'sin(90°) = 1',
      points: 2
    },
    {
      id: 'q-008',
      question_text: 'Tính logarit cơ số 10 của 100',
      options: ['1', '2', '10', '100'],
      correct_answer: '2',
      explanation: 'log₁₀(100) = 2 vì 10² = 100',
      points: 2
    },
    {
      id: 'q-009',
      question_text: 'Tính căn bậc hai của 16',
      options: ['2', '4', '8', '16'],
      correct_answer: '4',
      explanation: '√16 = 4 vì 4² = 16',
      points: 1
    },
    {
      id: 'q-010',
      question_text: 'Tính giá trị của 2³',
      options: ['4', '6', '8', '9'],
      correct_answer: '8',
      explanation: '2³ = 2 × 2 × 2 = 8',
      points: 1
    },
  ]
};

const ExamResultPage = () => {
  const { id: examId } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // API hooks
  const { data: attemptData, loading: loadingAttempt, error: attemptError, execute: loadAttempt } = useApi(getAttemptApi);

  const [result, setResult] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Try to get attempt ID from localStorage first (set by ExamTakePage)
    const storedResult = localStorage.getItem(`exam_result_${examId}`);

    if (storedResult) {
      const parsedResult = JSON.parse(storedResult);
      if (parsedResult.attempt_id) {
        // Load attempt data from API
        loadAttempt(parsedResult.attempt_id);
      } else {
        // Fallback to local calculation if no attempt ID
        calculateResult(parsedResult.answers, parsedResult.time_taken);
      }
    } else {
      // Fallback: generate mock result
      const mockAnswers = {
        'q-001': 'C', // Correct
        'q-002': 'C', // Correct
        'q-003': 'C', // Correct
        'q-004': 'B', // Correct
        'q-005': 'B', // Correct
        'q-006': 'A', // Correct
        'q-007': 'C', // Correct
        'q-008': 'B', // Correct
        'q-009': 'B', // Correct
        'q-010': 'A', // Wrong (should be C)
      };
      calculateResult(mockAnswers, 3200);
    }

    // Set window size for confetti
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  }, [examId]);

  // Handle attempt data when loaded from API
  useEffect(() => {
    if (attemptData) {
      // Process the attempt data from API
      const score = attemptData.score || 0;
      const totalQuestions = attemptData.total_questions || 0;
      const correctAnswers = attemptData.correct_answers || 0;
      const timeTaken = attemptData.time_taken_seconds || 0;

      const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

      setResult({
        score: percentage,
        correctAnswers,
        totalQuestions,
        timeTaken,
        passed: percentage >= 60, // Assume 60% is passing
      });

      // Show confetti for good scores
      if (percentage >= 80) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
    }
  }, [attemptData]);

  const calculateResult = (answers, timeTaken) => {
    let score = 0;
    let maxScore = 0;
    let correctCount = 0;
    const questionsWithResults = mockExamData.questions.map((question) => {
      maxScore += question.points;
      const userAnswerLetter = answers[question.id];
      const userAnswerIndex = userAnswerLetter ? userAnswerLetter.charCodeAt(0) - 65 : -1;
      const userAnswer = userAnswerIndex >= 0 ? question.options[userAnswerIndex] : null;
      const correctAnswerIndex = question.options.indexOf(question.correct_answer);
      const isCorrect = userAnswer === question.correct_answer;
      
      if (isCorrect) {
        score += question.points;
        correctCount++;
      }

      return {
        ...question,
        user_answer: userAnswer,
        user_answer_letter: userAnswerLetter,
        is_correct: isCorrect,
      };
    });

    const percentage = Math.round((score / maxScore) * 100);
    const passed = percentage >= 70;

    const calculatedResult = {
      exam_id: examId,
      exam_title: mockExamData.title,
      score,
      max_score: maxScore,
      percentage,
      total_questions: mockExamData.questions.length,
      correct_answers: correctCount,
      incorrect_answers: mockExamData.questions.length - correctCount,
      time_taken: timeTaken || 3200,
      passed,
      completed_at: new Date().toISOString(),
      questions: questionsWithResults,
    };

    setResult(calculatedResult);

    // Show confetti if score >= 80%
    if (percentage >= 80) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  };

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

