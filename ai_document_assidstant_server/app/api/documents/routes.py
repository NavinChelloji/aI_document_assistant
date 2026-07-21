from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, UploadFile, File, Form, status, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.documents.schema import DocumentResponse
from app.api.documents.service import upload_document, get_documents, get_document, delete_document_service, get_all_documents
from app.database.models.user import User
from app.database.session import get_db_session
from app.security.auth_dependency import get_current_user
from app.utils.response import success_response, StandardResponse

router = APIRouter()

@router.post("/upload", response_model=StandardResponse[DocumentResponse], status_code=status.HTTP_201_CREATED)
async def upload_document_route(
    background_tasks: BackgroundTasks,
    workspace_id: UUID = Form(...),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    document = await upload_document(db, workspace_id, current_user.id, file, background_tasks)
    return success_response(data=document, message="Document uploaded successfully")

@router.get("/all", response_model=StandardResponse[List[DocumentResponse]])
async def list_all_documents(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    """Return all documents across all workspaces owned by the current user."""
    documents = await get_all_documents(db, current_user.id)
    return success_response(data=documents, message="Documents retrieved successfully")

@router.get("/workspace/{workspace_id}", response_model=StandardResponse[List[DocumentResponse]])
async def list_documents(
    workspace_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    documents = await get_documents(db, workspace_id, current_user.id)
    return success_response(data=documents, message="Documents retrieved successfully")

@router.get("/{document_id}", response_model=StandardResponse[DocumentResponse])
async def read_document(
    document_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    document = await get_document(db, document_id, current_user.id)
    return success_response(data=document, message="Document retrieved successfully")

@router.delete("/{document_id}", response_model=StandardResponse[None])
async def delete_document_route(
    document_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    await delete_document_service(db, document_id, current_user.id)
    return success_response(message="Document deleted successfully")
