from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional, List
from datetime import datetime
from pydantic import ConfigDict
import re

class User(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, example="John Doe")
    email: EmailStr = Field(..., example="john@example.com")
    password: str = Field(..., min_length=6, max_length=100, example="securepassword123")
    role: str = Field(default="buyer", example="buyer")

    @field_validator('name')
    @classmethod
    def name_must_not_be_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError('Name cannot be empty or just whitespace')
        return v.strip()

    @field_validator('role')
    @classmethod
    def role_must_be_valid(cls, v: str) -> str:
        valid_roles = ["buyer", "seller"]
        if v not in valid_roles:
            raise ValueError(f'Role must be one of: {", ".join(valid_roles)}')
        return v

    @field_validator('password')
    @classmethod
    def password_must_be_strong(cls, v: str) -> str:
        if len(v) < 6:
            raise ValueError('Password must be at least 6 characters long')
        return v

class LoginRequest(BaseModel):
    email: EmailStr = Field(..., example="john@example.com")
    password: str = Field(..., min_length=1, example="securepassword123")

class PropertyCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200, example="3 BHK Luxury Apartment")
    description: str = Field(..., min_length=10, max_length=2000, example="A luxurious 3 BHK apartment with modern amenities...")
    price: float = Field(..., gt=0, example=25500000.00)
    location: str = Field(..., min_length=1, max_length=200, example="Channasandra, Bangalore")
    type: str = Field(..., example="sale")  # "sale" or "rent"
    bhk: Optional[str] = Field(None, example="3 BHK")
    size: Optional[str] = Field(None, example="1817 sqft")
    status: Optional[str] = Field("Available", example="Under Construction")
    amenities: List[str] = Field(default_factory=list, example=["Pool", "Gym", "Park"])
    featured: bool = Field(False, example=True)
    
    # REMOVE image_urls from PropertyCreate since images are uploaded separately
    # photos count will be auto-calculated from uploaded images
    
    rating: float = Field(0.0, ge=0, le=5, example=4.8)
    reviews: int = Field(0, ge=0, example=42)

    # Keep all your existing validators but remove image_urls validator
    @field_validator('title')
    @classmethod
    def title_must_not_be_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError('Title cannot be empty or just whitespace')
        return v.strip()

    # ... keep other validators but remove the image_urls validator

class Property(PropertyCreate):
    id: Optional[str] = None
    owner_id: str
    owner_email: Optional[str] = None
    owner_name: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    # Add image_urls here in the response model only
    image_urls: List[str] = Field(default_factory=list, description="URLs of uploaded images")
    photos: int = Field(0, description="Number of photos - auto-calculated")

    model_config = ConfigDict(from_attributes=True)

    
# Specialized models for image upload operations
class ImageUploadResponse(BaseModel):
    """Response model for image upload"""
    filename: str
    url: str
    size: int
    uploaded_at: datetime

class PropertyImageUpdate(BaseModel):
    """Model for updating property images"""
    property_id: str = Field(..., example="507f1f77bcf86cd799439011")
    image_urls: List[str] = Field(..., description="List of image URLs to add")

class PropertyResponse(Property):
    """Extended response model with full image URLs"""
    full_image_urls: List[str] = Field(default_factory=list, description="Complete URLs to access images")