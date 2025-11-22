from fastapi import FastAPI

from backend.handlers import health_handler
from backend.router import RouteInfo, register_routes

server: FastAPI = FastAPI()

# WARN: Add middleware


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
    # TODO: Add jury routes
    # TODO: Add organization routes
    # TODO: Add admin routes
    # TODO: Add event routes
    # TODO: Add team routes
    # TODO: Add marking routes
}

register_routes(server, ROUTES_INFO)
