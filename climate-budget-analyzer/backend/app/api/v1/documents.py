from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
import aiofiles
import os
from ..core.database import get_db
from ..schemas.schemas import DocumentResponse, BudgetItemResponse
from ..models.models import Document, BudgetItem

router = APIRouter(prefix="/documents", tags=["Documents"])


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Validate file extension
    allowed_extensions = [".pdf", ".csv", ".xlsx", ".xls"]
    file_ext = os.path.splitext(file.filename)[1].lower()
    
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type {file_ext} not allowed. Allowed types: {allowed_extensions}"
        )
    
    # Save file temporarily
    temp_path = f"/tmp/{file.filename}"
    async with aiofiles.open(temp_path, 'wb') as out_file:
        content = await file.read()
        await out_file.write(content)
    
    # Create document record
    document = Document(
        filename=file.filename,
        file_type=file_ext[1:],
        status="processing"
    )
    
    db.add(document)
    db.commit()
    db.refresh(document)
    
    # Trigger background processing (Celery task would be called here)
    # For demo, we'll mark as completed
    document.status = "completed"
    db.commit()
    
    return {"id": str(document.id), "filename": file.filename, "status": "processing"}


@router.get("/", response_model=List[DocumentResponse])
def list_documents(db: Session = Depends(get_db)):
    documents = db.query(Document).all()
    return documents


@router.get("/{document_id}", response_model=DocumentResponse)
def get_document(document_id: UUID, db: Session = Depends(get_db)):
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    return document


@router.delete("/{document_id}")
def delete_document(document_id: UUID, db: Session = Depends(get_db)):
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    db.delete(document)
    db.commit()
    return {"message": "Document deleted successfully"}
