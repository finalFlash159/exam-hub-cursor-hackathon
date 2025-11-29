/**
 * Exam Create Page - Multi-step wizard
 * UI-only version with static data
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Card,
  Divider,
  Chip,
  Slider,
  IconButton,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import {
  CloudUpload,
  Description,
  Edit,
  CheckCircle,
  ArrowBack,
  ArrowForward,
  Add,
  Delete,
  DragIndicator,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { MainLayout } from '../../../components/layout';
import { ROUTES } from '../../../config/routes';
import { DESIGN_SYSTEM as DS } from '../../../config/designSystem';

// Static mock data for generated questions
const mockGeneratedQuestions = [
  {
    id: 'q-001',
    question_text: 'Tính tổng: 2 + 2 = ?',
    question_type: 'multiple_choice',
    options: ['2', '3', '4', '5'],
    correct_answer: '4',
    explanation: 'Phép cộng cơ bản: 2 cộng 2 bằng 4',
    difficulty: 'easy',
    points: 1
  },
  {
    id: 'q-002',
    question_text: 'Tính tích: 3 × 4 = ?',
    question_type: 'multiple_choice',
    options: ['10', '11', '12', '13'],
    correct_answer: '12',
    explanation: 'Phép nhân: 3 nhân 4 bằng 12',
    difficulty: 'easy',
    points: 1
  },
  {
    id: 'q-003',
    question_text: 'Giải phương trình: x + 5 = 10',
    question_type: 'multiple_choice',
    options: ['x = 3', 'x = 4', 'x = 5', 'x = 6'],
    correct_answer: 'x = 5',
    explanation: 'x = 10 - 5 = 5',
    difficulty: 'medium',
    points: 2
  },
  {
    id: 'q-004',
    question_text: 'Tính diện tích hình chữ nhật có chiều dài 5cm và chiều rộng 3cm',
    question_type: 'multiple_choice',
    options: ['8 cm²', '15 cm²', '16 cm²', '20 cm²'],
    correct_answer: '15 cm²',
    explanation: 'Diện tích = dài × rộng = 5 × 3 = 15 cm²',
    difficulty: 'medium',
    points: 2
  },
  {
    id: 'q-005',
    question_text: 'Tính đạo hàm của hàm số f(x) = x²',
    question_type: 'multiple_choice',
    options: ['x', '2x', 'x²', '2x²'],
    correct_answer: '2x',
    explanation: 'Đạo hàm của x² là 2x',
    difficulty: 'hard',
    points: 3
  },
];

const ExamCreatePage = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  
  const steps = ['Chọn phương pháp', 'Cấu hình đề thi', 'Xác nhận tạo'];
  
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Step 1: Method selection
  const [method, setMethod] = useState(''); // 'file', 'text', 'manual'
  const [selectedFile, setSelectedFile] = useState(null);
  const [textInput, setTextInput] = useState('');
  
  // Step 2: Exam configuration
  const [examTitle, setExamTitle] = useState('');
  const [examDescription, setExamDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [numQuestions, setNumQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState('medium');
  const [timeLimit, setTimeLimit] = useState(60);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [hasGeneratedQuestions, setHasGeneratedQuestions] = useState(false);
  
  // Step 3: Manual questions
  const [manualQuestions, setManualQuestions] = useState([]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      enqueueSnackbar(`Đã chọn file: ${file.name}`, { variant: 'info' });
    }
  };

  const handleGenerateQuestions = async () => {
    setLoading(true);
    // Simulate AI generation delay
    setTimeout(() => {
      setGeneratedQuestions(mockGeneratedQuestions);
      setHasGeneratedQuestions(true);
      setLoading(false);
      enqueueSnackbar('Đã tạo câu hỏi thành công!', { variant: 'success' });
    }, 2000);
  };

  const handleDeleteQuestion = (questionId) => {
    setGeneratedQuestions(generatedQuestions.filter(q => q.id !== questionId));
    enqueueSnackbar('Đã xóa câu hỏi', { variant: 'info' });
  };

  const handleAddManualQuestion = () => {
    const newQuestion = {
      id: `q-manual-${Date.now()}`,
      question_text: '',
      question_type: 'multiple_choice',
      options: ['', '', '', ''],
      correct_answer: 'A',
      explanation: '',
      difficulty: 'medium',
      points: 1
    };
    setManualQuestions([...manualQuestions, newQuestion]);
  };

  const handleUpdateManualQuestion = (questionId, field, value) => {
    setManualQuestions(manualQuestions.map(q => 
      q.id === questionId ? { ...q, [field]: value } : q
    ));
  };

  const handleNext = () => {
    if (activeStep === 0 && !method) {
      enqueueSnackbar('Vui lòng chọn phương pháp tạo đề thi', { variant: 'warning' });
      return;
    }
    if (activeStep === 0 && method === 'file' && !selectedFile) {
      enqueueSnackbar('Vui lòng chọn file', { variant: 'warning' });
      return;
    }
    if (activeStep === 0 && method === 'text' && !textInput.trim()) {
      enqueueSnackbar('Vui lòng nhập nội dung', { variant: 'warning' });
      return;
    }
    if (activeStep === 1 && !examTitle.trim()) {
      enqueueSnackbar('Vui lòng nhập tiêu đề đề thi', { variant: 'warning' });
      return;
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleCreateExam = () => {
    setLoading(true);
    // Simulate creation delay
    setTimeout(() => {
      setLoading(false);
      enqueueSnackbar('Đã tạo đề thi thành công!', { variant: 'success' });
      navigate(ROUTES.EXAMS);
    }, 1000);
  };

  const renderStep1 = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, fontSize: DS.typography.headingSmall }}>
        Chọn phương pháp tạo đề thi
      </Typography>
      
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
        gap: 2,
        mb: 3
      }}>
        {/* File Upload Method */}
        <Paper
          onClick={() => setMethod('file')}
          sx={{ 
            p: 2.5,
            cursor: 'pointer',
            border: method === 'file' ? '2px solid' : '1px solid',
            borderColor: method === 'file' ? 'primary.main' : 'divider',
            borderRadius: DS.borderRadius.regular,
            transition: 'all 0.2s',
            bgcolor: method === 'file' ? 'primary.50' : 'background.paper',
            '&:hover': {
              boxShadow: DS.shadows.hover,
              borderColor: 'primary.main',
            }
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: 'center', textAlign: 'center' }}>
            <Box sx={{
              width: 56,
              height: 56,
              borderRadius: DS.borderRadius.regular,
              bgcolor: 'primary.100',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 1
            }}>
              <CloudUpload sx={{ fontSize: 28, color: 'primary.main' }} />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontWeight: 600, fontSize: DS.typography.bodyLarge }}>
                Upload File
              </Typography>
              {method === 'file' && <CheckCircle sx={{ fontSize: 20, color: 'success.main' }} />}
            </Box>
            <Typography sx={{ fontSize: DS.typography.bodySmall, color: 'text.secondary' }}>
              Upload PDF/DOCX, AI sẽ tự động tạo câu hỏi
            </Typography>
            {method === 'file' && (
              <Box sx={{ mt: 1, width: '100%' }}>
                <input
                  accept=".pdf,.doc,.docx"
                  style={{ display: 'none' }}
                  id="file-upload"
                  type="file"
                  onChange={handleFileSelect}
                />
                <label htmlFor="file-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    size="small"
                    fullWidth
                    sx={{ fontSize: DS.typography.bodySmall }}
                  >
                    {selectedFile ? selectedFile.name : 'Chọn file'}
                  </Button>
                </label>
              </Box>
            )}
          </Box>
        </Paper>

        {/* Text Input Method */}
        <Paper
          onClick={() => setMethod('text')}
          sx={{ 
            p: 2.5,
            cursor: 'pointer',
            border: method === 'text' ? '2px solid' : '1px solid',
            borderColor: method === 'text' ? 'secondary.main' : 'divider',
            borderRadius: DS.borderRadius.regular,
            transition: 'all 0.2s',
            bgcolor: method === 'text' ? 'secondary.50' : 'background.paper',
            '&:hover': {
              boxShadow: DS.shadows.hover,
              borderColor: 'secondary.main',
            }
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: 'center', textAlign: 'center' }}>
            <Box sx={{
              width: 56,
              height: 56,
              borderRadius: DS.borderRadius.regular,
              bgcolor: 'secondary.100',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 1
            }}>
              <Description sx={{ fontSize: 28, color: 'secondary.main' }} />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontWeight: 600, fontSize: DS.typography.bodyLarge }}>
                Paste Text
              </Typography>
              {method === 'text' && <CheckCircle sx={{ fontSize: 20, color: 'success.main' }} />}
            </Box>
            <Typography sx={{ fontSize: DS.typography.bodySmall, color: 'text.secondary' }}>
              Dán nội dung học liệu, AI sẽ phân tích và tạo câu hỏi
            </Typography>
            {method === 'text' && (
              <TextField
                multiline
                rows={4}
                placeholder="Dán nội dung vào đây..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                fullWidth
                size="small"
                sx={{ mt: 1 }}
              />
            )}
          </Box>
        </Paper>

        {/* Manual Method */}
        <Paper
          onClick={() => setMethod('manual')}
          sx={{ 
            p: 2.5,
            cursor: 'pointer',
            border: method === 'manual' ? '2px solid' : '1px solid',
            borderColor: method === 'manual' ? 'grey.600' : 'divider',
            borderRadius: DS.borderRadius.regular,
            transition: 'all 0.2s',
            bgcolor: method === 'manual' ? 'grey.50' : 'background.paper',
            '&:hover': {
              boxShadow: DS.shadows.hover,
              borderColor: 'grey.600',
            }
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: 'center', textAlign: 'center' }}>
            <Box sx={{
              width: 56,
              height: 56,
              borderRadius: DS.borderRadius.regular,
              bgcolor: 'grey.200',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 1
            }}>
              <Edit sx={{ fontSize: 28, color: 'grey.700' }} />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontWeight: 600, fontSize: DS.typography.bodyLarge }}>
                Tạo thủ công
              </Typography>
              {method === 'manual' && <CheckCircle sx={{ fontSize: 20, color: 'success.main' }} />}
            </Box>
            <Typography sx={{ fontSize: DS.typography.bodySmall, color: 'text.secondary' }}>
              Tạo câu hỏi thủ công, kiểm soát toàn bộ nội dung
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );

  const renderStep2 = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, fontSize: DS.typography.headingSmall }}>
        Cấu hình đề thi
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3 }}>
        {/* Configuration Form */}
        <Stack spacing={2.5}>
          <TextField
            label="Tiêu đề đề thi"
            value={examTitle}
            onChange={(e) => setExamTitle(e.target.value)}
            fullWidth
            required
            size="small"
          />
          
          <TextField
            label="Mô tả"
            value={examDescription}
            onChange={(e) => setExamDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
            size="small"
          />

          <FormControl fullWidth size="small">
            <InputLabel>Môn học</InputLabel>
            <Select
              value={subject}
              label="Môn học"
              onChange={(e) => setSubject(e.target.value)}
            >
              <MenuItem value="toan">Toán học</MenuItem>
              <MenuItem value="van">Văn học</MenuItem>
              <MenuItem value="anh">Tiếng Anh</MenuItem>
              <MenuItem value="ly">Vật lý</MenuItem>
              <MenuItem value="hoa">Hóa học</MenuItem>
              <MenuItem value="sinh">Sinh học</MenuItem>
            </Select>
          </FormControl>

          <Box>
            <Typography gutterBottom sx={{ fontSize: DS.typography.bodySmall, fontWeight: 500 }}>
              Số lượng câu hỏi: {numQuestions}
            </Typography>
            <Slider
              value={numQuestions}
              onChange={(e, value) => setNumQuestions(value)}
              min={5}
              max={50}
              step={1}
              marks
            />
          </Box>

          <Box>
            <Typography gutterBottom sx={{ fontSize: DS.typography.bodySmall, fontWeight: 500 }}>
              Thời gian làm bài: {timeLimit} phút
            </Typography>
            <Slider
              value={timeLimit}
              onChange={(e, value) => setTimeLimit(value)}
              min={15}
              max={180}
              step={15}
              marks={[
                { value: 15, label: '15' },
                { value: 60, label: '60' },
                { value: 120, label: '120' },
                { value: 180, label: '180' },
              ]}
            />
          </Box>

          <FormControl fullWidth size="small">
            <InputLabel>Độ khó</InputLabel>
            <Select
              value={difficulty}
              label="Độ khó"
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <MenuItem value="easy">Dễ</MenuItem>
              <MenuItem value="medium">Trung bình</MenuItem>
              <MenuItem value="hard">Khó</MenuItem>
            </Select>
          </FormControl>

          {method !== 'manual' && (
            <Button
              variant="contained"
              onClick={handleGenerateQuestions}
              disabled={loading || hasGeneratedQuestions}
              startIcon={loading ? <CircularProgress size={16} /> : null}
              fullWidth
              sx={{ mt: 1 }}
            >
              {loading ? 'Đang tạo câu hỏi...' : hasGeneratedQuestions ? 'Đã tạo câu hỏi' : 'Tạo câu hỏi bằng AI'}
            </Button>
          )}
        </Stack>

        {/* Questions Preview/Editor */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontSize: DS.typography.bodyLarge, fontWeight: 600 }}>
              {method === 'manual' ? 'Danh sách câu hỏi' : 'Câu hỏi đã tạo'}
            </Typography>
            {method === 'manual' && (
              <Button
                size="small"
                startIcon={<Add />}
                onClick={handleAddManualQuestion}
                variant="outlined"
              >
                Thêm câu hỏi
              </Button>
            )}
          </Box>

          <Box sx={{ maxHeight: 500, overflow: 'auto' }}>
            {method === 'manual' ? (
              <Stack spacing={2}>
                {manualQuestions.length === 0 ? (
                  <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.50' }}>
                    <Typography color="text.secondary" sx={{ fontSize: DS.typography.bodySmall }}>
                      Chưa có câu hỏi nào. Nhấn "Thêm câu hỏi" để bắt đầu.
                    </Typography>
                  </Paper>
                ) : (
                  manualQuestions.map((question, index) => (
                    <Card key={question.id} sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography sx={{ fontWeight: 600, fontSize: DS.typography.bodySmall }}>
                          Câu {index + 1}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteQuestion(question.id)}
                          sx={{ color: 'error.main' }}
                        >
                          <Delete sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Box>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Nhập câu hỏi..."
                        value={question.question_text}
                        onChange={(e) => handleUpdateManualQuestion(question.id, 'question_text', e.target.value)}
                        sx={{ mb: 1 }}
                      />
                      <Stack spacing={1}>
                        {['A', 'B', 'C', 'D'].map((option, optIndex) => (
                          <TextField
                            key={optIndex}
                            fullWidth
                            size="small"
                            placeholder={`Đáp án ${option}`}
                            value={question.options[optIndex] || ''}
                            onChange={(e) => {
                              const newOptions = [...question.options];
                              newOptions[optIndex] = e.target.value;
                              handleUpdateManualQuestion(question.id, 'options', newOptions);
                            }}
                          />
                        ))}
                      </Stack>
                    </Card>
                  ))
                )}
              </Stack>
            ) : (
              <Stack spacing={2}>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : hasGeneratedQuestions ? (
                  generatedQuestions.map((question, index) => (
                    <Card key={question.id} sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography sx={{ fontWeight: 600, fontSize: DS.typography.bodySmall }}>
                          Câu {index + 1}
                        </Typography>
                        <Chip
                          label={question.difficulty === 'easy' ? 'Dễ' : question.difficulty === 'medium' ? 'TB' : 'Khó'}
                          size="small"
                          color={question.difficulty === 'easy' ? 'success' : question.difficulty === 'medium' ? 'warning' : 'error'}
                          sx={{ fontSize: DS.typography.bodyXSmall, height: 20 }}
                        />
                      </Box>
                      <Typography sx={{ mb: 1.5, fontSize: DS.typography.bodySmall }}>
                        {question.question_text}
                      </Typography>
                      <Stack spacing={0.5}>
                        {question.options.map((option, optIndex) => (
                          <Box key={optIndex} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography sx={{ fontSize: DS.typography.bodySmall, minWidth: 20 }}>
                              {String.fromCharCode(65 + optIndex)}.
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: DS.typography.bodySmall,
                                color: option === question.correct_answer ? 'success.main' : 'text.secondary',
                                fontWeight: option === question.correct_answer ? 600 : 400,
                              }}
                            >
                              {option}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                      {question.explanation && (
                        <Box sx={{ mt: 1, p: 1, bgcolor: 'info.50', borderRadius: DS.borderRadius.small }}>
                          <Typography sx={{ fontSize: DS.typography.bodyXSmall, color: 'info.main' }}>
                            Giải thích: {question.explanation}
                          </Typography>
                        </Box>
                      )}
                    </Card>
                  ))
                ) : (
                  <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.50' }}>
                    <Typography color="text.secondary" sx={{ fontSize: DS.typography.bodySmall }}>
                      Nhấn "Tạo câu hỏi bằng AI" để bắt đầu
                    </Typography>
                  </Paper>
                )}
              </Stack>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );

  const renderStep3 = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, fontSize: DS.typography.headingSmall }}>
        Xác nhận và tạo đề thi
      </Typography>

      <Paper sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider' }}>
        <Stack spacing={2}>
          <Box>
            <Typography sx={{ fontSize: DS.typography.bodySmall, color: 'text.secondary', mb: 0.5 }}>
              Tiêu đề
            </Typography>
            <Typography sx={{ fontSize: DS.typography.bodyLarge, fontWeight: 600 }}>
              {examTitle || 'Chưa có tiêu đề'}
            </Typography>
          </Box>
          
          <Divider />
          
          <Box>
            <Typography sx={{ fontSize: DS.typography.bodySmall, color: 'text.secondary', mb: 0.5 }}>
              Môn học
            </Typography>
            <Typography sx={{ fontSize: DS.typography.bodyMedium }}>
              {subject || 'Chưa chọn'}
            </Typography>
          </Box>
          
          <Box>
            <Typography sx={{ fontSize: DS.typography.bodySmall, color: 'text.secondary', mb: 0.5 }}>
              Số lượng câu hỏi
            </Typography>
            <Typography sx={{ fontSize: DS.typography.bodyMedium }}>
              {method === 'manual' ? manualQuestions.length : generatedQuestions.length} câu
            </Typography>
          </Box>
          
          <Box>
            <Typography sx={{ fontSize: DS.typography.bodySmall, color: 'text.secondary', mb: 0.5 }}>
              Thời gian làm bài
            </Typography>
            <Typography sx={{ fontSize: DS.typography.bodyMedium }}>
              {timeLimit} phút
            </Typography>
          </Box>
          
          <Box>
            <Typography sx={{ fontSize: DS.typography.bodySmall, color: 'text.secondary', mb: 0.5 }}>
              Độ khó
            </Typography>
            <Typography sx={{ fontSize: DS.typography.bodyMedium }}>
              {difficulty === 'easy' ? 'Dễ' : difficulty === 'medium' ? 'Trung bình' : 'Khó'}
            </Typography>
          </Box>
        </Stack>
      </Paper>

      <Button
        variant="contained"
        size="large"
        onClick={handleCreateExam}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={20} /> : null}
        fullWidth
        sx={{ py: 1.5 }}
      >
        {loading ? 'Đang tạo đề thi...' : 'Tạo đề thi'}
      </Button>
    </Box>
  );

  return (
    <MainLayout>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        <Box sx={{ py: DS.spacing.pageTop, px: DS.spacing.pageHorizontal, maxWidth: 1200, mx: 'auto' }}>
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
              {t('exams.createNew') || 'Tạo đề thi mới'}
            </Typography>
            <Typography
              sx={{
                color: 'text.secondary',
                fontSize: DS.typography.bodySmall,
              }}
            >
              {steps[activeStep]}
            </Typography>
          </Box>

          {/* Stepper */}
          <Box sx={{ mb: 4 }}>
            <Stepper activeStep={activeStep}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel sx={{ '& .MuiStepLabel-label': { fontSize: DS.typography.bodySmall } }}>
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          {/* Step Content */}
          <Paper sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: DS.borderRadius.regular }}>
            {activeStep === 0 && renderStep1()}
            {activeStep === 1 && renderStep2()}
            {activeStep === 2 && renderStep3()}
          </Paper>

          {/* Navigation Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              onClick={handleBack}
              disabled={activeStep === 0}
              startIcon={<ArrowBack />}
              sx={{ fontSize: DS.typography.bodyMedium }}
            >
              Quay lại
            </Button>
            {activeStep < steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={<ArrowForward />}
                sx={{ fontSize: DS.typography.bodyMedium }}
              >
                Tiếp theo
              </Button>
            ) : null}
          </Box>
        </Box>
      </Box>
    </MainLayout>
  );
};

export default ExamCreatePage;

