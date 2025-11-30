from collections.abc import Sequence
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from src.db import get_session
from src.schemas import Jury

jury_router = APIRouter()


@jury_router.post("/jury/", response_model=Jury, status_code=201)
def create_jury(
    *, session: Annotated[Session, Depends(get_session)], jury: Jury
) -> Jury:
    db_jury = Jury.model_validate(jury)
    session.add(db_jury)
    session.commit()
    session.refresh(db_jury)
    return db_jury


@jury_router.get("/jury/", response_model=Sequence[Jury])
def read_juries(
    *,
    session: Annotated[Session, Depends(get_session)],
    offset: int = 0,
    limit: int = 100,
) -> Sequence[Jury]:
    juries = session.exec(select(Jury).offset(offset).limit(limit)).all()
    return juries


@jury_router.get("/jury/{jury_id}", response_model=Jury)
def read_jury(
    *, session: Annotated[Session, Depends(get_session)], jury_id: UUID
) -> Jury:
    jury = session.get(Jury, jury_id)
    if not jury:
        raise HTTPException(status_code=404, detail="Jury not found")
    return jury


@jury_router.delete("/jury/{jury_id}", status_code=204)
def delete_jury(
    *, session: Annotated[Session, Depends(get_session)], jury_id: UUID
) -> None:
    jury = session.get(Jury, jury_id)
    if jury:
        session.delete(jury)
        session.commit()
    else:
        raise HTTPException(status_code=404, detail="Jury not found")
