# Todo List Backend Implementation Plan

Todo 리스트 관리를 위한 FastAPI 기반의 백엔드 CRUD API 구현 계획입니다. 사용자님께서 제안해주신 기본 API 구조에 더해, 실제 운영 및 프론트엔드 연동을 고려한 몇 가지 권장 사항을 추가로 반영했습니다.

## 💡 추가 권장 사항 (Recommendations)
1. **단일 조회 API 추가**: `GET /todos/{id}` (특정 Todo의 상세 정보를 조회하는 기능이 종종 필요합니다)
2. **데이터베이스 연동 (SQLAlchemy)**: 인메모리가 아닌 데이터베이스(예: SQLite)를 사용하여 데이터를 영구적으로 저장합니다. (이미 `requirements.txt`에 포함되어 있어 이를 활용합니다)
3. **Pydantic 스키마와 DB 모델 분리**: 데이터 유효성 검사(Pydantic)와 데이터베이스 구조(SQLAlchemy)를 명확히 분리하여 유지보수성을 높입니다.
4. **CORS (Cross-Origin Resource Sharing) 설정**: 프론트엔드 웹 앱에서 API를 원활하게 호출할 수 있도록 CORS 미들웨어를 추가합니다.
5. **예외 처리 (Error Handling)**: 존재하지 않는 Todo에 접근할 때 `404 Not Found` 등의 적절한 HTTP 상태 코드를 반환하도록 합니다.

## User Review Required

> [!IMPORTANT]  
> 데이터베이스의 경우 별도의 서버 설정이 필요 없는 **SQLite**를 기본으로 사용하여 빠르게 개발을 진행하는 것을 제안합니다. 혹시 MySQL이나 PostgreSQL 같은 다른 DB를 원하신다면 알려주세요.

## Open Questions

> [!NOTE]  
> 1. **CORS 설정**: 프론트엔드 서버가 구동 중인 주소(예: `http://localhost:5173` 등)를 알려주시면 CORS 허용 목록에 추가하겠습니다.
> 2. **추가 필드**: Todo 모델에 `title`, `description` 외에 완료 여부를 나타내는 `completed` (기본값: false), 생성일자 `created_at` 필드를 추가하는 것이 어떨까요?

## Proposed Changes

### Database & Models

데이터베이스 연결 및 데이터 구조를 정의합니다.

#### [NEW] [backend/database.py](file:///c:/Users/ljw09/Desktop/kakao-assignment-3/backend/database.py)
- SQLAlchemy `engine` 및 `SessionLocal` 생성
- 선언적 기본 클래스(`Base`) 정의

#### [NEW] [backend/models.py](file:///c:/Users/ljw09/Desktop/kakao-assignment-3/backend/models.py)
- `Todo` SQLAlchemy 모델 정의 (테이블명: `todos`)
- 컬럼: `id`, `title`, `description`, `completed`, `created_at`

#### [NEW] [backend/schemas.py](file:///c:/Users/ljw09/Desktop/kakao-assignment-3/backend/schemas.py)
- API 요청/응답을 위한 Pydantic 모델 정의
- `TodoBase`, `TodoCreate`, `TodoUpdate`, `TodoResponse`

### CRUD Operations & Routing

데이터 처리 로직과 API 엔드포인트를 분리하여 구현합니다.

#### [NEW] [backend/crud.py](file:///c:/Users/ljw09/Desktop/kakao-assignment-3/backend/crud.py)
- DB와 상호작용하는 함수 구현: `get_todos`, `get_todo`, `create_todo`, `update_todo`, `delete_todo`

#### [NEW] [backend/routers/todos.py](file:///c:/Users/ljw09/Desktop/kakao-assignment-3/backend/routers/todos.py)
- 사용자님의 제안 + 단일 조회를 포함한 APIRouter 정의
- `GET /todos`, `GET /todos/{todo_id}`, `POST /todos`, `PUT /todos/{todo_id}`, `DELETE /todos/{todo_id}`

#### [MODIFY] [backend/main.py](file:///c:/Users/ljw09/Desktop/kakao-assignment-3/backend/main.py)
- 데이터베이스 테이블 자동 생성 로직 추가
- CORS 미들웨어 등록
- `todos` 라우터 등록

## Verification Plan

### Automated Tests
- 현재는 별도의 자동화 테스트 코드가 없으므로 FastAPI에서 기본으로 제공하는 Swagger UI(`/docs`)를 사용하여 테스트합니다.

### Manual Verification
1. `uvicorn main:app --reload`로 백엔드 서버를 실행합니다.
2. 브라우저에서 `http://127.0.0.1:8000/docs`에 접속하여 생성된 5개의 API(GET 2개, POST, PUT, DELETE)가 정상적으로 표시되는지 확인합니다.
3. Swagger UI에서 직접 각 API를 호출하여 데이터가 잘 생성, 조회, 수정, 삭제되는지 검증합니다.
