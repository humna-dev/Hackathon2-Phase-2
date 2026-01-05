from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt
import os
from dotenv import load_dotenv
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

# Load environment variables
load_dotenv()

from app.models import User
from app.schemas import UserCreate, UserResponse, Token, LoginRequest
from app.database import get_session   # ✅ FIX 1

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# JWT config
SECRET_KEY = os.getenv("BETTER_AUTH_SECRET")
if not SECRET_KEY:
    raise RuntimeError("BETTER_AUTH_SECRET not set")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Utils
def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    session: AsyncSession = Depends(get_session)
) -> User:
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    stmt = select(User).where(User.id == int(user_id))
    result = await session.execute(stmt)
    user = result.scalar_one_or_none()
    
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    
    return user

# ---------------- AUTH ROUTES ---------------- #

@router.post("/register", response_model=UserResponse)
async def register(
    user: UserCreate,
    session: AsyncSession = Depends(get_session)
):
    stmt = select(User).where(
        (User.username == user.username) | (User.email == user.email)
    )
    result = await session.execute(stmt)
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=400,
            detail="Username or email already registered"
        )

    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=get_password_hash(user.password),
    )

    session.add(db_user)
    await session.commit()
    await session.refresh(db_user)

    return db_user


@router.post("/login", response_model=Token)
async def login(
    login_request: LoginRequest,
    session: AsyncSession = Depends(get_session)
):
    stmt = select(User).where(User.username == login_request.username)
    result = await session.execute(stmt)
    db_user = result.scalar_one_or_none()

    if not db_user or not verify_password(login_request.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = create_access_token(
        data={"sub": str(db_user.id)},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    return {"access_token": token, "token_type": "bearer"}


@router.post("/logout")
async def logout(
    current_user: User = Depends(get_current_user)
):
    # In a JWT-based system, logout is typically handled client-side
    # by removing the token. This endpoint validates the token and 
    # confirms successful logout.
    return {"message": "Successfully logged out"}
