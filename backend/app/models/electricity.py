from sqlalchemy import BigInteger, Column, Numeric, Date, DateTime
from .base import Base


class ElectricityData(Base):
    __tablename__ = "electricitydata"
    id = Column(BigInteger, primary_key=True)
    date = Column(Date, nullable=True)
    starttime = Column(DateTime, nullable=True)
    productionamount = Column(Numeric(11, 5), nullable=True)
    consumptionamount = Column(Numeric(11, 3), nullable=True)
    hourlyprice = Column(Numeric(6, 3), nullable=True)
