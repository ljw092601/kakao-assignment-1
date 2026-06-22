"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { Todo } from "../types/todo";
import { getTodos, createTodo } from "../actions/todoActions";
import TodoItem from "./TodoItem";

const DAYS = ["월", "화", "수", "목", "금", "토", "일"];

function getWeekDates(baseDate: Date) {
  const dates = [];
  const date = new Date(baseDate);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  
  const start = new Date(date.setDate(diff));
  start.setHours(0, 0, 0, 0);

  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    dates.push(d);
  }
  return dates;
}

function formatDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function TodoListClient() {
  const [currentWeekBase, setCurrentWeekBase] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState<"all" | "active" | "completed">("all");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const weekDates = getWeekDates(currentWeekBase);
  const startDateStr = formatDate(weekDates[0]);
  const endDateStr = formatDate(weekDates[6]);

  const fetchTodos = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      const data = await getTodos(startDateStr, endDateStr);
      setTodos(data);
    } catch (err) {
      console.error(err);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos(true);
  }, [startDateStr, endDateStr]);

  const handlePrevWeek = () => {
    const next = new Date(currentWeekBase);
    next.setDate(next.getDate() - 7);
    setCurrentWeekBase(next);
  };

  const handleNextWeek = () => {
    const next = new Date(currentWeekBase);
    next.setDate(next.getDate() + 7);
    setCurrentWeekBase(next);
  };
  const handleTaskChange = () => {
    // Refresh the list silently in the background
    fetchTodos(false);
  };

  const handleOptimisticUpdate = (updatedTodo: Todo) => {
    setTodos(prev => prev.map(t => t.id === updatedTodo.id ? updatedTodo : t));
  };

  // Derived state
  const totalTasks = todos.length;
  const completedTasks = todos.filter(t => t.completed).length;

  const countsByDate = todos.reduce((acc, todo) => {
    if (todo.date) {
      acc[todo.date] = (acc[todo.date] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const displayedTodos = todos
    .filter(t => t.date === selectedDate)
    .filter(t => {
      if (filterTab === "active") return !t.completed;
      if (filterTab === "completed") return t.completed;
      return true;
    })
    .filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="max-w-2xl mx-auto bg-white h-[850px] max-h-[90vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col p-8 border border-slate-100">
      <h1 className="text-3xl font-extrabold text-center text-violet-800 italic mb-8 tracking-tight shrink-0">Todo List</h1>

      {/* Week Navigation */}
      <div className="flex items-center justify-between mb-6 px-2 shrink-0">
        <button onClick={handlePrevWeek} className="text-violet-800 hover:text-violet-600 p-2">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
        </button>
        <span className="text-slate-500 font-medium">{startDateStr} ~ {endDateStr}</span>
        <button onClick={handleNextWeek} className="text-violet-800 hover:text-violet-600 p-2">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
        </button>
      </div>

      {/* Calendar Days */}
      <div className="flex justify-between gap-2 mb-6 shrink-0">
        {weekDates.map((date, idx) => {
          const dateStr = formatDate(date);
          const isSelected = dateStr === selectedDate;
          const count = countsByDate[dateStr] || 0;
          
          return (
            <button
              key={dateStr}
              onClick={() => setSelectedDate(dateStr)}
              className={`flex-1 flex flex-col items-center justify-center py-3 rounded-2xl transition-all ${
                isSelected 
                  ? "bg-violet-800 text-white shadow-lg shadow-violet-500/30 scale-105" 
                  : "bg-violet-100/50 text-violet-900 hover:bg-violet-100"
              }`}
            >
              <span className={`text-xs font-semibold mb-1 ${isSelected ? 'text-violet-200' : 'text-violet-500'}`}>{DAYS[idx]}</span>
              <span className="text-xl font-bold mb-1">{date.getDate()}</span>
              <span className={`text-xs ${isSelected ? 'text-violet-200' : 'text-violet-400'}`}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Weekly Progress Bar */}
      <div className="mb-8 shrink-0 px-2">
        <div className="flex justify-between items-end mb-2">
          <span className="text-sm font-bold text-slate-500">주간 달성률</span>
          <span className="text-lg font-extrabold text-violet-800">{totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100)}%</span>
        </div>
        <div className="h-3 w-full bg-violet-100 rounded-full overflow-hidden shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500 ease-out rounded-full" 
            style={{ width: `${totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100)}%` }} 
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-6 shrink-0">
        <Link 
          href={`/todos/new?date=${selectedDate}`}
          className="flex-1 bg-violet-800 hover:bg-violet-700 text-white text-center font-bold rounded-2xl px-8 py-4 transition-all shadow-md shadow-violet-500/20 hover:shadow-lg hover:-translate-y-0.5"
        >
          할 일 추가
        </Link>
        <Link 
          href="/upcoming"
          className="flex-1 bg-violet-100 hover:bg-violet-200 text-violet-800 text-center font-bold rounded-2xl px-8 py-4 transition-all hover:-translate-y-0.5 flex items-center justify-center"
        >
          다가오는 목록
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6 shrink-0">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="검색어를 입력하세요"
          className="w-full bg-white border-2 border-violet-200 rounded-full pl-12 pr-6 py-3 text-slate-800 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all placeholder:text-slate-400 font-medium"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 bg-white rounded-full mb-6 shrink-0">
        {[
          { id: "all", label: "전체" },
          { id: "active", label: "진행 중" },
          { id: "completed", label: "완료" }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilterTab(tab.id as any)}
            className={`flex-1 py-3 rounded-full text-sm font-bold transition-colors ${
              filterTab === tab.id
                ? "bg-violet-800 text-white shadow-md shadow-violet-500/20"
                : "bg-violet-50 text-violet-600 hover:bg-violet-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        {isLoading ? (
          <div className="text-center py-10 text-slate-400 font-medium">로딩 중...</div>
        ) : displayedTodos.length === 0 ? (
          <div className="text-center py-10 text-slate-400 font-medium">
            {searchQuery ? "검색 결과가 없습니다." : "이 날짜에 할 일이 없습니다."}
          </div>
        ) : (
          displayedTodos.map(todo => (
            <TodoItem 
              key={todo.id} 
              todo={todo} 
              onChange={handleTaskChange} 
              onOptimisticUpdate={handleOptimisticUpdate}
            />
          ))
        )}
      </div>
    </div>
  );
}
