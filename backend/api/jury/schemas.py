from pydantic import BaseModel

class GiveMarksRequest(BaseModel):
  team_id: int
  score: int
  remarks: str | None = None

class UpdateMarksRequest(BaseModel):
  score: int
  remarks: str | None = None

class MarksResponse(BaseModel):
  jury_id: int
  team_id: int
  score: int
  remarks: str | None

