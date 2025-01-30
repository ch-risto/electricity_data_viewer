from datetime import date
from typing import List

from sqlalchemy import func

from app.services.electricity_service_base import ElectricityServiceBase
from app.db import Db
from app.models.electricity import ElectricityData


class ElectricitySaService(ElectricityServiceBase):
    def __init__(self, context: Db):
        self.context = context

    def get_all(self, limit: int = 100) -> List[ElectricityData]:
        result = (
            self.context.query(ElectricityData)
            .order_by(ElectricityData.date)
            .limit(limit)
            .all()
        )
        return result

    def get_by_date(self, date: date) -> List[ElectricityData]:
        result = (
            self.context.query(ElectricityData)
            .filter(ElectricityData.date == date)
            .order_by(ElectricityData.starttime)
            .all()
        )
        return result

    def get_summary_by_date(self, date: date) -> ElectricityData:
        result = (
            self.context.query(
                func.sum(ElectricityData.consumptionamount).label("total_consumption"),
                func.sum(ElectricityData.productionamount).label("total_production"),
                func.avg(ElectricityData.hourlyprice).label("avg_price"),
            )
            .filter(ElectricityData.date == date)
            .first()
        )
        return result
