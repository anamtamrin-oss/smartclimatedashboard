from fastapi import APIRouter
from .auth import router as auth_router
from .documents import router as documents_router
from .budget_items import router as budget_items_router
from .eft import router as eft_router
from .config import router as config_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(documents_router)
api_router.include_router(budget_items_router)
api_router.include_router(eft_router)
api_router.include_router(config_router)

__all__ = ["api_router"]
