from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.auth.schema import UserResponse
from app.api.users.schema import UserUpdate
from app.api.users.service import update_user
from app.database.models.user import User
from app.database.session import get_db_session
from app.security.auth_dependency import get_current_user
from app.utils.response import success_response, StandardResponse

router = APIRouter()

@router.get("/me", response_model=StandardResponse[UserResponse])
async def read_users_me(current_user: User = Depends(get_current_user)):
    return success_response(data=current_user, message="User retrieved successfully")

@router.put("/me", response_model=StandardResponse[UserResponse])
async def update_users_me(
    user_in: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    user = await update_user(db, current_user, user_in)
    return success_response(data=user, message="User updated successfully")
