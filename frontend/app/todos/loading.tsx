export default function Loading() {
  return (
    <main className="max-w-3xl mx-auto p-6 min-h-screen">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <div className="h-10 w-48 bg-slate-200/50 dark:bg-slate-800/50 rounded-lg animate-pulse mb-2"></div>
          <div className="h-5 w-32 bg-slate-200/50 dark:bg-slate-800/50 rounded-md animate-pulse"></div>
        </div>
        <div className="h-11 w-32 bg-slate-200/50 dark:bg-slate-800/50 rounded-xl animate-pulse"></div>
      </header>

      <div className="flex flex-col gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-panel p-4 rounded-xl flex items-center gap-4 border-transparent shadow-none">
            <div className="w-6 h-6 rounded-full bg-slate-200/50 dark:bg-slate-800/50 animate-pulse shrink-0"></div>
            <div className="flex-1">
              <div className="h-6 w-3/4 bg-slate-200/50 dark:bg-slate-800/50 rounded-md animate-pulse mb-2"></div>
              <div className="h-4 w-1/2 bg-slate-200/50 dark:bg-slate-800/50 rounded-md animate-pulse"></div>
            </div>
            <div className="flex gap-2 shrink-0">
              <div className="h-8 w-12 bg-slate-200/50 dark:bg-slate-800/50 rounded-md animate-pulse"></div>
              <div className="h-8 w-14 bg-slate-200/50 dark:bg-slate-800/50 rounded-md animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
