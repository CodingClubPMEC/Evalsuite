# Evalsuite Backend API

FastAPI backend for **Evalsuite**:
An evaluation platform for hackathons, competitions, and team-based events.
Supports organizations, admins, events, teams, juries, criteria, marking, and scheduling.

## ✨ Features

- **Multi-tenant Events**: Organizations host multiple events with team registration
- **Jury Scoring**: Multi-criteria evaluation with weighted marking system
- **Team Management**: Leader + members, problem statements per team
- **RESTful API**: Full CRUD operations with SQLModel + PostgreSQL
- **Type-Safe**: Pydantic validation + SQLModel ORM
- **Test Coverage**: pytest integration tests for all endpoints

## 🏗️ Architecture

```
src/
├── api/                # FastAPI routers (admin, event, jury, org)
├── schemas.py          # SQLModel table definitions
├── db.py               # Database engine + session management
└── main.py             # FastAPI app + lifespan events
tests/                  # pytest integration tests
```

## 🚀 Quick Start

### 1. Setup Environment

```bash
uv venv         # Create virtual environment (.venv)
uv sync         # Install dependencies (pyproject.toml)
# Edit .env to include DB_URL, TEST_DB_URL.
```

### 2. Run Server

```bash
fastapi dev
```

**API Docs**: http://localhost:8000/docs

### 3. Run Tests

```bash
pytest tests -vv          # All tests
```

## 📋 API Endpoints

| Resource  | Create         | Read              | Delete               | List          |
| --------- | -------------- | ----------------- | -------------------- | ------------- |
| `/org/`   | POST `/org/`   | GET `/org/{id}`   | DELETE `/org/{id}`   | GET `/org/`   |
| `/admin/` | POST `/admin/` | GET `/admin/{id}` | DELETE `/admin/{id}` | GET `/admin/` |
| `/event/` | POST `/event/` | GET `/event/{id}` | DELETE `/event/{id}` | GET `/event/` |
| `/jury/`  | POST `/jury/`  | GET `/jury/{id}`  | DELETE `/jury/{id}`  | GET `/jury/`  |

**Foreign Key Flow**:
![evalsuitedbschema](docs/evalsuitedbschema.png)

## 🧪 Testing Strategy

- **Integration Tests**: `tests/test_*.py` - TestClient + test DB
- **Fixture Pattern**: Create parents → child → verify → cleanup
- **Test DB**: Separate `TEST_DB_URL` in `.env`
- **Isolation**: Session rollback after each test

**Example Test Flow** (`test_event.py`):

```python
# 1. Create Org/Admin via API → extract real IDs
# 2. POST /event/ with valid foreign keys
# 3. GET /event/{id} → verify data
# 4. DELETE /event/{id} → verify 404
```

## 🌐 Environment Variables

| Key           | Description         | Example                                           |
| ------------- | ------------------- | ------------------------------------------------- |
| `DB_URL`      | Production database | `postgresql://user:pass@localhost/evalsuite`      |
| `TEST_DB_URL` | Test database       | `postgresql://user:pass@localhost/evalsuite_test` |

## 🛠️ Tech Stack

- **Framework**: FastAPI 0.115+
- **ORM**: SQLModel (SQLAlchemy + Pydantic)
- **Database**: PostgreSQL 16+
- **Testing**: pytest 9.0+, TestClient (from fastapi)
- **Package Manager**: uv (replacement for pip/poetry)
- **Deployment**: Ready for Docker/Uvicorn/Gunicorn

## 🤝 Contributing

1. Fork → Branch → PR
2. Add new features
3. Add tests for new features
4. Update this README

---

**Built for hackathons, codefests, and competitive programming events.** 🚀

[1](https://docs.pytest.org/en/stable/explanation/goodpractices.html)
[2](https://pytest-with-eric.com/pytest-best-practices/pytest-organize-tests/)
[3](https://docs.pytest.org/en/stable/how-to/fixtures.html)
[4](https://stackoverflow.com/questions/76608690/pytest-best-practice-to-setup-and-teardown-before-and-after-all-tests)
[5](https://betterstack.com/community/guides/testing/pytest-fixtures-guide/)
[6](https://stackoverflow.com/questions/74406488/how-to-best-structure-conftest-and-fixtures-in-across-multiple-pytest-files)
[7](https://www.reddit.com/r/Python/comments/o2pcj1/what_are_best_practices_with_pytest/)
[8](https://realpython.com/pytest-python-testing/)
[9](https://www.almabetter.com/bytes/articles/getting-started-with-pytest-fixtures)
[10](https://keploy.io/blog/community/python-testing-with-pytest-features-best-practices?trk=article-ssr-frontend-pulse_little-text-block)
