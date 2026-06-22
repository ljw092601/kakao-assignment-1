"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Todo } from "../types/todo";
import { createTodo, updateTodo } from "../actions/todoActions";

interface Props {
  initialData?: Todo; // If provided, it's edit mode
}

export default function TodoForm({ initialData }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    startTransition(async () => {
      try {
        if (initialData) {
          await updateTodo(initialData.id, { title, description: description || null });
        } else {
          await createTodo({ title, description: description || null });
        }
        router.push("/todos");
      } catch (err) {
        setError("Something went wrong. Please try again.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-2xl flex flex-col gap-5 animate-in max-w-2xl mx-auto w-full mt-8">
      <h2 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-indigo-500">
        {initialData ? "Edit Todo" : "Create New Todo"}
      </h2>

      {error && <div className="text-red-500 bg-red-100/50 dark:bg-red-900/20 p-3 rounded-xl text-sm font-medium border border-red-200 dark:border-red-800">{error}</div>}
      
      <div className="flex flex-col gap-2">
        <label htmlFor="title" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          defaultValue={initialData?.title}
          className="px-4 py-3 rounded-xl border border-slate-300/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all shadow-sm"
          placeholder="What needs to be done?"
          autoFocus
          disabled={isPending}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="description" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Description <span className="text-slate-400 font-normal">(Optional)</span>
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={initialData?.description || ""}
          className="px-4 py-3 rounded-xl border border-slate-300/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all shadow-sm min-h-[120px] resize-y"
          placeholder="Add some details..."
          disabled={isPending}
        />
      </div>

      <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isPending}
          className="px-5 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white shadow-lg shadow-teal-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
        >
          {isPending ? "Saving..." : initialData ? "Save Changes" : "Create Task"}
        </button>
      </div>
    </form>
  );
}
