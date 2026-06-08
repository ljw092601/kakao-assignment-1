import { useState, useEffect } from 'react';

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

function App() {
  // 로컬스토리지 연동 데이터 복원
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });

  // 필터링 기준 상태 변수
  const [currentFilter, setCurrentFilter] = useState('all');
  const [currentCategoryFilter, setCurrentCategoryFilter] = useState('all');

  // 현재 선택된 타겟 날짜 및 주간 시작일 정보 상태 제어
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentWeekStart, setCurrentWeekStart] = useState(() => getMonday(new Date()));

  // Form 상태
  const [todoInput, setTodoInput] = useState('');
  const [todoCategory, setTodoCategory] = useState('일상');

  // 수정 상태
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [editingList, setEditingList] = useState(null);

  // 로컬스토리지 영속성 직렬화 저장 (todos 변경 시)
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // 주차 이동 처리 함수
  const handleWeekNavigation = (daysOffset) => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(newWeekStart.getDate() + daysOffset);
    setCurrentWeekStart(newWeekStart);
    setSelectedDate(new Date(newWeekStart));
  };

  // 새로운 Todo를 추가하는 함수
  const addTodo = (e) => {
    e.preventDefault();
    const todoText = todoInput.trim();

    if (todoText === '') {
      alert('할 일을 입력해주세요!');
      return;
    }

    const newTodo = {
      id: Date.now(),
      text: todoText,
      completed: false,
      date: getFormattedDateString(selectedDate),
      category: todoCategory,
    };

    setTodos([...todos, newTodo]);
    setTodoInput('');
  };

  // Todo 완료 상태를 토글하는 함수
  const toggleComplete = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // Todo 수정을 시작하는 함수
  const startEditTodo = (id, currentText, listType) => {
    setEditingId(id);
    setEditingText(currentText);
    setEditingList(listType);
  };

  // 수정된 내용을 저장하는 함수
  const saveEditTodo = (id) => {
    if (editingText.trim() === '') {
      alert('내용을 입력해야 수정할 수 있습니다.');
      return;
    }

    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, text: editingText.trim() } : todo
    ));
    setEditingId(null);
    setEditingText('');
    setEditingList(null);
  };

  // 수정을 취소하는 함수
  const cancelEditTodo = () => {
    setEditingId(null);
    setEditingText('');
    setEditingList(null);
  };

  // Todo를 삭제하는 함수
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // 주간 달력 생성용 배열
  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const loopDay = new Date(currentWeekStart);
    loopDay.setDate(currentWeekStart.getDate() + i);
    weekDays.push(loopDay);
  }

  const year = currentWeekStart.getFullYear();
  const month = currentWeekStart.getMonth() + 1;
  const dayNames = ['월', '화', '수', '목', '금', '토', '일'];
  const realTodayStr = getFormattedDateString(new Date());
  const selectedDateStr = getFormattedDateString(selectedDate);

  // 주간 달성률 계산
  const weekDateStrings = weekDays.map(d => getFormattedDateString(d));
  const weeklyTodos = todos.filter(todo => weekDateStrings.includes(todo.date));
  const totalWeeklyCount = weeklyTodos.length;
  const completedWeeklyCount = weeklyTodos.filter(todo => todo.completed).length;
  const progressPercentage = totalWeeklyCount === 0 ? 0 : Math.round((completedWeeklyCount / totalWeeklyCount) * 100);

  // 필터링된 Todo 목록
  const filteredTodos = todos.filter(todo => {
    if (todo.date !== selectedDateStr) return false;
    if (currentFilter === 'active' && todo.completed) return false;
    if (currentFilter === 'completed' && !todo.completed) return false;
    if (currentCategoryFilter !== 'all' && todo.category !== currentCategoryFilter) return false;
    return true;
  });

  // 다가오는 일정 필터링 및 정렬
  const todayStr = getFormattedDateString(new Date());
  const upcomingTodos = todos.filter(todo => todo.date >= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="app-layout">
      {/* 메인 Todo 컨테이너 */}
      <div className="todo-container">
        <h1>Todo List</h1>

        {/* 주간 네비게이션 */}
        <div className="week-navigation-container">
          <div className="week-header">
            <button id="prev-week-btn" className="nav-btn" aria-label="이전 주" onClick={() => handleWeekNavigation(-7)}>&lt;</button>
            <span id="month-display">{year}년 {month}월</span>
            <button id="next-week-btn" className="nav-btn" aria-label="다음 주" onClick={() => handleWeekNavigation(7)}>&gt;</button>
          </div>
          <div id="weekly-calendar" className="weekly-calendar">
            {weekDays.map((loopDay, index) => {
              const loopDayStr = getFormattedDateString(loopDay);
              const dayTodoCount = todos.filter(todo => todo.date === loopDayStr).length;
              
              let dayCardClass = "day-card";
              if (loopDayStr === realTodayStr) dayCardClass += " today";
              if (loopDayStr === selectedDateStr) dayCardClass += " active";

              return (
                <div 
                  key={loopDayStr}
                  className={dayCardClass}
                  onClick={() => setSelectedDate(new Date(loopDay))}
                >
                  <span className="day-name">{dayNames[index]}</span>
                  <span className="day-number">{loopDay.getDate()}</span>
                  <span className="todo-count">{dayTodoCount > 0 ? dayTodoCount : ''}</span>
                </div>
              );
            })}
          </div>

          {/* 주간 달성률 프로그래스 바 */}
          <div className="progress-container">
            <div className="progress-label">
              <span>주간 달성률</span>
              <span id="progress-percent">{progressPercentage}%</span>
            </div>
            <div className="progress-bar-bg">
              <div id="progress-bar-fill" className="progress-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
            </div>
          </div>
        </div>

        {/* 할 일 입력 폼 */}
        <form id="todo-form" className="todo-form" onSubmit={addTodo}>
          <select 
            id="todo-category" 
            className="category-select" 
            aria-label="카테고리 선택"
            value={todoCategory}
            onChange={(e) => setTodoCategory(e.target.value)}
          >
            <option value="일상">일상</option>
            <option value="학업">학업</option>
            <option value="업무">업무</option>
            <option value="운동">운동</option>
          </select>
          <input 
            type="text" 
            id="todo-input" 
            placeholder="할 일을 입력하세요..." 
            autoComplete="off" 
            value={todoInput}
            onChange={(e) => setTodoInput(e.target.value)}
          />
          <button type="submit" id="add-btn">추가</button>
        </form>

        {/* 필터 탭 및 카테고리 필터 */}
        <div className="filter-container">
          <div className="filter-tabs">
            <button 
              className={`tab-btn ${currentFilter === 'all' ? 'active' : ''}`} 
              data-filter="all"
              onClick={() => setCurrentFilter('all')}
            >전체</button>
            <button 
              className={`tab-btn ${currentFilter === 'active' ? 'active' : ''}`} 
              data-filter="active"
              onClick={() => setCurrentFilter('active')}
            >진행</button>
            <button 
              className={`tab-btn ${currentFilter === 'completed' ? 'active' : ''}`} 
              data-filter="completed"
              onClick={() => setCurrentFilter('completed')}
            >완료</button>
          </div>
          <select 
            id="filter-category" 
            className="filter-category-select" 
            aria-label="카테고리 필터"
            value={currentCategoryFilter}
            onChange={(e) => setCurrentCategoryFilter(e.target.value)}
          >
            <option value="all">모든 카테고리</option>
            <option value="일상">일상</option>
            <option value="학업">학업</option>
            <option value="업무">업무</option>
            <option value="운동">운동</option>
          </select>
        </div>

        {/* 할 일 목록 배열 공간 */}
        <ul id="todo-list" className="todo-list main-todo-list">
          {filteredTodos.map(todo => (
            <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              <div className="todo-content-box">
                <span className={`todo-tag tag-${todo.category || '일상'}`}>{todo.category || '일상'}</span>
                {editingId === todo.id && editingList === 'main' ? (
                  <input
                    type="text"
                    className="edit-todo-input"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEditTodo(todo.id);
                      if (e.key === 'Escape') cancelEditTodo();
                    }}
                    autoFocus
                  />
                ) : (
                  <span className="todo-text">{todo.text}</span>
                )}
              </div>
              <div className="btn-group">
                {editingId === todo.id && editingList === 'main' ? (
                  <>
                    <button className="action-btn save-btn" onClick={() => saveEditTodo(todo.id)}>저장</button>
                    <button className="action-btn cancel-btn" onClick={cancelEditTodo}>취소</button>
                  </>
                ) : (
                  <>
                    <button className="action-btn complete-btn" onClick={() => toggleComplete(todo.id)}>
                      {todo.completed ? '취소' : '완료'}
                    </button>
                    <button className="action-btn edit-btn" onClick={() => startEditTodo(todo.id, todo.text, 'main')}>수정</button>
                    <button className="action-btn delete-btn" onClick={() => deleteTodo(todo.id)}>삭제</button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* 다가오는 일정 사이드바 */}
      <div className="upcoming-container">
        <h2>다가오는 일정</h2>
        <ul id="upcoming-list" className="todo-list upcoming-list">
          {upcomingTodos.map(todo => (
            <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              <div className="todo-content-box">
                <span className="todo-date-label">{todo.date.slice(5)}</span>
                <span className={`todo-tag tag-${todo.category || '일상'}`}>{todo.category || '일상'}</span>
                {editingId === todo.id && editingList === 'upcoming' ? (
                  <input
                    type="text"
                    className="edit-todo-input"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEditTodo(todo.id);
                      if (e.key === 'Escape') cancelEditTodo();
                    }}
                    autoFocus
                  />
                ) : (
                  <span className="todo-text">{todo.text}</span>
                )}
              </div>
              <div className="btn-group">
                {editingId === todo.id && editingList === 'upcoming' ? (
                  <>
                    <button className="action-btn save-btn" onClick={() => saveEditTodo(todo.id)}>저장</button>
                    <button className="action-btn cancel-btn" onClick={cancelEditTodo}>취소</button>
                  </>
                ) : (
                  <>
                    <button className="action-btn complete-btn" onClick={() => toggleComplete(todo.id)}>
                      {todo.completed ? '취소' : '완료'}
                    </button>
                    <button className="action-btn edit-btn" onClick={() => startEditTodo(todo.id, todo.text, 'upcoming')}>수정</button>
                    <button className="action-btn delete-btn" onClick={() => deleteTodo(todo.id)}>삭제</button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;