# Exam Hub Backend (Simplified)

A simplified FastAPI backend for exam management - easy to demo without authentication, email, or notification features.

## Features

- ✅ **Exam Management**: Create, update, delete exams
- ✅ **Question Management**: Add multiple choice, true/false, short answer, and essay questions
- ✅ **Exam Attempts**: Students can take exams and get instant results
- ✅ **Folder Organization**: Organize exams into folders
- ✅ **File Upload**: Upload exam materials (PDF, DOCX, etc.)
- ✅ **AI Question Generation**: Generate multiple choice, true/false, short answer, and essay questions from files using Google Gemini AI
- ✅ **Dashboard**: View statistics and recent activity
- ❌ **No Authentication**: All endpoints are public for easy demo
- ❌ **No Email**: No email notifications

## Tech Stack

- **FastAPI**: Modern, fast web framework
- **SQLAlchemy**: ORM with async support
- **SQLite**: Lightweight database (easy to demo)
- **Pydantic**: Data validation
- **Uvicorn**: ASGI server

## Quick Start

### 1. Install Dependencies

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Run setup script for Gemini AI (recommended)
python setup_gemini.py

# Or manually edit .env and add your Gemini API key
# Get your API key from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### 3. Test Gemini Integration (Optional)

```bash
# Test if Gemini AI is working
python test_gemini.py
```

### 3. Run the Server

```bash
# Run with auto-reload
python main.py

# Or with uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- **API**: http://localhost:8000
- **Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/api/health

## API Endpoints

### Health
- `GET /api/health` - Health check

### Folders
- `POST /api/folders` - Create folder
- `GET /api/folders` - List folders
- `GET /api/folders/{id}` - Get folder
- `PUT /api/folders/{id}` - Update folder
- `DELETE /api/folders/{id}` - Delete folder

### Exams
- `POST /api/exams` - Create exam
- `GET /api/exams` - List exams
- `GET /api/exams/{id}` - Get exam (use ?include_answers=true for admin view)
- `PUT /api/exams/{id}` - Update exam
- `DELETE /api/exams/{id}` - Delete exam

### Questions
- `POST /api/exams/{exam_id}/questions` - Add question
- `PUT /api/exams/{exam_id}/questions/{question_id}` - Update question
- `DELETE /api/exams/{exam_id}/questions/{question_id}` - Delete question

### Exam Attempts
- `POST /api/exams/{exam_id}/attempts` - Start exam attempt
- `POST /api/exams/attempts/{attempt_id}/submit` - Submit exam
- `GET /api/exams/attempts/{attempt_id}` - Get attempt results
- `GET /api/exams/{exam_id}/attempts` - List exam attempts

### File Upload
- `POST /api/upload` - Upload file
- `GET /api/upload` - List files
- `GET /api/upload/{id}` - Get file info
- `DELETE /api/upload/{id}` - Delete file

### AI Question Generation
- `POST /api/exams/extract-questions` - Generate questions from uploaded file using Gemini AI
  - Parameters: `file_id`, `question_type` (mcq/true_false/short_answer/essay), `num_questions`, `difficulty` (easy/medium/hard)
  - Supported file types: PDF, DOCX, DOC, TXT
  - AI automatically extracts text and generates relevant questions

### Dashboard
- `GET /api/dashboard` - Get dashboard stats

## Project Structure

```
backend/
├── app/
│   ├── api/              # API endpoints
│   │   ├── exam.py
│   │   ├── folder.py
│   │   ├── upload.py
│   │   ├── dashboard.py
│   │   └── health.py
│   ├── core/             # Core configuration
│   │   └── config.py
│   ├── database/         # Database setup
│   │   └── connection.py
│   ├── models/           # Database models
│   │   ├── base.py
│   │   ├── exam.py
│   │   ├── folder.py
│   │   └── file.py
│   ├── repositories/     # Data access layer
│   │   ├── base.py
│   │   ├── exam.py
│   │   ├── folder.py
│   │   └── file.py
│   ├── schemas/          # Pydantic schemas
│   │   ├── exam.py
│   │   ├── folder.py
│   │   ├── file.py
│   │   └── dashboard.py
│   └── services/         # Business logic
│       ├── exam_service.py
│       ├── folder_service.py
│       ├── upload_service.py
│       └── dashboard_service.py
├── main.py               # Application entry point
├── requirements.txt      # Python dependencies
├── .env.example          # Environment variables example
└── README.md            # This file
```

## Example Usage

### Create an Exam

```bash
curl -X POST "http://localhost:8000/api/exams" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Python Basics Quiz",
    "description": "Test your Python knowledge",
    "duration": 30,
    "total_marks": 10,
    "passing_marks": 6,
    "is_published": true,
    "questions": [
      {
        "question_text": "What is Python?",
        "question_type": "mcq",
        "marks": 2,
        "options": ["A programming language", "A snake", "A framework"],
        "correct_answer": "A programming language"
      }
    ]
  }'
```

### Take an Exam

```bash
# Start attempt
curl -X POST "http://localhost:8000/api/exams/1/attempts" \
  -H "Content-Type: application/json" \
  -d '{
    "student_name": "John Doe",
    "student_email": "john@example.com"
  }'

# Submit answers
curl -X POST "http://localhost:8000/api/exams/attempts/1/submit" \
  -H "Content-Type: application/json" \
  -d '{
    "answers": [
      {
        "question_id": 1,
        "answer_text": "A programming language"
      }
    ]
  }'
```

## Development

### Database

The application uses SQLite by default. The database file (`exam_hub.db`) will be created automatically when you first run the server.

To reset the database, simply delete the `exam_hub.db` file and restart the server.

### Auto-reload

The server runs with auto-reload enabled in development mode. Any code changes will automatically restart the server.

## Notes

- This is a simplified version for demo purposes
- No authentication required - all endpoints are public
- Automatic grading for MCQ and True/False questions
- Manual grading needed for short answer and essay questions (currently gives full marks)
- Uses SQLite for easy setup (no separate database server needed)

## License

MIT
