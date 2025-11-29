"""Exam related models"""
from sqlalchemy import Column, String, Text, Integer, Float, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.models.base import BaseModel


class Exam(BaseModel):
    """Exam model"""
    __tablename__ = "exams"
    
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    duration = Column(Integer, nullable=True)  # in minutes
    total_marks = Column(Float, default=0.0)
    passing_marks = Column(Float, default=0.0)
    is_published = Column(Boolean, default=False)
    
    # Foreign keys
    folder_id = Column(Integer, ForeignKey("folders.id", ondelete="SET NULL"), nullable=True)
    
    # Relationships
    folder = relationship("Folder", back_populates="exams")
    questions = relationship("Question", back_populates="exam", cascade="all, delete-orphan")
    attempts = relationship("ExamAttempt", back_populates="exam", cascade="all, delete-orphan")


class Question(BaseModel):
    """Question model"""
    __tablename__ = "questions"
    
    exam_id = Column(Integer, ForeignKey("exams.id", ondelete="CASCADE"), nullable=False)
    question_text = Column(Text, nullable=False)
    question_type = Column(String(50), nullable=False)  # mcq, true_false, short_answer, essay
    marks = Column(Float, default=1.0)
    order = Column(Integer, default=0)
    
    # For MCQ questions
    options = Column(JSON, nullable=True)  # List of options for MCQ
    correct_answer = Column(Text, nullable=True)  # Correct answer(s)
    
    # Relationships
    exam = relationship("Exam", back_populates="questions")
    answers = relationship("Answer", back_populates="question", cascade="all, delete-orphan")


class ExamAttempt(BaseModel):
    """Exam attempt model"""
    __tablename__ = "exam_attempts"
    
    exam_id = Column(Integer, ForeignKey("exams.id", ondelete="CASCADE"), nullable=False)
    student_name = Column(String(255), nullable=False)  # No auth, so we store name directly
    student_email = Column(String(255), nullable=True)  # Optional
    
    status = Column(String(50), default="in_progress")  # in_progress, completed, submitted
    score = Column(Float, nullable=True)
    percentage = Column(Float, nullable=True)
    passed = Column(Boolean, nullable=True)
    
    started_at = Column(String(50), nullable=True)
    completed_at = Column(String(50), nullable=True)
    
    # Relationships
    exam = relationship("Exam", back_populates="attempts")
    answers = relationship("Answer", back_populates="attempt", cascade="all, delete-orphan")


class Answer(BaseModel):
    """Student answer model"""
    __tablename__ = "answers"
    
    attempt_id = Column(Integer, ForeignKey("exam_attempts.id", ondelete="CASCADE"), nullable=False)
    question_id = Column(Integer, ForeignKey("questions.id", ondelete="CASCADE"), nullable=False)
    
    answer_text = Column(Text, nullable=True)
    is_correct = Column(Boolean, nullable=True)
    marks_obtained = Column(Float, default=0.0)
    
    # Relationships
    attempt = relationship("ExamAttempt", back_populates="answers")
    question = relationship("Question", back_populates="answers")

