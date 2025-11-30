import json
import os
import uuid
from datetime import datetime, timezone

import pytest
from dotenv import load_dotenv
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlmodel import Session

from backend import Admin, get_session
from backend.main import server

_ = load_dotenv()

test_db_url = str(os.getenv("TEST_DB_URL"))
test_engine = create_engine(test_db_url)
Admin.metadata.create_all(test_engine)


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
def local_admin() -> dict[str, object]:
    admin = Admin(
        id=uuid.uuid4(), name="Subham Choudhury", created_at=datetime.now(timezone.utc)
    )
    return json.loads(admin.model_dump_json())


def test_admin(client: TestClient, local_admin: dict[str, object]):
    create_response = client.post("/admin/", json=local_admin)
    assert create_response.status_code == 201
    created_admin = create_response.json()
    assert created_admin["id"] == local_admin["id"]

    read_response = client.get(f"/admin/{local_admin['id']}")
    assert read_response.status_code == 200
    admin = read_response.json()
    assert admin["id"] == local_admin["id"]

    read_admins_response = client.get("/admin/")
    assert read_admins_response.status_code == 200
    admins = read_admins_response.json()
    assert isinstance(admins, list) and len(admins) > 0

    _ = client.delete(f"/admin/{local_admin['id']}")
    final_read = client.get(f"/admin/{local_admin['id']}")
    assert final_read.status_code == 404
