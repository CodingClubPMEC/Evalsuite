import os
import uuid

import pytest
from dotenv import load_dotenv
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlmodel import Session

from src.db import get_session
from src.main import server
from src.schemas import Admin, Event, Org

_ = load_dotenv()
test_db_url = str(os.getenv("TEST_DB_URL"))
test_engine = create_engine(test_db_url)

Event.metadata.create_all(test_engine)
Admin.metadata.create_all(test_engine)
Org.metadata.create_all(test_engine)


@pytest.fixture(scope="module")
def client():
    test_client = TestClient(server)
    server.dependency_overrides[get_session] = override_get_session
    _ = test_client.get("/")
    yield test_client
    server.dependency_overrides.clear()


def override_get_session():
    with Session(test_engine) as session:
        yield session


@pytest.fixture
def org_and_admin_ids(client: TestClient):
    org_resp = client.post("/org/", json={"name": "CDD"})
    assert org_resp.status_code in (200, 201)
    org_id = org_resp.json()["id"]

    admin_resp = client.post("/admin/", json={"name": "Subham"})
    assert admin_resp.status_code in (200, 201)
    admin_id = admin_resp.json()["id"]

    yield org_id, admin_id

    _ = client.delete(f"/org/{org_id}", headers={"accept": "application/json"})
    _ = client.delete(f"/admin/{admin_id}", headers={"accept": "application/json"})


@pytest.fixture
def local_event(org_and_admin_ids: tuple[uuid.UUID, uuid.UUID]) -> dict[str, object]:
    org_id, admin_id = org_and_admin_ids
    return {
        "name": "Code Kriti",
        "max_team_member_size": 5,
        "no_of_teams": 10,
        "org_id": str(org_id),
        "admin_id": str(admin_id),
    }


def test_event(client: TestClient, local_event: dict[str, object]) -> None:
    create_resp = client.post("/event/", json=local_event)
    assert create_resp.status_code == 201
    event = create_resp.json()
    event_id = event["id"]
    assert event["name"] == "Code Kriti"
    assert event["org_id"] == local_event["org_id"]
    assert event["admin_id"] == local_event["admin_id"]

    single_resp = client.get(f"/event/{event_id}")
    assert single_resp.status_code == 200
    read_event = single_resp.json()
    assert read_event["id"] == event_id
    assert read_event["name"] == "Code Kriti"

    list_resp = client.get("/event/")
    assert list_resp.status_code == 200
    events = list_resp.json()
    assert isinstance(events, list)
    assert any(e["id"] == event_id for e in events)

    _ = client.delete(f"/event/{event_id}")
    final_resp = client.get(f"/event/{event_id}")
    assert final_resp.status_code == 404
