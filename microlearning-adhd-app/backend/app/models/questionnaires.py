from datetime import datetime

from sqlmodel import Field, SQLModel, UniqueConstraint
from sqlmodel.main import SQLModelMetaclass

from app.config import (ADHD_SCREENING_ITEM_COUNT, FAM_ITEM_COUNT, PANAS_ITEM_COUNT, UES_ITEM_COUNT)


def _make_likert_model(name: str, prefix: str, count: int) -> type[SQLModel]:
    """
      Build a Likert-questionnaire table model.

      Shape:
        Surrogate id
        Owning participant
        Group assignment at submission time
        Subgroup at submission time
        One integer column per item (``{prefix}1`` .. ``{prefix}{count}``)
        Submission timestamp
    """

    annotations: dict[str, object] = {
        "id": int | None,
        "participant_id": str,
        "assignment": str,
        "subgroup": str,
    }

    namespace: dict[str, object] = {
        "id": Field(default=None, primary_key=True),
        "participant_id": Field(foreign_key="participantsession.id"),
        "__table_args__": (
            UniqueConstraint("participant_id", name=f"uq_{name.lower()}_participant_id"),
        )
    }

    for index in range(1, count + 1):
        annotations[f"{prefix}{index}"] = int
    annotations["submitted_at"] = datetime

    namespace["__annotations__"] = annotations
    namespace["__module__"] = __name__
    
    return SQLModelMetaclass(name, (SQLModel,), namespace, table=True)


"""
  o ASRS-based ADHD screening (18 items)
  o PANAS (20 items, measured pre and post),
  o FAM (18 items)
  o UES (30 items). 
  
  Item counts are held in app/config.py.
  TODO: Move question contents from frontend to backend and fetch them on questionnaire load.
"""
AdhdScreeningResponse = _make_likert_model("AdhdScreeningResponse", "adhd", ADHD_SCREENING_ITEM_COUNT)
PanasPreResponse = _make_likert_model("PanasPreResponse", "panas", PANAS_ITEM_COUNT)
PanasPostResponse = _make_likert_model("PanasPostResponse", "panas", PANAS_ITEM_COUNT)
FamResponse = _make_likert_model("FamResponse", "fam", FAM_ITEM_COUNT)
UesResponse = _make_likert_model("UesResponse", "ues", UES_ITEM_COUNT)
