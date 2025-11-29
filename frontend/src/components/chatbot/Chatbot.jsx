import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  IconButton,
  Paper,
  TextField,
  Typography,
  Fade,
  Avatar,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import {
  Chat as ChatIcon,
  Close as CloseIcon,
  Send as SendIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { chatbotAPI } from '../../services/api';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your Exam Hub assistant. I can help you with:\n\n• Creating and managing exams\n• Understanding question types\n• Taking exams and viewing results\n• Organizing content with folders\n• API usage and troubleshooting\n\nWhat would you like to know?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const data = await chatbotAPI.query(
        userMessage.content,
        messages.slice(-5) // Send last 5 messages for context
      );

      const botMessage = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please make sure the backend server is running on port 8000.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      {/* Floating Button */}
      <Tooltip title="Ask AI Assistant" placement="left">
        <IconButton
          onClick={handleToggle}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 60,
            height: 60,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
            zIndex: 1300,
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
              transform: 'scale(1.1)',
              boxShadow: '0 6px 25px rgba(102, 126, 234, 0.6)',
            },
          }}
        >
          {isOpen ? <CloseIcon /> : <ChatIcon />}
        </IconButton>
      </Tooltip>

      {/* Chat Window */}
      <Fade in={isOpen}>
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            bottom: 100,
            right: 24,
            width: { xs: 'calc(100% - 48px)', sm: 400 },
            height: { xs: 'calc(100vh - 180px)', sm: 600 },
            maxHeight: '80vh',
            zIndex: 1300,
            display: isOpen ? 'flex' : 'none',
            flexDirection: 'column',
            borderRadius: 3,
            overflow: 'hidden',
            background: 'white',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  width: 40,
                  height: 40,
                }}
              >
                <BotIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Exam Hub AI
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  Always here to help
                </Typography>
              </Box>
            </Box>
            <IconButton
              onClick={handleToggle}
              size="small"
              sx={{ color: 'white' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Messages */}
          <Box
            ref={chatContainerRef}
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 2,
              bgcolor: '#f5f5f5',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  gap: 1.5,
                  alignItems: 'flex-start',
                  flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
                }}
              >
                <Avatar
                  sx={{
                    bgcolor:
                      message.role === 'user' ? '#3b82f6' : '#667eea',
                    width: 32,
                    height: 32,
                  }}
                >
                  {message.role === 'user' ? (
                    <PersonIcon fontSize="small" />
                  ) : (
                    <BotIcon fontSize="small" />
                  )}
                </Avatar>
                <Box
                  sx={{
                    maxWidth: '75%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5,
                  }}
                >
                  <Paper
                    elevation={1}
                    sx={{
                      p: 1.5,
                      bgcolor: message.role === 'user' ? '#3b82f6' : 'white',
                      color: message.role === 'user' ? 'white' : 'text.primary',
                      borderRadius: 2,
                      borderTopLeftRadius:
                        message.role === 'assistant' ? 0 : 2,
                      borderTopRightRadius: message.role === 'user' ? 0 : 2,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                      }}
                    >
                      {message.content}
                    </Typography>
                  </Paper>
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'text.secondary',
                      px: 0.5,
                      alignSelf:
                        message.role === 'user' ? 'flex-end' : 'flex-start',
                    }}
                  >
                    {formatTime(message.timestamp)}
                  </Typography>
                </Box>
              </Box>
            ))}

            {isLoading && (
              <Box
                sx={{
                  display: 'flex',
                  gap: 1.5,
                  alignItems: 'center',
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: '#667eea',
                    width: 32,
                    height: 32,
                  }}
                >
                  <BotIcon fontSize="small" />
                </Avatar>
                <Paper
                  elevation={1}
                  sx={{
                    p: 1.5,
                    bgcolor: 'white',
                    borderRadius: 2,
                    borderTopLeftRadius: 0,
                    display: 'flex',
                    gap: 1,
                    alignItems: 'center',
                  }}
                >
                  <CircularProgress size={16} />
                  <Typography variant="body2" color="text.secondary">
                    Thinking...
                  </Typography>
                </Paper>
              </Box>
            )}

            <div ref={messagesEndRef} />
          </Box>

          {/* Input */}
          <Box
            sx={{
              p: 2,
              bgcolor: 'white',
              borderTop: '1px solid #e0e0e0',
            }}
          >
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about Exam Hub..."
                disabled={isLoading}
                multiline
                maxRows={3}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                  },
                }}
              />
              <IconButton
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                sx={{
                  bgcolor: '#667eea',
                  color: 'white',
                  '&:hover': {
                    bgcolor: '#764ba2',
                  },
                  '&:disabled': {
                    bgcolor: '#e0e0e0',
                    color: '#9e9e9e',
                  },
                }}
              >
                <SendIcon />
              </IconButton>
            </Box>
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                textAlign: 'center',
                color: 'text.secondary',
                mt: 1,
              }}
            >
              Powered by AI • Press Enter to send
            </Typography>
          </Box>
        </Paper>
      </Fade>
    </>
  );
};

export default Chatbot;

