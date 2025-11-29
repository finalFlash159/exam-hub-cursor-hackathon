"""Exam endpoints"""
from typing import List, Union
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.connection import get_db
from app.services.exam_service import ExamService
from app.schemas.exam import (
    ExamCreate, ExamUpdate, ExamResponse, ExamResponsePublic, ExamListResponse,
    QuestionCreate, QuestionUpdate, QuestionResponse,
    ExamAttemptCreate, ExamAttemptSubmit, ExamAttemptResponse, ExamAttemptListResponse
)

router = APIRouter()


# Exam endpoints
@router.post("", response_model=ExamResponse, status_code=201)
async def create_exam(
    exam_data: ExamCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new exam"""
    service = ExamService(db)
    return await service.create_exam(exam_data)


@router.get("", response_model=List[ExamListResponse])
async def get_exams(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: AsyncSession = Depends(get_db)
):
    """Get all exams"""
    service = ExamService(db)
    return await service.get_all_exams(skip, limit)


@router.get("/{exam_id}", response_model=Union[ExamResponse, ExamResponsePublic])
async def get_exam(
    exam_id: int,
    include_answers: bool = Query(False, description="Include correct answers (for admin)"),
    db: AsyncSession = Depends(get_db)
):
    """Get exam by ID"""
    service = ExamService(db)
    return await service.get_exam(exam_id, include_answers)


@router.put("/{exam_id}", response_model=ExamResponse)
async def update_exam(
    exam_id: int,
    exam_data: ExamUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update exam"""
    service = ExamService(db)
    return await service.update_exam(exam_id, exam_data)


@router.delete("/{exam_id}", status_code=204)
async def delete_exam(
    exam_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Delete exam"""
    service = ExamService(db)
    await service.delete_exam(exam_id)
    return None


# Question endpoints
@router.post("/{exam_id}/questions", response_model=QuestionResponse, status_code=201)
async def add_question(
    exam_id: int,
    question_data: QuestionCreate,
    db: AsyncSession = Depends(get_db)
):
    """Add question to exam"""
    service = ExamService(db)
    return await service.add_question(exam_id, question_data)


@router.post("/extract-questions", response_model=List[QuestionCreate])
async def extract_questions_from_file(
    file_id: int,
    question_type: str = Query("mcq", pattern="^(mcq|true_false|short_answer|essay)$"),
    num_questions: int = Query(10, ge=1, le=50),
    difficulty: str = Query("medium", pattern="^(easy|medium|hard)$"),
    db: AsyncSession = Depends(get_db)
):
    """Extract questions from uploaded file using Gemini AI"""
    service = ExamService(db)
    return await service.extract_questions_from_file(file_id, question_type, num_questions, difficulty)


@router.put("/{exam_id}/questions/{question_id}", response_model=QuestionResponse)
async def update_question(
    exam_id: int,
    question_id: int,
    question_data: QuestionUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update question"""
    service = ExamService(db)
    return await service.update_question(question_id, question_data)


@router.delete("/{exam_id}/questions/{question_id}", status_code=204)
async def delete_question(
    exam_id: int,
    question_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Delete question"""
    service = ExamService(db)
    await service.delete_question(question_id)
    return None


# Exam attempt endpoints
@router.post("/{exam_id}/attempts", response_model=ExamAttemptResponse, status_code=201)
async def start_attempt(
    exam_id: int,
    attempt_data: ExamAttemptCreate,
    db: AsyncSession = Depends(get_db)
):
    """Start an exam attempt"""
    service = ExamService(db)
    return await service.start_attempt(exam_id, attempt_data)


@router.post("/attempts/{attempt_id}/submit", response_model=ExamAttemptResponse)
async def submit_attempt(
    attempt_id: int,
    submission: ExamAttemptSubmit,
    db: AsyncSession = Depends(get_db)
):
    """Submit an exam attempt"""
    service = ExamService(db)
    return await service.submit_attempt(attempt_id, submission)


@router.get("/attempts/history", response_model=List[ExamAttemptListResponse])
async def get_user_attempt_history(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: AsyncSession = Depends(get_db)
):
    """Get attempt history for current user (simplified - returns all attempts)"""
    # In a real app, this would filter by user ID from authentication
    service = ExamService(db)

    try:
        # Get all exams first
        exams = await service.get_all_exams(0, 1000)

        if not exams:
            return []  # Return empty list if no exams exist

        # Get all attempts
        all_attempts = []
        for exam in exams:
            try:
                exam_attempts = await service.get_exam_attempts(exam.id, 0, 1000)
                all_attempts.extend(exam_attempts)
            except Exception as e:
                print(f"Error loading attempts for exam {exam.id}: {e}")
                continue

        # Sort by creation date (newest first) and apply pagination
        all_attempts.sort(key=lambda x: x.created_at, reverse=True)
        return all_attempts[skip:skip + limit]
    except Exception as e:
        print(f"Error in get_user_attempt_history: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to load attempt history: {str(e)}"
        )


@router.get("/attempts/{attempt_id}", response_model=ExamAttemptResponse)
async def get_attempt(
    attempt_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get exam attempt by ID"""
    service = ExamService(db)
    return await service.get_attempt(attempt_id)


@router.get("/{exam_id}/attempts", response_model=List[ExamAttemptListResponse])
async def get_exam_attempts(
    exam_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: AsyncSession = Depends(get_db)
):
    """Get all attempts for an exam"""
    service = ExamService(db)
    return await service.get_exam_attempts(exam_id, skip, limit)