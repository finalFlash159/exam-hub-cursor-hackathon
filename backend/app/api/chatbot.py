"""Chatbot endpoints"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import os
import google.generativeai as genai
from app.core.config import settings

router = APIRouter()

# Configure Gemini API
if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)
    GEMINI_AVAILABLE = True
else:
    GEMINI_AVAILABLE = False
    print("⚠️  Warning: GEMINI_API_KEY not configured. Chatbot will use fallback responses.")


class Message(BaseModel):
    """Message schema"""
    role: str
    content: str


class ChatbotQuery(BaseModel):
    """Chatbot query schema"""
    message: str
    conversation_history: Optional[List[Message]] = []


class ChatbotResponse(BaseModel):
    """Chatbot response schema"""
    response: str


# CONTEXT.md removed - using Gemini API for intelligent responses


def get_simple_response(question: str) -> str:
    """
    Provide a simple response based on keywords in the question.
    This is a fallback when no AI API is configured.
    """
    question_lower = question.lower()
    
    # Exam creation
    if any(word in question_lower for word in ['create exam', 'make exam', 'new exam', 'add exam']):
        return """To create an exam:

1. **Create a folder** (optional but recommended):
   - POST `/api/folders` with name, description, and color

2. **Create the exam**:
   - POST `/api/exams`
   - Include: title, description, duration, total_marks, passing_marks
   - Set `is_published: false` initially (draft mode)
   - Optionally include questions array

3. **Add questions** (if not included in step 2):
   - POST `/api/exams/{exam_id}/questions`
   - Specify question_type: "mcq", "true_false", "short_answer", or "essay"

4. **Publish the exam**:
   - PUT `/api/exams/{exam_id}` with `{"is_published": true}`

Example:
```json
POST /api/exams
{
  "title": "Math Quiz",
  "duration": 30,
  "total_marks": 10,
  "passing_marks": 6,
  "is_published": false,
  "questions": [
    {
      "question_text": "What is 2+2?",
      "question_type": "mcq",
      "marks": 2,
      "options": ["3", "4", "5"],
      "correct_answer": "4"
    }
  ]
}
```"""

    # Question types
    elif any(word in question_lower for word in ['question type', 'types of question', 'mcq', 'true false']):
        return """Exam Hub supports 4 question types:

1. **MCQ (Multiple Choice)**:
   - Provides multiple options
   - Student selects one answer
   - Automatic grading by exact match
   
2. **True/False**:
   - Simple boolean question
   - Automatic grading
   
3. **Short Answer**:
   - Text-based answer
   - Currently auto-awards full marks (needs manual grading)
   
4. **Essay**:
   - Long-form answer
   - Currently auto-awards full marks (needs manual grading)

Example MCQ:
```json
{
  "question_text": "What is the capital of France?",
  "question_type": "mcq",
  "marks": 1,
  "options": ["London", "Paris", "Berlin"],
  "correct_answer": "Paris"
}
```"""

    # Taking exam
    elif any(word in question_lower for word in ['take exam', 'start exam', 'attempt exam', 'do exam']):
        return """To take an exam:

1. **List available exams**:
   - GET `/api/exams`
   - Look for published exams (`is_published: true`)

2. **Start an attempt**:
   - POST `/api/exams/{exam_id}/attempts`
   - Provide student name and email
   ```json
   {
     "student_name": "John Doe",
     "student_email": "john@example.com"
   }
   ```
   - Note the `attempt_id` from response

3. **Get exam questions**:
   - GET `/api/exams/{exam_id}`
   - Don't use `include_answers=true` (that's for admins)

4. **Submit answers**:
   - POST `/api/exams/attempts/{attempt_id}/submit`
   ```json
   {
     "answers": [
       {"question_id": 1, "answer_text": "Paris"},
       {"question_id": 2, "answer_text": "True"}
     ]
   }
   ```

5. **View results**:
   - Results are returned immediately after submission
   - Check score, percentage, and passed status"""

    # Grading
    elif any(word in question_lower for word in ['grade', 'grading', 'score', 'scoring', 'marks']):
        return """Grading in Exam Hub:

**Auto-grading** (immediate):
- **MCQ**: Case-insensitive exact match with correct_answer
- **True/False**: Case-insensitive exact match

**Manual grading needed**:
- **Short Answer**: Currently gives full marks
- **Essay**: Currently gives full marks

**Score Calculation**:
- Total score = sum of marks_obtained for all answers
- Percentage = (score / total_marks) × 100
- Pass/Fail = percentage >= (passing_marks / total_marks × 100)

**View Results**:
- GET `/api/exams/attempts/{attempt_id}`
- Shows detailed breakdown with `is_correct` and `marks_obtained` per question"""

    # Folders
    elif any(word in question_lower for word in ['folder', 'organize', 'category']):
        return """Folders help organize exams and files:

**Create a folder**:
```json
POST /api/folders
{
  "name": "Mathematics",
  "description": "All math exams",
  "color": "#10B981"
}
```

**Assign exams to folders**:
- When creating: Include `folder_id` in exam creation
- When updating: PUT `/api/exams/{exam_id}` with new `folder_id`

**Upload files to folders**:
- POST `/api/upload?folder_id=1` with file

**Folder operations**:
- GET `/api/folders` - List all folders
- GET `/api/folders/{id}` - Get folder details (includes exam_count, file_count)
- PUT `/api/folders/{id}` - Update folder
- DELETE `/api/folders/{id}` - Delete folder"""

    # API endpoints
    elif any(word in question_lower for word in ['api', 'endpoint', 'route']):
        return """Main API Endpoints (Base: http://localhost:8000):

**Exams**:
- POST `/api/exams` - Create exam
- GET `/api/exams` - List exams
- GET `/api/exams/{id}` - Get exam
- PUT `/api/exams/{id}` - Update exam
- DELETE `/api/exams/{id}` - Delete exam

**Questions**:
- POST `/api/exams/{exam_id}/questions` - Add question
- PUT `/api/exams/{exam_id}/questions/{question_id}` - Update
- DELETE `/api/exams/{exam_id}/questions/{question_id}` - Delete

**Attempts**:
- POST `/api/exams/{exam_id}/attempts` - Start attempt
- POST `/api/exams/attempts/{attempt_id}/submit` - Submit
- GET `/api/exams/attempts/{attempt_id}` - Get results

**Folders**:
- POST `/api/folders` - Create
- GET `/api/folders` - List all
- PUT/DELETE `/api/folders/{id}`

**Files**:
- POST `/api/upload` - Upload file
- GET `/api/upload` - List files

**Other**:
- GET `/api/dashboard` - Statistics
- GET `/api/health` - Health check

📚 Full API docs: http://localhost:8000/docs"""

    # Dashboard/statistics
    elif any(word in question_lower for word in ['dashboard', 'statistics', 'stats', 'analytics']):
        return """Dashboard provides statistics:

GET `/api/dashboard` returns:

**Stats**:
- total_exams (count)
- total_folders
- total_attempts
- total_files
- published_exams
- draft_exams
- completed_attempts
- average_score

**Recent Activity**:
- recent_exams (latest created)
- recent_attempts (latest submitted)

**View specific exam attempts**:
- GET `/api/exams/{exam_id}/attempts` - All attempts for one exam
- GET `/api/exams/attempts/{attempt_id}` - Individual attempt details"""

    # File upload
    elif any(word in question_lower for word in ['upload', 'file', 'document', 'pdf']):
        return """File Upload:

**Upload a file**:
```bash
POST /api/upload?folder_id=1
Content-Type: multipart/form-data
file: [your file]
```

**Supported formats**: PDF, DOCX, TXT, etc.

**Response includes**:
- id, filename, original_filename
- file_path, file_type, file_size
- mime_type, folder_id

**Operations**:
- GET `/api/upload` - List all files
- GET `/api/upload?folder_id=1` - Files in folder
- GET `/api/upload/{id}` - File details
- DELETE `/api/upload/{id}` - Delete file

**Use cases**:
- Upload study materials
- Attach reference documents
- Share supplementary resources"""

    # Error/troubleshooting
    elif any(word in question_lower for word in ['error', 'not working', 'problem', 'issue', 'troubleshoot']):
        return """Common Issues:

**Cannot take exam**:
- Check if exam is published: `is_published: true`
- Publish: PUT `/api/exams/{id}` with `{"is_published": true}`

**Grading incorrect**:
- MCQ/True-False: Ensure exact match (case-insensitive)
- Trim whitespace from answers
- Short answer/essay need manual grading

**Cannot delete exam**:
- Deletion cascades to questions and attempts
- Consider unpublishing instead: `{"is_published": false}`

**File upload fails**:
- Use multipart/form-data
- Check file size limits
- Ensure folder exists if using folder_id

**404 errors**:
- Verify resource ID exists
- Check if exam/folder/file was deleted

**Backend not responding**:
- Ensure server is running: `python main.py`
- Check port 8000 is available
- Visit: http://localhost:8000/docs"""

    # Publishing
    elif any(word in question_lower for word in ['publish', 'unpublish', 'draft']):
        return """Publishing Exams:

**Why publish?**
- Only published exams can be taken by students
- Draft exams are for editing and review

**Publish an exam**:
```json
PUT /api/exams/{exam_id}
{
  "is_published": true
}
```

**Unpublish an exam**:
```json
PUT /api/exams/{exam_id}
{
  "is_published": false
}
```

**Best practice**:
1. Create exam with `is_published: false`
2. Add and review all questions
3. Test exam flow
4. Publish when ready

**Check status**:
- GET `/api/exams/{id}` - Check `is_published` field
- Dashboard shows published_exams vs draft_exams count"""

    # Default response
    else:
        return """I'm here to help with Exam Hub! I can assist with:

🎯 **Exam Management**
- Creating and publishing exams
- Adding/editing questions
- Managing exam settings

📝 **Question Types**
- MCQ (Multiple Choice)
- True/False
- Short Answer
- Essay

✅ **Taking Exams**
- Starting attempts
- Submitting answers
- Viewing results

📁 **Organization**
- Creating folders
- Uploading files
- Organizing content

📊 **Analytics**
- Dashboard statistics
- Exam results
- Performance tracking

🔧 **API Usage**
- Endpoints documentation
- Request/response formats
- Error handling

Ask me specific questions like:
- "How do I create an exam?"
- "What question types are supported?"
- "How does grading work?"
- "How do I upload files?"

Or check the full documentation at /docs"""


async def get_gemini_response(message: str, conversation_history: List[Message]) -> str:
    """
    Get response from Gemini API
    """
    try:
        # Initialize Gemini model
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        # Build system context
        system_context = """You are an AI assistant for Exam Hub, an exam management system. 
You help users with:
- Creating and managing exams
- Understanding question types (MCQ, True/False, Short Answer, Essay)
- Taking exams and viewing results
- Organizing content with folders and files
- API usage and troubleshooting

Key Features:
- Exam Management: Create, publish, update, delete exams
- Questions: Add various question types with automatic grading (MCQ/True-False)
- Exam Attempts: Students can take published exams and get instant results
- Folders: Organize exams and files into folders
- File Upload: Upload study materials (PDF, DOCX, etc.)
- Dashboard: View statistics and recent activity

API Endpoints:
- POST /api/exams - Create exam
- GET /api/exams - List exams
- POST /api/exams/{id}/attempts - Start exam attempt
- POST /api/exams/attempts/{id}/submit - Submit exam
- POST /api/folders - Create folder
- POST /api/upload - Upload file
- GET /api/dashboard - View statistics

Be helpful, concise, and provide practical examples when relevant."""

        # Build conversation history
        chat_messages = []
        for msg in conversation_history[-5:]:  # Last 5 messages for context
            chat_messages.append(f"{msg.role.upper()}: {msg.content}")
        
        # Combine context with current message
        full_prompt = f"{system_context}\n\n"
        if chat_messages:
            full_prompt += "Previous conversation:\n" + "\n".join(chat_messages) + "\n\n"
        full_prompt += f"USER: {message}\n\nASSISTANT:"
        
        # Generate response
        response = model.generate_content(full_prompt)
        
        return response.text
        
    except Exception as e:
        print(f"Gemini API error: {e}")
        raise


@router.post("/query", response_model=ChatbotResponse)
async def chatbot_query(query: ChatbotQuery):
    """
    Handle chatbot queries using Gemini API or fallback to keyword matching
    """
    try:
        if GEMINI_AVAILABLE:
            # Use Gemini API
            response = await get_gemini_response(query.message, query.conversation_history)
        else:
            # Fallback to simple keyword matching
            response = get_simple_response(query.message)
        
        return ChatbotResponse(response=response)
        
    except Exception as e:
        # If Gemini fails, try fallback
        try:
            response = get_simple_response(query.message)
            return ChatbotResponse(response=response)
        except:
            raise HTTPException(
                status_code=500,
                detail=f"Chatbot error: {str(e)}"
            )


@router.get("/context")
async def get_context():
    """
    Get the full CONTEXT.md content
    Useful for debugging or external AI integrations
    """
    return {
        "context": CONTEXT_CONTENT,
        "length": len(CONTEXT_CONTENT),
        "available": bool(CONTEXT_CONTENT)
    }

