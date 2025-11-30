import uuid
from datetime import datetime, timezone

from sqlmodel import JSON, Column, Field, SQLModel


class Org(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str
    created_at: datetime = datetime.now(timezone.utc)


class Admin(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str
    created_at: datetime = datetime.now(timezone.utc)


class Event(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str
    created_at: datetime = datetime.now(timezone.utc)
    no_of_teams: int
    max_team_member_size: int
    org_id: uuid.UUID = Field(foreign_key="org.id")
    admin_id: uuid.UUID = Field(foreign_key="admin.id")


class Jury(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str
    created_at: datetime = datetime.now(timezone.utc)


class Team(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    sl_no: int
    name: str
    created_at: datetime = datetime.now(timezone.utc)
    leader: str
    members: str = Field(sa_column=Column(JSON))
    problem_statement: str
    event_id: uuid.UUID = Field(foreign_key="event.id")


class Criteria(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str
    created_at: datetime = datetime.now(timezone.utc)
    weightage: int
    max_mark: int
    event_id: uuid.UUID = Field(foreign_key="event.id")


class Schedule(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime = datetime.now(timezone.utc)
    due_date: datetime
    event_id: uuid.UUID = Field(foreign_key="event.id")


class Marking(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime = datetime.now(timezone.utc)
    mark: int
    event_id: uuid.UUID = Field(foreign_key="event.id")
    jury_id: uuid.UUID = Field(foreign_key="jury.id")
    team_id: uuid.UUID = Field(foreign_key="team.id")
    criteria_id: uuid.UUID = Field(foreign_key="criteria.id")
