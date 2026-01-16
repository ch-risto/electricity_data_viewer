import pytest
from datetime import date, datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.base import Base
from app.models.electricity import ElectricityData
from app.services.electricity_sa_service import ElectricitySaService


@pytest.fixture
def test_db():
    """Create an in-memory test database for integration tests"""

    engine = create_engine("sqlite:///:memory:")
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    Base.metadata.create_all(bind=engine)

    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(engine)


@pytest.fixture
def sample_data():
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


class TestElectrityServiceIntegration:
    """Integration tests with real database"""

    def test_get_all_with_real_data(self, test_db, sample_data):
        """Test that get_by_date() returns data for a specific date"""

        test_db.add_all(sample_data)
        test_db.commit()

        service = ElectricitySaService(test_db)

        # Act
        result = service.get_all(100)

        # Assert
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
