from collections.abc import Sequence
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from src.db import get_session
from src.schemas import Org

org_router = APIRouter()


@org_router.post("/org/", response_model=Org, status_code=201)
def create_org(*, session: Annotated[Session, Depends(get_session)], org: Org) -> Org:
    db_org = Org.model_validate(org)
    session.add(db_org)
    session.commit()
    session.refresh(db_org)
    return db_org


@org_router.get("/org/", response_model=Sequence[Org])
def read_orgs(
    *,
    session: Annotated[Session, Depends(get_session)],
    offset: int = 0,
    limit: int = 10,
) -> Sequence[Org]:
    orgs = session.exec(select(Org).offset(offset).limit(limit)).all()
    return orgs


@org_router.get("/org/{org_id}", response_model=Org)
def read_org(*, session: Annotated[Session, Depends(get_session)], org_id: UUID) -> Org:
    org = session.get(Org, org_id)
    if not org:
        raise HTTPException(status_code=404, detail="Org not found")
    return org


@org_router.delete("/org/{org_id}", status_code=204)
def delete_org(
    *, session: Annotated[Session, Depends(get_session)], org_id: UUID
) -> None:
    org = session.get(Org, org_id)
    if org:
        session.delete(org)
        session.commit()
    else:
        raise HTTPException(status_code=404, detail="Org not found")
