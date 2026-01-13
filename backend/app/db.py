import os
from typing import Annotated
from fastapi.params import Depends
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

# Creates a SQLAlchemy engine by reading the database URL from environment variables
engine = create_engine(os.getenv("SQLALCHEMY_DATABASE_URL"))

# Creates a session factory to manage database connection
session = sessionmaker(bind=engine, autocommit=False, autoflush=False)


# Dependency function to get a database connection
def get_db_conn():
    con = None
    try:
        # Creates a new database session
        con = session()
        # Yields the connection to be used in API endpoints
        yield con
    finally:
        # Closes the connection after use
        if con is not None:
            con.close()


# Annotates the Db type as a Session with the dependency function get_db_conn
# Allows FastAPI to inject the database session in API endpoint functions
Db = Annotated[Session, Depends(get_db_conn)]
