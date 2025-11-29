"""Upload service"""
import os
import uuid
from typing import Optional
from pathlib import Path
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import UploadFile, HTTPException, status

from app.models.file import File
from app.repositories.file import FileRepository
from app.schemas.file import FileResponse
from app.core.config import settings


class UploadService:
    """Upload service"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repository = FileRepository(db)
        self.upload_dir = Path(settings.UPLOAD_DIR)
        self.upload_dir.mkdir(parents=True, exist_ok=True)
    
    async def upload_file(self, file: UploadFile, folder_id: Optional[int] = None) -> FileResponse:
        """Upload a file"""
        # Validate file size
        contents = await file.read()
        file_size = len(contents)
        
        if file_size > settings.MAX_UPLOAD_SIZE:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"File size exceeds maximum allowed size of {settings.MAX_UPLOAD_SIZE} bytes"
            )
        
        # Validate file extension
        file_ext = file.filename.split(".")[-1].lower() if "." in file.filename else ""
        if file_ext not in settings.ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File type not allowed. Allowed types: {', '.join(settings.ALLOWED_EXTENSIONS)}"
            )
        
        # Generate unique filename
        unique_filename = f"{uuid.uuid4()}.{file_ext}"
        file_path = self.upload_dir / unique_filename
        
        # Save file
        with open(file_path, "wb") as f:
            f.write(contents)
        
        # Save to database
        file_obj = File(
            filename=unique_filename,
            original_filename=file.filename,
            file_path=str(file_path),
            file_type=file_ext,
            file_size=file_size,
            mime_type=file.content_type,
            folder_id=folder_id
        )
        file_obj = await self.repository.create(file_obj)
        
        return FileResponse(**file_obj.__dict__)
    
    async def get_file(self, file_id: int) -> FileResponse:
        """Get file by ID"""
        file_obj = await self.repository.get_by_id(file_id)
        if not file_obj:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="File not found"
            )
        
        return FileResponse(**file_obj.__dict__)
    
    async def get_files_by_folder(self, folder_id: Optional[int], skip: int = 0, limit: int = 100) -> list[FileResponse]:
        """Get files by folder"""
        files = await self.repository.get_by_folder(folder_id, skip, limit)
        return [FileResponse(**f.__dict__) for f in files]
    
    async def delete_file(self, file_id: int) -> bool:
        """Delete file"""
        file_obj = await self.repository.get_by_id(file_id)
        if not file_obj:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="File not found"
            )
        
        # Delete physical file
        try:
            if os.path.exists(file_obj.file_path):
                os.remove(file_obj.file_path)
        except Exception as e:
            print(f"Error deleting file: {e}")
        
        # Delete from database
        return await self.repository.delete(file_id)

