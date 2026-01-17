# ruff: noqa: E402
from pathlib import Path
from dotenv import load_dotenv

# BEFORE any app imports, load the .env file
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(env_path)

from unittest.mock import Base, Mock
from sqlalchemy import create_engine
from app.models.electricity import ElectricityData
from app.services.electricity_sa_service import ElectricitySaService
import pytest
from datetime import date, datetime
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient
from app.main import app


@pytest.fixture
def mock_db():
    """For Service tests - mocking the database session"""
    return Mock()


@pytest.fixture
def mock_electricity_service():
    """For Controller tests - mocking the Electricity Service"""
    mock = Mock()
    mock.get_all.return_value = []
    mock.get_by_date.return_value = []
    mock.get_summary_by_date.return_value = Mock(
        total_consumption=0.0, total_production=0.0, avg_price=0.0
    )
    mock.get_longest_negative_price_period.return_value = Mock(
        start_time=datetime(2024, 1, 1, 0, 0, 0), duration_hours=0, avg_price=0.2
    )

    return mock


@pytest.fixture
def service(mock_db):
    return ElectricitySaService(mock_db)


@pytest.fixture
def client(mock_electricity_service):
    """Test client for FastAPI app with mocked service"""
    # Override the ElectricityService dependency with the mock
    from app.services.service_factory import init_electricity_service

    app.dependency_overrides[init_electricity_service] = (
        lambda: mock_electricity_service
    )

    client_instance = TestClient(app)

    # Clean up after test
    yield client_instance
    app.dependency_overrides.clear()


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


# Sample data fixture for tests
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


# Fixtures for setting up sample data
@pytest.fixture
def setup_empty_data(mock_db):
    mock_db.query.return_value.order_by.return_value.limit.return_value.all.return_value = []
    return mock_db


@pytest.fixture
def setup_sample_data(mock_db):
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
