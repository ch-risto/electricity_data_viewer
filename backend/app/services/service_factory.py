from typing import Annotated
from fastapi.params import Depends
from app.db import Db
from app.services.electricity_sa_service import ElectricitySaService
from app.services.electricity_service_base import ElectricityServiceBase


def init_electricity_service(context: Db):
    return ElectricitySaService(context)


ElectricityService = Annotated[
    ElectricityServiceBase, Depends(init_electricity_service)
]
