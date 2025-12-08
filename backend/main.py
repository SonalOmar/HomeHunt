from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi
from routes import auth, users, properties  # Import your routers
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
app = FastAPI()

import os

# Use current working directory
UPLOAD_DIR = "/Users/sonalomar/Documents/HomeHunt/backend/uploads"
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


print(f"📁 Serving from: {os.path.abspath(UPLOAD_DIR)}")



# Include routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(properties.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers
)
# Customize Swagger for JWT Bearer token


def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title="Property App API",
        version="1.0.0",
        routes=app.routes,
    )

    openapi_schema["components"] = {
        "securitySchemes": {
            "BearerAuth": {
                "type": "http",
                "scheme": "bearer",
                "bearerFormat": "JWT"
            }
        }
    }

    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi
