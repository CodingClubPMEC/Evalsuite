import json
import os
import uuid
from datetime import datetime, timezone

import pytest
from dotenv import load_dotenv
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlmodel import Session

from src.db import get_session
from src.main import server
from src.schemas import Org

_ = load_dotenv()

test_db_url = str(os.getenv("TEST_DB_URL"))
test_engine = create_engine(test_db_url)
Org.metadata.create_all(test_engine)


@pytest.fixture(scope="module")
def client() -> TestClient:
    test_client = TestClient(server)
    server.dependency_overrides[get_session] = override_get_session
    _ = test_client.get("/")
    return test_client


def override_get_session():
    with Session(test_engine) as session:
        yield session


@pytest.fixture(scope="module", autouse=True)
def local_org() -> dict[str, object]:
    org = Org(
        id=uuid.uuid4(), name="Subham Choudhury", created_at=datetime.now(timezone.utc)
    )
    return json.loads(org.model_dump_json())


def test_org(client: TestClient, local_org: dict[str, object]):
    create_response = client.post("/org/", json=local_org)
    assert create_response.status_code == 201
    created_org = create_response.json()
    assert created_org["id"] == local_org["id"]

    read_response = client.get(f"/org/{local_org['id']}")
    assert read_response.status_code == 200
    org = read_response.json()
    assert org["id"] == local_org["id"]

    read_orgs_response = client.get("/org/")
    assert read_orgs_response.status_code == 200
    orgs = read_orgs_response.json()
    assert isinstance(orgs, list) and len(orgs) > 0

    _ = client.delete(f"/org/{local_org['id']}")
    final_read = client.get(f"/org/{local_org['id']}")
    assert final_read.status_code == 404
