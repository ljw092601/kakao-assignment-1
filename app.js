// 로컬스토리지 연동 데이터 복원
let todos = JSON.parse(localStorage.getItem('todos')) || [];

// 필터링 기준 상태 변수
let currentFilter = 'all'; 
let currentCategoryFilter = 'all'; 

// 현재 선택된 타겟 날짜 및 주간 시작일 정보 상태 제어
let selectedDate = new Date();
let currentWeekStart = getMonday(selectedDate);

// DOM 요소 선택
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoCategory = document.getElementById('todo-category'); 
const filterCategory = document.getElementById('filter-category'); 
const todoList = document.getElementById('todo-list');
const tabButtons = document.querySelectorAll('.tab-btn');

// 주간 네비게이션 및 프로그레스 바 DOM 노드 레퍼런스
const monthDisplay = document.getElementById('month-display');
const weeklyCalendar = document.getElementById('weekly-calendar');
const prevWeekBtn = document.getElementById('prev-week-btn');
const nextWeekBtn = document.getElementById('next-week-btn');
const progressPercent = document.getElementById('progress-percent'); 
const progressBarFill = document.getElementById('progress-bar-fill'); 

// 우측 다가오는 일정용 DOM 노드 레퍼런스 확보
const upcomingList = document.getElementById('upcoming-list');

// 앱 초기 설정 및 이벤트 리스너 등록
function init() {
    todoForm.addEventListener('submit', addTodo);
    
    tabButtons.forEach(button => {
        button.addEventListener('click', changeFilter);
    });

    filterCategory.addEventListener('change', changeCategoryFilter);

    prevWeekBtn.addEventListener('click', () => handleWeekNavigation(-7));
    nextWeekBtn.addEventListener('click', () => handleWeekNavigation(7));

    // 초기 화면 컴포넌트 통합 렌더링
    renderWeeklyCalendar();
    renderTodos();
    renderUpcomingTodos(); 
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

// 현재 보고 있는 주차 전체의 '달성률'을 계산하고 바를 업데이트하는 함수
function updateWeeklyProgressBar() {
    const weekDateStrings = [];
    for (let i = 0; i < 7; i++) {
        const loopDay = new Date(currentWeekStart);
        loopDay.setDate(currentWeekStart.getDate() + i);
        weekDateStrings.push(getFormattedDateString(loopDay));
    }

    const weeklyTodos = todos.filter(todo => weekDateStrings.includes(todo.date));
    const totalCount = weeklyTodos.length;
    const completedCount = weeklyTodos.filter(todo => todo.completed).length;

    const percentage = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

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

    updateWeeklyProgressBar();
}

// 새로운 Todo를 추가하는 함수
function addTodo(e) {
    e.preventDefault();

    const todoText = todoInput.value.trim();
    const todoTagValue = todoCategory.value; 

    if (todoText === '') {
        alert('할 일을 입력해주세요!');
        return;
    }

    const newTodo = {
        id: Date.now(),
        text: todoText,
        completed: false,
        date: getFormattedDateString(selectedDate),
        category: todoTagValue 
    };

    todos.push(newTodo);
    
    saveToLocalStorage();
    renderWeeklyCalendar(); 
    renderTodos();
    renderUpcomingTodos(); 

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
    renderWeeklyCalendar();
    renderTodos();
    renderUpcomingTodos(); 
}

// Todo 내용을 수정하는 함수
function editTodo(id) {
    const todoToEdit = todos.find(todo => { return todo.id === id; });
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
    renderUpcomingTodos(); 
}

// Todo를 삭제하는 함수
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    
    saveToLocalStorage();
    renderWeeklyCalendar(); 
    renderTodos();
    renderUpcomingTodos(); 
}

// 선택된 상태 필터를 변경하는 함수
function changeFilter(e) {
    currentFilter = e.target.dataset.filter;

    tabButtons.forEach(button => {
        button.classList.remove('active');
    });

    e.target.classList.add('active');
    renderTodos();
}

// 카테고리 필터 조작 시 트리거되는 핸들러 함수
function changeCategoryFilter(e) {
    currentCategoryFilter = e.target.value;
    renderTodos();
}

// 일별 Todo 리스트 렌더링 함수
function renderTodos() {
    todoList.innerHTML = '';
    const targetDateStr = getFormattedDateString(selectedDate);

    const filteredTodos = todos.filter(todo => {
        if (todo.date !== targetDateStr) return false;
        if (currentFilter === 'active' && todo.completed) return false;
        if (currentFilter === 'completed' && !todo.completed) return false;
        if (currentCategoryFilter !== 'all' && todo.category !== currentCategoryFilter) return false;
        return true;
    });

    filteredTodos.forEach(todo => {
        const li = createTodoItemDOM(todo);
        todoList.appendChild(li);
    });
}

// 우측 다가오는 일정 리스트를 필터링 및 정렬하여 그려주는 렌더링 함수
function renderUpcomingTodos() {
    upcomingList.innerHTML = '';

    const todayStr = getFormattedDateString(new Date());
    const upcomingTodos = todos.filter(todo => todo.date >= todayStr);

    upcomingTodos.sort((a, b) => a.date.localeCompare(b.date));

    upcomingTodos.forEach(todo => {
        const li = createTodoItemDOM(todo, true); 
        upcomingList.appendChild(li);
    });
}

// 양쪽 리스트 엘리먼트 생성용 공통 팩토리 함수
function createTodoItemDOM(todo, isUpcomingView = false) {
    const li = document.createElement('li');
    li.className = 'todo-item';
    if (todo.completed) {
        li.classList.add('completed');
    }

    const contentBox = document.createElement('div');
    contentBox.className = 'todo-content-box';

    if (isUpcomingView) {
        const dateSpan = document.createElement('span');
        dateSpan.className = 'todo-date-label';
        dateSpan.textContent = todo.date.slice(5); 
        contentBox.appendChild(dateSpan);
    }

    const tagSpan = document.createElement('span');
    tagSpan.className = `todo-tag tag-${todo.category || '일상'}`;
    tagSpan.textContent = todo.category || '일상';
    contentBox.appendChild(tagSpan);

    const textSpan = document.createElement('span');
    textSpan.className = 'todo-text';
    textSpan.textContent = todo.text;
    contentBox.appendChild(textSpan);
    
    li.appendChild(contentBox);

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
    return li;
}

// 애플리케이션 시작 실행
init();