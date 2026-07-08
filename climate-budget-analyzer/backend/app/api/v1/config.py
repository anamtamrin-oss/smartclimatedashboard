from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from ..core.database import get_db
from ..schemas.schemas import ConfigurationUpdate
from ..models.models import Configuration

router = APIRouter(prefix="/config", tags=["Configuration"])


@router.get("/")
def get_config(db: Session = Depends(get_db)):
    configs = db.query(Configuration).all()
    return {c.key: c.value for c in configs}


@router.put("/")
def update_config(config_data: ConfigurationUpdate, db: Session = Depends(get_db)):
    config = db.query(Configuration).filter(
        Configuration.key == config_data.key
    ).first()
    
    if config:
        config.value = config_data.value
    else:
        config = Configuration(
            key=config_data.key,
            value=config_data.value
        )
        db.add(config)
    
    db.commit()
    return {"message": "Configuration updated"}
