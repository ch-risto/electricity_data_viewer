from datetime import date
from app.services.electricity_sa_service import ElectricitySaService


class TestElectrityServiceIntegration:
    """Integration tests with real database"""

    def test_get_all_with_real_data(self, test_db, sample_data):
        """Test that get_by_date() returns data for a specific date"""

        test_db.add_all(sample_data)
        test_db.commit()

        service = ElectricitySaService(test_db)

        result = service.get_all(100)

        assert len(result) == 2
        assert result[0].id == 1
        assert result[0].date == date(2024, 1, 1)

    def test_get_by_date_with_real_data(self, test_db, sample_data):
        """Test that get_by_date() returns data for a specific date"""

        test_db.add_all(sample_data)
        test_db.commit()

        service = ElectricitySaService(test_db)

        result = service.get_by_date(date(2024, 1, 1))

        assert len(result) == 1
        assert all(result[i].date == date(2024, 1, 1) for i in range(len(result)))
