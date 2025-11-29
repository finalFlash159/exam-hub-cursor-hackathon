/**
 * Exam Create Page - Multi-step wizard
 * Connected to backend API
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
import { createExam, addQuestion, extractQuestionsFromFile } from '../../../api';
import { uploadFile } from '../../../api/uploadApi';
import { useApi } from '../../../hooks/useApi';

// API functions
const createExamApi = (examData) => createExam(examData);
const addQuestionApi = (examId, questionData) => addQuestion(examId, questionData);

const ExamCreatePage = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const steps = ['Chọn phương pháp', 'Cấu hình đề thi', 'Xác nhận tạo'];

  const [activeStep, setActiveStep] = useState(0);

  // API hooks
  const { execute: createExamAction, loading: creatingExam } = useApi(createExamApi);
  const { execute: addQuestionAction, loading: addingQuestion } = useApi(addQuestionApi);
  
  // Step 1: Method selection
  const [method, setMethod] = useState(''); // 'file', 'text', 'manual'
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFileId, setUploadedFileId] = useState(null);
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
  const [generatingQuestions, setGeneratingQuestions] = useState(false);
  
  // Step 3: Manual questions
  const [manualQuestions, setManualQuestions] = useState([]);
  const [defaultQuestionType, setDefaultQuestionType] = useState('mcq');

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('Selected file:', file.name, 'Size:', file.size, 'Type:', file.type);
      setSelectedFile(file);
      try {
        // Upload file immediately
        console.log('Starting file upload...');
        const uploadResult = await uploadFile(file);
        console.log('Upload result:', uploadResult);
        setUploadedFileId(uploadResult.file.id);
        enqueueSnackbar(`Đã upload file: ${file.name}`, { variant: 'success' });
      } catch (error) {
        console.error('Upload error:', error);
        console.error('Error response:', error.response?.data);
        enqueueSnackbar('Lỗi khi upload file', { variant: 'error' });
        setSelectedFile(null);
      }
    }
  };

  const handleGenerateQuestions = async () => {
    try {
      setGeneratingQuestions(true);

      let questions = [];

      if (method === 'file' && uploadedFileId) {
        // Extract questions from uploaded file
        questions = await extractQuestionsFromFile(uploadedFileId, defaultQuestionType, numQuestions, difficulty);
      } else if (method === 'text' && textInput.trim()) {
        // For text input, we'll create mock questions for now
        // In a real implementation, this would send text to AI service
        questions = [];
        for (let i = 0; i < numQuestions; i++) {
          if (defaultQuestionType === 'mcq') {
            questions.push({
              question_text: `Câu hỏi ${i+1} từ nội dung: ${textInput.substring(0, 50)}...`,
              question_type: 'mcq',
              options: [`Đáp án A cho câu ${i+1}`, `Đáp án B cho câu ${i+1}`, `Đáp án C cho câu ${i+1}`, `Đáp án D cho câu ${i+1}`],
              correct_answer: 'A',
              explanation: `Giải thích cho câu hỏi ${i+1}`,
              difficulty: 'medium',
              points: 1
            });
          } else if (defaultQuestionType === 'true_false') {
            questions.push({
              question_text: `Câu hỏi đúng/sai ${i+1} từ nội dung: ${textInput.substring(0, 50)}...`,
              question_type: 'true_false',
              options: ['Đúng', 'Sai'],
              correct_answer: 'Đúng',
              explanation: `Giải thích cho câu hỏi ${i+1}`,
              difficulty: 'medium',
              points: 1
            });
          } else if (defaultQuestionType === 'short_answer') {
            questions.push({
              question_text: `Câu hỏi trả lời ngắn ${i+1} từ nội dung: ${textInput.substring(0, 50)}...`,
              question_type: 'short_answer',
              correct_answer: `Đáp án cho câu hỏi ${i+1}`,
              explanation: `Giải thích cho câu hỏi ${i+1}`,
              difficulty: 'medium',
              points: 2
            });
          } else if (defaultQuestionType === 'essay') {
            questions.push({
              question_text: `Câu hỏi tự luận ${i+1} từ nội dung: ${textInput.substring(0, 50)}...`,
              question_type: 'essay',
              explanation: `Hướng dẫn chấm điểm cho bài tự luận ${i+1}`,
              difficulty: 'medium',
              points: 5
            });
          }
        }
      }

      setGeneratedQuestions(questions);
      setHasGeneratedQuestions(true);
      enqueueSnackbar(`Đã tạo ${questions.length} câu hỏi thành công!`, { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Có lỗi xảy ra khi tạo câu hỏi', { variant: 'error' });
    } finally {
      setGeneratingQuestions(false);
    }
  };

  const handleDeleteQuestion = (questionId) => {
    setGeneratedQuestions(generatedQuestions.filter(q => q.id !== questionId));
    enqueueSnackbar('Đã xóa câu hỏi', { variant: 'info' });
  };

  const handleAddManualQuestion = () => {
    const newQuestion = {
      id: `q-manual-${Date.now()}`,
      question_text: '',
      question_type: defaultQuestionType,
      options: defaultQuestionType === 'mcq' ? ['', '', '', ''] : defaultQuestionType === 'true_false' ? ['Đúng', 'Sai'] : null,
      correct_answer: defaultQuestionType === 'mcq' ? 'A' : defaultQuestionType === 'true_false' ? 'Đúng' : '',
      explanation: '',
      difficulty: 'medium',
      points: 1
    };
    setManualQuestions([...manualQuestions, newQuestion]);
  };

  const handleUpdateManualQuestion = (questionId, field, value) => {
    setManualQuestions(manualQuestions.map(q => {
      if (q.id === questionId) {
        const updatedQuestion = { ...q, [field]: value };

        // Auto-update options and correct_answer when question_type changes
        if (field === 'question_type') {
          switch (value) {
            case 'mcq':
              updatedQuestion.options = ['', '', '', ''];
              updatedQuestion.correct_answer = 'A';
              break;
            case 'true_false':
              updatedQuestion.options = ['Đúng', 'Sai'];
              updatedQuestion.correct_answer = 'Đúng';
              break;
            case 'short_answer':
              updatedQuestion.options = null;
              updatedQuestion.correct_answer = '';
              break;
            case 'essay':
              updatedQuestion.options = null;
              updatedQuestion.correct_answer = '';
              break;
          }
        }

        return updatedQuestion;
      }
      return q;
    }));
  };

  const getQuestionTypeLabel = (type) => {
    const labels = {
      mcq: 'Trắc nghiệm',
      true_false: 'Đúng/Sai',
      short_answer: 'Trả lời ngắn',
      essay: 'Tự luận'
    };
    return labels[type] || type;
  };

  const renderQuestionInput = (question) => {
    switch (question.question_type) {
      case 'mcq':
        return (
          <Stack spacing={1}>
            {['A', 'B', 'C', 'D'].map((option, optIndex) => (
              <TextField
                key={optIndex}
                fullWidth
                size="small"
                placeholder={`Đáp án ${option}`}
                value={question.options?.[optIndex] || ''}
                onChange={(e) => {
                  const newOptions = [...(question.options || ['', '', '', ''])];
                  newOptions[optIndex] = e.target.value;
                  handleUpdateManualQuestion(question.id, 'options', newOptions);
                }}
              />
            ))}
            <FormControl fullWidth size="small" sx={{ mt: 1 }}>
              <InputLabel>Đáp án đúng</InputLabel>
              <Select
                value={question.correct_answer || 'A'}
                label="Đáp án đúng"
                onChange={(e) => handleUpdateManualQuestion(question.id, 'correct_answer', e.target.value)}
              >
                <MenuItem value="A">A</MenuItem>
                <MenuItem value="B">B</MenuItem>
                <MenuItem value="C">C</MenuItem>
                <MenuItem value="D">D</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        );

      case 'true_false':
        return (
          <FormControl fullWidth size="small">
            <InputLabel>Đáp án đúng</InputLabel>
            <Select
              value={question.correct_answer || 'Đúng'}
              label="Đáp án đúng"
              onChange={(e) => handleUpdateManualQuestion(question.id, 'correct_answer', e.target.value)}
            >
              <MenuItem value="Đúng">Đúng</MenuItem>
              <MenuItem value="Sai">Sai</MenuItem>
            </Select>
          </FormControl>
        );

      case 'short_answer':
        return (
          <TextField
            fullWidth
            size="small"
            placeholder="Đáp án đúng..."
            value={question.correct_answer || ''}
            onChange={(e) => handleUpdateManualQuestion(question.id, 'correct_answer', e.target.value)}
            helperText="Nhập đáp án đúng cho câu hỏi"
          />
        );

      case 'essay':
        return (
          <TextField
            fullWidth
            multiline
            rows={3}
            size="small"
            placeholder="Hướng dẫn chấm điểm hoặc gợi ý..."
            value={question.explanation || ''}
            onChange={(e) => handleUpdateManualQuestion(question.id, 'explanation', e.target.value)}
            helperText="Nhập hướng dẫn chấm điểm hoặc gợi ý cho bài tự luận"
          />
        );

      default:
        return null;
    }
  };

  const handleNext = () => {
    if (activeStep === 0 && !method) {
      enqueueSnackbar('Vui lòng chọn phương pháp tạo đề thi', { variant: 'warning' });
      return;
    }
    if (activeStep === 0 && method === 'file' && !uploadedFileId) {
      enqueueSnackbar('Vui lòng upload file thành công', { variant: 'warning' });
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
    if (activeStep === 1 && method === 'manual' && manualQuestions.length === 0) {
      enqueueSnackbar('Vui lòng thêm ít nhất một câu hỏi', { variant: 'warning' });
      return;
    }
    if (activeStep === 1 && hasGeneratedQuestions && generatedQuestions.length === 0) {
      enqueueSnackbar('Vui lòng tạo câu hỏi trước', { variant: 'warning' });
      return;
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleCreateExam = async () => {
    try {
      // Prepare exam data
      const examData = {
        title: examTitle,
        description: examDescription,
        duration: timeLimit,
        total_marks: numQuestions * 1.0, // Default 1 mark per question
        passing_marks: Math.ceil(numQuestions * 0.6), // 60% passing
        difficulty,
        is_published: true, // Auto-publish so users can take the exam immediately
      };

      // Create the exam
      const createdExam = await createExamAction(examData);

      // Add questions if we have manual questions
      if (method === 'manual' && manualQuestions.length > 0) {
        await Promise.all(
          manualQuestions.map(question =>
            addQuestionAction(createdExam.id, {
              question_text: question.question_text,
              question_type: question.question_type,
              options: question.options,
              correct_answer: question.correct_answer,
              explanation: question.explanation,
              difficulty: question.difficulty,
              marks: question.points,
            })
          )
        );
      }

      // Add questions if we have generated questions
      if (hasGeneratedQuestions && generatedQuestions.length > 0) {
        await Promise.all(
          generatedQuestions.map(question =>
            addQuestionAction(createdExam.id, {
              question_text: question.question_text,
              question_type: question.question_type,
              options: question.options,
              correct_answer: question.correct_answer,
              explanation: question.explanation,
              difficulty: question.difficulty,
              marks: question.points,
            })
          )
        );
      }

      enqueueSnackbar('Đã tạo đề thi thành công!', { variant: 'success' });
      navigate(ROUTES.EXAMS);
    } catch (error) {
      // Error is already handled by the useApi hook
    }
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
                    disabled={!selectedFile && !uploadedFileId}
                  >
                    {uploadedFileId ? '✅ Đã upload' : selectedFile ? 'Đang upload...' : 'Chọn file'}
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

          <FormControl fullWidth size="small">
            <InputLabel>Loại câu hỏi mặc định</InputLabel>
            <Select
              value={defaultQuestionType}
              label="Loại câu hỏi mặc định"
              onChange={(e) => setDefaultQuestionType(e.target.value)}
            >
              <MenuItem value="mcq">Trắc nghiệm (Multiple Choice)</MenuItem>
              <MenuItem value="true_false">Đúng/Sai (True/False)</MenuItem>
              <MenuItem value="short_answer">Trả lời ngắn (Short Answer)</MenuItem>
              <MenuItem value="essay">Tự luận (Essay)</MenuItem>
            </Select>
          </FormControl>

          {method !== 'manual' && (
            <Button
              variant="contained"
              onClick={handleGenerateQuestions}
              disabled={
                generatingQuestions ||
                hasGeneratedQuestions ||
                (method === 'file' && !uploadedFileId) ||
                (method === 'text' && !textInput.trim())
              }
              startIcon={generatingQuestions ? <CircularProgress size={16} /> : null}
              fullWidth
              sx={{ mt: 1 }}
            >
              {generatingQuestions ? 'Đang tạo câu hỏi...' : hasGeneratedQuestions ? 'Đã tạo câu hỏi' : 'Tạo câu hỏi bằng AI'}
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
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography sx={{ fontWeight: 600, fontSize: DS.typography.bodySmall }}>
                            Câu {index + 1}
                          </Typography>
                          <Chip
                            label={getQuestionTypeLabel(question.question_type)}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ fontSize: DS.typography.bodyXSmall, height: 20 }}
                          />
                        </Box>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteQuestion(question.id)}
                          sx={{ color: 'error.main' }}
                        >
                          <Delete sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="Nhập câu hỏi..."
                          value={question.question_text}
                          onChange={(e) => handleUpdateManualQuestion(question.id, 'question_text', e.target.value)}
                        />
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                          <InputLabel>Loại</InputLabel>
                          <Select
                            value={question.question_type}
                            label="Loại"
                            onChange={(e) => handleUpdateManualQuestion(question.id, 'question_type', e.target.value)}
                          >
                            <MenuItem value="mcq">Trắc nghiệm</MenuItem>
                            <MenuItem value="true_false">Đúng/Sai</MenuItem>
                            <MenuItem value="short_answer">Trả lời ngắn</MenuItem>
                            <MenuItem value="essay">Tự luận</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                      {renderQuestionInput(question)}
                    </Card>
                  ))
                )}
              </Stack>
            ) : (
              <Stack spacing={2}>
                {generatingQuestions ? (
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
              {method === 'manual' ? manualQuestions.length :
               hasGeneratedQuestions ? generatedQuestions.length : 0} câu
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
        disabled={creatingExam || addingQuestion}
        startIcon={(creatingExam || addingQuestion) ? <CircularProgress size={20} /> : null}
        fullWidth
        sx={{ py: 1.5 }}
      >
        {(creatingExam || addingQuestion) ? 'Đang tạo đề thi...' : 'Tạo đề thi'}
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

