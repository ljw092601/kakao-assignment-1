import React from 'react';

function TodoItem({
  todo,
  isEditing,
  editingText,
  onEditChange,
  onSave,
  onCancel,
  onToggleComplete,
  onEditStart,
  onDelete,
  showDate = false,
}) {
  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-content-box">
        {showDate && <span className="todo-date-label">{todo.date.slice(5)}</span>}
        <span className={`todo-tag tag-${todo.category || '일상'}`}>{todo.category || '일상'}</span>
        {isEditing ? (
          <input
            type="text"
            className="edit-todo-input"
            value={editingText}
            onChange={onEditChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSave();
              if (e.key === 'Escape') onCancel();
            }}
            autoFocus
          />
        ) : (
          <span className="todo-text">{todo.text}</span>
        )}
      </div>
      <div className="btn-group">
        {isEditing ? (
          <>
            <button className="action-btn save-btn" onClick={onSave}>저장</button>
            <button className="action-btn cancel-btn" onClick={onCancel}>취소</button>
          </>
        ) : (
          <>
            <button className="action-btn complete-btn" onClick={onToggleComplete}>
              {todo.completed ? '취소' : '완료'}
            </button>
            <button className="action-btn edit-btn" onClick={onEditStart}>수정</button>
            <button className="action-btn delete-btn" onClick={onDelete}>삭제</button>
          </>
        )}
      </div>
    </li>
  );
}

export default TodoItem;
