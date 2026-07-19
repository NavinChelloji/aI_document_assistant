from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from app.config.settings import get_settings

settings = get_settings()

engine = create_async_engine(settings.DATABASE_URL, echo=False)

async_session_maker = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False
)

async def get_db_session() -> AsyncSession: # type: ignore
    async with async_session_maker() as session:
        yield session
