/**
 * Subjects Page - Grid of available subjects with icons
 * UI-only version with static data
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
} from '@mui/material';
import {
  Search,
  Calculate,
  MenuBook,
  Language,
  Science,
  Biotech,
  History,
  Public,
  Psychology,
  Computer,
  Build,
  FitnessCenter,
  MusicNote,
  ArtTrack,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { MainLayout } from '../components/layout';
import { DESIGN_SYSTEM as DS } from '../config/designSystem';

// Static subjects data
const subjectsData = [
  {
    id: 'toan',
    name: 'Toán học',
    icon: <Calculate sx={{ fontSize: 48 }} />,
    color: 'primary',
    examCount: 45,
    description: 'Đại số, Hình học, Giải tích',
  },
  {
    id: 'van',
    name: 'Văn học',
    icon: <MenuBook sx={{ fontSize: 48 }} />,
    color: 'secondary',
    examCount: 32,
    description: 'Văn xuôi, Thơ, Văn học dân gian',
  },
  {
    id: 'anh',
    name: 'Tiếng Anh',
    icon: <Language sx={{ fontSize: 48 }} />,
    color: 'info',
    examCount: 38,
    description: 'Ngữ pháp, Từ vựng, Đọc hiểu',
  },
  {
    id: 'ly',
    name: 'Vật lý',
    icon: <Science sx={{ fontSize: 48 }} />,
    color: 'warning',
    examCount: 28,
    description: 'Cơ học, Điện học, Quang học',
  },
  {
    id: 'hoa',
    name: 'Hóa học',
    icon: <Biotech sx={{ fontSize: 48 }} />,
    color: 'error',
    examCount: 25,
    description: 'Hóa hữu cơ, Hóa vô cơ, Phản ứng',
  },
  {
    id: 'sinh',
    name: 'Sinh học',
    icon: <Biotech sx={{ fontSize: 48 }} />,
    color: 'success',
    examCount: 22,
    description: 'Tế bào, Di truyền, Sinh thái',
  },
  {
    id: 'su',
    name: 'Lịch sử',
    icon: <History sx={{ fontSize: 48 }} />,
    color: 'primary',
    examCount: 18,
    description: 'Lịch sử Việt Nam, Lịch sử thế giới',
  },
  {
    id: 'dia',
    name: 'Địa lý',
    icon: <Public sx={{ fontSize: 48 }} />,
    color: 'info',
    examCount: 20,
    description: 'Địa lý tự nhiên, Địa lý kinh tế',
  },
  {
    id: 'gdcd',
    name: 'GDCD',
    icon: <Psychology sx={{ fontSize: 48 }} />,
    color: 'secondary',
    examCount: 15,
    description: 'Đạo đức, Pháp luật, Công dân',
  },
  {
    id: 'tin',
    name: 'Tin học',
    icon: <Computer sx={{ fontSize: 48 }} />,
    color: 'primary',
    examCount: 30,
    description: 'Lập trình, Excel, PowerPoint',
  },
  {
    id: 'cong-nghe',
    name: 'Công nghệ',
    icon: <Build sx={{ fontSize: 48 }} />,
    color: 'warning',
    examCount: 12,
    description: 'Công nghệ điện, Công nghệ cơ khí',
  },
  {
    id: 'the-duc',
    name: 'Thể dục',
    icon: <FitnessCenter sx={{ fontSize: 48 }} />,
    color: 'success',
    examCount: 8,
    description: 'Lý thuyết thể dục, Sức khỏe',
  },
];

const SubjectsPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredSubjects = subjectsData.filter((subject) =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject);
    setDialogOpen(true);
    enqueueSnackbar(`Đã chọn môn ${subject.name}`, { variant: 'info' });
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedSubject(null);
  };

  const handleViewExams = () => {
    if (selectedSubject) {
      enqueueSnackbar(`Đang tải ${selectedSubject.examCount} đề thi của môn ${selectedSubject.name}`, { variant: 'info' });
      handleCloseDialog();
    }
  };

  return (
    <MainLayout>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: DS.spacing.pageTop }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: DS.spacing.pageHorizontal }}>
          {/* Page Header */}
          <Box sx={{ mb: 4 }}>
            <Typography
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                fontSize: DS.typography.pageTitle,
                mb: 0.5,
              }}
            >
              Các môn học
            </Typography>
            <Typography
              sx={{
                color: 'text.secondary',
                fontSize: DS.typography.bodyMedium,
              }}
            >
              Khám phá đề thi theo từng môn học
            </Typography>
          </Box>

          {/* Search Bar */}
          <Box sx={{ mb: 4 }}>
            <TextField
              fullWidth
              placeholder="Tìm kiếm môn học..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'background.paper',
                },
              }}
            />
          </Box>

          {/* Subjects Grid */}
          <Grid container spacing={3}>
            {filteredSubjects.length === 0 ? (
              <Grid item xs={12}>
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography sx={{ fontSize: DS.typography.bodyLarge, color: 'text.secondary' }}>
                    Không tìm thấy môn học nào
                  </Typography>
                </Box>
              </Grid>
            ) : (
              filteredSubjects.map((subject) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={subject.id}>
                  <Card
                    sx={{
                      height: '100%',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: DS.borderRadius.regular,
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: DS.shadows.hover,
                        borderColor: `${subject.color}.main`,
                      },
                    }}
                    onClick={() => handleSubjectClick(subject)}
                  >
                    <CardContent sx={{ p: 3, textAlign: 'center' }}>
                      <Box sx={{
                        display: 'inline-flex',
                        p: 2,
                        borderRadius: '50%',
                        bgcolor: `${subject.color}.100`,
                        color: `${subject.color}.main`,
                        mb: 2,
                      }}>
                        {subject.icon}
                      </Box>
                      
                      <Typography sx={{
                        fontSize: DS.typography.headingSmall,
                        fontWeight: 600,
                        mb: 1,
                      }}>
                        {subject.name}
                      </Typography>
                      
                      <Typography sx={{
                        fontSize: DS.typography.bodySmall,
                        color: 'text.secondary',
                        mb: 2,
                        minHeight: 40,
                      }}>
                        {subject.description}
                      </Typography>
                      
                      <Chip
                        label={`${subject.examCount} đề thi`}
                        color={subject.color}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          fontSize: DS.typography.bodySmall,
                        }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>

          {/* Subject Detail Dialog */}
          <Dialog
            open={dialogOpen}
            onClose={handleCloseDialog}
            maxWidth="sm"
            fullWidth
          >
            {selectedSubject && (
              <>
                <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
                  <Box sx={{
                    display: 'inline-flex',
                    p: 2,
                    borderRadius: '50%',
                    bgcolor: `${selectedSubject.color}.100`,
                    color: `${selectedSubject.color}.main`,
                    mb: 2,
                  }}>
                    {selectedSubject.icon}
                  </Box>
                  <Typography sx={{
                    fontSize: DS.typography.headingSmall,
                    fontWeight: 600,
                  }}>
                    {selectedSubject.name}
                  </Typography>
                </DialogTitle>
                <DialogContent>
                  <Stack spacing={2}>
                    <Box>
                      <Typography sx={{
                        fontSize: DS.typography.bodySmall,
                        color: 'text.secondary',
                        mb: 0.5,
                      }}>
                        Mô tả
                      </Typography>
                      <Typography sx={{
                        fontSize: DS.typography.bodyMedium,
                      }}>
                        {selectedSubject.description}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography sx={{
                        fontSize: DS.typography.bodySmall,
                        color: 'text.secondary',
                        mb: 0.5,
                      }}>
                        Số lượng đề thi
                      </Typography>
                      <Typography sx={{
                        fontSize: DS.typography.headingSmall,
                        fontWeight: 600,
                        color: `${selectedSubject.color}.main`,
                      }}>
                        {selectedSubject.examCount} đề thi
                      </Typography>
                    </Box>
                  </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                  <Button onClick={handleCloseDialog} sx={{ fontSize: DS.typography.bodyMedium }}>
                    Đóng
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleViewExams}
                    sx={{ fontSize: DS.typography.bodyMedium }}
                  >
                    Xem đề thi
                  </Button>
                </DialogActions>
              </>
            )}
          </Dialog>
        </Box>
      </Box>
    </MainLayout>
  );
};

export default SubjectsPage;


