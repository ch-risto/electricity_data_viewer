import pytest
from datetime import date, datetime
from unittest.mock import Mock
from app.services.electricity_sa_service import ElectricitySaService
from app.models.electricity import ElectricityData


class TestElectricitySaService:
    @pytest.fixture
    def mock_db(self):
        mock_db = Mock()

        return mock_db

    @pytest.fixture
    def service(self, mock_db):
        return ElectricitySaService(mock_db)

    @pytest.fixture
    def setup_empty_data(self, mock_db):
        mock_db.query.return_value.order_by.return_value.limit.return_value.all.return_value = []
        return mock_db

    @pytest.fixture
    def setup_sample_data(self, mock_db):
        sample_data = [
            ElectricityData(
                id=1,
                date=date(2024, 1, 1),
                starttime="2024-01-01T00:00:00",
                consumptionamount=100.0,
                productionamount=150.0,
                hourlyprice=-5.0,
            ),
            ElectricityData(
                id=2,
                date=date(2024, 1, 1),
                starttime="2024-01-01T01:00:00",
                consumptionamount=200.0,
                productionamount=250.0,
                hourlyprice=10.0,
            ),
        ]
        mock_db.query.return_value.order_by.return_value.limit.return_value.all.return_value = sample_data
        return mock_db

    @pytest.fixture
    def sample_data(self):
        return [
            ElectricityData(
                id=1,
                date=date(2024, 1, 1),
                starttime=datetime(2024, 1, 1, 0, 0, 0),
                consumptionamount=100.0,
                productionamount=150.0,
                hourlyprice=-5.0,
            ),
            ElectricityData(
                id=2,
                date=date(2024, 1, 2),
                starttime=datetime(2024, 1, 2, 1, 0, 0),
                consumptionamount=200.0,
                productionamount=250.0,
                hourlyprice=10.0,
            ),
        ]


class TestGetAllMethod(TestElectricitySaService):
    def test_get_all_with_default_limit(self, service, setup_sample_data):
        """Test that get_all() fetches 100 records by default"""

        result = service.get_all(100)

        # 3. ASSERT - Check it worked correctly
        assert len(result) == 2
        assert result[0].id == 1
        assert result[1].id == 2

    def test_get_all_returns_empty_list(self, service, setup_empty_data):
        """Test that get_all() returns empty list when no data is present"""

        # 2. ACT
        result = service.get_all(100)

        # 3. ASSERT
        assert result == []

    def test_get_all_with_custom_limit(self, service, mock_db, sample_data):
        """Test that get_all() respects a custom limit"""

        mock_db.query.return_value.order_by.return_value.limit.return_value.all.return_value = sample_data

        service.get_all(1)

        mock_db.query.return_value.order_by.return_value.limit.assert_called_with(1)


class TestGetByDateMethod(TestElectricitySaService):
    def test_get_by_date_returns_data(self, service, mock_db, sample_data):
        """Test that get_by_date() returns data for a specific date"""

        mock_db.query.return_value.filter.return_value.order_by.return_value.all.return_value = sample_data

        result = service.get_by_date(date(2024, 1, 1))

        # assert len(result) == 1
        assert len(result) == 2
        assert result[0].id == 1
        assert result[0].date == date(2024, 1, 1)

    def test_get_by_date_no_data(self, service, mock_db):
        """Test that get_by_date() returns empty list when no data for the date"""

        mock_db.query.return_value.filter.return_value.order_by.return_value.all.return_value = []

        result = service.get_by_date(date(2024, 1, 2))

        assert result == []


class TestGetSummaryByDateMethod(TestElectricitySaService):
    def test_get_summary_by_date_returns_summary(self, service, mock_db):
        """Test that get_summary_by_date() returns correct summary data"""

        mock_summary = Mock()
        mock_summary.total_consumption = 300.0
        mock_summary.total_production = 400.0
        mock_summary.avg_price = 2.5

        mock_db.query.return_value.filter.return_value.first.return_value = mock_summary

        result = service.get_summary_by_date(date(2024, 1, 1))

        assert result.total_consumption == 300.0
        assert result.total_production == 400.0
        assert result.avg_price == 2.5


class TestGetLongestNegativePricePeriodMethod(TestElectricitySaService):
    def test_no_data_returns_none(self, service, mock_db):
        """Test that get_longest_negative_price_period() returns None when no data is present"""

        mock_db.query.return_value.filter.return_value.order_by.return_value.all.return_value = []

        result = service.get_longest_negative_price_period(date(2024, 1, 1))

        assert result is None

    def test_no_negative_prices(self, service, mock_db):
        """Test that get_longest_negative_price_period() returns zero duration when no negative prices"""

        sample_data = [
            ElectricityData(
                id=1,
                date=date(2024, 1, 1),
                starttime="2024-01-01T00:00:00",
                consumptionamount=100.0,
                productionamount=150.0,
                hourlyprice=5.0,
            ),
            ElectricityData(
                id=2,
                date=date(2024, 1, 1),
                starttime="2024-01-01T01:00:00",
                consumptionamount=200.0,
                productionamount=250.0,
                hourlyprice=10.0,
            ),
        ]

        mock_db.query.return_value.filter.return_value.order_by.return_value.all.return_value = sample_data

        result = service.get_longest_negative_price_period(date(2024, 1, 1))

        assert result.duration_hours == 0
        assert result.avg_price == 0

    def test_single_negative_period(self, service, mock_db, sample_data):
        """Test that get_longest_negative_price_period() correctly identifies a single negative price period"""

        mock_db.query.return_value.filter.return_value.order_by.return_value.all.return_value = sample_data

        result = service.get_longest_negative_price_period(date(2024, 1, 1))

        assert result.duration_hours == 1
        assert result.avg_price == -5.0

    def test_multiple_negative_periods(self, service, mock_db):
        """Test that get_longest_negative_price_period() returns the longest negative price period when multiple exist"""

        sample_data = [
            ElectricityData(
                id=1,
                date=date(2024, 1, 1),
                starttime="2024-01-01T00:00:00",
                consumptionamount=100.0,
                productionamount=150.0,
                hourlyprice=-3.0,
            ),
            ElectricityData(
                id=2,
                date=date(2024, 1, 1),
                starttime="2024-01-01T01:00:00",
                consumptionamount=200.0,
                productionamount=250.0,
                hourlyprice=-4.0,
            ),
            ElectricityData(
                id=3,
                date=date(2024, 1, 1),
                starttime="2024-01-01T02:00:00",
                consumptionamount=150.0,
                productionamount=200.0,
                hourlyprice=2.0,
            ),
            ElectricityData(
                id=4,
                date=date(2024, 1, 1),
                starttime="2024-01-01T03:00:00",
                consumptionamount=120.0,
                productionamount=180.0,
                hourlyprice=-2.0,
            ),
        ]

        mock_db.query.return_value.filter.return_value.order_by.return_value.all.return_value = sample_data

        result = service.get_longest_negative_price_period(date(2024, 1, 1))

        assert result.duration_hours == 2
        assert result.avg_price == -3.5
