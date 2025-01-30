from typing import List, Type

from fastapi import APIRouter, HTTPException
from sqlalchemy import func

from app.models.electricity import ElectricityData
from app.dtos.electricity import (
    ElectricityDataDto,
    ElectricityDataListByDayDto,
    ElectricityDataSummaryDto,
)
from app.db import Db
from app.services.service_factory import ElectricityService
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/electricity", tags=["electricity data"])


@router.get("/limit/{limit}")
async def get_all(limit, service: ElectricityService) -> List[ElectricityDataDto]:
    result = service.get_all(limit)
    return [ElectricityDataDto.model_validate(r) for r in result]


@router.get("/by_date/{date}")
async def get_by_date(date, service: ElectricityService) -> ElectricityDataListByDayDto:
    result = service.get_by_date(date)
    if not result:
        raise HTTPException(
            detail="Electricity information for that day not found", status_code=404
        )
    electricity_data_dtos = [ElectricityDataDto.model_validate(r) for r in result]

    return ElectricityDataListByDayDto(date=date, data=electricity_data_dtos)


@router.get("/electricity_summary/{date}")
async def get_summary_by_date(
    date, service: ElectricityService
) -> ElectricityDataSummaryDto:
    result = service.get_summary_by_date(date)
    if not result:
        raise HTTPException(
            detail="Electricity information for that day not found", status_code=404
        )

    return ElectricityDataSummaryDto(
        date=date,
        total_consumption=result.total_consumption,
        total_production=result.total_production,
        avg_price=result.avg_price,
    )


# Routeja mitä tarvitaan:
# Longest consecutive time in hours, when electricity price has been negative, per day

# Routeja, mitä vois olla hyvä olla
#
