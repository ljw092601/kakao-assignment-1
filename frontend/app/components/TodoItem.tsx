"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Todo } from "../types/todo";
import { updateTodo, deleteTodo } from "../actions/todoActions";

interface Props {
  todo: Todo;
}

export default function TodoItem({ todo }: Props) {
  const [isPending, startTransition] = useTransition();

  const toggleCompleted = () => {
    startTransition(async () => {
      await updateTodo(todo.id, { completed: !todo.completed });
    });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this?")) {
      startTransition(async () => {
        await deleteTodo(todo.id);
      });
    }
  };

  return (
    <div
      className={`glass-panel p-4 rounded-xl flex items-center gap-4 transition-all duration-300 ${
        isPending ? "opacity-50 scale-95" : "hover:scale-[1.02]"
      } ${todo.completed ? "opacity-75" : ""}`}
    >
      <button
        onClick={toggleCompleted}
        disabled={isPending}
        className={`w-6 h-6 rounded-full border-2 flex shrink-0 items-center justify-center transition-colors ${
          todo.completed
            ? "bg-teal-500 border-teal-500"
            : "border-slate-400 hover:border-teal-500"
        }`}
      >
        {todo.completed && (
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <h3
          className={`text-lg font-semibold truncate transition-all ${
            todo.completed ? "line-through text-slate-500 dark:text-slate-400" : ""
          }`}
        >
          {todo.title}
        </h3>
        {todo.description && (
          <p className="text-sm text-slate-500 dark:text-slate-400 truncate mt-1">
            {todo.description}
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Link
          href={`/todos/${todo.id}`}
          className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 transition-colors bg-white/50 dark:bg-slate-800/50 rounded-lg hover:bg-white dark:hover:bg-slate-800"
        >
          Edit
        </Link>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-red-600 dark:text-slate-300 dark:hover:text-red-400 transition-colors bg-white/50 dark:bg-slate-800/50 rounded-lg hover:bg-white dark:hover:bg-slate-800"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
