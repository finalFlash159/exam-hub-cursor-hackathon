"""Exam repository"""
from typing import List, Optional
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.exam import Exam, Question, ExamAttempt, Answer
from app.repositories.base import BaseRepository


class ExamRepository(BaseRepository[Exam]):
    """Exam repository"""
    
    def __init__(self, db: AsyncSession):
        super().__init__(Exam, db)
    
    async def get_by_id_with_questions(self, id: int) -> Optional[Exam]:
        """Get exam by ID with questions"""
        result = await self.db.execute(
            select(self.model)
            .options(selectinload(self.model.questions))
            .where(self.model.id == id)
        )
        return result.scalar_one_or_none()
    
    async def get_all_with_counts(self, skip: int = 0, limit: int = 100) -> List[dict]:
        """Get all exams with question and attempt counts"""
        exams = await self.get_all(skip, limit)
        
        result = []
        for exam in exams:
            # Count questions
            question_count_result = await self.db.execute(
                select(func.count(Question.id)).where(Question.exam_id == exam.id)
            )
            question_count = question_count_result.scalar() or 0
            
            # Count attempts
            attempt_count_result = await self.db.execute(
                select(func.count(ExamAttempt.id)).where(ExamAttempt.exam_id == exam.id)
            )
            attempt_count = attempt_count_result.scalar() or 0
            
            result.append({
                "exam": exam,
                "question_count": question_count,
                "attempt_count": attempt_count
            })
        
        return result
    
    async def get_by_folder(self, folder_id: Optional[int], skip: int = 0, limit: int = 100) -> List[Exam]:
        """Get exams by folder"""
        query = select(self.model)
        if folder_id:
            query = query.where(self.model.folder_id == folder_id)
        
        result = await self.db.execute(query.offset(skip).limit(limit))
        return result.scalars().all()


class QuestionRepository(BaseRepository[Question]):
    """Question repository"""
    
    def __init__(self, db: AsyncSession):
        super().__init__(Question, db)
    
    async def get_by_exam(self, exam_id: int) -> List[Question]:
        """Get questions by exam ID"""
        result = await self.db.execute(
            select(self.model)
            .where(self.model.exam_id == exam_id)
            .order_by(self.model.order)
        )
        return result.scalars().all()


class ExamAttemptRepository(BaseRepository[ExamAttempt]):
    """Exam attempt repository"""
    
    def __init__(self, db: AsyncSession):
        super().__init__(ExamAttempt, db)
    
    async def get_by_id_with_answers(self, id: int) -> Optional[ExamAttempt]:
        """Get exam attempt by ID with answers"""
        result = await self.db.execute(
            select(self.model)
            .options(selectinload(self.model.answers))
            .where(self.model.id == id)
        )
        return result.scalar_one_or_none()
    
    async def get_by_exam(self, exam_id: int, skip: int = 0, limit: int = 100) -> List[ExamAttempt]:
        """Get attempts by exam ID"""
        result = await self.db.execute(
            select(self.model)
            .where(self.model.exam_id == exam_id)
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()


class AnswerRepository(BaseRepository[Answer]):
    """Answer repository"""
    
    def __init__(self, db: AsyncSession):
        super().__init__(Answer, db)
    
    async def get_by_attempt(self, attempt_id: int) -> List[Answer]:
        """Get answers by attempt ID"""
        result = await self.db.execute(
            select(self.model).where(self.model.attempt_id == attempt_id)
        )
        return result.scalars().all()

