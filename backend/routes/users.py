import datetime
from fastapi import APIRouter, HTTPException, Depends, Request, status
from models import User
from database import db
from utils import get_current_user 
from datetime import datetime, timezone  # Add timezone import

router = APIRouter(prefix="/users", tags=["Users"])



# 📌 Get all users (Admin only)
@router.get("/")
def get_users(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Permission denied")
    
    users = list(db.users.find({}, {"_id": 0}))
    return users


# 📌 Get a specific user detail
@router.get("/{email}")
def get_user(email: str, current_user: dict = Depends(get_current_user)):
    print("🔹 Route handler called")
    print("🔹 Requested email:", email)
    print("🔹 Current user email:", current_user.get("email"))
    print("🔹 Current user role:", current_user.get("role"))
    print("🔹 Full current_user:", current_user)
    
    # Normal user can see only their own profile, Admin can see anyone's
    if current_user["role"] != "admin" and current_user["email"] != email:
        print("🔹 Permission denied - not admin and email doesn't match")
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Permission denied")

    user = db.users.find_one({"email": email}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    print("🔹 User found, returning data")
    return user


# 📌 Update user details
@router.put("/{email}")
async def update_user(
    email: str, 
    request: Request,
    current_user: dict = Depends(get_current_user)
):
    # User can update only their own data, Admin can update anyone
    if current_user["role"] != "admin" and current_user["email"] != email:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Permission denied")

    existing_user = db.users.find_one({"email": email})
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")

    try:
        # Parse the request body as JSON
        user_data = await request.json()
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid JSON in request body")

    # Validate and prepare update data
    update_fields = {}
    
    if 'name' in user_data and user_data['name'] is not None:
        name = user_data['name'].strip()
        if not name:
            raise HTTPException(status_code=400, detail="Name cannot be empty")
        if len(name) > 100:
            raise HTTPException(status_code=400, detail="Name too long")
        update_fields['name'] = name
    
    if 'email' in user_data and user_data['email'] is not None:
        email_value = user_data['email'].strip()
        if '@' not in email_value:
            raise HTTPException(status_code=400, detail="Invalid email format")
        # Check if email already exists (if changing email)
        if email_value != email:
            existing_email = db.users.find_one({"email": email_value})
            if existing_email:
                raise HTTPException(status_code=400, detail="Email already registered")
        update_fields['email'] = email_value
    
    if 'password' in user_data and user_data['password'] is not None:
        password = user_data['password']
        if len(password) < 6:
            raise HTTPException(status_code=400, detail="Password must be at least 6 characters long")
        # Hash the new password
        from utils import hash_password
        update_fields['password'] = hash_password(password)
    
    if 'role' in user_data and user_data['role'] is not None:
        valid_roles = ["buyer", "seller"]
        if user_data['role'] not in valid_roles:
            raise HTTPException(status_code=400, detail=f"Role must be one of: {', '.join(valid_roles)}")
        update_fields['role'] = user_data['role']

    # Add updated_at timestamp - FIXED: use datetime.now(timezone.utc)
    update_fields['updated_at'] = datetime.now(timezone.utc)

    if not update_fields:
        raise HTTPException(status_code=400, detail="No valid fields to update")

    # Perform the update
    result = db.users.update_one({"email": email}, {"$set": update_fields})
    
    if result.modified_count == 1:
        return {"message": "User updated successfully"}
    else:
        return {"message": "No changes made to user"}
    
# 📌 Delete a user (Admin only)
@router.delete("/{email}")
def delete_user(email: str, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Permission denied")

    result = db.users.delete_one({"email": email})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": "User deleted successfully"}
