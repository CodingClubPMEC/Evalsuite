import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlmodel import Session, SQLModel

_ = load_dotenv()

db_url = str(os.getenv("DB_URL"))

engine = create_engine(db_url)
conn = engine.connect()


def create_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session
