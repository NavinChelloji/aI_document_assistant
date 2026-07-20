from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.workspaces.schema import WorkspaceCreate, WorkspaceUpdate, WorkspaceResponse
from app.api.workspaces.service import create_workspace, get_workspaces, get_workspace, update_workspace, delete_workspace
from app.database.models.user import User
from app.database.session import get_db_session
from app.security.auth_dependency import get_current_user
from app.utils.response import success_response, StandardResponse

router = APIRouter()

@router.post("/", response_model=StandardResponse[WorkspaceResponse], status_code=status.HTTP_201_CREATED)
async def create_workspace_route(
    workspace_in: WorkspaceCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    workspace = await create_workspace(db, workspace_in, current_user.id)
    return success_response(data=workspace, message="Workspace created successfully")

@router.get("/", response_model=StandardResponse[List[WorkspaceResponse]])
async def list_workspaces(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    workspaces = await get_workspaces(db, current_user.id)
    return success_response(data=workspaces, message="Workspaces retrieved successfully")

@router.get("/{workspace_id}", response_model=StandardResponse[WorkspaceResponse])
async def read_workspace(
    workspace_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    workspace = await get_workspace(db, workspace_id, current_user.id)
    return success_response(data=workspace, message="Workspace retrieved successfully")

@router.put("/{workspace_id}", response_model=StandardResponse[WorkspaceResponse])
async def update_workspace_route(
    workspace_id: UUID,
    workspace_in: WorkspaceUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    workspace = await update_workspace(db, workspace_id, workspace_in, current_user.id)
    return success_response(data=workspace, message="Workspace updated successfully")

@router.delete("/{workspace_id}", response_model=StandardResponse[None])
async def delete_workspace_route(
    workspace_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    await delete_workspace(db, workspace_id, current_user.id)
    return success_response(message="Workspace deleted successfully")
