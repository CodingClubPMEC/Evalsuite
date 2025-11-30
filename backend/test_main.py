from fastapi.testclient import TestClient

from .main import server

client = TestClient(server)


def test_read_index():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
