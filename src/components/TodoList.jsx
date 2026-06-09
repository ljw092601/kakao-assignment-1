import React from 'react';
import TodoItem from './TodoItem';

function TodoList({
  todos,
  listType,
  editingId,
  editingList,
  editingText,
  onEditChange,
  onSave,
  onCancel,
  onToggleComplete,
  onEditStart,
  onDelete,
  showDate = false,
  listId,
  listClassName
}) {
  return (
    <ul id={listId} className={`todo-list ${listClassName}`}>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isEditing={editingId === todo.id && editingList === listType}
          editingText={editingText}
          onEditChange={onEditChange}
          onSave={() => onSave(todo.id)}
          onCancel={onCancel}
          onToggleComplete={() => onToggleComplete(todo.id)}
          onEditStart={() => onEditStart(todo.id, todo.text, listType)}
          onDelete={() => onDelete(todo.id)}
          showDate={showDate}
        />
      ))}
    </ul>
  );
}

export default TodoList;
