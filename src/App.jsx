import { useState, useEffect } from 'react';
import { getFormattedDateString, getMonday } from './utils/dateUtils';
import TodoForm from './components/TodoForm';
import TodoFilter from './components/TodoFilter';
import TodoList from './components/TodoList';
import WeeklyCalendar from './components/WeeklyCalendar';
import WeeklyProgress from './components/WeeklyProgress';

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
          <WeeklyCalendar
            year={year}
            month={month}
            handleWeekNavigation={handleWeekNavigation}
            weekDays={weekDays}
            dayNames={dayNames}
            todos={todos}
            realTodayStr={realTodayStr}
            selectedDateStr={selectedDateStr}
            setSelectedDate={setSelectedDate}
          />
          <WeeklyProgress progressPercentage={progressPercentage} />
        </div>

        {/* 할 일 입력 폼 */}
        <TodoForm
          todoCategory={todoCategory}
          onCategoryChange={(e) => setTodoCategory(e.target.value)}
          todoInput={todoInput}
          onInputChange={(e) => setTodoInput(e.target.value)}
          onSubmit={addTodo}
        />

        {/* 필터 탭 및 카테고리 필터 */}
        <TodoFilter
          currentFilter={currentFilter}
          onFilterChange={setCurrentFilter}
          currentCategoryFilter={currentCategoryFilter}
          onCategoryFilterChange={(e) => setCurrentCategoryFilter(e.target.value)}
        />

        {/* 할 일 목록 배열 공간 */}
        <TodoList
          listId="todo-list"
          listClassName="main-todo-list"
          todos={filteredTodos}
          listType="main"
          editingId={editingId}
          editingList={editingList}
          editingText={editingText}
          onEditChange={(e) => setEditingText(e.target.value)}
          onSave={saveEditTodo}
          onCancel={cancelEditTodo}
          onToggleComplete={toggleComplete}
          onEditStart={startEditTodo}
          onDelete={deleteTodo}
          showDate={false}
        />
      </div>

      {/* 다가오는 일정 사이드바 */}
      <div className="upcoming-container">
        <h2>다가오는 일정</h2>
        <TodoList
          listId="upcoming-list"
          listClassName="upcoming-list"
          todos={upcomingTodos}
          listType="upcoming"
          editingId={editingId}
          editingList={editingList}
          editingText={editingText}
          onEditChange={(e) => setEditingText(e.target.value)}
          onSave={saveEditTodo}
          onCancel={cancelEditTodo}
          onToggleComplete={toggleComplete}
          onEditStart={startEditTodo}
          onDelete={deleteTodo}
          showDate={true}
        />
      </div>
    </div>
  );
}

export default App;