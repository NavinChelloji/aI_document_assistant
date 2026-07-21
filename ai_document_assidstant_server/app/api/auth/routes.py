from fastapi import APIRouter, Depends, HTTPException, status, Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.auth.schema import UserCreate, UserResponse, Token
from app.api.auth.service import create_user, authenticate_user
from app.database.session import get_db_session
from app.security.jwt import create_access_token, create_refresh_token
from app.config.settings import get_settings
from app.utils.response import success_response, StandardResponse

settings = get_settings()
router = APIRouter()

@router.post("/register", response_model=StandardResponse[UserResponse], status_code=status.HTTP_201_CREATED)
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db_session)):
    user = await create_user(db, user_in)
    return success_response(data=user, message="User registered successfully")

@router.post("/login")
async def login(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db_session)
):
    user = await authenticate_user(db, form_data.username, form_data.password);
    print(f"Authenticated user: {user.email}")  # Debugging line
    
    access_token = create_access_token(data={"sub": user.email})
    refresh_token = create_refresh_token(data={"sub": user.email})
    
    # Set HttpOnly cookies
    # max_age in seconds: 30 minutes for access token, 7 days for refresh token
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False, # Set to True in production (HTTPS)
        samesite="lax",
        max_age=settings.JWT_EXPIRE_MINUTES * 60
    )
    
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=7 * 24 * 60 * 60
    )
    
    return success_response(message="Login successful")

@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    return success_response(message="Logout successful")
