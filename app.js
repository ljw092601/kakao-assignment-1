// 할 일 목록 데이터를 관리할 배열 상태 (State)
let todos = [];

// 필터링 기준 상태 변수 ('all', 'active', 'completed')
let currentFilter = 'all';

// 조건 반영: 현재 앱에서 선택 및 추적 중인 날짜 객체 상태 변수
let selectedDate = new Date();

// 제어할 DOM 요소 선택
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const tabButtons = document.querySelectorAll('.tab-btn');

// 조건 반영: 날짜 제어 노드 선택
const dateDisplay = document.getElementById('date-display');
const prevDateBtn = document.getElementById('prev-date-btn');
const nextDateBtn = document.getElementById('next-date-btn');

// 앱 초기 설정 및 이벤트 리스너 등록
function init() {
    todoForm.addEventListener('submit', addTodo);
    
    tabButtons.forEach(button => {
        button.addEventListener('click', changeFilter);
    });

    // 조건 반영: 날짜 조절 버튼에 이벤트 바인딩
    prevDateBtn.addEventListener('click', () => handleDateNavigation(-1));
    nextDateBtn.addEventListener('click', () => handleDateNavigation(1));

    // 최초 실행 시 현재 날짜 출력 및 목록 렌더링
    updateDateDisplay();
    renderTodos();
}

// 조건 반영: 데이터 비교용 고유 날짜 포맷 문자열을 반환하는 헬퍼 함수 (예: "2026-05-31")
function getFormattedDateString(dateObj) {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 조건 반영: 화면 상단 헤더 영역에 날짜를 포맷팅하여 표시하는 함수
function updateDateDisplay() {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;
    const day = selectedDate.getDate();
    
    // 요일 배열 생성
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    const dayName = dayNames[selectedDate.getDay()];

    // UI 텍스트 업데이트 변경
    dateDisplay.textContent = `${year}년 ${month}월 ${day}일 (${dayName})`;
}

// 조건 반영: 이전(-1) / 다음(1) 버튼 클릭 시 날짜를 계산하고 동기화하는 함수
function handleDateNavigation(offsetDays) {
    selectedDate.setDate(selectedDate.getDate() + offsetDays);
    updateDateDisplay();
    renderTodos(); // 날짜가 바뀌었으므로 할 일 목록 재필터링 렌더링
}

// 새로운 Todo를 추가하는 함수
function addTodo(e) {
    e.preventDefault();

    const todoText = todoInput.value.trim();

    if (todoText === '') {
        alert('할 일을 입력해주세요!');
        return;
    }

    // 새 Todo 객체 모델 생성
    const newTodo = {
        id: Date.now(),
        text: todoText,
        completed: false,
        // 조건 반영: 생성 시점에 상단에 '현재 선택된 날짜'의 포맷 문자열을 기록
        date: getFormattedDateString(selectedDate)
    };

    todos.push(newTodo);
    renderTodos();

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

// 선택된 필터 상태를 변경하고 UI 탭 스타일을 전환하는 함수
function changeFilter(e) {
    currentFilter = e.target.dataset.filter;

    tabButtons.forEach(button => {
        button.classList.remove('active');
    });

    e.target.classList.add('active');
    renderTodos();
}

// 데이터 상태, 필터 기준, 그리고 날짜 동기화를 적용해 리스트를 그려주는 렌더링 함수
function renderTodos() {
    todoList.innerHTML = '';

    // 조건 반영: 현재 선택된 날짜의 포맷팅 문자열 추출
    const targetDateStr = getFormattedDateString(selectedDate);

    // 조건부 2중 필터링 실행 (1차: 날짜 일치 여부 확인, 2차: 전체/진행중/완료 상태 확인)
    const filteredTodos = todos.filter(todo => {
        // 첫 번째 조건: 등록된 Todo 날짜가 현재 보는 날짜와 다르면 렌더링에서 배제
        if (todo.date !== targetDateStr) {
            return false;
        }

        // 두 번째 조건: 기존 상태 탭 필터링 규칙 적용
        if (currentFilter === 'active') {
            return !todo.completed;
        } else if (currentFilter === 'completed') {
            return todo.completed;
        }
        return true;
    });

    // 최종 필터링된 데이터만 순회하며 DOM 요소 생성
    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.className = 'todo-item';
        
        if (todo.completed) {
            li.classList.add('completed');
        }

        const textSpan = document.createElement('span');
        textSpan.className = 'todo-text';
        textSpan.textContent = todo.text;
        li.appendChild(textSpan);

        const btnGroup = document.createElement('div');
        btnGroup.className = 'btn-group';

        const completeBtn = document.createElement('button');
        completeBtn.className = 'action-btn complete-btn';
        completeBtn.textContent = todo.completed ? '취소' : '완료';
        completeBtn.addEventListener('click', () => toggleComplete(todo.id));
        btnGroup.appendChild(completeBtn);

        const editBtn = document.createElement('button');
        editBtn.className = 'action-btn edit-btn';
        editBtn.textContent = '수정';
        editBtn.addEventListener('click', () => editTodo(todo.id));
        btnGroup.appendChild(editBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'action-btn delete-btn';
        deleteBtn.textContent = '삭제';
        deleteBtn.addEventListener('click', () => deleteTodo(todo.id));
        btnGroup.appendChild(deleteBtn);

        li.appendChild(btnGroup);
        todoList.appendChild(li);
    });
}

// 애플리케이션 시작 실행
init();