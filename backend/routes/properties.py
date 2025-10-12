import json
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from database import db
from models import Property, PropertyCreate, ImageUploadResponse
from utils import get_current_user
from bson import ObjectId
import datetime
import logging
import os
import shutil
import uuid
from typing import List, Optional

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('property_api.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/properties", tags=["Properties"])
UPLOAD_DIR = "/Users/sonalomar/Documents/HomeHunt/backend/uploads/properties"
os.makedirs(UPLOAD_DIR, exist_ok=True)
ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp', '.gif'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


def verify_seller_or_admin(current_user: dict):
    """Verify if user is seller or admin"""
    user_role = current_user.get("role", "").lower()
    is_authorized = user_role in ["seller", "admin"]
    
    logger.info(f"Role verification - User: {current_user.get('email')}, Role: {user_role}, Authorized: {is_authorized}")
    
    if not is_authorized:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only sellers and admins can perform this action"
        )
    return True

async def save_uploaded_images(files: List[UploadFile], property_id: str) -> List[ImageUploadResponse]:
    """Save uploaded images and return their URLs"""
    saved_images = []
    
    for file in files:
        # Validate file type
        file_extension = os.path.splitext(file.filename)[1].lower()
        if file_extension not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400, 
                detail=f"File type {file_extension} not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
            )
        
        # Generate unique filename
        unique_filename = f"{property_id}_{uuid.uuid4().hex}{file_extension}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        
        # Save file
        file_content = await file.read()
        
        # Check file size
        if len(file_content) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"File {file.filename} is too large. Maximum size is {MAX_FILE_SIZE // (1024*1024)}MB"
            )
        
        with open(file_path, "wb") as buffer:
            buffer.write(file_content)
        
        # Create image URL path
        image_url = f"/uploads/properties/{unique_filename}"
        
        saved_images.append(ImageUploadResponse(
            filename=file.filename,
            url=image_url,
            size=len(file_content),
            uploaded_at=datetime.datetime.utcnow()
        ))
        
        logger.info(f"Saved image: {file.filename} -> {image_url}")
    
    return saved_images

def delete_image_files(image_urls: List[str]):
    """Delete image files from filesystem"""
    deleted_count = 0
    for image_url in image_urls:
        filename = image_url.split('/')[-1]
        file_path = os.path.join(UPLOAD_DIR, filename)
        if os.path.exists(file_path):
            os.remove(file_path)
            deleted_count += 1
            logger.info(f"Deleted image file: {file_path}")
    
    return deleted_count


@router.get("/")
def list_properties():
    """Anyone can view properties list"""
    logger.info("GET /properties - Listing all properties")
    try:
        properties = list(db.properties.find())
        logger.info(f"Found {len(properties)} properties in database")
        
        # Convert ObjectId to string for JSON serialization
        for prop in properties:
            prop["_id"] = str(prop["_id"])
            if "owner_id" in prop and isinstance(prop["owner_id"], ObjectId):
                prop["owner_id"] = str(prop["owner_id"])
            
            # Ensure image_urls field exists
            if "image_urls" not in prop:
                prop["image_urls"] = []
        
        logger.info("Successfully retrieved and formatted properties")
        return properties
        
    except Exception as e:
        logger.error(f"Error listing properties: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error while fetching properties"
        )

@router.get("/{id}")
def get_property(id: str):
    """Anyone can view individual property details"""
    logger.info(f"GET /properties/{id} - Getting property details")
    
    try:
        # Validate property ID
        if not id or len(id) != 24:
            logger.error(f"Invalid property ID format: {id}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid property ID format"
            )
        
        # Find property
        property_data = db.properties.find_one({"_id": ObjectId(id)})
        if not property_data:
            logger.warning(f"Property not found with ID: {id}")
            raise HTTPException(status_code=404, detail="Property not found")
        
        # Convert ObjectId to string
        property_data["_id"] = str(property_data["_id"])
        if "owner_id" in property_data and isinstance(property_data["owner_id"], ObjectId):
            property_data["owner_id"] = str(property_data["owner_id"])
        
        # Ensure image_urls field exists
        if "image_urls" not in property_data:
            property_data["image_urls"] = []
        
        logger.info(f"Successfully retrieved property: {property_data.get('title')} with {len(property_data['image_urls'])} images")
        return property_data
        
    except HTTPException:
        logger.warning("HTTPException raised during property retrieval")
        raise
    except Exception as e:
        logger.error(f"Unexpected error getting property {id}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error while fetching property"
        )
    

@router.get("/debug-files")
async def debug_files():
    """Debug: List all files in uploads directory"""
    import os
    
    files_info = []
    if os.path.exists(UPLOAD_DIR):
        for filename in os.listdir(UPLOAD_DIR):
            file_path = os.path.join(UPLOAD_DIR, filename)
            files_info.append({
                "filename": filename,
                "file_path": file_path,
                "size": os.path.getsize(file_path),
                "created": os.path.getctime(file_path)
            })
    
    return {
        "upload_dir": UPLOAD_DIR,
        "upload_dir_exists": os.path.exists(UPLOAD_DIR),
        "total_files": len(files_info),
        "files": files_info
    }

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=Property)
async def add_property(
    property_data: str = Form(...),
    current_user: dict = Depends(get_current_user),
    image_urls: List[UploadFile] = File(None)
):
    """Create a new property with optional image uploads"""
    logger.info("POST /properties - Adding new property")
    
    try:
        # Verify user is seller or admin
        verify_seller_or_admin(current_user)
        
        # Parse JSON
        try:
            property_dict = json.loads(property_data)
        except json.JSONDecodeError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid JSON format: {str(e)}"
            )
        
        # Create Pydantic model
        property_create = PropertyCreate(**property_dict)
        
        # Create property document
        property_doc = property_create.model_dump()
        property_doc["owner_id"] = str(current_user["_id"])
        property_doc["owner_email"] = current_user.get("email", "unknown")
        property_doc["owner_name"] = current_user.get("name", "Unknown")
        property_doc["created_at"] = datetime.datetime.utcnow()
        property_doc["updated_at"] = datetime.datetime.utcnow()
        property_doc["image_urls"] = []
        
        logger.info(f"Received image_urls: {image_urls}")
        
        # Handle image uploads
        uploaded_image_urls = []
        if image_urls:
            # Generate property ID first so we can use it in filenames
            result = db.properties.insert_one(property_doc)
            property_id = str(result.inserted_id)
            
            # Now save images with the actual property ID
            saved_images = await save_uploaded_images(image_urls, property_id)  # Use actual property ID
            uploaded_image_urls = [img.url for img in saved_images]
            
            # Update the property with image URLs
            db.properties.update_one(
                {"_id": ObjectId(property_id)},
                {"$set": {
                    "image_urls": uploaded_image_urls,
                    "photos": len(uploaded_image_urls)
                }}
            )
            
            # Fetch the updated property
            updated_property = db.properties.find_one({"_id": ObjectId(property_id)})
            updated_property["_id"] = str(updated_property["_id"])
            updated_property["id"] = property_id
            
            logger.info(f"Property inserted successfully with ID: {property_id}")
            return Property(**updated_property)
        else:
            # No images, just insert the property
            result = db.properties.insert_one(property_doc)
            property_id = str(result.inserted_id)
            property_doc["id"] = property_id
            
            logger.info(f"Property inserted successfully with ID: {property_id}")
            return Property(**property_doc)
        
    except Exception as e:
        logger.error(f"Error adding property: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error adding property: {str(e)}"
        )
    
@router.put("/{id}")
async def update_property(
    id: str, 
    property_data: PropertyCreate, 
    current_user: dict = Depends(get_current_user),
    image_urls: List[UploadFile] = File(None),
    delete_images: Optional[List[str]] = Form(None)
):
    """Update property with optional image management - add new images and/or delete existing ones"""
    logger.info(f"PUT /properties/{id} - Updating property with image management")
    images=image_urls  
    try:
        # Verify user is seller or admin
        verify_seller_or_admin(current_user)
        
        # Log the update attempt
        logger.info(f"Update data: {property_data.model_dump()}")
        logger.info(f"Current user: {current_user.get('email')} (ID: {current_user.get('_id')}, Role: {current_user.get('role')})")
        logger.info(f"New images received: {len(images) if images else 0}")
        logger.info(f"Images to delete: {delete_images if delete_images else []}")
        
        # Validate property ID
        if not id or len(id) != 24:
            logger.error(f"Invalid property ID format: {id}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid property ID format"
            )
        
        # Find existing property
        existing = db.properties.find_one({"_id": ObjectId(id)})
        if not existing:
            logger.warning(f"Property not found with ID: {id}")
            raise HTTPException(status_code=404, detail="Property not found")
        
        logger.info(f"Found existing property: {existing.get('title')} (Owner: {existing.get('owner_id')})")
        
        # Check ownership - sellers can only update their own properties, admins can update any
        current_user_id = str(current_user["_id"])
        property_owner_id = str(existing["owner_id"])
        is_admin = current_user.get("role") == "admin"
        
        logger.info(f"Ownership check - User: {current_user_id}, Property Owner: {property_owner_id}, Is Admin: {is_admin}")
        
        # Sellers can only update their own properties, admins can update any
        if not is_admin and property_owner_id != current_user_id:
            logger.warning(f"User {current_user_id} not authorized to update property {id}")
            raise HTTPException(
                status_code=403, 
                detail="You can only update your own properties"
            )
        
        # Get current images
        current_image_urls = existing.get("image_urls", [])
        updated_image_urls = current_image_urls.copy()
        
        # Handle image deletion if requested
        deleted_images_count = 0
        if delete_images:
            # Validate that images to delete actually exist in the property
            valid_images_to_delete = [img for img in delete_images if img in current_image_urls]
            if len(valid_images_to_delete) != len(delete_images):
                logger.warning(f"Some images to delete were not found in property: {set(delete_images) - set(current_image_urls)}")
            
            # Delete image files from filesystem
            deleted_files_count = delete_image_files(valid_images_to_delete)
            
            # Remove from image URLs list
            updated_image_urls = [url for url in updated_image_urls if url not in valid_images_to_delete]
            deleted_images_count = len(valid_images_to_delete)
            
            logger.info(f"Deleted {deleted_files_count} image files and {deleted_images_count} image references")
        
        # Handle new image uploads
        new_images_count = 0
        if images:
            saved_images = await save_uploaded_images(images, id)
            new_image_urls = [img.url for img in saved_images]
            updated_image_urls.extend(new_image_urls)
            new_images_count = len(new_image_urls)
            logger.info(f"Added {new_images_count} new images")
        
        # Prepare update data
        update_data = property_data.model_dump()
        update_data["updated_at"] = datetime.datetime.utcnow()
        
        # Update image URLs and photo count
        update_data["image_urls"] = updated_image_urls
        update_data["photos"] = len(updated_image_urls)
        
        # Ensure all fields are properly set
        if update_data.get("bhk") == "":
            update_data["bhk"] = None
        if update_data.get("size") == "":
            update_data["size"] = None
        
        logger.info(f"Update data to apply: {update_data}")
        logger.info(f"Image summary - Total: {len(updated_image_urls)}, Added: {new_images_count}, Deleted: {deleted_images_count}")
        
        # Perform update
        result = db.properties.update_one(
            {"_id": ObjectId(id)}, 
            {"$set": update_data}
        )
        
        if result.modified_count == 1:
            logger.info(f"Successfully updated property {id}")
            return {
                "message": "Property updated successfully",
                "images_added": new_images_count,
                "images_deleted": deleted_images_count,
                "total_images": len(updated_image_urls)
            }
        else:
            logger.warning(f"No changes made to property {id}")
            return {"message": "No changes detected"}
            
    except HTTPException:
        logger.warning("HTTPException raised during property update")
        raise
    except Exception as e:
        logger.error(f"Unexpected error updating property {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=400, detail=f"Error updating property: {str(e)}")

@router.delete("/{id}")
async def delete_property(
    id: str, 
    current_user: dict = Depends(get_current_user),
    delete_all_images: bool = True
):
    """Delete property with option to keep or delete associated images"""
    logger.info(f"DELETE /properties/{id} - Deleting property")
    
    try:
        # Verify user is seller or admin
        verify_seller_or_admin(current_user)
        
        # Log the deletion attempt
        logger.info(f"Current user: {current_user.get('email')} (ID: {current_user.get('_id')}, Role: {current_user.get('role')})")
        logger.info(f"Delete all images: {delete_all_images}")
        
        # Validate property ID
        if not id or len(id) != 24:
            logger.error(f"Invalid property ID format: {id}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid property ID format"
            )
        
        # Find existing property
        existing = db.properties.find_one({"_id": ObjectId(id)})
        if not existing:
            logger.warning(f"Property not found with ID: {id}")
            raise HTTPException(status_code=404, detail="Property not found")
        
        logger.info(f"Found property to delete: {existing.get('title')} (Owner: {existing.get('owner_id')})")
        
        # Check ownership - sellers can only delete their own properties, admins can delete any
        current_user_id = str(current_user["_id"])
        property_owner_id = str(existing["owner_id"])
        is_admin = current_user.get("role") == "admin"
        
        logger.info(f"Ownership check - User: {current_user_id}, Property Owner: {property_owner_id}, Is Admin: {is_admin}")
        
        # Sellers can only delete their own properties, admins can delete any
        if not is_admin and property_owner_id != current_user_id:
            logger.warning(f"User {current_user_id} not authorized to delete property {id}")
            raise HTTPException(
                status_code=403, 
                detail="You can only delete your own properties"
            )
        
        # Delete associated images from filesystem if requested
        deleted_images_count = 0
        if delete_all_images:
            image_urls = existing.get("image_urls", [])
            deleted_images_count = delete_image_files(image_urls)
            logger.info(f"Deleted {deleted_images_count} associated images")
        
        # Perform deletion
        result = db.properties.delete_one({"_id": ObjectId(id)})
        
        if result.deleted_count == 1:
            logger.info(f"Successfully deleted property {id}")
            return {
                "message": "Property deleted successfully",
                "images_deleted": deleted_images_count
            }
        else:
            logger.error(f"Failed to delete property {id} - no document deleted")
            raise HTTPException(status_code=500, detail="Failed to delete property")
            
    except HTTPException:
        logger.warning("HTTPException raised during property deletion")
        raise
    except Exception as e:
        logger.error(f"Unexpected error deleting property {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=400, detail=f"Error deleting property: {str(e)}")

@router.get("/user/my-properties")
def get_my_properties(current_user: dict = Depends(get_current_user)):
    """Get properties listed by the current user (sellers/admins only)"""
    logger.info("GET /properties/user/my-properties - Getting user's properties")
    
    try:
        # Verify user is seller or admin
        verify_seller_or_admin(current_user)
        
        user_id = str(current_user["_id"])
        logger.info(f"Fetching properties for user: {current_user.get('email')} (ID: {user_id})")
        
        properties = list(db.properties.find({"owner_id": user_id}))
        logger.info(f"Found {len(properties)} properties for user {user_id}")
        
        # Convert ObjectId to string and debug image URLs
        for prop in properties:
            prop["_id"] = str(prop["_id"])
            
            # Debug image URLs
            logger.info(f"Property '{prop.get('title', 'No Title')}' (ID: {prop['_id']}):")
            logger.info(f"  - Raw image_urls from DB: {prop.get('image_urls')}")
            logger.info(f"  - Type of image_urls: {type(prop.get('image_urls'))}")
            
            # Ensure image_urls field exists and is a list
            if "image_urls" not in prop:
                prop["image_urls"] = []
                logger.info(f"  - No image_urls field; initialized to empty list")
            elif prop["image_urls"] is None:
                prop["image_urls"] = []
                logger.info(f"  - image_urls was None; initialized to empty list")
            elif not isinstance(prop["image_urls"], list):
                logger.warning(f"  - image_urls is not a list: {type(prop['image_urls'])}")
                # Convert to list if it's not
                if isinstance(prop["image_urls"], str):
                    prop["image_urls"] = [prop["image_urls"]]
                else:
                    prop["image_urls"] = list(prop["image_urls"])
            
            # Log detailed image info
            image_urls = prop.get("image_urls", [])
            logger.info(f"  - Number of images: {len(image_urls)}")
            
            for i, img_url in enumerate(image_urls):
                full_url = f"http://localhost:8000{img_url}" if img_url else "No URL"
                logger.info(f"    Image {i}: {img_url} -> {full_url}")
            
            # Log photos count for comparison
            logger.info(f"  - Photos count in DB: {prop.get('photos', 0)}")
            
            # Add a debug field to check URL accessibility
            prop["_debug"] = {
                "image_count": len(image_urls),
                "image_urls_sample": image_urls[0] if image_urls else "No images",
                "full_sample_url": f"http://localhost:8000{image_urls[0]}" if image_urls else "No images"
            }
        
        return properties
        
    except HTTPException:
        logger.warning("HTTPException raised while fetching user properties")
        raise
    except Exception as e:
        logger.error(f"Error fetching user properties: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error fetching your properties"
        )

# New endpoint to get trending properties (for carousel)
@router.get("/trending/featured")
def get_featured_properties(limit: int = 6):
    """Get featured properties for carousel display"""
    logger.info("GET /properties/trending/featured - Getting featured properties")
    
    try:
        # Get featured properties, sorted by rating or creation date
        properties = list(db.properties.find(
            {"featured": True}
        ).sort([("rating", -1), ("created_at", -1)]).limit(limit))
        
        logger.info(f"Found {len(properties)} featured properties")
        
        # Convert ObjectId to string
        for prop in properties:
            prop["_id"] = str(prop["_id"])
            if "owner_id" in prop and isinstance(prop["owner_id"], ObjectId):
                prop["owner_id"] = str(prop["owner_id"])
            # Ensure image_urls field exists
            if "image_urls" not in prop:
                prop["image_urls"] = []
        
        return properties
        
    except Exception as e:
        logger.error(f"Error fetching featured properties: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error fetching featured properties"
        )

# New endpoint to get properties by type (sale/rent)
@router.get("/type/{property_type}")
def get_properties_by_type(property_type: str):
    """Get properties by type (sale or rent)"""
    logger.info(f"GET /properties/type/{property_type} - Getting properties by type")
    
    try:
        if property_type not in ["sale", "rent"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Property type must be 'sale' or 'rent'"
            )
        
        properties = list(db.properties.find({"type": property_type}))
        logger.info(f"Found {len(properties)} properties for type: {property_type}")
        
        # Convert ObjectId to string
        for prop in properties:
            prop["_id"] = str(prop["_id"])
            if "owner_id" in prop and isinstance(prop["owner_id"], ObjectId):
                prop["owner_id"] = str(prop["owner_id"])
            # Ensure image_urls field exists
            if "image_urls" not in prop:
                prop["image_urls"] = []
        
        return properties
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching properties by type: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error fetching properties by type"
        )
    
