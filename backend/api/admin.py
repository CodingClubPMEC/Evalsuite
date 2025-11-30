from collections.abc import Sequence
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from backend import Admin, get_session

admin_router = APIRouter()


@admin_router.post("/admin/", response_model=Admin, status_code=201)
def create_admin(
    *, session: Annotated[Session, Depends(get_session)], admin: Admin
) -> Admin:
    db_admin = Admin.model_validate(admin)
    session.add(db_admin)
    session.commit()
    session.refresh(db_admin)
    return db_admin


@admin_router.get("/admin/", response_model=Sequence[Admin])
def read_admins(
    *,
    session: Annotated[Session, Depends(get_session)],
    offset: int = 0,
    limit: int = 10,
) -> Sequence[Admin]:
    admins = session.exec(select(Admin).offset(offset).limit(limit)).all()
    return admins


@admin_router.get("/admin/{admin_id}", response_model=Admin)
def read_admin(
    *, session: Annotated[Session, Depends(get_session)], admin_id: UUID
) -> Admin:
    admin = session.get(Admin, admin_id)
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")
    return admin


@admin_router.delete("/admin/{admin_id}", status_code=204)
def delete_admin(
    *, session: Annotated[Session, Depends(get_session)], admin_id: UUID
) -> None:
    admin = session.get(Admin, admin_id)
    if admin:
        session.delete(admin)
        session.commit()
    else:
        raise HTTPException(status_code=404, detail="Admin not found")
