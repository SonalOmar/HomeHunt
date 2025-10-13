# 🏠 HomeHunt - Property Listing Platform

A modern full-stack property listing application built with the FARM stack (FastAPI, React, and MongoDB). Find your dream home with ease!


## 🚀 Tech Stack

### Frontend
- **React** - UI framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **CSS3** - Styling
- **React Context** - State management

### Backend
- **FastAPI** - Python web framework
- **Uvicorn** - ASGI server
- **MongoDB** - NoSQL database
- **Motor** - Async MongoDB driver
- **BCrypt** - Password hashing


## ✨ Features

### 🔐 Authentication & Authorization
- User registration and login
- JWT-based authentication
- Password hashing

### 🏘️ Property Management
- Add new property listings
- View all properties
- Filter properties by:
  - Price range
  - Location
  - Property type
  - Number of bedrooms/bathrooms
- Search properties


### 👤 User Features
- User profiles
- Manage own listings
- Save favorite properties
- Contact property owners

### 📱 Responsive Design
- Cross-browser compatibility
- Modern UI/UX

## 🛠️ Installation & Local Development

### Prerequisites
- Python 3.8+
- Node.js 16+
- MongoDB (local or Atlas)
- Git

# Clone repository
git clone https://github.com/SonalOmar/homehunt.git
cd homehunt

# Backend setup
- cd backend
- python -m venv venv
- source venv/bin/activate  # Windows: venv\Scripts\activate
- pip install -r requirements.txt
- uvicorn main:app --reload

# Frontend setup
- cd ../frontend
- npm install
- npm run dev
