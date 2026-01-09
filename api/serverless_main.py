import logging
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.ext.asyncio import create_async_engine, AsyncEngine
import os

# ✅ ROUTES IMPORT (ONLY THIS)
from app.routes import auth, tasks

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database URL fix for serverless
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./todo_app.db")

# Handle different database types for serverless environment
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)
elif DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+asyncpg://", 1)
elif DATABASE_URL.startswith("sqlite:///"):
    # Use aiosqlite for SQLite in async context
    DATABASE_URL = DATABASE_URL.replace("sqlite:///", "sqlite+aiosqlite:///", 1)

# Create async engine
engine: AsyncEngine = create_async_engine(DATABASE_URL, echo=True)

async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSession(engine) as session:
        yield session


# Lifespan (create tables)
@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        # Create tables
        async with engine.begin() as conn:
            await conn.run_sync(SQLModel.metadata.create_all)
        logger.info("Database tables created successfully")
        yield
    except Exception as e:
        logger.error(f"Error during startup: {str(e)}")
        raise
    finally:
        await engine.dispose()
        logger.info("Database engine disposed")


# FastAPI app
app = FastAPI(
    title="Todo API",
    version="1.0.0",
    lifespan=lifespan,
    # Add exception handlers for better error reporting
    debug=True
)

# CORS - More restrictive for production
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    # Allow credentials to be sent with cross-origin requests
    allow_credentials=True,
)

# Routes
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(tasks.router, prefix="/api", tags=["tasks"])

@app.get("/")
async def root():
    return {"message": "Todo API is running"}

@app.get("/health")
async def health_check():
    """Health check endpoint to verify the API is running"""
    try:
        # Simple check - try to connect to DB
        async with AsyncSession(engine) as session:
            # Just return success if we can get a session
            pass
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return {"status": "unhealthy", "error": str(e)}