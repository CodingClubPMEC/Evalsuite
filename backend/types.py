from collections.abc import Callable
from types import CoroutineType
from pydantic import BaseModel

class RouteInfo(BaseModel):
    name: str
    description: str
    methods_implemented: list[str]
    response_model: type[BaseModel] | None
    handler: Callable[..., CoroutineType | None]