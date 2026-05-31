// 로컬스토리지 연동 객체 역직렬화 복원
let todos = JSON.parse(localStorage.getItem('todos')) || [];

// 필터링 기준 상태 변수 ('all', 'active', 'completed')
let currentFilter = 'all';

// 현재 클릭하여 선택된 타겟 날짜 객체 상태 변수 (기본값: 오늘)
let selectedDate = new Date();

// 조건 반영: 주간 달력 조작을 위해 현재 보고 있는 주차의 '월요일'을 저장할 상태 변수
let currentWeekStart = getMonday(selectedDate);

// 제어할 DOM 요소 선택
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const tabButtons = document.querySelectorAll('.tab-btn');

// 조건 반영: 주간 네비게이션용 DOM 노드 레퍼런스 확보
const monthDisplay = document.getElementById('month-display');
const weeklyCalendar = document.getElementById('weekly-calendar');
const prevWeekBtn = document.getElementById('prev-week-btn');
const nextWeekBtn = document.getElementById('next-week-btn');

// 앱 초기 설정 및 이벤트 리스너 등록
function init() {
    todoForm.addEventListener('submit', addTodo);
    
    tabButtons.forEach(button => {
        button.addEventListener('click', changeFilter);
    });

    // 조건 반영: 주차 단위 이전/다음 체인 이벤트 핸들러 바인딩
    prevWeekBtn.addEventListener('click', () => handleWeekNavigation(-7));
    nextWeekBtn.addEventListener('click', () => handleWeekNavigation(7));

    // 최초 뷰 구동 시 주간 달력 및 목록 동시 렌더링
    renderWeeklyCalendar();
    renderTodos();
}

// 로컬스토리지 직렬화 텍스트 문자열 동기화 함수
function saveToLocalStorage() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// 고유 날짜 포맷 문자열 생성기 (예: "2026-05-31")
function getFormattedDateString(dateObj) {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 조건 반영: 임의의 날짜를 기준 삼아 해당 주차의 '월요일' 일자 객체를 계산하는 함수
function getMonday(d) {
    const date = new Date(d);
    const day = date.getDay();
    // 일요일(0)일 경우 이전 주차 연산을 막기 위해 보정 수치 설정 (-6)
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    
    const monday = new Date(date.setDate(diff));
    // 시간 세팅 정규화를 통해 날짜 대조 무결성 확보
    monday.setHours(0, 0, 0, 0);
    return monday;
}

// 조건 반영: 주차 넘기기 연산 및 연동 데이터 상태 동기화 제어 함수
function handleWeekNavigation(daysOffset) {
    // 7일 단위 가감 처리
    currentWeekStart.setDate(currentWeekStart.getDate() + daysOffset);
    
    // 주차 정보가 바뀔 때 사용자 경험 향상을 위해 선택된 날짜도 새 주차의 월요일로 자동 동기화
    selectedDate = new Date(currentWeekStart);
    
    renderWeeklyCalendar();
    renderTodos();
}

// 조건 반영: 주간 가로 달력 캘린더 UI를 그리는 동적 렌더링 엔진 함수
function renderWeeklyCalendar() {
    weeklyCalendar.innerHTML = '';

    // 메인 달력 헤더에 해당 주차 기준 년/월 명시
    const year = currentWeekStart.getFullYear();
    const month = currentWeekStart.getMonth() + 1;
    monthDisplay.textContent = `${year}년 ${month}월`;

    // 월요일부터 일요일순 인덱싱 매핑
    const dayNames = ['월', '화', '수', '목', '금', '토', '일'];
    
    // 실제 금일 날짜 포맷 정보 획득 (시각 강조용)
    const realTodayStr = getFormattedDateString(new Date());
    // 현재 사용자가 찍은 선택 날짜 포맷 정보 획득 (액티브 활성화용)
    const selectedDateStr = getFormattedDateString(selectedDate);

    // 가로 배열 7일 루프 생성
    for (let i = 0; i < 7; i++) {
        const loopDay = new Date(currentWeekStart);
        loopDay.setDate(currentWeekStart.getDate() + i);
        const loopDayStr = getFormattedDateString(loopDay);

        // 조건 반영: 해당 일자에 부합하는 고유 Todo 개수 필터 집계
        const dayTodoCount = todos.filter(todo => todo.date === loopDayStr).length;

        // 개별 일자 카드 바깥 프레임 생성
        const dayCard = document.createElement('div');
        dayCard.className = 'day-card';

        // 조건 반영: 실제 오늘 날짜 구조적 구분 클래스 부여
        if (loopDayStr === realTodayStr) {
            dayCard.classList.add('today');
        }

        // 조건 반영: 클릭되어 현재 활성화된 타겟 날짜 클래스 부여
        if (loopDayStr === selectedDateStr) {
            dayCard.classList.add('active');
        }

        // 요일 텍스트 노드 추가
        const nameSpan = document.createElement('span');
        nameSpan.className = 'day-name';
        nameSpan.textContent = dayNames[i];

        // 일자 숫자 노드 추가
        const numberSpan = document.createElement('span');
        numberSpan.className = 'day-number';
        numberSpan.textContent = loopDay.getDate();

        // 조건 반영: 하단 개수 노드 기입 (0개일 경우 미니멀 디자인 유지를 위해 공백 처리)
        const countSpan = document.createElement('span');
        countSpan.className = 'todo-count';
        countSpan.textContent = dayTodoCount > 0 ? dayTodoCount : '';

        // 카드 내부 패키징 조립
        dayCard.appendChild(nameSpan);
        dayCard.appendChild(numberSpan);
        dayCard.appendChild(countSpan);

        // 조건 반영: 가로 달력 날짜 클릭 시 동작하는 필터 갱신 리스너 주입
        dayCard.addEventListener('click', () => {
            selectedDate = new Date(loopDay);
            renderWeeklyCalendar(); // 액티브 인디케이터 스왑을 위한 상단 재렌더링
            renderTodos();          // 하단 본문 리스트 목록 교체
        });

        weeklyCalendar.appendChild(dayCard);
    }
}

// 새로운 Todo를 추가하는 함수
function addTodo(e) {
    e.preventDefault();

    const todoText = todoInput.value.trim();

    if (todoText === '') {
        alert('할 일을 입력해주세요!');
        return;
    }

    const newTodo = {
        id: Date.now(),
        text: todoText,
        completed: false,
        date: getFormattedDateString(selectedDate) // 현재 선택된 타겟 날짜 종속 저장
    };

    todos.push(newTodo);
    
    saveToLocalStorage();
    renderWeeklyCalendar(); // 투두 개수 카운트 실시간 증감을 위해 주간 캘린더 동시 갱신
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
    
    saveToLocalStorage();
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
    
    saveToLocalStorage();
    renderTodos();
}

// Todo를 삭제하는 함수
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    
    saveToLocalStorage();
    renderWeeklyCalendar(); // 투두 개수 카운트 감소 반영을 위해 상단 캘린더 동시 갱신
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

    const targetDateStr = getFormattedDateString(selectedDate);

    // 2중 필터링 실행 (1차: 선택 날짜 매칭, 2차: 활성 탭 매칭)
    const filteredTodos = todos.filter(todo => {
        if (todo.date !== targetDateStr) {
            return false;
        }

        if (currentFilter === 'active') {
            return !todo.completed;
        } else if (currentFilter === 'completed') {
            return todo.completed;
        }
        return true;
    });

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