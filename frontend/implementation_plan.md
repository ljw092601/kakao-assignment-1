# Frontend Implementation Plan (Next.js)

Next.js 14+ App Router의 특징을 최대한 활용하여 Todo 애플리케이션 프론트엔드를 구축하는 계획입니다. 사용자님이 제안해주신 구조에 더해, 성능과 사용자 경험(UX)을 극대화하기 위한 추천 사항을 포함했습니다.

## 💡 추가 권장 사항 (Recommendations)

1. **Server Actions의 적극 활용**
   데이터를 수정(생성, 수정, 삭제)할 때 클라이언트에서 직접 `fetch`를 호출하는 대신, Next.js의 **Server Actions**(`"use server"`)를 사용합니다. 보안성이 높아지고 별도의 API 클라이언트 코드가 대폭 줄어듭니다.
2. **낙관적 업데이트 (Optimistic Updates)**
   체크박스를 클릭하거나 할 일을 삭제할 때 서버의 응답을 기다리지 않고 UI를 먼저 변경하는 `useOptimistic` 훅을 사용하여 앱이 훨씬 빠르고 매끄럽게 느껴지도록 구성합니다.
3. **Glassmorphism & Premium UI**
   Tailwind CSS가 이미 설치되어 있으므로 이를 활용하여, 반투명 효과(backdrop-blur), 부드러운 그라데이션, 마이크로 애니메이션 등 프리미엄하고 역동적인(Dynamic) 디자인을 적용합니다.
4. **타입(Type) 및 API 유틸리티 분리**
   백엔드 스키마와 동일한 형태의 TypeScript 인터페이스를 `app/types/`에 분리하고, 서버 컴포넌트용 페칭 함수를 `app/lib/`에 분리하여 유지보수성을 높입니다.

## User Review Required

> [!IMPORTANT]
> - 현재 폴더에 Tailwind CSS v4가 설치되어 있어, 이를 활용해 **고급스럽고 모던한 UI(다크 모드, Glassmorphism 등)**를 구현할 계획입니다. (만약 Vanilla CSS를 원하신다면 말씀해주세요!)
> - 데이터 변경 처리에 Server Actions를 사용할 계획입니다.

## Open Questions

> [!NOTE]  
> 1. 메인 페이지(`app/page.tsx`)를 `app/todos/page.tsx`로 리다이렉트(Redirect) 처리할까요? 아니면 메인 페이지에 바로 Todo 목록을 띄울까요?
> 2. 백엔드 주소(`http://127.0.0.1:8000`)를 환경 변수(`.env.local`)로 관리하는 것이 좋습니다. 지금 바로 `.env.local` 파일도 함께 생성해 둘까요?

## Proposed Changes

### Configuration & Types
- **`frontend/.env.local`** (NEW): `NEXT_PUBLIC_API_URL=http://127.0.0.1:8000` 설정
- **`frontend/app/types/todo.ts`** (NEW): `Todo` 인터페이스 정의
- **`frontend/app/globals.css`** (MODIFY): 배경 그라데이션 및 디자인 토큰 정의

### API & Server Actions
- **`frontend/app/actions/todoActions.ts`** (NEW): `createTodo`, `updateTodo`, `deleteTodo` 서버 액션 구현 (데이터 재검증 `revalidatePath` 포함)

### Components
- **`frontend/app/components/TodoItem.tsx`** (NEW): (Client Component) 단일 Todo 표시 및 낙관적 업데이트 로직 처리
- **`frontend/app/components/TodoForm.tsx`** (NEW): (Client Component) Todo 생성 폼
- **`frontend/app/components/BackButton.tsx`** (NEW): (Client Component) 뒤로가기 버튼 UI

### Pages (App Router)
- **`frontend/app/todos/page.tsx`** (NEW): (Server Component) 전체 Todo 목록 조회 및 렌더링 (`getTodos` 호출)
- **`frontend/app/todos/new/page.tsx`** (NEW): (Server Component) 새로운 Todo를 생성하는 폼 페이지
- **`frontend/app/todos/[todoId]/page.tsx`** (NEW): (Server Component) 특정 Todo 수정 페이지
- **`frontend/app/todos/error.tsx`** (NEW): (Client Component) 에러 발생 시의 폴백 UI 구현
- **`frontend/app/todos/loading.tsx`** (NEW): (Server Component) 데이터 로딩 스켈레톤 UI 구현

## Verification Plan

### Manual Verification
1. `npm run dev`로 프론트엔드 서버를 실행하고 브라우저(`http://localhost:3000/todos`)에 접속합니다.
2. 미려한 디자인(Glassmorphism 등)이 적용된 Todo 목록이 보이는지 확인합니다.
3. **Todo 생성**: "새로 만들기" 버튼을 눌러 `/todos/new`에서 데이터를 입력 후 저장하면, 리스트에 즉시 반영되는지 확인합니다.
4. **Todo 수정/삭제**: 체크박스를 눌러 완료 상태를 변경해 보고(낙관적 업데이트 확인), 삭제 버튼 및 수정 페이지(`/todos/[todoId]`)의 동작을 검증합니다.
