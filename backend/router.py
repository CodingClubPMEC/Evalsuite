from collections.abc import Callable
from types import CoroutineType

from fastapi import FastAPI
from pydantic import BaseModel


class RouteInfo(BaseModel):
    name: str
    description: str
    methods_implemented: list[str]
    response_model: BaseModel | None
    handler: Callable[..., CoroutineType[object, object, object] | None]


def register_routes(server: FastAPI, routes_info: dict[str, RouteInfo]) -> None:
    for route_path, route_detail in routes_info.items():
        server.add_api_route(
            route_path,
            route_detail.handler,
            methods=route_detail.methods_implemented,
            response_model=route_detail.response_model,
        )
