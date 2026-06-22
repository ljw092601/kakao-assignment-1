"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Todo } from "../types/todo";
import { updateTodo, deleteTodo } from "../actions/todoActions";

interface Props {
  todo: Todo;
  onChange?: () => void;
  onOptimisticUpdate?: (todo: Todo) => void;
}

export default function TodoItem({ todo, onChange, onOptimisticUpdate }: Props) {
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);

  const toggleCompleted = () => {
    const updatedTodo = { ...todo, completed: !todo.completed };
    onOptimisticUpdate?.(updatedTodo); // Optimistically update parent
    
    startTransition(async () => {
      try {
        await updateTodo(todo.id, { completed: updatedTodo.completed });
      } catch (err) {
        console.error("Failed to update status");
      } finally {
        onChange?.(); // Background sync
      }
    });
  };

  const handleDelete = () => {
    if (confirm("정말 삭제하시겠습니까?")) {
      setIsDeleting(true);
      startTransition(async () => {
        await deleteTodo(todo.id);
        onChange?.();
      });
    }
  };

  return (
    <div
      className={`bg-violet-50 p-4 rounded-2xl flex items-center gap-4 transition-all duration-300 ${
        isDeleting ? "opacity-50 scale-95" : "hover:-translate-y-0.5 hover:shadow-md"
      } ${todo.completed ? "opacity-60" : ""}`}
    >
      <button
        onClick={toggleCompleted}
        disabled={isDeleting}
        className={`w-6 h-6 rounded-full border-2 flex shrink-0 items-center justify-center transition-colors ${
          todo.completed
            ? "bg-violet-600 border-violet-600"
            : "border-violet-300 hover:border-violet-500"
        }`}
      >
        {todo.completed && (
          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0 flex items-baseline gap-3">
        <h3
          className={`text-base font-semibold truncate shrink-0 max-w-[60%] sm:max-w-[75%] transition-all ${
            todo.completed ? "line-through text-slate-400" : "text-slate-700"
          }`}
        >
          {todo.title}
        </h3>
        {todo.description && (
          <span className="text-sm text-slate-400 truncate flex-1 min-w-0">
            {todo.description}
          </span>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Link
          href={`/todos/${todo.id}`}
          className="w-8 h-8 flex items-center justify-center bg-violet-100 text-violet-600 hover:bg-violet-200 rounded-full transition-colors"
          title="수정"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </Link>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="w-8 h-8 flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-100 rounded-full transition-colors"
          title="삭제"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
