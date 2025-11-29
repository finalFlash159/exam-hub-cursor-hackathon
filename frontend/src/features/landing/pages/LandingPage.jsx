/**
 * Landing Page - Modern AI Exam Platform
 * Design inspired by OnlineExamMaker + Dribbble Exxam.io
 * - Gradient hero with AI theme
 * - Stats showcase (10K+ users style)
 * - Modern feature cards
 * - Clean CTA sections
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Container, Typography, Button, Grid, Card, CardContent, Stack, Chip } from "@mui/material";
import {
  AutoAwesome,
  Speed,
  ArrowForward,
  Psychology,
  ShowChart,
  Lightbulb,
  LibraryBooks,
  DevicesOutlined,
} from "@mui/icons-material";
import { ROUTES } from "../../../config/routes";
import LightThemeWrapper from "../../../components/common/LightThemeWrapper";
import { HowItWorks, Footer } from "../../../components/landing";
import { DESIGN_SYSTEM } from "../../../config/designSystem";

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Psychology sx={{ fontSize: DESIGN_SYSTEM.icons.xlarge, color: "#3b82f6" }} />,
      title: "AI Tạo Câu Hỏi",
      description: "Upload tài liệu học, AI tự động tạo câu hỏi đa dạng trong vài giây",
      color: "#eff6ff",
    },
    {
      icon: <Speed sx={{ fontSize: DESIGN_SYSTEM.icons.xlarge, color: "#10b981" }} />,
      title: "Chấm Điểm Tức Thì",
      description: "Nhận kết quả ngay lập tức sau khi hoàn thành bài thi, không cần chờ đợi",
      color: "#f0fdf4",
    },
    {
      icon: <ShowChart sx={{ fontSize: DESIGN_SYSTEM.icons.xlarge, color: "#f59e0b" }} />,
      title: "Theo Dõi Tiến Độ",
      description: "Biểu đồ học tập trực quan, phân tích điểm mạnh yếu để cải thiện",
      color: "#fef3c7",
    },
    {
      icon: <Lightbulb sx={{ fontSize: DESIGN_SYSTEM.icons.xlarge, color: "#8b5cf6" }} />,
      title: "Giải Thích Chi Tiết",
      description: "Mỗi câu hỏi có giải thích đầy đủ giúp bạn hiểu rõ bản chất vấn đề",
      color: "#ede9fe",
    },
    {
      icon: <LibraryBooks sx={{ fontSize: DESIGN_SYSTEM.icons.xlarge, color: "#ef4444" }} />,
      title: "Ngân Hàng Đề Thi",
      description: "Hàng nghìn đề thi mẫu cho tất cả các môn học phổ thông",
      color: "#fee2e2",
    },
    {
      icon: <DevicesOutlined sx={{ fontSize: DESIGN_SYSTEM.icons.xlarge, color: "#06b6d4" }} />,
      title: "Đa Nền Tảng",
      description: "Luyện tập mọi lúc mọi nơi trên điện thoại, tablet, máy tính",
      color: "#cffafe",
    },
  ];

  const heroStats = [
    { value: "50K+", label: "Học sinh" },
    { value: "500K+", label: "Đề thi" },
    { value: "4.8/5", label: "Đánh giá" },
    { value: "85%", label: "Cải thiện" },
  ];

  return (
    <LightThemeWrapper>
      <Box
        sx={{
          height: '100%',
          overflow: 'auto',
          overscrollBehavior: 'auto',
        }}
      >
        {/* Navigation Bar */}
        <Box
          sx={{
            py: 2,
            px: 3,
            borderBottom: "1px solid",
            borderColor: "divider",
            bgcolor: "white",
            position: "sticky",
            top: 0,
            zIndex: 1000,
            backdropFilter: "blur(10px)",
          }}
        >
          <Container maxWidth="lg">
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    bgcolor: '#3b82f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <AutoAwesome sx={{ color: 'white', fontSize: 24 }} />
                </Box>
                <Typography variant="h6" fontWeight={700} color="#1f2937">
                  Exam Hub
                </Typography>
              </Stack>
              
              {/* Navigation Links */}
              <Stack 
                direction="row" 
                spacing={1} 
                alignItems="center"
                sx={{ display: { xs: 'none', md: 'flex' } }}
              >
                <Button
                  color="inherit"
                  onClick={() => navigate(ROUTES.SUBJECTS)}
                  sx={{
                    color: "#4b5563",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    textTransform: "none",
                    px: 2,
                    "&:hover": {
                      bgcolor: "#f9fafb",
                      color: "#3b82f6",
                    },
                  }}
                >
                  Môn học
                </Button>
                <Button
                  color="inherit"
                  onClick={() => navigate(ROUTES.PRICING)}
                  sx={{
                    color: "#4b5563",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    textTransform: "none",
                    px: 2,
                    "&:hover": {
                      bgcolor: "#f9fafb",
                      color: "#3b82f6",
                    },
                  }}
                >
                  Bảng giá
                </Button>
                <Button
                  color="inherit"
                  onClick={() => navigate(ROUTES.FAQ)}
                  sx={{
                    color: "#4b5563",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    textTransform: "none",
                    px: 2,
                    "&:hover": {
                      bgcolor: "#f9fafb",
                      color: "#3b82f6",
                    },
                  }}
                >
                  FAQ
                </Button>
              </Stack>

              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  onClick={() => navigate(ROUTES.DASHBOARD)}
                  sx={{
                    borderColor: "#e5e7eb",
                    color: "#4b5563",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    textTransform: "none",
                    "&:hover": {
                      borderColor: "#3b82f6",
                      bgcolor: "#eff6ff",
                    },
                  }}
                >
                  Đăng nhập
                </Button>
                <Button
                  variant="contained"
                  onClick={() => navigate(ROUTES.DASHBOARD)}
                  sx={{
                    background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                    boxShadow: "0 4px 14px rgba(59, 130, 246, 0.4)",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    textTransform: "none",
                    "&:hover": {
                      background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
                    },
                  }}
                >
                  Dùng thử miễn phí
                </Button>
              </Stack>
            </Stack>
          </Container>
        </Box>

        {/* Hero Section - Blue to White Gradient */}
        <Box
          sx={{
            background: "linear-gradient(180deg, #3b82f6 0%, #ffffff 100%)",
            position: "relative",
            overflow: "hidden",
            pt: 10,
            pb: 12,
          }}
        >
          {/* Decorative Blur Elements */}
          <Box
            sx={{
              position: "absolute",
              top: "-10%",
              right: "-5%",
              width: 500,
              height: 500,
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.1)",
              filter: "blur(80px)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: "-10%",
              left: "-5%",
              width: 400,
              height: 400,
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.1)",
              filter: "blur(60px)",
            }}
          />

          <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={6}>
                <Chip
                  label="🎓 Nền Tảng Luyện Thi AI"
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.9)",
                    color: "#3b82f6",
                    fontWeight: 600,
                    fontSize: DESIGN_SYSTEM.typography.bodySmall,
                    height: DESIGN_SYSTEM.heights.chipRegular,
                    mb: 3,
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 800,
                    color: "#1f2937",
                    mb: 3,
                    lineHeight: 1.2,
                    fontSize: { xs: "2.5rem", md: "3.5rem" },
                  }}
                >
                  Tạo Đề Thi Thông Minh
                  <br />
                  với AI
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#4b5563",
                    mb: 4,
                    lineHeight: 1.6,
                    fontWeight: 400,
                  }}
                >
                  Hàng nghìn đề thi được tạo bởi AI giúp bạn ôn tập hiệu quả hơn. Được tin dùng bởi{" "}
                  <Box component="span" fontWeight={700} color="#1f2937">
                    50,000+ học sinh
                  </Box>
                  {" "}trên toàn quốc.
                </Typography>
                <Stack direction="row" spacing={2} mb={6}>
                  <Button
                    size="large"
                    variant="contained"
                    endIcon={<ArrowForward />}
                    onClick={() => navigate(ROUTES.DASHBOARD)}
                    sx={{
                      bgcolor: "white",
                      color: "#3b82f6",
                      px: 4,
                      py: 1.5,
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
                      "&:hover": {
                        bgcolor: "#f9fafb",
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.3s",
                    }}
                  >
                    Bắt đầu luyện tập
                  </Button>
                  <Button
                    size="large"
                    variant="outlined"
                    onClick={() => navigate(ROUTES.DASHBOARD)}
                    sx={{
                      borderColor: "white",
                      color: "white",
                      px: 4,
                      py: 1.5,
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      "&:hover": {
                        borderColor: "white",
                        bgcolor: "rgba(255, 255, 255, 0.1)",
                      },
                    }}
                  >
                    Xem demo
                  </Button>
                </Stack>

                {/* Stats Bar */}
                <Stack direction="row" spacing={4} flexWrap="wrap">
                  {heroStats.map((stat, index) => (
                    <Box key={index}>
                      <Typography
                        variant="h4"
                        fontWeight={700}
                        color="#1f2937"
                        sx={{ fontSize: { xs: "1.5rem", md: "2rem" } }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="#6b7280"
                        sx={{ fontSize: DESIGN_SYSTEM.typography.bodyMedium }}
                      >
                        {stat.label}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Grid>

              {/* Right Side - Empty space or future illustration */}
              <Grid item xs={12} md={6}>
                {/* Empty space for balance or can add illustration later */}
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Features + How It Works Section - Gradient wrapper */}
        <Box
          sx={{
            background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 50%, #f0f7ff 100%)",
            position: "relative",
          }}
        >
          {/* Features Section */}
          <Container maxWidth="lg" sx={{ py: 10 }}>
            <Box textAlign="center" mb={8}>
              <Chip
                label="✨ Tính năng nổi bật"
                sx={{
                  bgcolor: "#eff6ff",
                  color: "#3b82f6",
                  fontWeight: 600,
                  fontSize: DESIGN_SYSTEM.typography.bodySmall,
                  height: DESIGN_SYSTEM.heights.chipRegular,
                  mb: 2,
                }}
              />
              <Typography
                variant="h3"
                fontWeight={700}
                color="#1f2937"
                mb={2}
                sx={{ fontSize: { xs: "1.75rem", md: "2.5rem" } }}
              >
                Mọi thứ bạn cần để học tập hiệu quả
              </Typography>
              <Typography
                variant="h6"
                color="#6b7280"
                maxWidth={700}
                mx="auto"
                sx={{ fontSize: DESIGN_SYSTEM.typography.bodyLarge }}
              >
                Tất cả công cụ cần thiết để ôn luyện, kiểm tra kiến thức và cải thiện kết quả học tập
              </Typography>
            </Box>

            <Grid 
              container 
              spacing={3} 
              alignItems="stretch"
              justifyContent="center"
              sx={{
                margin: 0,
                width: '100%',
              }}
            >
              {features.map((feature, index) => (
                <Grid 
                  item 
                  xs={12} 
                  sm={6} 
                  md={4} 
                  key={index} 
                  sx={{ 
                    display: "flex",
                    flexBasis: { xs: '100%', sm: '50%', md: '33.333%' },
                    maxWidth: { xs: '100%', sm: '50%', md: '33.333%' },
                    padding: 1.5,
                  }}
                >
                  <Card
                    elevation={0}
                    sx={{
                      height: 180,
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      overflow: "hidden",
                      border: "1px solid #e5e7eb",
                      borderRadius: DESIGN_SYSTEM.borderRadius.regular,
                      transition: "all 0.3s",
                      "&:hover": {
                        boxShadow: DESIGN_SYSTEM.shadows.hover,
                        transform: "translateY(-4px)",
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        p: 1.5,
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        overflow: "hidden",
                        boxSizing: "border-box",
                      }}
                    >
                      <Box
                        sx={{
                          width: 64,
                          height: 64,
                          minHeight: 64,
                          maxHeight: 64,
                          borderRadius: DESIGN_SYSTEM.borderRadius.regular,
                          bgcolor: feature.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mb: 1.5,
                          flexShrink: 0,
                          flexGrow: 0,
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        mb={1}
                        color="#1f2937"
                        sx={{
                          fontSize: DESIGN_SYSTEM.typography.bodyMedium,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          wordBreak: "break-word",
                          overflowWrap: "break-word",
                          hyphens: "auto",
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="#6b7280"
                        sx={{
                          fontSize: DESIGN_SYSTEM.typography.bodySmall,
                          lineHeight: 1.6,
                          flex: 1,
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          wordBreak: "break-word",
                          overflowWrap: "break-word",
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>

          {/* How It Works Section */}
          <HowItWorks />
        </Box>

        {/* CTA Section - Blue Gradient */}
        <Box
          sx={{
            background: "linear-gradient(180deg, #f0f7ff 0%, #3b82f6 100%)",
            py: 10,
          }}
        >
          <Container maxWidth="md">
            <Box textAlign="center">
              <Typography
                variant="h3"
                fontWeight={700}
                color="white"
                mb={2}
                sx={{ fontSize: { xs: "1.75rem", md: "2.5rem" } }}
              >
                Bắt đầu luyện thi miễn phí ngay hôm nay
              </Typography>
              <Typography
                variant="h6"
                color="rgba(255, 255, 255, 0.9)"
                mb={4}
                sx={{ fontSize: DESIGN_SYSTEM.typography.bodyLarge }}
              >
                Tham gia cùng 50,000+ học sinh đang học tập hiệu quả hơn với Exam Hub
              </Typography>
              <Button
                size="large"
                variant="contained"
                endIcon={<ArrowForward />}
                onClick={() => navigate(ROUTES.DASHBOARD)}
                sx={{
                  bgcolor: "white",
                  color: "#3b82f6",
                  px: 5,
                  py: 2,
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  height: DESIGN_SYSTEM.heights.buttonLarge,
                  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
                  borderRadius: DESIGN_SYSTEM.borderRadius.small,
                  "&:hover": {
                    bgcolor: "#f9fafb",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s",
                }}
              >
                Tạo tài khoản miễn phí
              </Button>
            </Box>
          </Container>
        </Box>

        {/* Footer */}
        <Footer />
      </Box>
    </LightThemeWrapper>
  );
};

export default LandingPage;

