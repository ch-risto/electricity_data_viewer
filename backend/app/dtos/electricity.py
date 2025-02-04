from typing import Optional
from pydantic import BaseModel
from datetime import date, datetime
from decimal import Decimal


#
class ElectricityDataDto(BaseModel):
    # id: int
    # date: date
    starttime: Optional[datetime] = None
    productionamount: Optional[Decimal] = None
    consumptionamount: Optional[Decimal] = None
    hourlyprice: Optional[Decimal] = None

    class Config:
        from_attributes = True


class ElectricityDataListByDayDto(BaseModel):
    date: date
    data: list[ElectricityDataDto]

    class Config:
        from_attributes = True


class ElectricityDataSummaryDto(BaseModel):
    date: date
    total_consumption: Optional[Decimal] = None
    total_production: Optional[Decimal] = None
    avg_price: Optional[Decimal] = None

    class Config:
        from_attributes = True


class NegativePricePeriodDto(BaseModel):
    start_time: Optional[datetime] = None
    duration_hours: Optional[int] = None
    avg_price: Optional[Decimal] = None


class ElectricityDateRangeDto(BaseModel):
    minDate: date
    maxDate: date
