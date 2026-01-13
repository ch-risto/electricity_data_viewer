from datetime import date
from typing import List, Optional

from sqlalchemy import func

from app.services.electricity_service_base import ElectricityServiceBase
from app.db import Db
from app.models.electricity import ElectricityData
from app.dtos.electricity import ElectricityDateRangeDto, NegativePricePeriodDto
import traceback
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


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

    def get_longest_negative_price_period(
        self, date: date
    ) -> Optional[NegativePricePeriodDto]:
        try:
            data = (
                self.context.query(ElectricityData)
                .filter(ElectricityData.date == date)
                .order_by(ElectricityData.starttime)
                .all()
            )
            logger.debug(f"kyselyssä: {data}")

            if not data:
                return None

            current_sequence = 0
            sequence_start = None
            prices_sum = 0

            best_sequence_start = None
            best_sequence_length = 0
            best_sequence_avg_price = 0

            for item in data:
                logger.debug(f"item {item}, hourlyprice {item.hourlyprice}")
                if item.hourlyprice and item.hourlyprice < 0:
                    logger.debug("check, negative hourlyprice")
                    if current_sequence == 0:
                        sequence_start = item.starttime
                    current_sequence += 1
                    prices_sum += item.hourlyprice
                else:
                    if current_sequence > best_sequence_length:
                        best_sequence_length = current_sequence
                        best_sequence_start = sequence_start
                        best_sequence_avg_price = (
                            prices_sum / current_sequence if current_sequence > 0 else 0
                        )
                    current_sequence = 0
                    prices_sum = 0

            if current_sequence > best_sequence_length:
                best_sequence_length = current_sequence
                best_sequence_start = sequence_start
                best_sequence_avg_price = (
                    prices_sum / current_sequence if current_sequence > 0 else 0
                )

            return NegativePricePeriodDto(
                start_time=best_sequence_start,
                duration_hours=best_sequence_length,
                avg_price=best_sequence_avg_price,
            )

        except Exception as e:
            logger.error(f"Error calculating negative price period: {str(e)}")
            return None

    def get_date_range(self) -> ElectricityDateRangeDto:
        try:
            result = self.context.query(
                func.min(ElectricityData.date).label("min_date"),
                func.max(ElectricityData.date).label("max_date"),
            ).first()
            return ElectricityDateRangeDto(
                minDate=result.min_date, maxDate=result.max_date
            )
        except Exception as e:
            logger.debug(f"Error fetching {traceback.format_exc(e.__traceback__)}")
