from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from uuid import UUID


# Auth Schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: Optional[str] = None
    organization: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: UUID
    email: EmailStr
    full_name: Optional[str]
    organization: Optional[str]
    role: str

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


# Document Schemas
class DocumentCreate(BaseModel):
    filename: str
    file_type: str


class DocumentResponse(BaseModel):
    id: UUID
    filename: str
    file_type: str
    upload_date: datetime
    status: str
    total_rows: int
    processed_rows: int

    class Config:
        from_attributes = True


# Budget Item Schemas
class BudgetItemCreate(BaseModel):
    ro_code: Optional[str] = None
    ro_name: Optional[str] = None
    opd_name: Optional[str] = None
    sector: Optional[str] = None
    amount: Optional[float] = None
    tag_code: Optional[str] = None
    tag_label: Optional[str] = None
    activity_type: Optional[str] = None
    justification: Optional[str] = None


class BudgetItemResponse(BaseModel):
    id: UUID
    document_id: UUID
    ro_code: Optional[str]
    ro_name: Optional[str]
    opd_name: Optional[str]
    sector: Optional[str]
    amount: Optional[float]
    tag_code: Optional[str]
    tag_label: Optional[str]
    activity_type: Optional[str]
    justification: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


# Analytics Schemas
class DashboardStats(BaseModel):
    total_budget: float
    climate_budget_percentage: float
    funding_gap: float
    total_ro: int


class SectorDistribution(BaseModel):
    sector: str
    amount: float


class MitigationAdaptationRatio(BaseModel):
    mitigation: float
    adaptation: float
    non_climate: float


# EFT Calculator Schemas
class EFTCalculationInput(BaseModel):
    ika: float = Field(..., ge=0, le=100)
    iku: float = Field(..., ge=0, le=100)
    hutan: float = Field(..., ge=0, le=100)
    sampah: float = Field(..., ge=0, le=100)


class EFTCalculationResult(BaseModel):
    icke: float
    tape: float
    take: float
    recommendations: List[str]


# Configuration Schema
class ConfigurationUpdate(BaseModel):
    key: str
    value: str
