"""Exam schemas"""
from pydantic import BaseModel, Field
from typing import Optional, List, Any
from datetime import datetime


# Question Schemas
class QuestionBase(BaseModel):
    """Base question schema"""
    question_text: str = Field(..., min_length=1)
    question_type: str = Field(..., pattern="^(mcq|true_false|short_answer|essay)$")
    marks: float = Field(default=1.0, ge=0)
    order: int = Field(default=0, ge=0)
    options: Optional[List[str]] = None
    correct_answer: Optional[str] = None


class QuestionCreate(QuestionBase):
    """Schema for creating a question"""
    pass


class QuestionUpdate(BaseModel):
    """Schema for updating a question"""
    question_text: Optional[str] = Field(None, min_length=1)
    question_type: Optional[str] = Field(None, pattern="^(mcq|true_false|short_answer|essay)$")
    marks: Optional[float] = Field(None, ge=0)
    order: Optional[int] = Field(None, ge=0)
    options: Optional[List[str]] = None
    correct_answer: Optional[str] = None


class QuestionResponse(QuestionBase):
    """Schema for question response"""
    id: int
    exam_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class QuestionResponsePublic(BaseModel):
    """Schema for question response (without correct answers)"""
    id: int
    exam_id: int
    question_text: str
    question_type: str
    marks: float
    order: int
    options: Optional[List[str]] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


# Exam Schemas
class ExamBase(BaseModel):
    """Base exam schema"""
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    duration: Optional[int] = Field(None, ge=1)  # in minutes
    total_marks: float = Field(default=0.0, ge=0)
    passing_marks: float = Field(default=0.0, ge=0)
    is_published: bool = False
    folder_id: Optional[int] = None


class ExamCreate(ExamBase):
    """Schema for creating an exam"""
    questions: Optional[List[QuestionCreate]] = []


class ExamUpdate(BaseModel):
    """Schema for updating an exam"""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    duration: Optional[int] = Field(None, ge=1)
    total_marks: Optional[float] = Field(None, ge=0)
    passing_marks: Optional[float] = Field(None, ge=0)
    is_published: Optional[bool] = None
    folder_id: Optional[int] = None


class ExamResponse(ExamBase):
    """Schema for exam response"""
    id: int
    created_at: datetime
    updated_at: datetime
    questions: List[QuestionResponse] = []
    
    class Config:
        from_attributes = True


class ExamResponsePublic(BaseModel):
    """Schema for exam response (public view, without answers)"""
    id: int
    title: str
    description: Optional[str]
    duration: Optional[int]
    total_marks: float
    passing_marks: float
    is_published: bool
    folder_id: Optional[int]
    created_at: datetime
    questions: List[QuestionResponsePublic] = []
    
    class Config:
        from_attributes = True


class ExamListResponse(BaseModel):
    """Schema for exam list response"""
    id: int
    title: str
    description: Optional[str]
    duration: Optional[int]
    total_marks: float
    is_published: bool
    folder_id: Optional[int]
    question_count: int = 0
    attempt_count: int = 0
    created_at: datetime
    
    class Config:
        from_attributes = True


# Answer Schemas
class AnswerSubmit(BaseModel):
    """Schema for submitting an answer"""
    question_id: int
    answer_text: str


class AnswerResponse(BaseModel):
    """Schema for answer response"""
    id: int
    question_id: int
    answer_text: Optional[str]
    is_correct: Optional[bool]
    marks_obtained: float
    
    class Config:
        from_attributes = True


# Exam Attempt Schemas
class ExamAttemptCreate(BaseModel):
    """Schema for creating an exam attempt"""
    student_name: str = Field(..., min_length=1, max_length=255)
    student_email: Optional[str] = None


class ExamAttemptSubmit(BaseModel):
    """Schema for submitting an exam attempt"""
    answers: List[AnswerSubmit]


class ExamAttemptResponse(BaseModel):
    """Schema for exam attempt response"""
    id: int
    exam_id: int
    student_name: str
    student_email: Optional[str]
    status: str
    score: Optional[float]
    percentage: Optional[float]
    passed: Optional[bool]
    started_at: Optional[str]
    completed_at: Optional[str]
    created_at: datetime
    answers: List[AnswerResponse] = []
    
    class Config:
        from_attributes = True


class ExamAttemptListResponse(BaseModel):
    """Schema for exam attempt list response"""
    id: int
    exam_id: int
    student_name: str
    status: str
    score: Optional[float]
    percentage: Optional[float]
    passed: Optional[bool]
    created_at: datetime
    
    class Config:
        from_attributes = True

