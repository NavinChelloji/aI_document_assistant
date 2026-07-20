from typing import List
from fastapi import APIRouter, Depends, UploadFile, File, Form, status, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.documents.schema import DocumentResponse
from app.api.documents.service import upload_document, get_documents, get_document, delete_document_service
from app.database.models.user import User
from app.database.session import get_db_session
from app.security.auth_dependency import get_current_user

router = APIRouter()

@router.post("/upload", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def upload_document_route(
    background_tasks: BackgroundTasks,
    workspace_id: int = Form(...),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    return await upload_document(db, workspace_id, current_user.id, file, background_tasks)

@router.get("/workspace/{workspace_id}", response_model=List[DocumentResponse])
async def list_documents(
    workspace_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    return await get_documents(db, workspace_id, current_user.id)

@router.get("/{document_id}", response_model=DocumentResponse)
async def read_document(
    document_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    return await get_document(db, document_id, current_user.id)

@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_document_route(
    document_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    await delete_document_service(db, document_id, current_user.id)
