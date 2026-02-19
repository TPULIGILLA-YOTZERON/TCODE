"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { useIDEStore } from "@/app/store/ideStore";

const MonacoEditor = dynamic(() => import("./MonacoEditor"), { ssr: false, loading: () => <div className="p-4">Loading editor…</div> });

export function Editor() {
  const { project, activeFilePath, openTabs, setActiveFile, updateFileContent } = useIDEStore();
  const activeFile = useMemo(() => project.files.find((file) => file.path === activeFilePath), [project.files, activeFilePath]);

  return (
    <section className="flex h-full flex-1 flex-col bg-[#1e1e1e]">
      <div className="flex border-b border-border bg-panel text-xs">
        {openTabs.map((tab) => (
          <button
            key={tab}
            className={`border-r border-border px-3 py-2 ${tab === activeFilePath ? "bg-[#1e1e1e]" : "hover:bg-zinc-700"}`}
            onClick={() => setActiveFile(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="min-h-0 flex-1">
        {activeFile ? (
          <MonacoEditor
            language={activeFile.language}
            value={activeFile.content}
            onChange={(value) => updateFileContent(activeFile.path, value)}
          />
        ) : (
          <div className="p-4">Select a file to edit.</div>
        )}
      </div>
    </section>
  );
}
