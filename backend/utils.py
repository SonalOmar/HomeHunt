from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm, HTTPBearer
import os
from typing import Dict, List, Optional, Annotated

# Password hashing setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT setup
SECRET_KEY = os.getenv("SECRET_KEY", "mysecret")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# OAuth2 scheme for FastAPI dependency injection
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


bearer_scheme = HTTPBearer() 
# ✅ Hash a password
def hash_password(password: str):
    return pwd_context.hash(password)


# ✅ Verify password
def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)


# ✅ Create access token with email as `sub`
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})

    # Must include "sub" in payload for identifying user later
    if "sub" not in to_encode:
        raise ValueError("Token payload must include 'sub' (subject = email)")

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def get_current_user(security_token: Annotated[str, Depends(bearer_scheme)]):
    from database import db  # avoid circular import
    
    print("🔹 get_current_user called")  # This should print first
    print("🔹 Security token type:", type(security_token))
    
    token = security_token.credentials
    print("🔹 Incoming Token:", token)
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        print("🔹 Attempting to decode token...")
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print("🔹 Payload decoded:", payload)
        
        email: str = payload.get("sub")
        print("🔹 Decoded email:", email)
        
        if email is None:
            print("🔹 No email in payload")
            raise credentials_exception

        print("🔹 Searching user in database...")
        user = db.users.find_one({"email": email})
        print("🔹 User found in DB:", user)
        
        if not user:
            print("🔹 User not found in database")
            raise credentials_exception
        
        print("🔹 Authentication successful")
        return user

    except JWTError as e:
        print("🔹 JWT Error:", str(e))
        raise credentials_exception
    except Exception as e:
        print("🔹 Unexpected error:", str(e))
        raise credentials_exception