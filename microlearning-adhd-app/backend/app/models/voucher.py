from sqlmodel import Field, SQLModel


class VoucherCode(SQLModel, table=True):
    __table_args__ = {
        "sqlite_with_rowid": False
    }  # No rowid, instead ordered by code, so no timebased break of anonymity
    code: str = Field(primary_key=True)
