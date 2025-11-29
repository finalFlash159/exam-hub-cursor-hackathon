"""Dashboard service"""
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.exam import Exam, ExamAttempt
from app.models.folder import Folder
from app.models.file import File
from app.schemas.dashboard import DashboardStats, DashboardResponse
from app.schemas.exam import ExamListResponse, ExamAttemptListResponse


class DashboardService:
    """Dashboard service"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def get_dashboard_stats(self) -> DashboardResponse:
        """Get dashboard statistics"""
        # Count exams
        total_exams_result = await self.db.execute(select(func.count(Exam.id)))
        total_exams = total_exams_result.scalar() or 0
        
        # Count published exams
        published_exams_result = await self.db.execute(
            select(func.count(Exam.id)).where(Exam.is_published == True)
        )
        published_exams = published_exams_result.scalar() or 0
        
        # Count draft exams
        draft_exams = total_exams - published_exams
        
        # Count folders
        total_folders_result = await self.db.execute(select(func.count(Folder.id)))
        total_folders = total_folders_result.scalar() or 0
        
        # Count files
        total_files_result = await self.db.execute(select(func.count(File.id)))
        total_files = total_files_result.scalar() or 0
        
        # Count attempts
        total_attempts_result = await self.db.execute(select(func.count(ExamAttempt.id)))
        total_attempts = total_attempts_result.scalar() or 0
        
        # Count completed attempts
        completed_attempts_result = await self.db.execute(
            select(func.count(ExamAttempt.id)).where(ExamAttempt.status == "completed")
        )
        completed_attempts = completed_attempts_result.scalar() or 0
        
        # Calculate average score
        avg_score_result = await self.db.execute(
            select(func.avg(ExamAttempt.percentage)).where(ExamAttempt.status == "completed")
        )
        average_score = avg_score_result.scalar() or 0.0
        
        stats = DashboardStats(
            total_exams=total_exams,
            total_folders=total_folders,
            total_attempts=total_attempts,
            total_files=total_files,
            published_exams=published_exams,
            draft_exams=draft_exams,
            completed_attempts=completed_attempts,
            average_score=round(average_score, 2)
        )
        
        # Get recent exams
        recent_exams_result = await self.db.execute(
            select(Exam).order_by(Exam.created_at.desc()).limit(5)
        )
        recent_exams = recent_exams_result.scalars().all()
        
        # Get recent attempts
        recent_attempts_result = await self.db.execute(
            select(ExamAttempt).order_by(ExamAttempt.created_at.desc()).limit(5)
        )
        recent_attempts = recent_attempts_result.scalars().all()
        
        return DashboardResponse(
            stats=stats,
            recent_exams=[ExamListResponse(**e.__dict__, question_count=0, attempt_count=0) for e in recent_exams],
            recent_attempts=[ExamAttemptListResponse(**a.__dict__) for a in recent_attempts]
        )

