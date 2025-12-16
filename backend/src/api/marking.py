from collections.abc import Sequence
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from src.db import get_session
from src.schemas import Marking

marking_router = APIRouter()


@marking_router.post("/marking/", response_model=Marking, status_code=201)
def create_mark(*, session: Annotated[Session, Depends(get_session)], mark: Marking) -> Marking:
    db_mark = Marking.model_validate(mark)
    session.add(db_mark)
    session.commit()
    session.refresh(db_mark)
    return db_mark


@marking_router.get("/marking/{mark_id}", response_model=Marking)
def read_mark(*, session: Annotated[Session, Depends(get_session)], mark_id: UUID) -> Marking:
    mark = session.get(Marking, mark_id)
    if not mark:
        raise HTTPException(status_code=404, detail="Mark not found")
    return mark


@marking_router.get("/marking/event/{event_id}", response_model=Sequence[Marking])
def read_marks_by_event(*, session: Annotated[Session, Depends(get_session)], event_id: UUID) -> Sequence[Marking]:
    marks = session.exec(
        select(Marking).where(Marking.event_id == event_id)
    ).all()
    return marks


@marking_router.patch("/marking/{mark_id}", response_model=Marking)
def update_mark(
    *,
    session: Annotated[Session, Depends(get_session)],
    mark_id: UUID,
    new_mark: int,
    jury_id: UUID
) -> Marking:
    mark = session.get(Marking, mark_id)
    if not mark:
        raise HTTPException(status_code=404, detail="Mark not found")

    if mark.jury_id != jury_id:
        raise HTTPException(status_code=403, detail="Only the jury who created this mark can update it")

    mark.mark = new_mark
    session.add(mark)
    session.commit()
    session.refresh(mark)
    return mark


@marking_router.delete("/marking/{mark_id}", status_code=204)
def delete_mark(
    *, session: Annotated[Session, Depends(get_session)], mark_id: UUID, jury_id: UUID
) -> None:
    mark = session.get(Marking, mark_id)
    if not mark:
        raise HTTPException(status_code=404, detail="Mark not found")

    if mark.jury_id != jury_id:
        raise HTTPException(status_code=403, detail="Only the jury who created this mark can delete it")

    session.delete(mark)
    session.commit()
