"""Gemini AI service for question generation"""
import google.generativeai as genai
from typing import List, Dict, Any
import json
from pathlib import Path

from app.core.config import settings
from app.schemas.exam import QuestionCreate


class GeminiService:
    """Service for interacting with Google Gemini AI"""

    def __init__(self):
        if not settings.GENAI_ENABLED or not settings.GEMINI_API_KEY:
            raise ValueError("Gemini AI is not configured. Please set GEMINI_API_KEY environment variable.")

        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel(settings.GEMINI_MODEL)

    async def extract_text_from_file(self, file_path: str) -> str:
        """Extract text content from various file types"""
        file_path_obj = Path(file_path)

        if not file_path_obj.exists():
            raise FileNotFoundError(f"File not found: {file_path}")

        file_extension = file_path_obj.suffix.lower()

        try:
            if file_extension == '.pdf':
                import PyPDF2
                with open(file_path, 'rb') as file:
                    pdf_reader = PyPDF2.PdfReader(file)
                    text = ""
                    for page in pdf_reader.pages:
                        text += page.extract_text() + "\n"
                    return text

            elif file_extension in ['.docx', '.doc']:
                from docx import Document
                doc = Document(file_path)
                text = ""
                for paragraph in doc.paragraphs:
                    text += paragraph.text + "\n"
                return text

            elif file_extension == '.txt':
                with open(file_path, 'r', encoding='utf-8') as file:
                    return file.read()

            else:
                # For unsupported formats, return filename
                return f"Content from file: {file_path_obj.name}"

        except Exception as e:
            print(f"Error extracting text from {file_path}: {e}")
            return f"Content from file: {file_path_obj.name}"

    async def generate_questions_from_text(
        self,
        text: str,
        question_type: str,
        num_questions: int,
        difficulty: str = "medium"
    ) -> List[QuestionCreate]:
        """Generate questions from text using Gemini AI"""

        # Create prompt based on question type
        type_instructions = {
            "mcq": """
            Tạo câu hỏi trắc nghiệm (Multiple Choice Questions) với 4 phương án A, B, C, D.
            Mỗi câu hỏi phải có:
            - question_text: Nội dung câu hỏi
            - options: Mảng 4 phương án ["A. ...", "B. ...", "C. ...", "D. ..."]
            - correct_answer: Phương án đúng (A, B, C, hoặc D)
            - explanation: Giải thích tại sao đáp án đó đúng
            """,
            "true_false": """
            Tạo câu hỏi đúng/sai (True/False).
            Mỗi câu hỏi phải có:
            - question_text: Phát biểu cần xác định đúng/sai
            - options: ["Đúng", "Sai"]
            - correct_answer: "Đúng" hoặc "Sai"
            - explanation: Giải thích tại sao đúng hoặc sai
            """,
            "short_answer": """
            Tạo câu hỏi trả lời ngắn.
            Mỗi câu hỏi phải có:
            - question_text: Câu hỏi
            - correct_answer: Đáp án ngắn gọn
            - explanation: Giải thích đáp án
            """,
            "essay": """
            Tạo câu hỏi tự luận.
            Mỗi câu hỏi phải có:
            - question_text: Câu hỏi mở rộng
            - explanation: Hướng dẫn chấm điểm hoặc gợi ý
            """
        }

        prompt = f"""
        Dựa trên nội dung sau, hãy tạo {num_questions} câu hỏi loại {question_type} bằng tiếng Việt.
        Độ khó: {difficulty}

        {type_instructions.get(question_type, "")}

        Yêu cầu:
        - Câu hỏi phải liên quan trực tiếp đến nội dung được cung cấp
        - Đảm bảo câu hỏi có chất lượng cao và kiểm tra kiến thức thực sự
        - Trả về dưới dạng JSON array với cấu trúc chính xác cho từng câu hỏi
        - marks: {1 if question_type in ['mcq', 'true_false'] else 2 if question_type == 'short_answer' else 5}

        Nội dung để tạo câu hỏi:
        {text[:4000]}  # Limit text length for API

        Trả về JSON array với format:
        [
            {{
                "question_text": "...",
                "question_type": "{question_type}",
                "marks": {1 if question_type in ['mcq', 'true_false'] else 2 if question_type == 'short_answer' else 5},
                "difficulty": "{difficulty}",
                "options": {["A. ...", "B. ...", "C. ...", "D. ..."] if question_type == "mcq" else ["Đúng", "Sai"] if question_type == "true_false" else None},
                "correct_answer": "...",
                "explanation": "..."
            }}
        ]
        """

        try:
            response = await self.model.generate_content_async(prompt)

            # Parse JSON response
            response_text = response.text.strip()

            # Remove markdown code blocks if present
            if response_text.startswith("```json"):
                response_text = response_text[7:]
            if response_text.endswith("```"):
                response_text = response_text[:-3]

            response_text = response_text.strip()

            # Parse JSON
            questions_data = json.loads(response_text)

            # Convert to QuestionCreate objects
            questions = []
            for q_data in questions_data[:num_questions]:  # Limit to requested number
                try:
                    question = QuestionCreate(**q_data)
                    questions.append(question)
                except Exception as e:
                    print(f"Error parsing question: {e}")
                    continue

            return questions

        except Exception as e:
            print(f"Error generating questions with Gemini: {e}")
            # Fallback to mock questions if AI fails
            return self._generate_mock_questions(question_type, num_questions, difficulty, text[:100])

    def _generate_mock_questions(self, question_type: str, num_questions: int, difficulty: str, text_preview: str) -> List[QuestionCreate]:
        """Generate mock questions as fallback"""
        questions = []

        for i in range(num_questions):
            if question_type == "mcq":
                question = QuestionCreate(
                    question_text=f"Câu hỏi trắc nghiệm {i+1} từ nội dung: {text_preview}...",
                    question_type="mcq",
                    marks=1.0,
                    difficulty=difficulty,
                    options=[f"A. Phương án A cho câu {i+1}", f"B. Phương án B cho câu {i+1}",
                            f"C. Phương án C cho câu {i+1}", f"D. Phương án D cho câu {i+1}"],
                    correct_answer="A",
                    explanation=f"Giải thích cho câu hỏi {i+1}"
                )
            elif question_type == "true_false":
                question = QuestionCreate(
                    question_text=f"Phát biểu {i+1}: {text_preview[:50]}... là đúng hay sai?",
                    question_type="true_false",
                    marks=1.0,
                    difficulty=difficulty,
                    options=["Đúng", "Sai"],
                    correct_answer="Đúng",
                    explanation=f"Giải thích tại sao phát biểu {i+1} là đúng"
                )
            elif question_type == "short_answer":
                question = QuestionCreate(
                    question_text=f"Trả lời ngắn: {text_preview[:50]}... ?",
                    question_type="short_answer",
                    marks=2.0,
                    difficulty=difficulty,
                    correct_answer=f"Đáp án cho câu hỏi {i+1}",
                    explanation=f"Giải thích đáp án cho câu hỏi {i+1}"
                )
            elif question_type == "essay":
                question = QuestionCreate(
                    question_text=f"Thảo luận về: {text_preview[:50]}...",
                    question_type="essay",
                    marks=5.0,
                    difficulty=difficulty,
                    explanation=f"Hướng dẫn chấm điểm cho bài tự luận {i+1}"
                )
            else:
                continue

            questions.append(question)

        return questions
