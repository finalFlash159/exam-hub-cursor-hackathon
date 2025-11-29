"""Dashboard schemas"""
from pydantic import BaseModel
from typing import List, Dict, Any


class DashboardStats(BaseModel):
    """Dashboard statistics"""
    total_exams: int = 0
    total_folders: int = 0
    total_attempts: int = 0
    total_files: int = 0
    published_exams: int = 0
    draft_exams: int = 0
    completed_attempts: int = 0
    average_score: float = 0.0


class DashboardResponse(BaseModel):
    """Dashboard response"""
    stats: DashboardStats
    recent_exams: List[Any] = []
    recent_attempts: List[Any] = []

