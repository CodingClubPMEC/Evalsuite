from .admin import admin_router
from .event import event_router
from .jury import jury_router

# from .marking import marking_router
# from .criteria import criteria_router
from .org import org_router

# from .team import team_router

__all__ = [
    "admin_router",
    "event_router",
    "jury_router",
    # "criteria_router",
    # "marking_router",
    "org_router",
    # "team_router",
]
