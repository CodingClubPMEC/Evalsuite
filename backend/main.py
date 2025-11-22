from fastapi import FastAPI

from backend.handlers import health_handler
from backend.router import RouteInfo, register_routes

from backend.api.jury.router import JURY_ROUTES

server: FastAPI = FastAPI()


async def index_handler() -> dict[str, dict[str, object]]:
    extracted_info: dict[str, dict[str, object]] = {
        path: {
            "name": route_details.name,
            "description": route_details.description,
            "methods_implemented": route_details.methods_implemented,
            "reponse_model": route_details.response_model,
        }
        for path, route_details in ROUTES_INFO.items()
    }
    return extracted_info


ROUTES_INFO: dict[str, RouteInfo] = {
    "/": RouteInfo(
        name="Index",
        description="Shows the description of all the routes.",
        methods_implemented=["Get"],
        response_model=None,
        handler=index_handler,
    ),
    "/health": RouteInfo(
        name="health",
        description="Shows if the health of the server.",
        methods_implemented=["Get"],
        response_model=None,
        handler=health_handler,
    ),
}

register_routes(server, ROUTES_INFO)
register_routes(server, JURY_ROUTES)
