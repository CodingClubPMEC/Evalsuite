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
from src.schemas import Jury

_ = load_dotenv()

test_db_url = str(os.getenv("TEST_DB_URL"))
test_engine = create_engine(test_db_url)
Jury.metadata.create_all(test_engine)


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
def local_jury() -> dict[str, object]:
    jury = Jury(
        id=uuid.uuid4(), name="Subham Choudhury", created_at=datetime.now(timezone.utc)
    )
    return json.loads(jury.model_dump_json())


def test_jury(client: TestClient, local_jury: dict[str, object]):
    create_response = client.post("/jury/", json=local_jury)
    assert create_response.status_code == 201
    created_jury = create_response.json()
    assert created_jury["id"] == local_jury["id"]

    read_response = client.get(f"/jury/{local_jury['id']}")
    assert read_response.status_code == 200
    jury = read_response.json()
    assert jury["id"] == local_jury["id"]

    read_juries_response = client.get("/jury/")
    assert read_juries_response.status_code == 200
    juries = read_juries_response.json()
    assert isinstance(juries, list) and len(juries) > 0

    _ = client.delete(f"/jury/{local_jury['id']}")
    final_read = client.get(f"/jury/{local_jury['id']}")
    assert final_read.status_code == 404
