from datetime import date, datetime
from unittest.mock import Mock


class TestElectricityEndpoints:
    """Tests for the /electricity endpoint"""

    def test_get_all_endpoint_returns_200(self, client, mock_electricity_service):
        """Test that GET /electricity returns 200 OK"""

        mock_electricity_service.get_all.return_value = [
            Mock(
                id=1,
                date=date(2024, 1, 1),
                starttime=datetime(2024, 1, 1, 0, 0, 0),
                consumptionamount=100.0,
                productionamount=150.0,
                hourlyprice=-5.0,
            ),
            Mock(
                id=2,
                date=date(2024, 1, 2),
                starttime=datetime(2024, 1, 2, 1, 0, 0),
                consumptionamount=200.0,
                productionamount=250.0,
                hourlyprice=10.0,
            ),
        ]

        response = client.get("/electricity/limit/100")

        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2
        assert isinstance(data, list)

    def test_get_by_date_endpoint_returns_200(self, client, mock_electricity_service):
        """Test that GET /electricity/date/{date} returns 200 OK"""

        mock_electricity_service.get_by_date.return_value = [
            Mock(
                id=1,
                date=date(2024, 1, 1),
                starttime=datetime(2024, 1, 1, 0, 0, 0),
                consumptionamount=100.0,
                productionamount=150.0,
                hourlyprice=-5.0,
            ),
        ]

        response = client.get("/electricity/by-date/2024-01-01")

        assert response.status_code == 200
        response_data = response.json()

        assert "date" in response_data
        assert "data" in response_data
        assert response_data["date"] == "2024-01-01"
        assert len(response_data["data"]) == 1

    def test_get_by_date_returns_404_when_no_data(
        self, client, mock_electricity_service
    ):
        """Test that 404 is returned when no data exists for date."""

        mock_electricity_service.get_by_date.return_value = []

        response = client.get("/electricity/by-date/2099-12-31")

        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()

    def test_get_summary_by_date_endpoint(self, client, mock_electricity_service):
        """Test /electricity/electricity-summary/{date} endpoint."""

        mock_summary = Mock()
        mock_summary.total_consumption = 300.0
        mock_summary.total_production = 400.0
        mock_summary.avg_price = 2.5

        mock_electricity_service.get_summary_by_date.return_value = mock_summary

        response = client.get("/electricity/electricity-summary/2024-01-01")

        assert response.status_code == 200
        data = response.json()
        assert data["total_consumption"] == "300.0"
        assert data["total_production"] == "400.0"
        assert data["avg_price"] == "2.5"

    def test_negative_price_period_endpoint(self, client):
        """Test /electricity/negative-price-period/{date} endpoint."""

        response = client.get("/electricity/negative-price-period/2024-01-15")

        assert response.status_code in [200, 404]
        if response.status_code == 200:
            data = response.json()
            assert "start_time" in data
            assert "duration_hours" in data
            assert "avg_price" in data
        else:
            assert "not found" in response.json()["detail"].lower()
