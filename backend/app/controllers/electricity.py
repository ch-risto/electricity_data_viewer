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

# define API router for electricity-related endpoints
router = APIRouter(prefix="/electricity", tags=["electricity data"])


@router.get("/limit/{limit}")
async def get_all(limit: int, service: ElectricityService) -> List[ElectricityDataDto]:
    """Fetches limited number of electricity data entries."""
    result = service.get_all(limit)
    return [ElectricityDataDto.model_validate(r) for r in result]


@router.get("/by-date/{date}")
async def get_by_date(date, service: ElectricityService) -> ElectricityDataListByDayDto:
    """Fetches electricity data for a specific date."""
    result = service.get_by_date(date)
    if not result:
        raise HTTPException(
            detail="Electricity information for that day not found", status_code=404
        )
    electricity_data_dtos = [ElectricityDataDto.model_validate(r) for r in result]

    return ElectricityDataListByDayDto(date=date, data=electricity_data_dtos)


@router.get("/electricity-summary/{date}")
async def get_summary_by_date(
    date, service: ElectricityService
) -> ElectricityDataSummaryDto:
    """Fetches total consumption, total production and average price for specific date."""
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


@router.get("/negative-price-period/{date}")
async def get_longest_negative_price_period(
    date, service: ElectricityService
) -> NegativePricePeriodDto:
    """Finds the longest period when electricity prices were negative."""
    result = service.get_longest_negative_price_period(date)
    if not result:
        raise HTTPException(
            detail="Price information for that day not found", status_code=404
        )

    return NegativePricePeriodDto(
        start_time=result.start_time,
        duration_hours=result.duration_hours,
        avg_price=result.avg_price,
    )


@router.get("/date-range")
async def get_date_range(service: ElectricityService) -> ElectricityDateRangeDto:
    """Retrieves the available date range for electricity data."""
    result = service.get_date_range()
    if not result:
        print("VAROITUS: Tietokanta on tyhjä tai kysely ei palauttanut mitään!")
        # Palautetaan keksityt päivämäärät jotta nähdään, toimiiko frontend
        from datetime import date

        return ElectricityDateRangeDto(
            minDate=date(2023, 1, 1), maxDate=date(2023, 12, 31)
        )

    return ElectricityDateRangeDto(minDate=result.minDate, maxDate=result.maxDate)


# Routeja mitä tarvitaan:
# Longest consecutive time in hours, when electricity price has been negative, per day

# Routeja, mitä vois olla hyvä olla
#
