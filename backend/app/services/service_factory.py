from typing import Annotated
from fastapi.params import Depends
from app.db import Db
from app.services.electricity_sa_service import ElectricitySaService
from app.services.electricity_service_base import ElectricityServiceBase


# Dependency function to initialize the electricity service
# Takes the database connection as a parameter and returns an instance of ElectricitySaService
def init_electricity_service(context: Db):
    return ElectricitySaService(context)


# Annotate ElectricityService as a dependency that injects an instance of EletricityServiceBase
# FastAPI will use the init_electricity_service function to instantiate and inject the service
ElectricityService = Annotated[
    ElectricityServiceBase, Depends(init_electricity_service)
]
