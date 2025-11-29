"""Exam service"""
from typing import List
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from app.models.exam import Exam, Question, ExamAttempt, Answer
from app.repositories.exam import ExamRepository, QuestionRepository, ExamAttemptRepository, AnswerRepository
from app.schemas.exam import (
    ExamCreate, ExamUpdate, ExamResponse, ExamResponsePublic, ExamListResponse,
    QuestionCreate, QuestionUpdate, QuestionResponse,
    ExamAttemptCreate, ExamAttemptSubmit, ExamAttemptResponse, ExamAttemptListResponse
)


class ExamService:
    """Exam service"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
        self.exam_repo = ExamRepository(db)
        self.question_repo = QuestionRepository(db)
        self.attempt_repo = ExamAttemptRepository(db)
        self.answer_repo = AnswerRepository(db)
    
    async def create_exam(self, exam_data: ExamCreate) -> ExamResponse:
        """Create a new exam"""
        # Create exam
        exam_dict = exam_data.model_dump(exclude={"questions"})
        exam = Exam(**exam_dict)
        exam = await self.exam_repo.create(exam)
        
        # Create questions if provided
        questions = []
        if exam_data.questions:
            for idx, question_data in enumerate(exam_data.questions):
                question_dict = question_data.model_dump()
                question_dict["exam_id"] = exam.id
                question_dict["order"] = idx
                question = Question(**question_dict)
                question = await self.question_repo.create(question)
                questions.append(question)
        
        # Return response
        exam_dict = exam.__dict__
        exam_dict["questions"] = [QuestionResponse(**q.__dict__) for q in questions]
        return ExamResponse(**exam_dict)
    
    async def get_exam(self, exam_id: int, include_answers: bool = False) -> ExamResponse | ExamResponsePublic:
        """Get exam by ID"""
        exam = await self.exam_repo.get_by_id_with_questions(exam_id)
        if not exam:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Exam not found"
            )
        
        if include_answers:
            return ExamResponse(**exam.__dict__)
        else:
            # Return public version without answers
            exam_dict = {
                "id": exam.id,
                "title": exam.title,
                "description": exam.description,
                "duration": exam.duration,
                "total_marks": exam.total_marks,
                "passing_marks": exam.passing_marks,
                "is_published": exam.is_published,
                "folder_id": exam.folder_id,
                "created_at": exam.created_at,
                "questions": [
                    {
                        "id": q.id,
                        "exam_id": q.exam_id,
                        "question_text": q.question_text,
                        "question_type": q.question_type,
                        "marks": q.marks,
                        "order": q.order,
                        "options": q.options,
                        "created_at": q.created_at
                    }
                    for q in exam.questions
                ]
            }
            return ExamResponsePublic(**exam_dict)
    
    async def get_all_exams(self, skip: int = 0, limit: int = 100) -> List[ExamListResponse]:
        """Get all exams"""
        exams_with_counts = await self.exam_repo.get_all_with_counts(skip, limit)
        
        return [
            ExamListResponse(
                **e["exam"].__dict__,
                question_count=e["question_count"],
                attempt_count=e["attempt_count"]
            )
            for e in exams_with_counts
        ]
    
    async def update_exam(self, exam_id: int, exam_data: ExamUpdate) -> ExamResponse:
        """Update exam"""
        exam = await self.exam_repo.get_by_id(exam_id)
        if not exam:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Exam not found"
            )
        
        # Update fields
        update_data = exam_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(exam, key, value)
        
        exam = await self.exam_repo.update(exam)
        return await self.get_exam(exam_id, include_answers=True)
    
    async def delete_exam(self, exam_id: int) -> bool:
        """Delete exam"""
        exam = await self.exam_repo.get_by_id(exam_id)
        if not exam:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Exam not found"
            )
        
        return await self.exam_repo.delete(exam_id)
    
    # Question operations
    async def add_question(self, exam_id: int, question_data: QuestionCreate) -> QuestionResponse:
        """Add question to exam"""
        exam = await self.exam_repo.get_by_id(exam_id)
        if not exam:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Exam not found"
            )
        
        question_dict = question_data.model_dump()
        question_dict["exam_id"] = exam_id
        question = Question(**question_dict)
        question = await self.question_repo.create(question)
        
        return QuestionResponse(**question.__dict__)
    
    async def update_question(self, question_id: int, question_data: QuestionUpdate) -> QuestionResponse:
        """Update question"""
        question = await self.question_repo.get_by_id(question_id)
        if not question:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Question not found"
            )
        
        update_data = question_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(question, key, value)
        
        question = await self.question_repo.update(question)
        return QuestionResponse(**question.__dict__)
    
    async def delete_question(self, question_id: int) -> bool:
        """Delete question"""
        question = await self.question_repo.get_by_id(question_id)
        if not question:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Question not found"
            )
        
        return await self.question_repo.delete(question_id)
    
    # Exam attempt operations
    async def start_attempt(self, exam_id: int, attempt_data: ExamAttemptCreate) -> ExamAttemptResponse:
        """Start an exam attempt"""
        exam = await self.exam_repo.get_by_id(exam_id)
        if not exam:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Exam not found"
            )
        
        if not exam.is_published:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Exam is not published"
            )
        
        attempt_dict = attempt_data.model_dump()
        attempt_dict["exam_id"] = exam_id
        attempt_dict["status"] = "in_progress"
        attempt_dict["started_at"] = datetime.utcnow().isoformat()
        
        attempt = ExamAttempt(**attempt_dict)
        attempt = await self.attempt_repo.create(attempt)
        
        return ExamAttemptResponse(**attempt.__dict__, answers=[])
    
    async def submit_attempt(self, attempt_id: int, submission: ExamAttemptSubmit) -> ExamAttemptResponse:
        """Submit an exam attempt"""
        attempt = await self.attempt_repo.get_by_id(attempt_id)
        if not attempt:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Attempt not found"
            )
        
        if attempt.status == "completed":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Attempt already completed"
            )
        
        # Get exam with questions
        exam = await self.exam_repo.get_by_id_with_questions(attempt.exam_id)
        
        # Grade the submission
        total_score = 0.0
        answers = []
        
        for answer_data in submission.answers:
            question = next((q for q in exam.questions if q.id == answer_data.question_id), None)
            if not question:
                continue
            
            # Check if answer is correct (simple matching for now)
            is_correct = False
            marks_obtained = 0.0
            
            if question.correct_answer and answer_data.answer_text:
                if question.question_type == "mcq" or question.question_type == "true_false":
                    is_correct = answer_data.answer_text.strip().lower() == question.correct_answer.strip().lower()
                    marks_obtained = question.marks if is_correct else 0.0
                else:
                    # For short answer and essay, we can't auto-grade, give full marks for now
                    is_correct = True
                    marks_obtained = question.marks
            
            total_score += marks_obtained
            
            # Save answer
            answer = Answer(
                attempt_id=attempt_id,
                question_id=answer_data.question_id,
                answer_text=answer_data.answer_text,
                is_correct=is_correct,
                marks_obtained=marks_obtained
            )
            answer = await self.answer_repo.create(answer)
            answers.append(answer)
        
        # Update attempt
        attempt.status = "completed"
        attempt.score = total_score
        attempt.percentage = (total_score / exam.total_marks * 100) if exam.total_marks > 0 else 0
        attempt.passed = attempt.percentage >= (exam.passing_marks / exam.total_marks * 100) if exam.total_marks > 0 else False
        attempt.completed_at = datetime.utcnow().isoformat()
        
        attempt = await self.attempt_repo.update(attempt)
        
        # Get attempt with answers
        attempt = await self.attempt_repo.get_by_id_with_answers(attempt_id)
        return ExamAttemptResponse(**attempt.__dict__)
    
    async def get_attempt(self, attempt_id: int) -> ExamAttemptResponse:
        """Get exam attempt by ID"""
        attempt = await self.attempt_repo.get_by_id_with_answers(attempt_id)
        if not attempt:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Attempt not found"
            )
        
        return ExamAttemptResponse(**attempt.__dict__)
    
    async def get_exam_attempts(self, exam_id: int, skip: int = 0, limit: int = 100) -> List[ExamAttemptListResponse]:
        """Get all attempts for an exam"""
        attempts = await self.attempt_repo.get_by_exam(exam_id, skip, limit)
        return [ExamAttemptListResponse(**a.__dict__) for a in attempts]

