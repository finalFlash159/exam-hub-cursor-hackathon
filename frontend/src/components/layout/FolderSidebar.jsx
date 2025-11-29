/**
 * FolderSidebar Component
 * Displays folder navigation with API integration
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  Badge,
  Collapse,
} from '@mui/material';
import {
  Folder,
  FolderOpen,
  Add,
  MoreVert,
  Edit,
  Delete,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { getFolders, createFolder, updateFolder, deleteFolder } from '../../api';
import { useApi } from '../../hooks/useApi';
import { LoadingSpinner } from '../common';

// API functions
const getFoldersApi = (skip, limit) => getFolders(skip, limit);
const createFolderApi = (folderData) => createFolder(folderData);
const updateFolderApi = (folderId, folderData) => updateFolder(folderId, folderData);
const deleteFolderApi = (folderId) => deleteFolder(folderId);

// Default "All exams" folder
const defaultAllFolder = {
  id: 'all',
  name: 'Tất cả đề thi',
  count: 0,
  isDefault: true,
};

// Mock folders for now (will be replaced with API data)
const mockFolders = [
  {
    id: 'all',
    name: 'Tất cả đề thi',
    count: 15,
    isDefault: true,
  },
  {
    id: 'folder-001',
    name: 'Toán học',
    count: 5,
    color: '#3b82f6',
  },
  {
    id: 'folder-002',
    name: 'Tiếng Anh',
    count: 3,
    color: '#10b981',
  },
  {
    id: 'folder-003',
    name: 'Văn học',
    count: 2,
    color: '#f59e0b',
  },
  {
    id: 'folder-004',
    name: 'Vật lý',
    count: 3,
    color: '#8b5cf6',
    parent_folder_id: 'folder-001',
  },
  {
    id: 'folder-005',
    name: 'Hóa học',
    count: 2,
    color: '#ef4444',
  },
];

const FolderSidebar = ({
  selectedFolder,
  onFolderSelect,
  drawerWidth = 220
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();

  // API hooks
  const { data: apiFolders, loading: loadingFolders, execute: loadFolders } = useApi(getFoldersApi);
  const { execute: createFolderAction } = useApi(createFolderApi);
  const { execute: updateFolderAction } = useApi(updateFolderApi);
  const { execute: deleteFolderAction } = useApi(deleteFolderApi);

  // State
  const [folders, setFolders] = useState([defaultAllFolder, ...mockFolders.slice(1)]); // Start with mock data
  const [expandedFolders, setExpandedFolders] = useState(new Set(['all']));

  // Load folders on component mount
  useEffect(() => {
    loadFolders(0, 100);
  }, [loadFolders]);

  // Update folders when API data changes
  useEffect(() => {
    if (apiFolders) {
      setFolders([defaultAllFolder, ...apiFolders]);
    }
  }, [apiFolders]);

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState('#3b82f6');

  // Menu states
  const [folderMenuAnchor, setFolderMenuAnchor] = useState(null);
  const [selectedFolderForMenu, setSelectedFolderForMenu] = useState(null);

  // Rename dialog
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [renameFolderName, setRenameFolderName] = useState('');

  // Handle folder expansion
  const handleToggleExpand = (folderId) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  // Handle folder selection
  const handleFolderSelect = (folder) => {
    if (onFolderSelect) {
      onFolderSelect(folder.id);
    }
  };

  // Handle folder menu
  const handleFolderMenuOpen = (event, folder) => {
    event.stopPropagation();
    setFolderMenuAnchor(event.currentTarget);
    setSelectedFolderForMenu(folder);
  };

  const handleFolderMenuClose = () => {
    setFolderMenuAnchor(null);
    setSelectedFolderForMenu(null);
  };

  // Create folder (shows success but doesn't persist)
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      enqueueSnackbar('Tên thư mục không được để trống', { variant: 'warning' });
      return;
    }

    try {
      const folderData = {
        name: newFolderName.trim(),
        color: newFolderColor,
      };

      await createFolderAction(folderData);
      enqueueSnackbar('Đã tạo thư mục mới', { variant: 'success' });

      // Reload folders
      loadFolders(0, 100);

      setCreateDialogOpen(false);
      setNewFolderName('');
      setNewFolderColor('#3b82f6');
    } catch (error) {
      // Error is already handled by the useApi hook
    }
  };

  // Rename folder (shows success but doesn't persist)
  const handleRenameFolder = () => {
    if (!selectedFolderForMenu || selectedFolderForMenu.isDefault) return;
    setRenameFolderName(selectedFolderForMenu.name);
    setRenameDialogOpen(true);
    handleFolderMenuClose();
  };

  const handleRenameSubmit = () => {
    if (!selectedFolderForMenu || !renameFolderName.trim()) return;
    enqueueSnackbar('Đã đổi tên thư mục', { variant: 'success' });
    setRenameDialogOpen(false);
    setRenameFolderName('');
  };

  // Delete folder (shows success but doesn't persist)
  const handleDeleteFolder = async () => {
    if (!selectedFolderForMenu || selectedFolderForMenu.isDefault) return;
    const confirmMessage = 'Xóa thư mục này sẽ chuyển tất cả bài thi vào thư mục gốc. Bạn có chắc chắn?';
    if (!window.confirm(confirmMessage)) return;

    try {
      await deleteFolderAction(selectedFolderForMenu.id);
      enqueueSnackbar('Đã xóa thư mục', { variant: 'success' });

      // Reload folders
      loadFolders(0, 100);

      handleFolderMenuClose();
    } catch (error) {
      // Error is already handled by the useApi hook
    }
  };

  // Render folder item
  const renderFolderItem = (folder, level = 0) => {
    const isSelected = selectedFolder === folder.id;
    const isExpanded = expandedFolders.has(folder.id);
    const hasChildren = folders.some(f => f.parent_folder_id === folder.id);
    const paddingLeft = level * 8;

    return (
      <Box key={folder.id}>
        <ListItem
          disablePadding
          secondaryAction={
            !folder.isDefault && (
              <IconButton
                edge="end"
                size="small"
                onClick={(e) => handleFolderMenuOpen(e, folder)}
                sx={{
                  opacity: 0.6,
                  '&:hover': { opacity: 1 },
                  mr: 0,
                  p: 0.25
                }}
              >
                <MoreVert sx={{ fontSize: 14 }} />
              </IconButton>
            )
          }
        >
          <ListItemButton
            selected={isSelected}
            onClick={() => handleFolderSelect(folder)}
            sx={{
              borderRadius: 1,
              border: '1px solid transparent',
              pl: `${paddingLeft}px`,
              pr: 0.5,
              py: 0.375,
              minHeight: 28,
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'white',
                border: '1px solid',
                borderColor: 'primary.main',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
                '& .MuiListItemIcon-root': {
                  color: 'white',
                },
                '& .MuiTypography-root': {
                  color: 'white',
                  fontWeight: 600,
                },
              },
              '&:hover': {
                bgcolor: (theme) => isSelected ? 'primary.dark' : (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'grey.50'),
                border: '1px solid',
                borderColor: (theme) => isSelected ? 'primary.main' : 'divider',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 28 }}>
              {hasChildren ? (
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleExpand(folder.id);
                  }}
                  sx={{
                    p: 0.25,
                    color: isSelected ? 'white' : 'inherit'
                  }}
                >
                  {isExpanded ? <ExpandLess sx={{ fontSize: 14 }} /> : <ExpandMore sx={{ fontSize: 14 }} />}
                </IconButton>
              ) : (
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: 0.5,
                    bgcolor: folder.color || '#3b82f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: isSelected ? 1 : 0.9
                  }}
                >
                  {isSelected ? (
                    <FolderOpen sx={{ fontSize: 12, color: 'white' }} />
                  ) : (
                    <Folder sx={{ fontSize: 12, color: 'white' }} />
                  )}
                </Box>
              )}
            </ListItemIcon>
            <ListItemText
              primary={folder.name}
              primaryTypographyProps={{
                variant: 'body2',
                fontSize: '0.75rem',
                noWrap: true,
              }}
            />
            <Badge
              badgeContent={folder.count || 0}
              color="primary"
              sx={{
                mr: folder.isDefault ? 0.5 : 3.5,
                '& .MuiBadge-badge': {
                  bgcolor: (theme) => isSelected ? 'white' : (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'grey.200'),
                  color: (theme) => isSelected ? 'primary.main' : 'text.secondary',
                  fontWeight: 600,
                  fontSize: '0.625rem',
                  height: 16,
                  minWidth: 16,
                  padding: '0 4px',
                },
              }}
            />
          </ListItemButton>
        </ListItem>

        {/* Render children */}
        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ '& .MuiListItem-root': { mb: 0.25 } }}>
              {folders
                .filter(f => f.parent_folder_id === folder.id)
                .map(childFolder => renderFolderItem(childFolder, level + 1))
              }
            </List>
          </Collapse>
        )}
      </Box>
    );
  };

  return (
    <>
      <Box
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          borderRadius: 0,
          borderRight: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          overflow: 'auto',
          height: '100%',
          position: 'sticky',
          top: 0,
        }}
      >
        <Box sx={{ p: 1 }}>
          {/* Header */}
          <Box sx={{ mb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 0, fontSize: '0.875rem', lineHeight: 1.3 }}>
              {t('exams.manageExams') || 'Quản lý đề thi'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.625rem' }}>
              {folders.reduce((sum, f) => sum + (f.count || 0), 0)} {t('exams.exams') || 'đề thi'}
            </Typography>
          </Box>

          {/* Create folder button */}
          <Button
            fullWidth
            variant="contained"
            size="small"
            startIcon={<Add sx={{ fontSize: 16 }} />}
            onClick={() => setCreateDialogOpen(true)}
            sx={{
              mb: 1,
              fontSize: '0.75rem',
              height: 32,
              px: 1,
              textTransform: 'none',
              bgcolor: 'primary.main',
              boxShadow: 'none',
              '&:hover': {
                bgcolor: 'primary.dark',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
              },
            }}
          >
            {t('exams.createNewFolder') || 'Tạo folder mới'}
          </Button>

          <Divider sx={{ mb: 1 }} />

          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, mb: 0.75, display: 'block', textTransform: 'uppercase', fontSize: '0.625rem', letterSpacing: 0.5 }}>
            {t('exams.myFolders') || 'Thư mục của tôi'}
          </Typography>

          {/* Folder list */}
          <List dense sx={{ p: 0, '& .MuiListItem-root': { mb: 0.25 } }}>
            {folders
              .filter(folder => !folder.parent_folder_id) // Only root level folders
              .map(folder => renderFolderItem(folder))
            }
          </List>
        </Box>
      </Box>

      {/* Create Folder Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1, fontSize: '1rem' }}>{t('exams.createNewFolder') || 'Tạo folder mới'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <TextField
              fullWidth
              size="small"
              label={t('exams.folderName') || 'Tên thư mục'}
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              autoFocus
              sx={{ '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
            />
            
            {/* Color picker */}
            <Box>
              <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary', fontSize: '0.75rem' }}>
                Màu thư mục
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {[
                  { color: '#3b82f6', name: 'Blue' },
                  { color: '#10b981', name: 'Green' },
                  { color: '#f59e0b', name: 'Orange' },
                  { color: '#ef4444', name: 'Red' },
                  { color: '#8b5cf6', name: 'Purple' },
                  { color: '#ec4899', name: 'Pink' },
                  { color: '#06b6d4', name: 'Cyan' },
                  { color: '#6b7280', name: 'Gray' },
                ].map((item) => (
                  <Box
                    key={item.color}
                    onClick={() => setNewFolderColor(item.color)}
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: 1,
                      bgcolor: item.color,
                      cursor: 'pointer',
                      border: 2,
                      borderColor: newFolderColor === item.color ? 'primary.main' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'scale(1.1)',
                        boxShadow: 2
                      }
                    }}
                  >
                    {newFolderColor === item.color && (
                      <Box sx={{ color: 'white', fontSize: 16 }}>✓</Box>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 1.5 }}>
          <Button onClick={() => setCreateDialogOpen(false)} size="small" sx={{ fontSize: '0.875rem' }}>Hủy</Button>
          <Button onClick={handleCreateFolder} variant="contained" size="small" sx={{ fontSize: '0.875rem' }}>
            Tạo thư mục
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rename Folder Dialog */}
      <Dialog
        open={renameDialogOpen}
        onClose={() => setRenameDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1, fontSize: '1rem' }}>Đổi tên thư mục</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1.5 }}>
            <TextField
              fullWidth
              size="small"
              label="Tên thư mục mới"
              value={renameFolderName}
              onChange={(e) => setRenameFolderName(e.target.value)}
              autoFocus
              sx={{ '& .MuiInputBase-input': { fontSize: '0.813rem' } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 1.5 }}>
          <Button onClick={() => setRenameDialogOpen(false)} size="small" sx={{ fontSize: '0.813rem' }}>Hủy</Button>
          <Button onClick={handleRenameSubmit} variant="contained" size="small" sx={{ fontSize: '0.813rem' }}>
            Đổi tên
          </Button>
        </DialogActions>
      </Dialog>

      {/* Folder Context Menu */}
      <Menu
        anchorEl={folderMenuAnchor}
        open={Boolean(folderMenuAnchor)}
        onClose={handleFolderMenuClose}
        slotProps={{
          paper: {
            sx: {
              minWidth: 160,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }
          }
        }}
      >
        <MenuItem onClick={handleRenameFolder} sx={{ fontSize: '0.813rem', py: 0.75 }}>
          <Edit sx={{ fontSize: 16, mr: 1 }} />
          Đổi tên
        </MenuItem>
        <MenuItem onClick={handleDeleteFolder} sx={{ fontSize: '0.813rem', py: 0.75, color: 'error.main' }}>
          <Delete sx={{ fontSize: 16, mr: 1 }} />
          Xóa thư mục
        </MenuItem>
      </Menu>
    </>
  );
};

export default FolderSidebar;

