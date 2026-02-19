"use client";

import { useIDEStore } from "@/app/store/ideStore";

export function ConsolePanel() {
  const { consoleEntries, clearConsole } = useIDEStore();

  return (
    <section className="h-48 border-t border-border bg-panel p-2 text-xs">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-semibold">Console</h3>
        <button onClick={clearConsole} className="rounded bg-zinc-700 px-2 py-1">Clear</button>
      </div>
      <div className="scrollbar-thin h-[calc(100%-2rem)] overflow-auto font-mono">
        {consoleEntries.map((entry) => (
          <pre key={entry.id} className={entry.type === "stderr" ? "text-red-400" : "text-zinc-200"}>{entry.message}</pre>
        ))}
      </div>
    </section>
  );
}
