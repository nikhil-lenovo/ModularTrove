# Interior Design Website

A full-stack web application for showcasing interior design projects.

## Setup Instructions

### Backend Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Run the backend server:
```bash
cd backend
uvicorn main:app --reload
```
The backend will run on `http://localhost:8000`

### Frontend Setup

1. Install Node.js from: https://nodejs.org/
2. Navigate to the frontend directory and install dependencies:
```bash
cd frontend
npm install
```

3. Start the development server:
```bash
npm start
```
The frontend will run on `http://localhost:3000`

## Features

- Image upload with validation
- Category-based filtering
- Responsive gallery layout
- Admin dashboard for managing designs
- RESTful API integration

## Project Structure

```
modular_trove/
├── backend/           # FastAPI backend
│   ├── main.py       # Main application
│   └── uploads/      # Uploaded images
├── frontend/         # React frontend
│   ├── src/         # React source files
│   └── public/      # Static files
└── requirements.txt  # Python dependencies
```
