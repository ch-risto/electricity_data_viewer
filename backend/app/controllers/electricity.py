# from typing import List, Type

from fastapi import APIRouter

from app.models.electricity import ElectricityData
from app.db import Db

router = APIRouter(prefix="/electricity", tags=["electricity data"])


@router.get("/")
async def get_all(context: Db):  # -> List[Type[ElectricityData]]
    all = context.query(ElectricityData).limit(100).all()
    return all
