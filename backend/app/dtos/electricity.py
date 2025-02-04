from typing import Optional
from pydantic import BaseModel
from datetime import date, datetime
from decimal import Decimal


#
class ElectricityDataDto(BaseModel):
    # id: int
    # date: date
    starttime: Optional[datetime] = None
    productionamount: Optional[float] = None
    consumptionamount: Optional[float] = None
    hourlyprice: Optional[float] = None

    class Config:
        from_attributes = True


class ElectricityDataListByDayDto(BaseModel):
    date: date
    data: list[ElectricityDataDto]

    class Config:
        from_attributes = True


# TODO: be consistent with types, find out if decimal or float is better (or if it makes any difference)
class ElectricityDataSummaryDto(BaseModel):
    date: date
    total_consumption: Optional[Decimal] = None
    total_production: Optional[Decimal] = None
    avg_price: Optional[Decimal] = None

    class Config:
        from_attributes = True

class ElectricityDateRangeDto(BaseModel):
    minDate: date
    maxDate: date
