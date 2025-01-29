import os
from typing import Annotated
from fastapi.params import Depends
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

engine = create_engine(os.getenv("SQLALCHEMY_DATABASE_URL"))
session = sessionmaker(bind=engine, autocommit=False, autoflush=False)


def get_db_conn():
    con = None
    try:
        con = session()
        yield con
    finally:
        if con is not None:
            con.close()


Db = Annotated[Session, Depends(get_db_conn)]
