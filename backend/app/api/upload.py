"""Upload endpoints"""
from typing import List, Optional
from fastapi import APIRouter, Depends, UploadFile, File, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.connection import get_db
from app.services.upload_service import UploadService
from app.schemas.file import FileResponse, FileUploadResponse

router = APIRouter()


@router.post("", response_model=FileUploadResponse, status_code=201)
async def upload_file(
    file: UploadFile = File(...),
    folder_id: Optional[int] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    """Upload a file"""
    service = UploadService(db)
    file_response = await service.upload_file(file, folder_id)
    return FileUploadResponse(
        message="File uploaded successfully",
        file=file_response
    )


@router.get("", response_model=List[FileResponse])
async def get_files(
    folder_id: Optional[int] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: AsyncSession = Depends(get_db)
):
    """Get files by folder"""
    service = UploadService(db)
    return await service.get_files_by_folder(folder_id, skip, limit)


@router.get("/{file_id}", response_model=FileResponse)
async def get_file(
    file_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get file by ID"""
    service = UploadService(db)
    return await service.get_file(file_id)


@router.delete("/{file_id}", status_code=204)
async def delete_file(
    file_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Delete file"""
    service = UploadService(db)
    await service.delete_file(file_id)
    return None

