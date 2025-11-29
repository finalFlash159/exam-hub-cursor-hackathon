# 🎓 Exam Hub - Complete Exam Management System

A modern, full-stack exam management platform built with FastAPI (Backend) and React (Frontend).

## 🚀 Quick Start

### **Option 1: Fastest Way (2 Terminals)**

**Terminal 1 - Backend:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### **Option 2: Using Run Scripts**

**macOS/Linux:**
```bash
# Terminal 1
cd backend && ./run.sh

# Terminal 2  
cd frontend && ./run.sh
```

**Windows:**
```bash
# Terminal 1
cd backend && run.bat

# Terminal 2
cd frontend && run.bat
```

## 🌐 Access the Application

Once both services are running:

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:5173 | Main web application |
| **Backend API** | http://localhost:8000 | REST API server |
| **API Docs** | http://localhost:8000/docs | Interactive API documentation |
| **Health Check** | http://localhost:8000/api/health | Server status endpoint |

## 📋 Environment Setup

### Backend (.env)

Create `backend/.env`:
```env
APP_NAME=Exam Hub
DEBUG=True
DATABASE_URL=sqlite+aiosqlite:///./exam_hub.db
CORS_ORIGINS=["http://localhost:5173"]
UPLOAD_DIR=./uploads
MAX_UPLOAD_SIZE=10485760
```

### Frontend (.env)

Create `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:8000
```

## ✨ Features

### ✅ Exam Management
- Create, edit, and delete exams
- Support for 4 question types: MCQ, True/False, Short Answer, Essay
- Automatic grading for MCQ and True/False
- Publish/unpublish exams
- Set duration, passing marks, and total marks

### 📊 Dashboard & Analytics
- Real-time statistics
- Recent exam activity
- Performance tracking
- Student attempt history

### 📁 Organization
- Folder system for exams and files
- File upload support (PDF, DOCX, TXT, etc.)
- Color-coded folders
- Drag-and-drop organization

### 🤖 AI Chatbot Assistant
- Context-aware help system
- API guidance
- Troubleshooting support
- Question answering

### 🎨 Modern UI
- Responsive design
- Neumorphic theme
- Dark mode support
- Smooth animations
- Material-UI components

## 🔌 API Integration

The frontend is fully integrated with the backend through a centralized API service layer:

### Frontend API Layer
- **API Config**: `frontend/src/config/api.js` - All endpoint definitions
- **API Service**: `frontend/src/services/api.js` - Abstracted API calls

### Usage Example
```javascript
import { examAPI, dashboardAPI } from '../services/api';

// Get all exams
const exams = await examAPI.getAll();

// Create an exam
const newExam = await examAPI.create({
  title: "Math Quiz",
  duration: 30,
  total_marks: 10,
  passing_marks: 6,
});

// Get dashboard stats
const stats = await dashboardAPI.getStats();
```

## 📚 API Endpoints

### Exams
- `GET /api/exams` - List all exams
- `POST /api/exams` - Create exam
- `GET /api/exams/{id}` - Get exam details
- `PUT /api/exams/{id}` - Update exam
- `DELETE /api/exams/{id}` - Delete exam

### Questions
- `POST /api/exams/{exam_id}/questions` - Add question
- `PUT /api/exams/{exam_id}/questions/{question_id}` - Update question
- `DELETE /api/exams/{exam_id}/questions/{question_id}` - Delete question

### Exam Attempts
- `POST /api/exams/{exam_id}/attempts` - Start attempt
- `POST /api/exams/attempts/{attempt_id}/submit` - Submit answers
- `GET /api/exams/attempts/{attempt_id}` - Get results

### Folders
- `GET /api/folders` - List all folders
- `POST /api/folders` - Create folder
- `PUT /api/folders/{id}` - Update folder
- `DELETE /api/folders/{id}` - Delete folder

### Dashboard
- `GET /api/dashboard` - Get statistics and recent activity

### Chatbot
- `POST /api/chatbot/query` - Ask questions

**Full API Documentation**: http://localhost:8000/docs

## 🏗️ Project Structure

```
exam-hub-cursor-hackathon/
├── backend/                    # FastAPI Backend
│   ├── app/
│   │   ├── api/               # API endpoints
│   │   ├── models/            # SQLAlchemy models
│   │   ├── schemas/           # Pydantic schemas
│   │   ├── services/          # Business logic
│   │   ├── repositories/      # Data access layer
│   │   ├── database/          # DB connection
│   │   └── core/              # Configuration
│   ├── main.py                # Entry point
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Environment config
│
├── frontend/                  # React Frontend
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── features/         # Feature modules
│   │   ├── services/         # API service layer ⭐
│   │   ├── config/           # Configuration ⭐
│   │   ├── theme/            # UI themes
│   │   ├── contexts/         # React contexts
│   │   └── i18n/             # Internationalization
│   ├── package.json          # Node dependencies
│   └── .env                  # Environment config
│
├── SETUP_GUIDE.md            # Detailed setup instructions
├── START_HERE.md             # Quick start guide
└── README.md                 # This file
```

## 🧪 Testing the Integration

### 1. Health Check
```bash
curl http://localhost:8000/api/health
```

### 2. Create Test Exam
```bash
curl -X POST http://localhost:8000/api/exams \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Exam",
    "duration": 30,
    "total_marks": 10,
    "passing_marks": 6,
    "is_published": true,
    "questions": [{
      "question_text": "What is 2+2?",
      "question_type": "mcq",
      "marks": 2,
      "options": ["3", "4", "5"],
      "correct_answer": "4"
    }]
  }'
```

### 3. View in Frontend
1. Open http://localhost:5173
2. Navigate to Dashboard
3. See your created exam

## 🐛 Troubleshooting

### Backend Won't Start

**Port 8000 in use:**
```bash
# macOS/Linux
lsof -ti:8000 | xargs kill -9

# Windows
netstat -ano | findstr :8000
# Then kill the PID: taskkill /PID <pid> /F
```

**Database errors:**
```bash
rm backend/exam_hub.db
# Restart backend - it will auto-create the DB
```

### Frontend Can't Connect

1. Verify backend is running: http://localhost:8000/api/health
2. Check `frontend/.env` has: `VITE_API_BASE_URL=http://localhost:8000`
3. Check browser console for CORS errors
4. Restart frontend: `Ctrl+C` then `npm run dev`

### CORS Errors

1. Check `backend/.env` has: `CORS_ORIGINS=["http://localhost:5173"]`
2. Restart backend

## 📖 Documentation

- **[START_HERE.md](./START_HERE.md)** - Quick 2-minute setup
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Complete setup guide with troubleshooting
- **[API Docs](http://localhost:8000/docs)** - Interactive API documentation

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM with async support
- **Pydantic** - Data validation
- **SQLite** - Database (can be swapped for PostgreSQL)

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **Material-UI** - Component library
- **React Router** - Navigation
- **i18next** - Internationalization

## 🔐 Security Notes

⚠️ **Development Mode** - This application is configured for local development:
- No authentication system
- CORS enabled for localhost
- Debug mode enabled
- SQLite database

For production deployment, you should:
- Add JWT authentication
- Configure proper CORS origins
- Use PostgreSQL or similar
- Enable HTTPS
- Add rate limiting
- Set DEBUG=False

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Make your changes
4. Test both frontend and backend
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Need Help?

1. **Check the docs**: [SETUP_GUIDE.md](./SETUP_GUIDE.md)
2. **Use the chatbot**: Click the chat icon in the frontend
3. **API docs**: http://localhost:8000/docs
4. **Check logs**: Look at terminal output for errors

---

**Built with ❤️ for the Cursor Hackathon**