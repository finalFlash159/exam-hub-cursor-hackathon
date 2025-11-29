/**
 * Settings Page - Application settings including theme, language, and preferences
 * Uses PreferencesContext for state management
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  InputLabel,
  Switch,
  Button,
  Divider,
  Stack,
  Card,
  CardContent,
} from '@mui/material';
import {
  Palette,
  Language,
  Notifications,
  DisplaySettings,
  Save,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { usePreferences } from '../../../contexts/PreferencesContext';
import { MainLayout } from '../../../components/layout';
import { DESIGN_SYSTEM as DS } from '../../../config/designSystem';

const SettingsPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { t, i18n } = useTranslation();
  const { preferences, updatePreferences } = usePreferences();
  
  const [localPreferences, setLocalPreferences] = useState({
    theme: preferences.theme || 'light',
    language: preferences.language || 'vi',
    emailNotifications: preferences.emailNotifications !== false,
    browserNotifications: preferences.browserNotifications !== false,
    examReminders: preferences.examReminders !== false,
    resultsPerPage: preferences.resultsPerPage || 10,
    showHints: preferences.showHints !== false,
  });

  const handleThemeChange = (event) => {
    setLocalPreferences(prev => ({ ...prev, theme: event.target.value }));
  };

  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    setLocalPreferences(prev => ({ ...prev, language: newLanguage }));
    i18n.changeLanguage(newLanguage);
  };

  const handleNotificationChange = (field) => (event) => {
    setLocalPreferences(prev => ({ ...prev, [field]: event.target.checked }));
  };

  const handleResultsPerPageChange = (event) => {
    setLocalPreferences(prev => ({ ...prev, resultsPerPage: parseInt(event.target.value) }));
  };

  const handleShowHintsChange = (event) => {
    setLocalPreferences(prev => ({ ...prev, showHints: event.target.checked }));
  };

  const handleSave = () => {
    updatePreferences(localPreferences);
    enqueueSnackbar('Đã lưu cài đặt thành công!', { variant: 'success' });
  };

  return (
    <MainLayout>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: DS.spacing.pageTop }}>
        <Box sx={{ maxWidth: 900, mx: 'auto', px: DS.spacing.pageHorizontal }}>
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
              {t('settings.title') || 'Cài đặt'}
            </Typography>
            <Typography
              sx={{
                color: 'text.secondary',
                fontSize: DS.typography.bodySmall,
              }}
            >
              Quản lý cài đặt ứng dụng và tùy chọn cá nhân
            </Typography>
          </Box>

          <Stack spacing={3}>
            {/* Theme Settings */}
            <Paper sx={{ 
              p: 3,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: DS.borderRadius.regular,
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Palette sx={{ fontSize: 24, color: 'primary.main' }} />
                <Typography sx={{ fontSize: DS.typography.headingSmall, fontWeight: 600 }}>
                  Giao diện
                </Typography>
              </Box>
              
              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ mb: 1, fontSize: DS.typography.bodyMedium }}>
                  Chủ đề
                </FormLabel>
                <RadioGroup
                  value={localPreferences.theme}
                  onChange={handleThemeChange}
                >
                  <FormControlLabel 
                    value="light" 
                    control={<Radio />} 
                    label="Sáng"
                    sx={{ mb: 1 }}
                  />
                  <FormControlLabel 
                    value="dark" 
                    control={<Radio />} 
                    label="Tối"
                    sx={{ mb: 1 }}
                  />
                  <FormControlLabel 
                    value="auto" 
                    control={<Radio />} 
                    label="Tự động (theo hệ thống)"
                  />
                </RadioGroup>
              </FormControl>
            </Paper>

            {/* Language Settings */}
            <Paper sx={{ 
              p: 3,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: DS.borderRadius.regular,
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Language sx={{ fontSize: 24, color: 'primary.main' }} />
                <Typography sx={{ fontSize: DS.typography.headingSmall, fontWeight: 600 }}>
                  Ngôn ngữ
                </Typography>
              </Box>
              
              <FormControl fullWidth>
                <InputLabel>Ngôn ngữ hiển thị</InputLabel>
                <Select
                  value={localPreferences.language}
                  label="Ngôn ngữ hiển thị"
                  onChange={handleLanguageChange}
                >
                  <MenuItem value="vi">Tiếng Việt</MenuItem>
                  <MenuItem value="en">English</MenuItem>
                </Select>
              </FormControl>
            </Paper>

            {/* Notification Settings */}
            <Paper sx={{ 
              p: 3,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: DS.borderRadius.regular,
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Notifications sx={{ fontSize: 24, color: 'primary.main' }} />
                <Typography sx={{ fontSize: DS.typography.headingSmall, fontWeight: 600 }}>
                  Thông báo
                </Typography>
              </Box>
              
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography sx={{ fontSize: DS.typography.bodyMedium, fontWeight: 500, mb: 0.5 }}>
                      Thông báo qua email
                    </Typography>
                    <Typography sx={{ fontSize: DS.typography.bodySmall, color: 'text.secondary' }}>
                      Nhận thông báo về kết quả bài thi và cập nhật qua email
                    </Typography>
                  </Box>
                  <Switch
                    checked={localPreferences.emailNotifications}
                    onChange={handleNotificationChange('emailNotifications')}
                  />
                </Box>
                
                <Divider />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography sx={{ fontSize: DS.typography.bodyMedium, fontWeight: 500, mb: 0.5 }}>
                      Thông báo trình duyệt
                    </Typography>
                    <Typography sx={{ fontSize: DS.typography.bodySmall, color: 'text.secondary' }}>
                      Hiển thị thông báo trên trình duyệt
                    </Typography>
                  </Box>
                  <Switch
                    checked={localPreferences.browserNotifications}
                    onChange={handleNotificationChange('browserNotifications')}
                  />
                </Box>
                
                <Divider />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography sx={{ fontSize: DS.typography.bodyMedium, fontWeight: 500, mb: 0.5 }}>
                      Nhắc nhở làm bài thi
                    </Typography>
                    <Typography sx={{ fontSize: DS.typography.bodySmall, color: 'text.secondary' }}>
                      Nhận nhắc nhở về các bài thi sắp tới
                    </Typography>
                  </Box>
                  <Switch
                    checked={localPreferences.examReminders}
                    onChange={handleNotificationChange('examReminders')}
                  />
                </Box>
              </Stack>
            </Paper>

            {/* Display Settings */}
            <Paper sx={{ 
              p: 3,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: DS.borderRadius.regular,
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <DisplaySettings sx={{ fontSize: 24, color: 'primary.main' }} />
                <Typography sx={{ fontSize: DS.typography.headingSmall, fontWeight: 600 }}>
                  Hiển thị
                </Typography>
              </Box>
              
              <Stack spacing={2}>
                <FormControl fullWidth>
                  <InputLabel>Số kết quả mỗi trang</InputLabel>
                  <Select
                    value={localPreferences.resultsPerPage}
                    label="Số kết quả mỗi trang"
                    onChange={handleResultsPerPageChange}
                  >
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                  </Select>
                </FormControl>
                
                <Divider />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography sx={{ fontSize: DS.typography.bodyMedium, fontWeight: 500, mb: 0.5 }}>
                      Hiển thị gợi ý
                    </Typography>
                    <Typography sx={{ fontSize: DS.typography.bodySmall, color: 'text.secondary' }}>
                      Hiển thị gợi ý và mẹo khi làm bài thi
                    </Typography>
                  </Box>
                  <Switch
                    checked={localPreferences.showHints}
                    onChange={handleShowHintsChange}
                  />
                </Box>
              </Stack>
            </Paper>

            {/* Save Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<Save />}
                onClick={handleSave}
                sx={{ 
                  fontSize: DS.typography.bodyLarge,
                  px: 4,
                  py: 1.5,
                }}
              >
                Lưu cài đặt
              </Button>
            </Box>
          </Stack>
        </Box>
      </Box>
    </MainLayout>
  );
};

export default SettingsPage;

