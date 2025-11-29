# AI Question Generation Setup

This guide will help you set up and use AI-powered question generation using Google Gemini.

## Quick Setup

1. **Install dependencies:**
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

2. **Configure Gemini API:**
   ```bash
   python setup_gemini.py
   ```
   Follow the prompts to enter your Gemini API key.

3. **Test the setup:**
   ```bash
   python test_gemini.py
   ```

4. **Run the server:**
   ```bash
   python main.py
   ```

## How AI Question Generation Works

### Supported Question Types

1. **Multiple Choice (mcq)**: 4 options A, B, C, D
2. **True/False**: Binary choice questions
3. **Short Answer**: Questions requiring brief text responses
4. **Essay**: Long-form questions for detailed responses

### Supported File Types

- **PDF**: Text extraction from PDF documents
- **DOCX/DOC**: Microsoft Word documents
- **TXT**: Plain text files
- **Other**: Fallback to basic processing

### Difficulty Levels

- **Easy**: Basic concepts, straightforward questions
- **Medium**: Moderate complexity, requires understanding
- **Hard**: Advanced concepts, analytical thinking

## API Usage

### Generate Questions from File

```bash
curl -X POST "http://localhost:8000/api/exams/extract-questions" \
  -H "Content-Type: application/json" \
  -d '{
    "file_id": 1,
    "question_type": "mcq",
    "num_questions": 10,
    "difficulty": "medium"
  }'
```

### Frontend Usage

1. Upload a file using `/api/upload`
2. Use the returned `file.id` to generate questions
3. Questions are automatically created and can be added to exams

## Troubleshooting

### API Key Issues
- Make sure your Gemini API key is valid
- Check your Google Cloud project quotas
- Verify the API key has Gemini API access

### File Processing Issues
- Ensure files contain readable text
- Check file size limits (10MB default)
- Supported formats: PDF, DOCX, DOC, TXT

### Network Issues
- Ensure stable internet connection
- Check firewall/proxy settings
- Gemini API requires external access

## Example Workflow

1. **Upload material**: User uploads a PDF study guide
2. **AI processing**: System extracts text from PDF
3. **Question generation**: Gemini creates 10 multiple choice questions
4. **Review & edit**: User can review and modify generated questions
5. **Create exam**: Questions are added to the exam

## Cost Considerations

- Gemini API has usage costs based on tokens processed
- Monitor your usage in Google Cloud Console
- Free tier available for testing

## Advanced Configuration

Edit `app/core/config.py` to customize:

```python
class Settings(BaseSettings):
    GEMINI_MODEL: str = "gemini-1.5-flash"  # or "gemini-1.5-pro"
    GENAI_ENABLED: bool = True
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10MB
```
