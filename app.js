// 할 일 목록 데이터를 관리할 배열 상태 (State)
let todos = [];

// 제어할 DOM 요소 선택
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

// 앱 초기 설정 및 이벤트 리스너 등록
function init() {
    todoForm.addEventListener('submit', addTodo);
}

// 새로운 Todo를 추가하는 함수
function addTodo(e) {
    e.preventDefault(); // 폼 제출 시 발생하는 페이지 새로고침 방지

    const todoText = todoInput.value.trim();

    // 조건 반영: 입력값이 비어있을 경우 예외 처리
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
    // 수정 대상을 탐색
    const todoToEdit = todos.find(todo => todo.id === id);
    if (!todoToEdit) return;

    // 브라우저 기본 prompt 창을 통해 새 텍스트 입력 유도
    const newText = prompt('할 일을 수정하세요:', todoToEdit.text);
    
    // 취소를 누른 경우(null) 예외 처리
    if (newText === null) return;
    
    // 수정 내용이 비어있을 경우 예외 처리
    if (newText.trim() === '') {
        alert('내용을 입력해야 수정할 수 있습니다.');
        return;
    }

    // 데이터 상태 업데이트 및 화면 재렌더링
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
    // 선택한 id를 제외한 새로운 배열로 상태 업데이트
    todos = todos.filter(todo => todo.id !== id);
    renderTodos();
}

// 데이터 상태를 바탕으로 화면에 리스트를 그려주는 렌더링 함수
function renderTodos() {
    // 기존의 목록 요소들을 깨끗하게 비움
    todoList.innerHTML = '';

    // todos 배열을 순회하며 DOM 요소를 작성
    todos.forEach(todo => {
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