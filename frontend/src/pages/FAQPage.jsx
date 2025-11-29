/**
 * FAQ Page - Accordion with common questions and answers
 * UI-only version with static data
 */

import React from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
} from '@mui/material';
import {
  ExpandMore,
  HelpOutline,
} from '@mui/icons-material';
import { MainLayout } from '../components/layout';
import { DESIGN_SYSTEM as DS } from '../config/designSystem';

// Static FAQ data
const faqData = [
  {
    id: 'faq-001',
    question: 'Làm thế nào để tạo đề thi mới?',
    answer: 'Bạn có thể tạo đề thi mới bằng cách nhấn vào nút "Tạo đề thi" trên trang danh sách đề thi. Sau đó, bạn có thể chọn một trong ba phương pháp: Upload file (PDF/DOCX), Dán nội dung văn bản, hoặc Tạo thủ công. Hệ thống sẽ hướng dẫn bạn qua từng bước.',
  },
  {
    id: 'faq-002',
    question: 'Tôi có thể tải lên những loại file nào?',
    answer: 'Hệ thống hỗ trợ các định dạng file phổ biến như PDF, DOC, và DOCX. File sẽ được AI phân tích tự động để tạo câu hỏi. Kích thước file tối đa là 10MB.',
  },
  {
    id: 'faq-003',
    question: 'Làm thế nào để làm bài thi?',
    answer: 'Từ trang danh sách đề thi, bạn có thể nhấn vào đề thi muốn làm, sau đó chọn "Làm bài". Bạn sẽ được chuyển đến trang làm bài với bộ đếm thời gian và danh sách câu hỏi. Sau khi hoàn thành, nhấn "Nộp bài" để xem kết quả.',
  },
  {
    id: 'faq-004',
    question: 'Tôi có thể xem lại kết quả bài thi đã làm không?',
    answer: 'Có, bạn có thể xem lại kết quả của tất cả các bài thi đã làm trong trang "Lịch sử làm bài". Tại đây, bạn sẽ thấy điểm số, thời gian làm bài, và có thể xem lại chi tiết từng câu hỏi.',
  },
  {
    id: 'faq-005',
    question: 'Làm thế nào để tổ chức đề thi vào các thư mục?',
    answer: 'Bạn có thể tạo thư mục mới từ thanh bên trái trên trang danh sách đề thi. Sau đó, bạn có thể kéo thả đề thi vào thư mục hoặc sử dụng menu "Di chuyển" để tổ chức đề thi của mình.',
  },
  {
    id: 'faq-006',
    question: 'Tôi có thể chỉnh sửa đề thi sau khi đã tạo không?',
    answer: 'Có, bạn có thể chỉnh sửa đề thi bất cứ lúc nào. Từ trang danh sách đề thi, nhấn vào menu ba chấm bên cạnh đề thi và chọn "Chỉnh sửa". Bạn có thể thay đổi tiêu đề, mô tả, câu hỏi, và các cài đặt khác.',
  },
  {
    id: 'faq-007',
    question: 'Hệ thống tính điểm như thế nào?',
    answer: 'Điểm số được tính dựa trên số câu trả lời đúng. Mỗi câu hỏi có thể có điểm số khác nhau tùy theo độ khó. Tổng điểm sẽ được chuyển đổi thành phần trăm để dễ so sánh.',
  },
  {
    id: 'faq-008',
    question: 'Tôi có thể chia sẻ đề thi với người khác không?',
    answer: 'Có, bạn có thể chia sẻ đề thi bằng cách đánh dấu đề thi là "Công khai" khi tạo hoặc chỉnh sửa. Đề thi công khai sẽ hiển thị cho tất cả người dùng trong hệ thống.',
  },
  {
    id: 'faq-009',
    question: 'Làm thế nào để thay đổi ngôn ngữ giao diện?',
    answer: 'Bạn có thể thay đổi ngôn ngữ trong trang "Cài đặt". Hệ thống hiện hỗ trợ Tiếng Việt và Tiếng Anh. Thay đổi sẽ được áp dụng ngay lập tức.',
  },
  {
    id: 'faq-010',
    question: 'Tôi quên mật khẩu thì phải làm sao?',
    answer: 'Bạn có thể sử dụng tính năng "Quên mật khẩu" trên trang đăng nhập. Hệ thống sẽ gửi email hướng dẫn đặt lại mật khẩu đến địa chỉ email đã đăng ký.',
  },
  {
    id: 'faq-011',
    question: 'Có giới hạn số lượng đề thi tôi có thể tạo không?',
    answer: 'Tùy thuộc vào gói dịch vụ của bạn. Gói miễn phí cho phép tạo tối đa 10 đề thi. Gói Pro cho phép tạo không giới hạn đề thi. Bạn có thể nâng cấp gói dịch vụ bất cứ lúc nào.',
  },
  {
    id: 'faq-012',
    question: 'Tôi có thể xuất kết quả bài thi ra PDF không?',
    answer: 'Có, từ trang kết quả bài thi, bạn có thể nhấn nút "Xuất PDF" để tải xuống báo cáo chi tiết về kết quả của mình. File PDF sẽ bao gồm điểm số, thời gian làm bài, và chi tiết từng câu hỏi.',
  },
  {
    id: 'faq-013',
    question: 'Làm thế nào để lưu trữ đề thi?',
    answer: 'Bạn có thể lưu trữ đề thi bằng cách chọn đề thi và nhấn "Lưu trữ" từ menu. Đề thi đã lưu trữ sẽ không hiển thị trong danh sách chính nhưng vẫn có thể truy cập từ tab "Đã lưu trữ".',
  },
  {
    id: 'faq-014',
    question: 'AI tạo câu hỏi hoạt động như thế nào?',
    answer: 'AI phân tích nội dung từ file hoặc văn bản bạn cung cấp, sau đó tự động tạo các câu hỏi trắc nghiệm phù hợp. Bạn có thể chỉnh sửa, xóa, hoặc thêm câu hỏi sau khi AI tạo xong.',
  },
  {
    id: 'faq-015',
    question: 'Tôi có thể làm lại bài thi đã làm chưa?',
    answer: 'Có, bạn có thể làm lại bài thi bất cứ lúc nào. Từ trang lịch sử hoặc trang kết quả, nhấn nút "Làm lại" để bắt đầu bài thi mới. Kết quả mới sẽ được lưu riêng biệt.',
  },
];

const FAQPage = () => {
  return (
    <MainLayout>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: DS.spacing.pageTop }}>
        <Box sx={{ maxWidth: 900, mx: 'auto', px: DS.spacing.pageHorizontal }}>
          {/* Page Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Box sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: 'primary.100',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <HelpOutline sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
            </Box>
            <Typography
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                fontSize: DS.typography.pageTitle,
                mb: 1,
              }}
            >
              Câu hỏi thường gặp
            </Typography>
            <Typography
              sx={{
                color: 'text.secondary',
                fontSize: DS.typography.bodyMedium,
              }}
            >
              Tìm câu trả lời cho các câu hỏi phổ biến về hệ thống
            </Typography>
          </Box>

          {/* FAQ Accordion */}
          <Paper sx={{ 
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: DS.borderRadius.regular,
            overflow: 'hidden',
          }}>
            {faqData.map((faq, index) => (
              <Accordion
                key={faq.id}
                defaultExpanded={index === 0}
                sx={{
                  '&:before': {
                    display: 'none',
                  },
                  borderBottom: index < faqData.length - 1 ? '1px solid' : 'none',
                  borderColor: 'divider',
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore sx={{ color: 'primary.main' }} />}
                  sx={{
                    px: 3,
                    py: 2,
                    '&:hover': {
                      bgcolor: 'grey.50',
                    },
                  }}
                >
                  <Typography sx={{ 
                    fontSize: DS.typography.bodyLarge, 
                    fontWeight: 600,
                    pr: 2,
                  }}>
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 3, py: 2, pt: 0 }}>
                  <Typography sx={{ 
                    fontSize: DS.typography.bodyMedium,
                    color: 'text.secondary',
                    lineHeight: 1.7,
                  }}>
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Paper>

          {/* Contact Support Section */}
          <Paper sx={{ 
            mt: 4,
            p: 3,
            textAlign: 'center',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: DS.borderRadius.regular,
            bgcolor: 'primary.50',
          }}>
            <Typography sx={{ 
              fontSize: DS.typography.headingSmall, 
              fontWeight: 600,
              mb: 1,
            }}>
              Không tìm thấy câu trả lời?
            </Typography>
            <Typography sx={{ 
              fontSize: DS.typography.bodyMedium,
              color: 'text.secondary',
              mb: 2,
            }}>
              Liên hệ với chúng tôi để được hỗ trợ
            </Typography>
            <Typography sx={{ 
              fontSize: DS.typography.bodyLarge,
              fontWeight: 600,
              color: 'primary.main',
            }}>
              support@examhub.com
            </Typography>
          </Paper>
        </Box>
      </Box>
    </MainLayout>
  );
};

export default FAQPage;


