import Link from "next/link";
import { getTodos } from "../actions/todoActions";
import TodoItem from "../components/TodoItem";

export default async function TodosPage() {
  const todos = await getTodos();

  return (
    <main className="max-w-3xl mx-auto p-6 min-h-screen">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 animate-in" style={{ animationDelay: "100ms" }}>
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-indigo-500 tracking-tight">
            My Tasks
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 font-medium">
            You have {todos.filter(t => !t.completed).length} tasks remaining
          </p>
        </div>
        <Link
          href="/todos/new"
          className="px-5 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white shadow-lg shadow-teal-500/30 transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          + Add Task
        </Link>
      </header>

      {todos.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center flex flex-col items-center justify-center animate-in" style={{ animationDelay: "200ms" }}>
          <div className="text-6xl mb-6 bg-white/50 dark:bg-slate-800/50 p-6 rounded-full w-24 h-24 flex items-center justify-center shadow-sm">
            ✨
          </div>
          <h2 className="text-2xl font-bold mb-2">All caught up!</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm">
            You don't have any tasks on your list yet. Start by adding one above!
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 animate-in" style={{ animationDelay: "200ms" }}>
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </div>
      )}
    </main>
  );
}
