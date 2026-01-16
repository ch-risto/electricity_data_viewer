from typing import Optional
from pydantic import BaseModel, ConfigDict
from datetime import date, datetime
from decimal import Decimal

# Data Transfer Objects (DTO) for electricity datas


class ElectricityDataDto(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    # id: int
    # date: date
    starttime: Optional[datetime] = None
    productionamount: Optional[Decimal] = None
    consumptionamount: Optional[Decimal] = None
    hourlyprice: Optional[Decimal] = None


class ElectricityDataListByDayDto(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    date: date
    data: list[ElectricityDataDto]


class ElectricityDataSummaryDto(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    date: date
    total_consumption: Optional[Decimal] = None
    total_production: Optional[Decimal] = None
    avg_price: Optional[Decimal] = None


class NegativePricePeriodDto(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    start_time: Optional[datetime] = None
    duration_hours: Optional[int] = None
    avg_price: Optional[Decimal] = None


class ElectricityDateRangeDto(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    minDate: date
    maxDate: date
