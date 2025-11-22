JURY_MARKS_DB: dict[tuple[int, int], dict] = {}

async def give_marks(jury_id: int, team_id: int, score: int, remarks: str | None):
  key = (jury_id, team_id)
  if key in JURY_MARKS_DB:
    raise ValueError("Marks already given for this team by jury.")
  
  JURY_MARKS_DB[key] = {
    "jury_id": jury_id,
    "team_id": team_id,
    "score": score,
    "remarks": remarks
  }

  return JURY_MARKS_DB[key]

async def update_marks(jury_id: int, team_id: int, score: int, remarks: str | None):
  key = (jury_id, team_id)
  if key not in JURY_MARKS_DB:
    raise ValueError("Marks not found! Cannot update.")
  
  JURY_MARKS_DB[key].update({"score": score, "remarks": remarks})
  return JURY_MARKS_DB[key]
