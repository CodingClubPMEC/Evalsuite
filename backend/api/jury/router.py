from fastapi import HTTPException
from backend.types import RouteInfo
from .schemas import GiveMarksRequest, UpdateMarksRequest, MarksResponse
from .service import give_marks, update_marks

async def give_marks_handler(request: GiveMarksRequest):
  try:
    # TODO: Replace with actual jury_id
    jury_id = 1

    result = await give_marks(
      jury_id=jury_id,
      team_id=request.team_id,
      score=request.score,
      remarks=request.remarks
    )

    return result
  except ValueError as e:
    raise HTTPException(status_code=400, detail=str(e))
  
async def update_marks_handler(team_id: int, request: UpdateMarksRequest):
  try:
    # TODO: Replace with actual jury_id
    jury_id = 1

    result = await update_marks(
      jury_id=jury_id,
      team_id=team_id,
      score=request.score,
      remarks=request.remarks
    )
    return result
  except ValueError as e:
    raise HTTPException(status_code=400, detail=str(e))
  
JURY_ROUTES: dict[str, RouteInfo] = {
  "/jury/marks": RouteInfo(
    name="Give Marks",
    description="Jury gives marks to a team.",
    methods_implemented=["POST"],
    response_model=MarksResponse,
    handler=give_marks_handler
  ),
  "/jury/marks/{team_id}": RouteInfo(
    name="Update Marks",
    description="Jury update marks for a team.",
    methods_implemented=["PUT"],
    response_model=MarksResponse,
    handler=update_marks_handler
  )
}