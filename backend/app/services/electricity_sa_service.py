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

    # Getch all electricity data with limit
    def get_all(self, limit: int = 100) -> List[ElectricityData]:
        result = (
            self.context.query(ElectricityData)
            .order_by(ElectricityData.date)
            .limit(limit)
            .all()
        )
        return result

    # Fetch electricity data for a specific date
    def get_by_date(self, date: date) -> List[ElectricityData]:
        result = (
            self.context.query(ElectricityData)
            .filter(ElectricityData.date == date)
            .order_by(ElectricityData.starttime)
            .all()
        )
        return result

    # Get a summary of electricity consumption, production and price for a specific date
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

    # Find the longest period of negative electricity price for a given date
    def get_longest_negative_price_period(
        self, date: date
    ) -> Optional[NegativePricePeriodDto]:
        try:
            # Fetch all data for the given date
            data = (
                self.context.query(ElectricityData)
                .filter(ElectricityData.date == date)
                .order_by(ElectricityData.starttime)
                .all()
            )

            # If there is no data, return None
            if not data:
                return None

            # Variables to track the longest negative price period
            current_sequence = 0
            sequence_start = None
            prices_sum = 0

            best_sequence_start = None
            best_sequence_length = 0
            best_sequence_avg_price = 0

            # Loop through the data to find the longest negative price period
            for item in data:
                # Check if price is negative
                if item.hourlyprice and item.hourlyprice < 0:
                    if current_sequence == 0:
                        # Mark the start time of the sequence
                        sequence_start = item.starttime
                    # Increment the current negative price period length
                    current_sequence += 1
                    # Add to the sum of negative prices
                    prices_sum += item.hourlyprice
                else:
                    # if sequence ends, check if it's the longest swquence
                    if current_sequence > best_sequence_length:
                        best_sequence_length = current_sequence
                        best_sequence_start = sequence_start
                        best_sequence_avg_price = (
                            prices_sum / current_sequence if current_sequence > 0 else 0
                        )
                    # Reset current sequence and price sum
                    current_sequence = 0
                    prices_sum = 0

            # Final check if the last sequence is the longest
            if current_sequence > best_sequence_length:
                best_sequence_length = current_sequence
                best_sequence_start = sequence_start
                best_sequence_avg_price = (
                    prices_sum / current_sequence if current_sequence > 0 else 0
                )

            # Return the longest negative price period as a DTO
            return NegativePricePeriodDto(
                start_time=best_sequence_start,
                duration_hours=best_sequence_length,
                avg_price=best_sequence_avg_price,
            )

        except Exception as e:
            logger.error(f"Error calculating negative price period: {str(e)}")
            return None

    # Fetch the date range (min and max date) of the electricity data
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
