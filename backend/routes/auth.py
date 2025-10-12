from fastapi import APIRouter, HTTPException, status
from models import User, LoginRequest
from database import db
from utils import hash_password, verify_password, create_access_token
from datetime import timedelta, datetime
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user: User):
    logger.info("POST /auth/register - User registration attempt")
    
    try:
        # Log incoming request data (without password for security)
        user_data = user.model_dump()
        logger.info(f"Registration attempt - Name: {user_data.get('name')}, Email: {user_data.get('email')}, Role: {user_data.get('role')}")
        
        # Check if email already exists
        existing_user = db.users.find_one({"email": user.email})
        if existing_user:
            logger.warning(f"Registration failed - Email already exists: {user.email}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="Email already registered"
            )

        # Hash password
        hashed_password = hash_password(user.password)
        logger.info("Password hashed successfully")

        # Create user document
        user_doc = {
            "name": user.name,
            "email": user.email,
            "password": hashed_password,
            "role": user.role,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }

        # Insert into database
        result = db.users.insert_one(user_doc)
        user_id = str(result.inserted_id)
        
        logger.info(f"User registered successfully - ID: {user_id}, Email: {user.email}, Role: {user.role}")

        # Create access token for immediate login
        token = create_access_token(
            data={"sub": user.email},
            expires_delta=timedelta(minutes=60)
        )

        return {
            "message": "User registered successfully",
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "id": user_id,
                "name": user.name,
                "email": user.email,
                "role": user.role
            }
        }
        
    except HTTPException:
        logger.warning("HTTPException during registration")
        raise
        
    except Exception as e:
        logger.error(f"Unexpected error during registration: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error during registration"
        )

@router.post("/login")
def login(request: LoginRequest):
    logger.info("POST /auth/login - Login attempt")
    
    try:
        logger.info(f"Login attempt - Email: {request.email}")

        existing_user = db.users.find_one({"email": request.email})
        
        if not existing_user:
            logger.warning(f"Login failed - User not found: {request.email}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )

        if not verify_password(request.password, existing_user["password"]):
            logger.warning(f"Login failed - Invalid password for: {request.email}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )

        token = create_access_token(
            data={"sub": request.email},
            expires_delta=timedelta(minutes=60)
        )

        logger.info(f"Login successful - Email: {request.email}, Role: {existing_user.get('role')}")

        return {
            "access_token": token, 
            "token_type": "bearer", 
            "message": "Login successful",
            "user": {
                "id": str(existing_user["_id"]),
                "name": existing_user.get("name"),
                "email": existing_user.get("email"),
                "role": existing_user.get("role")
            }
        }
        
    except HTTPException:
        logger.warning("HTTPException during login")
        raise
        
    except Exception as e:
        logger.error(f"Unexpected error during login: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error during login"
        )