from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from ..core.database import get_db
from ..schemas.schemas import BudgetItemResponse, DashboardStats, SectorDistribution, MitigationAdaptationRatio
from ..models.models import BudgetItem, Document
from sqlalchemy import func

router = APIRouter(prefix="/budget-items", tags=["Budget Items"])


@router.get("/", response_model=List[BudgetItemResponse])
def list_budget_items(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    sector: Optional[str] = None,
    tag_code: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(BudgetItem)
    
    if search:
        query = query.filter(
            (BudgetItem.ro_name.ilike(f"%{search}%")) |
            (BudgetItem.ro_code.ilike(f"%{search}%"))
        )
    
    if sector:
        query = query.filter(BudgetItem.sector == sector)
    
    if tag_code:
        query = query.filter(BudgetItem.tag_code == tag_code)
    
    items = query.offset(skip).limit(limit).all()
    return items


@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_budget = db.query(func.sum(BudgetItem.amount)).scalar() or 0
    climate_budget = db.query(func.sum(BudgetItem.amount)).filter(
        BudgetItem.tag_code.in_(["004", "007"])
    ).scalar() or 0
    
    climate_percentage = (climate_budget / total_budget * 100) if total_budget > 0 else 0
    total_ro = db.query(func.count(BudgetItem.id)).scalar() or 0
    
    # Funding gap calculation (example: target is 30% climate budget)
    target_climate = total_budget * 0.30
    funding_gap = target_climate - climate_budget
    
    return DashboardStats(
        total_budget=float(total_budget),
        climate_budget_percentage=climate_percentage,
        funding_gap=float(funding_gap),
        total_ro=total_ro
    )


@router.get("/sector-distribution", response_model=List[SectorDistribution])
def get_sector_distribution(db: Session = Depends(get_db)):
    results = db.query(
        BudgetItem.sector,
        func.sum(BudgetItem.amount).label("total")
    ).group_by(BudgetItem.sector).all()
    
    return [SectorDistribution(sector=r.sector, amount=float(r.total)) for r in results]


@router.get("/mitigation-adaptation-ratio", response_model=MitigationAdaptationRatio)
def get_mitigation_adaptation_ratio(db: Session = Depends(get_db)):
    mitigation = db.query(func.sum(BudgetItem.amount)).filter(
        BudgetItem.tag_code == "004"
    ).scalar() or 0
    
    adaptation = db.query(func.sum(BudgetItem.amount)).filter(
        BudgetItem.tag_code == "007"
    ).scalar() or 0
    
    non_climate = db.query(func.sum(BudgetItem.amount)).filter(
        BudgetItem.tag_code == "000"
    ).scalar() or 0
    
    return MitigationAdaptationRatio(
        mitigation=float(mitigation),
        adaptation=float(adaptation),
        non_climate=float(non_climate)
    )
