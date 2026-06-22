"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Todo } from "../types/todo";
import { getTodos } from "../actions/todoActions";
import TodoItem from "../components/TodoItem";

function getTodayDateStr() {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function UpcomingPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUpcomingTodos = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      const today = getTodayDateStr();
      const data = await getTodos(today);
      
      const upcoming = data
        .filter(t => !t.completed && t.date && t.date >= today)
        .sort((a, b) => {
          if (!a.date || !b.date) return 0;
          return a.date.localeCompare(b.date);
        });

      setTodos(upcoming);
    } catch (err) {
      console.error(err);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcomingTodos(true);
  }, []);

  const handleTaskChange = () => {
    fetchUpcomingTodos(false);
  };

  const handleOptimisticUpdate = (updatedTodo: Todo) => {
    setTodos(prev => prev.map(t => t.id === updatedTodo.id ? updatedTodo : t));
  };

  return (
    <main className="w-full max-w-4xl mx-auto p-6 md:p-10 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white h-[850px] max-h-[90vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col p-8 border border-slate-100">
        
        <div className="flex items-center gap-4 mb-8 shrink-0">
          <Link href="/todos" className="text-violet-400 hover:text-violet-600 transition-colors p-2 bg-violet-50 rounded-full">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <h1 className="text-3xl font-extrabold text-violet-800 italic tracking-tight">다가오는 목록</h1>
        </div>

        <p className="text-slate-500 mb-6 shrink-0 px-2 font-medium">
          오늘 이후로 완료되지 않은 할 일들을 가까운 순서대로 보여줍니다.
        </p>

        <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
          {isLoading ? (
            <div className="text-center py-10 text-slate-400 font-medium">로딩 중...</div>
          ) : todos.length === 0 ? (
            <div className="text-center py-10 text-slate-400 font-medium">다가오는 할 일이 없습니다! 🎉</div>
          ) : (
            todos.map(todo => (
              <div key={todo.id}>
                <div className="text-xs font-bold text-violet-400 mb-1 ml-2">{todo.date}</div>
                <TodoItem 
                  todo={todo} 
                  onChange={handleTaskChange} 
                  onOptimisticUpdate={handleOptimisticUpdate}
                />
              </div>
            ))
          )}
        </div>

      </div>
    </main>
  );
}
