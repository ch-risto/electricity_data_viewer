from typing import List

from fastapi import APIRouter, HTTPException

from app.dtos.electricity import (
    ElectricityDataDto,
    ElectricityDataListByDayDto,
    ElectricityDataSummaryDto,
    ElectricityDateRangeDto,
    NegativePricePeriodDto,
)
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


@router.get("/negative_price_period/{date}")
async def get_longest_negative_price_period(
    date, service: ElectricityService
) -> NegativePricePeriodDto:
    logger.debug(f"negismesta")
    result = service.get_longest_negative_price_period(date)
    logger.debug(f"no negative info result {result}")
    if not result:
        raise HTTPException(
            detail="Price information for that day not found", status_code=404
        )

    return NegativePricePeriodDto(
        start_time=result.start_time,
        duration_hours=result.duration_hours,
        avg_price=result.avg_price,
    )


@router.get("/date_range")
async def get_date_range(service: ElectricityService) -> ElectricityDateRangeDto:
    result = service.get_date_range()
    if not result:
        raise HTTPException(
            detail="Electricity information for that day not found", status_code=404
        )

    return ElectricityDateRangeDto(minDate=result.minDate, maxDate=result.maxDate)


# Routeja mitä tarvitaan:
# Longest consecutive time in hours, when electricity price has been negative, per day

# Routeja, mitä vois olla hyvä olla
#
