/**
 * Profile Page - User profile with personal info and statistics
 * UI-only version with static data
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Avatar,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  IconButton,
} from '@mui/material';
import {
  Edit,
  Save,
  Cancel,
  Assessment,
  TrendingUp,
  EmojiEvents,
  Timer,
  CalendarToday,
  Email,
  Phone,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { MainLayout } from '../../../components/layout';
import { DESIGN_SYSTEM as DS } from '../../../config/designSystem';
import { format } from 'date-fns';

// Static mock data
const mockUser = {
  id: 'user-001',
  full_name: 'Nguyễn Văn A',
  email: 'demo@example.com',
  phone: '+84901234567',
  avatar: null,
  bio: 'Học sinh đam mê học tập',
  joined_date: '2024-01-01T00:00:00Z'
};

const mockUserStats = {
  total_exams_taken: 25,
  average_score: 85.5,
  highest_score: 98,
  total_time_spent: 72000, // seconds
  current_streak: 7,
  achievements: [
    { id: 'first_exam', name: 'Bắt đầu hành trình', description: 'Hoàn thành bài thi đầu tiên' },
    { id: 'week_streak', name: 'Tuần liên tiếp', description: 'Làm bài thi 7 ngày liên tiếp' },
    { id: 'high_scorer', name: 'Điểm cao', description: 'Đạt trên 90% trong một bài thi' },
  ]
};

const ProfilePage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: mockUser.full_name,
    email: mockUser.email,
    phone: mockUser.phone,
    bio: mockUser.bio,
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    enqueueSnackbar('Đã cập nhật thông tin thành công!', { variant: 'success' });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      full_name: mockUser.full_name,
      email: mockUser.email,
      phone: mockUser.phone,
      bio: mockUser.bio,
    });
    setIsEditing(false);
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours} giờ ${minutes} phút`;
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <MainLayout>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: DS.spacing.pageTop }}>
        <Box sx={{ maxWidth: 1000, mx: 'auto', px: DS.spacing.pageHorizontal }}>
          {/* Profile Header */}
          <Paper sx={{ 
            p: 4, 
            mb: 3, 
            textAlign: 'center',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: DS.borderRadius.regular,
          }}>
            <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  fontSize: '3rem',
                  bgcolor: 'primary.main',
                  mx: 'auto',
                }}
              >
                {mockUser.avatar ? (
                  <img src={mockUser.avatar} alt={formData.full_name} />
                ) : (
                  getInitials(formData.full_name)
                )}
              </Avatar>
              <IconButton
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' },
                }}
                size="small"
              >
                <Edit sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
            
            <Typography sx={{ fontSize: DS.typography.headingMedium, fontWeight: 600, mb: 1 }}>
              {formData.full_name}
            </Typography>
            
            <Typography sx={{ fontSize: DS.typography.bodySmall, color: 'text.secondary', mb: 2 }}>
              Tham gia từ {format(new Date(mockUser.joined_date), 'dd/MM/yyyy')}
            </Typography>
          </Paper>

          {/* Edit Profile Section */}
          <Paper sx={{ 
            p: 3, 
            mb: 3,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: DS.borderRadius.regular,
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography sx={{ fontSize: DS.typography.headingSmall, fontWeight: 600 }}>
                Thông tin cá nhân
              </Typography>
              {!isEditing ? (
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={() => setIsEditing(true)}
                  sx={{ fontSize: DS.typography.bodyMedium }}
                >
                  Chỉnh sửa
                </Button>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSave}
                    sx={{ fontSize: DS.typography.bodyMedium }}
                  >
                    Lưu
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={handleCancel}
                    sx={{ fontSize: DS.typography.bodyMedium }}
                  >
                    Hủy
                  </Button>
                </Box>
              )}
            </Box>

            <Stack spacing={2.5}>
              <TextField
                label="Họ và tên"
                value={formData.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                disabled={!isEditing}
                fullWidth
                InputProps={{
                  startAdornment: <Box sx={{ mr: 1 }} />,
                }}
              />

              <TextField
                label="Email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={!isEditing}
                fullWidth
                type="email"
                InputProps={{
                  startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />

              <TextField
                label="Số điện thoại"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={!isEditing}
                fullWidth
                InputProps={{
                  startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />

              <TextField
                label="Giới thiệu"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                disabled={!isEditing}
                fullWidth
                multiline
                rows={3}
              />
            </Stack>
          </Paper>

          {/* Statistics Grid */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, 
            gap: 2, 
            mb: 3 
          }}>
            <Card>
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <Assessment sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography sx={{ fontSize: DS.typography.headingSmall, fontWeight: 600, mb: 0.5 }}>
                  {mockUserStats.total_exams_taken}
                </Typography>
                <Typography sx={{ fontSize: DS.typography.bodySmall, color: 'text.secondary' }}>
                  Tổng số bài thi
                </Typography>
              </CardContent>
            </Card>

            <Card>
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <TrendingUp sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                <Typography sx={{ fontSize: DS.typography.headingSmall, fontWeight: 600, mb: 0.5 }}>
                  {mockUserStats.average_score}%
                </Typography>
                <Typography sx={{ fontSize: DS.typography.bodySmall, color: 'text.secondary' }}>
                  Điểm trung bình
                </Typography>
              </CardContent>
            </Card>

            <Card>
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <EmojiEvents sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                <Typography sx={{ fontSize: DS.typography.headingSmall, fontWeight: 600, mb: 0.5 }}>
                  {mockUserStats.highest_score}%
                </Typography>
                <Typography sx={{ fontSize: DS.typography.bodySmall, color: 'text.secondary' }}>
                  Điểm cao nhất
                </Typography>
              </CardContent>
            </Card>

            <Card>
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <Timer sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                <Typography sx={{ fontSize: DS.typography.headingSmall, fontWeight: 600, mb: 0.5 }}>
                  {formatDuration(mockUserStats.total_time_spent)}
                </Typography>
                <Typography sx={{ fontSize: DS.typography.bodySmall, color: 'text.secondary' }}>
                  Tổng thời gian
                </Typography>
              </CardContent>
            </Card>

            <Card>
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <CalendarToday sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
                <Typography sx={{ fontSize: DS.typography.headingSmall, fontWeight: 600, mb: 0.5 }}>
                  {mockUserStats.current_streak}
                </Typography>
                <Typography sx={{ fontSize: DS.typography.bodySmall, color: 'text.secondary' }}>
                  Ngày liên tiếp
                </Typography>
              </CardContent>
            </Card>
          </Box>

          {/* Achievement Badges */}
          <Paper sx={{ 
            p: 3,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: DS.borderRadius.regular,
          }}>
            <Typography sx={{ fontSize: DS.typography.headingSmall, fontWeight: 600, mb: 2 }}>
              Thành tích
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {mockUserStats.achievements.map((achievement) => (
                <Card key={achievement.id} sx={{ 
                  p: 2, 
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: DS.borderRadius.regular,
                  minWidth: 200,
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      bgcolor: 'primary.100',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <EmojiEvents sx={{ fontSize: 24, color: 'primary.main' }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: DS.typography.bodyMedium, fontWeight: 600, mb: 0.25 }}>
                        {achievement.name}
                      </Typography>
                      <Typography sx={{ fontSize: DS.typography.bodySmall, color: 'text.secondary' }}>
                        {achievement.description}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              ))}
            </Box>
          </Paper>
        </Box>
      </Box>
    </MainLayout>
  );
};

export default ProfilePage;

