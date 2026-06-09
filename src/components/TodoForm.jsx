import React from 'react';

function TodoForm({
  todoCategory,
  onCategoryChange,
  todoInput,
  onInputChange,
  onSubmit
}) {
  return (
    <form id="todo-form" className="todo-form" onSubmit={onSubmit}>
      <select 
        id="todo-category" 
        className="category-select" 
        aria-label="카테고리 선택"
        value={todoCategory}
        onChange={onCategoryChange}
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
        onChange={onInputChange}
      />
      <button type="submit" id="add-btn">추가</button>
    </form>
  );
}

export default TodoForm;
