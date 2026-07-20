from sqlalchemy.ext.asyncio import AsyncSession
from app.database.models.user import User
from app.api.users.schema import UserUpdate
from app.security.password import get_password_hash

async def update_user(db: AsyncSession, user: User, user_in: UserUpdate) -> User:
    if user_in.email is not None:
        user.email = user_in.email
    if user_in.password is not None:
        user.hashed_password = get_password_hash(user_in.password)
    
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user
