from collections.abc import Sequence
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from src.db import get_session
from src.schemas import Event

event_router = APIRouter()


@event_router.post("/event/", response_model=Event, status_code=201)
def create_event(
    *, session: Annotated[Session, Depends(get_session)], event: Event
) -> Event:
    db_event = Event.model_validate(event)
    session.add(db_event)
    session.commit()
    session.refresh(db_event)
    return db_event


@event_router.get("/event/", response_model=Sequence[Event])
def read_events(
    *,
    session: Annotated[Session, Depends(get_session)],
    offset: int = 0,
    limit: int = 10,
) -> Sequence[Event]:
    events = session.exec(select(Event).offset(offset).limit(limit)).all()
    return events


@event_router.get("/event/{event_id}", response_model=Event)
def read_event(
    *, session: Annotated[Session, Depends(get_session)], event_id: UUID
) -> Event:
    event = session.get(Event, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event


@event_router.delete("/event/{event_id}", status_code=204)
def delete_event(
    *, session: Annotated[Session, Depends(get_session)], event_id: UUID
) -> None:
    event = session.get(Event, event_id)
    if event:
        session.delete(event)
        session.commit()
    else:
        raise HTTPException(status_code=404, detail="event not found")
