// 할 일 목록 데이터를 관리할 배열 상태 (State)
let todos = [];

// 조건 반영: 현재 선택된 필터 상태를 추적할 상태 변수 (기본값: 'all')
let currentFilter = 'all';

// 제어할 DOM 요소 선택
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

// 조건 반영: 필터 버튼 요소들을 일괄 선택
const tabButtons = document.querySelectorAll('.tab-btn');

// 앱 초기 설정 및 이벤트 리스너 등록
function init() {
    todoForm.addEventListener('submit', addTodo);
    
    // 조건 반영: 각 탭 버튼 클릭 시 필터 변경 함수 연결
    tabButtons.forEach(button => {
        button.addEventListener('click', changeFilter);
    });
}

// 새로운 Todo를 추가하는 함수
function addTodo(e) {
    e.preventDefault(); // 폼 제출 시 발생하는 페이지 새로고침 방지

    const todoText = todoInput.value.trim();

    // 입력값이 비어있을 경우 예외 처리
    if (todoText === '') {
        alert('할 일을 입력해주세요!');
        return;
    }

    // 새 Todo 객체 모델 생성
    const newTodo = {
        id: Date.now(), // 고유 식별자로 현재 타임스탬프 사용
        text: todoText,
        completed: false // 기본값은 미완료 상태
    };

    // 데이터 상태 업데이트 및 화면 재렌더링
    todos.push(newTodo);
    renderTodos();

    // 입력창 초기화 및 포커스 유지
    todoInput.value = '';
    todoInput.focus();
}

// Todo 완료 상태를 토글하는 함수
function toggleComplete(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });
    renderTodos();
}

// Todo 내용을 수정하는 함수
function editTodo(id) {
    const todoToEdit = todos.find(todo => todo.id === id);
    if (!todoToEdit) return;

    const newText = prompt('할 일을 수정하세요:', todoToEdit.text);
    
    if (newText === null) return;
    
    if (newText.trim() === '') {
        alert('내용을 입력해야 수정할 수 있습니다.');
        return;
    }

    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, text: newText.trim() };
        }
        return todo;
    });
    renderTodos();
}

// Todo를 삭제하는 함수
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    renderTodos();
}

// 조건 반영: 선택된 필터 상태를 변경하고 UI 탭 스타일을 전환하는 함수
function changeFilter(e) {
    // 탭 버튼의 data-filter 속성 값('all', 'active', 'completed')을 읽어옴
    currentFilter = e.target.dataset.filter;

    // 모든 탭에서 active 클래스를 지워 비활성화 스타일 처리
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });

    // 클릭된 현재 탭에만 active 클래스를 추가하여 시각적 강조 효과 적용
    e.target.classList.add('active');

    // 필터링 규칙이 바뀌었으므로 화면 리스트 재렌더링
    renderTodos();
}

// 데이터 상태와 필터 기준을 바탕으로 화면에 리스트를 그려주는 렌더링 함수
function renderTodos() {
    // 기존의 목록 요소들을 깨끗하게 비움
    todoList.innerHTML = '';

    // 조건 반영: 현재 설정된 currentFilter 값에 의거하여 노출할 배열 필터링
    const filteredTodos = todos.filter(todo => {
        if (currentFilter === 'active') {
            return !todo.completed; // 진행 중: completed가 false인 항목만 반환
        } else if (currentFilter === 'completed') {
            return todo.completed;  // 완료: completed가 true인 항목만 반환
        }
        return true; // 전체(all): 필터링 없이 그대로 모두 반환
    });

    // 필터링이 완료된 배열을 순회하며 DOM 요소를 작성
    filteredTodos.forEach(todo => {
        // 리스트 아이템(li) 생성
        const li = document.createElement('li');
        li.className = 'todo-item';
        
        // 완료 상태일 때 스타일 클래스 추가
        if (todo.completed) {
            li.classList.add('completed');
        }

        // 텍스트를 보여줄 span 요소 생성
        const textSpan = document.createElement('span');
        textSpan.className = 'todo-text';
        textSpan.textContent = todo.text;
        li.appendChild(textSpan);

        // 버튼들을 묶어줄 컨테이너 생성
        const btnGroup = document.createElement('div');
        btnGroup.className = 'btn-group';

        // 완료/취소 버튼 생성 및 이벤트 연결
        const completeBtn = document.createElement('button');
        completeBtn.className = 'action-btn complete-btn';
        completeBtn.textContent = todo.completed ? '취소' : '완료';
        completeBtn.addEventListener('click', () => toggleComplete(todo.id));
        btnGroup.appendChild(completeBtn);

        // 수정 버튼 생성 및 이벤트 연결
        const editBtn = document.createElement('button');
        editBtn.className = 'action-btn edit-btn';
        editBtn.textContent = '수정';
        editBtn.addEventListener('click', () => editTodo(todo.id));
        btnGroup.appendChild(editBtn);

        // 삭제 버튼 생성 및 이벤트 연결
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'action-btn delete-btn';
        deleteBtn.textContent = '삭제';
        deleteBtn.addEventListener('click', () => deleteTodo(todo.id));
        btnGroup.appendChild(deleteBtn);

        // 최종 조립 후 리스트에 삽입
        li.appendChild(btnGroup);
        todoList.appendChild(li);
    });
}

// 애플리케이션 시작 실행
init();