from collections.abc import Sequence
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from src.db import get_session
from src.schemas import Team

team_router = APIRouter()


@team_router.post("/team/", response_model=Team, status_code=201)
def create_team(*, session: Annotated[Session, Depends(get_session)], team: Team) -> Team:
    db_team = Team.model_validate(team)
    session.add(db_team)
    session.commit()
    session.refresh(db_team)
    return db_team


@team_router.get("/team/event/{event_id}", response_model=Sequence[Team])
def read_teams_by_event(*, session: Annotated[Session, Depends(get_session)], event_id: UUID):
    return session.exec(
        select(Team).where(Team.event_id == event_id)
    ).all()


@team_router.get("/team/{team_id}", response_model=Team)
def read_team(*, session: Annotated[Session, Depends(get_session)], team_id: UUID) -> Team:
    team = session.get(Team, team_id)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    return team


@team_router.delete("/team/{team_id}", status_code=204)
def delete_team(
    *, session: Annotated[Session, Depends(get_session)], team_id: UUID
) -> None:
    team = session.get(Team, team_id)
    if team:
        session.delete(team)
        session.commit()
    else:
        raise HTTPException(status_code=404, detail="Team not found")
