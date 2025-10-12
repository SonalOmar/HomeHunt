from pydantic import BaseModel, EmailStr

class UserResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    phone: str
    role: str

class PropertyResponse(BaseModel):
    id: str
    title: str
    description: str
    price: float
    location: str
    owner_id: str
