"use client";

import { useMemo } from "react";
import { Sidebar } from "@/app/components/Sidebar";
import { Editor } from "@/app/components/Editor";
import { ConsolePanel } from "@/app/components/ConsolePanel";
import { AIPanel } from "@/app/components/AIPanel";
import { LivePreview } from "@/app/components/LivePreview";
import { pyodideService } from "@/app/services/pyodideService";
import { useIDEStore } from "@/app/store/ideStore";

export function IDELayout() {
  const { project, activeFilePath, pushConsole } = useIDEStore();
  const activeFile = useMemo(() => project.files.find((f) => f.path === activeFilePath), [project.files, activeFilePath]);

  const runPython = async () => {
    if (!activeFile || activeFile.language !== "python") return;
    await pyodideService.run(
      activeFile.content,
      (message) => pushConsole({ type: "stdout", message }),
      (message) => pushConsole({ type: "stderr", message })
    );
  };

  const runJs = async () => {
    if (!activeFile || !["javascript", "typescript"].includes(activeFile.language)) return;
    try {
      const log = (...args: unknown[]) => pushConsole({ type: "stdout", message: args.join(" ") });
      // eslint-disable-next-line no-new-func
      new Function("console", activeFile.content)({ log });
    } catch (error) {
      pushConsole({ type: "stderr", message: String(error) });
    }
  };

  return (
    <main className="flex h-screen w-screen overflow-hidden">
      <Sidebar />
      <section className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-2 border-b border-border bg-panel px-3 py-2 text-xs">
          <span className="font-semibold">CodeFusion</span>
          <button className="rounded bg-zinc-700 px-2 py-1" onClick={runJs}>Run JS</button>
          <button className="rounded bg-zinc-700 px-2 py-1" onClick={runPython}>Run Python</button>
        </header>
        <div className="min-h-0 flex flex-1">
          <div className="flex min-w-0 flex-1 flex-col">
            <Editor />
            <ConsolePanel />
          </div>
          <div className="hidden w-[34rem] flex-col xl:flex">
            <LivePreview />
          </div>
        </div>
      </section>
      <AIPanel />
    </main>
  );
}
