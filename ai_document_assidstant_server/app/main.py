from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi import HTTPException
from app.api.health import routes as health_routes
from app.api.auth import routes as auth_routes
from app.api.users import routes as users_routes
from app.api.workspaces import routes as workspaces_routes
from app.api.documents import routes as documents_routes
from app.api.chat import routes as chat_routes
from app.config.settings import get_settings
from app.utils.response import error_response, success_response

settings = get_settings()

app = FastAPI(
    title="AI Document Assistant API",
    version="1.0.0",
    description="Backend API for the AI Document Assistant using Clean Architecture."
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], # Specific origins required when credentials=True
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception Handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return error_response(message=str(exc.detail), status_code=exc.status_code)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return error_response(message="Validation Error", status_code=422, data=exc.errors())

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    # In production, avoid leaking sensitive exception details
    return error_response(message="An unexpected error occurred.", status_code=500)

# Include Routers
app.include_router(health_routes.router, prefix="/api/health", tags=["Health"])
app.include_router(auth_routes.router, prefix="/api/auth", tags=["Auth"])
app.include_router(users_routes.router, prefix="/api/users", tags=["Users"])
app.include_router(workspaces_routes.router, prefix="/api/workspaces", tags=["Workspaces"])
app.include_router(documents_routes.router, prefix="/api/documents", tags=["Documents"])
app.include_router(chat_routes.router, prefix="/api/chat", tags=["Chat"])

@app.get("/")
async def root():
    return success_response(message="Welcome to AI Document Assistant API")
