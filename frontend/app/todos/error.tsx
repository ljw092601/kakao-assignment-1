"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="max-w-3xl mx-auto p-6 min-h-screen flex flex-col items-center pt-20">
      <div className="glass-panel p-10 rounded-3xl text-center animate-in max-w-md w-full shadow-xl">
        <div className="text-6xl mb-6 bg-red-100/50 dark:bg-red-900/20 p-4 rounded-full w-24 h-24 flex items-center justify-center mx-auto border border-red-200 dark:border-red-800">
          ⚠️
        </div>
        <h2 className="text-2xl font-bold mb-3 text-slate-800 dark:text-slate-100">Oops! Something went wrong</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
          We couldn't load your tasks. The server might be down or there's a network issue.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="w-full px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-lg shadow-red-500/30 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            Try again
          </button>
          <Link
            href="/todos"
            className="w-full px-6 py-3 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
          >
            Go to list
          </Link>
        </div>
      </div>
    </main>
  );
}
