from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.workspaces.schema import WorkspaceCreate, WorkspaceUpdate, WorkspaceResponse
from app.api.workspaces.service import create_workspace, get_workspaces, get_workspace, update_workspace, delete_workspace
from app.database.models.user import User
from app.database.session import get_db_session
from app.security.auth_dependency import get_current_user

router = APIRouter()

@router.post("/", response_model=WorkspaceResponse, status_code=status.HTTP_201_CREATED)
async def create_workspace_route(
    workspace_in: WorkspaceCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    return await create_workspace(db, workspace_in, current_user.id)

@router.get("/", response_model=List[WorkspaceResponse])
async def list_workspaces(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    return await get_workspaces(db, current_user.id)

@router.get("/{workspace_id}", response_model=WorkspaceResponse)
async def read_workspace(
    workspace_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    return await get_workspace(db, workspace_id, current_user.id)

@router.put("/{workspace_id}", response_model=WorkspaceResponse)
async def update_workspace_route(
    workspace_id: int,
    workspace_in: WorkspaceUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    return await update_workspace(db, workspace_id, workspace_in, current_user.id)

@router.delete("/{workspace_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_workspace_route(
    workspace_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    await delete_workspace(db, workspace_id, current_user.id)
