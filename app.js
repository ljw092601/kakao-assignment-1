// 로컬스토리지 연동 데이터 복원
let todos = JSON.parse(localStorage.getItem('todos')) || [];

// 필터링 기준 상태 변수
let currentFilter = 'all'; // 진행 상태 필터 ('all', 'active', 'completed')
let currentCategoryFilter = 'all'; // 조건 반영: 2. 카테고리 필터 기준 ('all', '일상', '학업' 등)

// 현재 선택된 타겟 날짜 및 주간 시작일 정보 상태 제어
let selectedDate = new Date();
let currentWeekStart = getMonday(selectedDate);

// DOM 요소 선택
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoCategory = document.getElementById('todo-category'); // 조건 반영: 등록용 카테고리 노드
const filterCategory = document.getElementById('filter-category'); // 조건 반영: 필터용 카테고리 노드
const todoList = document.getElementById('todo-list');
const tabButtons = document.querySelectorAll('.tab-btn');

// 주간 네비게이션 및 프로그레스 바 DOM 노드 레퍼런스
const monthDisplay = document.getElementById('month-display');
const weeklyCalendar = document.getElementById('weekly-calendar');
const prevWeekBtn = document.getElementById('prev-week-btn');
const nextWeekBtn = document.getElementById('next-week-btn');
const progressPercent = document.getElementById('progress-percent'); // 조건 반영: 프로그레스 텍스트 노드
const progressBarFill = document.getElementById('progress-bar-fill'); // 조건 반영: 프로그레스 바 바디 노드

// 앱 초기 설정 및 이벤트 리스너 등록
function init() {
    todoForm.addEventListener('submit', addTodo);
    
    tabButtons.forEach(button => {
        button.addEventListener('click', changeFilter);
    });

    // 조건 반영: 카테고리 필터링 변경시 작동하는 리스너 등록
    filterCategory.addEventListener('change', changeCategoryFilter);

    prevWeekBtn.addEventListener('click', () => handleWeekNavigation(-7));
    nextWeekBtn.addEventListener('click', () => handleWeekNavigation(7));

    // 초기 화면 컴포넌트 통합 렌더링
    renderWeeklyCalendar();
    renderTodos();
}

// 로컬스토리지 영속성 직렬화 저장 함수
function saveToLocalStorage() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// 고유 날짜 포맷 문자열 생성기 (예: "2026-06-01")
function getFormattedDateString(dateObj) {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 임의의 날짜를 기준 삼아 해당 주차의 '월요일' 일자 객체를 연산하는 함수
function getMonday(d) {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    
    const monday = new Date(date.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday;
}

// 주차 이동 처리 함수
function handleWeekNavigation(daysOffset) {
    currentWeekStart.setDate(currentWeekStart.getDate() + daysOffset);
    selectedDate = new Date(currentWeekStart);
    
    renderWeeklyCalendar();
    renderTodos();
}

// 조건 반영: 1. 현재 보고 있는 주차 전체의 '달성률'을 계산하고 바를 업데이트하는 함수
function updateWeeklyProgressBar() {
    // 현재 주차에 속하는 7일간의 날짜 문자열 배열 확보
    const weekDateStrings = [];
    for (let i = 0; i < 7; i++) {
        const loopDay = new Date(currentWeekStart);
        loopDay.setDate(currentWeekStart.getDate() + i);
        weekDateStrings.push(getFormattedDateString(loopDay));
    }

    // 이번 주 전체 할 일 필터링 집계
    const weeklyTodos = todos.filter(todo => weekDateStrings.includes(todo.date));
    const totalCount = weeklyTodos.length;
    const completedCount = weeklyTodos.filter(todo => todo.completed).length;

    // 분모가 0일 때의 예외 처리 후 백분율 계산
    const percentage = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

    // DOM 실시간 시각적 최신화
    progressPercent.textContent = `${percentage}%`;
    progressBarFill.style.width = `${percentage}%`;
}

// 주간 가로 달력 및 카운트 배지 렌더링 함수
function renderWeeklyCalendar() {
    weeklyCalendar.innerHTML = '';

    const year = currentWeekStart.getFullYear();
    const month = currentWeekStart.getMonth() + 1;
    monthDisplay.textContent = `${year}년 ${month}월`;

    const dayNames = ['월', '화', '수', '목', '금', '토', '일'];
    const realTodayStr = getFormattedDateString(new Date());
    const selectedDateStr = getFormattedDateString(selectedDate);

    for (let i = 0; i < 7; i++) {
        const loopDay = new Date(currentWeekStart);
        loopDay.setDate(currentWeekStart.getDate() + i);
        const loopDayStr = getFormattedDateString(loopDay);

        const dayTodoCount = todos.filter(todo => todo.date === loopDayStr).length;

        const dayCard = document.createElement('div');
        dayCard.className = 'day-card';

        if (loopDayStr === realTodayStr) {
            dayCard.classList.add('today');
        }

        if (loopDayStr === selectedDateStr) {
            dayCard.classList.add('active');
        }

        const nameSpan = document.createElement('span');
        nameSpan.className = 'day-name';
        nameSpan.textContent = dayNames[i];

        const numberSpan = document.createElement('span');
        numberSpan.className = 'day-number';
        numberSpan.textContent = loopDay.getDate();

        const countSpan = document.createElement('span');
        countSpan.className = 'todo-count';
        countSpan.textContent = dayTodoCount > 0 ? dayTodoCount : '';

        dayCard.appendChild(nameSpan);
        dayCard.appendChild(numberSpan);
        dayCard.appendChild(countSpan);

        dayCard.addEventListener('click', () => {
            selectedDate = new Date(loopDay);
            renderWeeklyCalendar();
            renderTodos();
        });

        weeklyCalendar.appendChild(dayCard);
    }

    // 캘린더 호출 시 주간 성취율도 동시 최신화
    updateWeeklyProgressBar();
}

// 새로운 Todo를 추가하는 함수
function addTodo(e) {
    e.preventDefault();

    const todoText = todoInput.value.trim();
    const todoTagValue = todoCategory.value; // 조건 반영: 2. 선택된 카테고리 데이터 확보

    if (todoText === '') {
        alert('할 일을 입력해주세요!');
        return;
    }

    const newTodo = {
        id: Date.now(),
        text: todoText,
        completed: false,
        date: getFormattedDateString(selectedDate),
        category: todoTagValue // 조건 반영: 2. 개별 객체 모델 내에 카테고리 정보 주입
    };

    todos.push(newTodo);
    
    saveToLocalStorage();
    renderWeeklyCalendar(); // 상단 개수 카운터 및 프로그레스 바 실시간 반영 유도
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
    updateWeeklyProgressBar(); // 달성 상태 변화에 따른 상단 프로그레스 바 실시간 리렌더링
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
    renderWeeklyCalendar(); // 삭제 건수 반영을 위해 상단 캘린더 및 성취율 바 리프레시
    renderTodos();
}

// 선택된 상태 필터(전체/진행/완료)를 변경하는 함수
function changeFilter(e) {
    currentFilter = e.target.dataset.filter;

    tabButtons.forEach(button => {
        button.classList.remove('active');
    });

    e.target.classList.add('active');
    renderTodos();
}

// 조건 반영: 2. 카테고리 필터 드롭다운 조작 시 트리거되는 핸들러 함수
function changeCategoryFilter(e) {
    currentCategoryFilter = e.target.value;
    renderTodos();
}

// 3중 필터링 데이터 기반 동적 본문 리스트 빌더 함수
function renderTodos() {
    todoList.innerHTML = '';

    const targetDateStr = getFormattedDateString(selectedDate);

    // 조건 고도화: 날짜 일치 x -> 완료 상태 일치 x -> 카테고리 일치 x 조건 순차 필터 검증 실행
    const filteredTodos = todos.filter(todo => {
        // 1차 필터: 날짜 검증
        if (todo.date !== targetDateStr) {
            return false;
        }

        // 2차 필터: 상태 탭 검증
        if (currentFilter === 'active' && todo.completed) return false;
        if (currentFilter === 'completed' && !todo.completed) return false;

        // 3차 필터: 카테고리 검증
        if (currentCategoryFilter !== 'all' && todo.category !== currentCategoryFilter) {
            return false;
        }

        return true;
    });

    // 필터 연산이 끝난 정제 배열 기반으로 DOM 생성
    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.className = 'todo-item';
        
        if (todo.completed) {
            li.classList.add('completed');
        }

        // 조건 반영: 2. 텍스트 바디 컨테이너 및 카테고리 뱃지 태그 구성 추가
        const contentBox = document.createElement('div');
        contentBox.className = 'todo-content-box';

        const tagSpan = document.createElement('span');
        // 동적 클래스 부여로 카테고리별 테마 스타일 바인딩 (예: .tag-일상, .tag-운동)
        tagSpan.className = `todo-tag tag-${todo.category || '일상'}`;
        tagSpan.textContent = todo.category || '일상';
        contentBox.appendChild(tagSpan);

        const textSpan = document.createElement('span');
        textSpan.className = 'todo-text';
        textSpan.textContent = todo.text;
        contentBox.appendChild(textSpan);
        
        li.appendChild(contentBox);

        // 액션 버튼 그룹 바인딩
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