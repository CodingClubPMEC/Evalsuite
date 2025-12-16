from contextlib import asynccontextmanager

from fastapi import FastAPI

from .api.admin import admin_router
from .api.event import event_router
from .api.jury import jury_router
from .api.team import team_router

# from .api.criteria import criteria_router
from .api.marking import marking_router
from .api.org import org_router
from .db import create_tables

# from .api.team import team_router


@asynccontextmanager
async def lifespan(server: FastAPI):
    create_tables()
    yield


server: FastAPI = FastAPI(lifespan=lifespan)
# WARN: Add middleware


@server.get("/")
async def index_handler() -> dict[str, str]:
    return {"status": "ok"}


server.include_router(admin_router)
server.include_router(event_router)
server.include_router(jury_router)
server.include_router(org_router)
server.include_router(team_router)
server.include_router(marking_router)
# TODO: Make these routers
# server.include_router(criteria_router)
