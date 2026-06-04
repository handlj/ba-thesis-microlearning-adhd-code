from collections.abc import Generator

from sqlmodel import SQLModel, Session, create_engine

from app.config import DATA_DIR, DATABASE_URL


sqlite_engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
)


def create_db_and_tables() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    SQLModel.metadata.create_all(sqlite_engine)


def get_session() -> Generator[Session, None, None]:
    with Session(sqlite_engine) as session:
        yield session
