from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os
from pathlib import Path

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database configuration
SQLALCHEMY_DATABASE_URL = "sqlite:///./designs.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Design(Base):
    __tablename__ = "designs"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    category = Column(String)
    image_path = Column(String)
    upload_date = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create uploads directory if it doesn't exist
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

@app.post("/upload/")
async def upload_design(
    title: str,
    description: str,
    category: str,
    file: UploadFile = File(...),
    db = Depends(get_db)
):
    # Validate file type
    if not file.filename.lower().endswith(('.png', '.jpg', '.jpeg')):
        raise HTTPException(status_code=400, detail="Only PNG and JPEG files are allowed")
    
    # Save file
    file_path = UPLOAD_DIR / file.filename
    with file_path.open("wb") as buffer:
        content = await file.read()
        buffer.write(content)
    
    # Create database record
    db_design = Design(
        title=title,
        description=description,
        category=category,
        image_path=str(file_path)
    )
    db.add(db_design)
    db.commit()
    db.refresh(db_design)
    
    return {"id": db_design.id, "image_path": str(file_path)}

@app.get("/designs/")
async def get_designs(db = Depends(get_db)):
    designs = db.query(Design).all()
    return [{
        "id": design.id,
        "title": design.title,
        "description": design.description,
        "category": design.category,
        "image_path": design.image_path,
        "upload_date": design.upload_date
    } for design in designs]

@app.get("/categories/")
async def get_categories(db = Depends(get_db)):
    categories = db.query(Design.category).distinct().all()
    return [category[0] for category in categories]
