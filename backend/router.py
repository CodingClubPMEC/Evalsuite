from fastapi import FastAPI
from backend.types import RouteInfo
from backend.api.jury.router import JURY_ROUTES

def register_routes(server: FastAPI, routes_info: dict[str, RouteInfo]) -> None:
    all_routes = {
        **routes_info,
        **JURY_ROUTES
    }

    for route_path, route_detail in all_routes.items():
        server.add_api_route(
            route_path,
            route_detail.handler,
            methods=route_detail.methods_implemented,
            response_model=route_detail.response_model,
        )
