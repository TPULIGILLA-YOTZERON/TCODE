"use client";

import { Plus, Trash2, Pencil } from "lucide-react";
import { useIDEStore } from "@/app/store/ideStore";

export function Sidebar() {
  const { project, activeFilePath, setActiveFile, createFile, deleteFile, renameFile } = useIDEStore();

  const handleCreate = async () => {
    const path = prompt("File path", "new-file.js");
    if (!path) return;
    await createFile(path, path.endsWith(".py") ? "python" : "javascript", "");
  };

  return (
    <aside className="h-full w-64 border-r border-border bg-panel p-3">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-300">Explorer</h2>
        <button onClick={handleCreate} className="rounded p-1 hover:bg-zinc-700" aria-label="Create file">
          <Plus size={14} />
        </button>
      </div>
      <ul className="scrollbar-thin space-y-1 overflow-auto text-sm">
        {project.files.map((file) => (
          <li key={file.id} className="group flex items-center justify-between gap-2">
            <button
              onClick={() => setActiveFile(file.path)}
              className={`flex-1 truncate rounded px-2 py-1 text-left ${
                activeFilePath === file.path ? "bg-accent text-white" : "hover:bg-zinc-700"
              }`}
            >
              {file.path}
            </button>
            <button
              onClick={async () => {
                const next = prompt("Rename file", file.path);
                if (next) await renameFile(file.path, next);
              }}
              className="hidden rounded p-1 hover:bg-zinc-700 group-hover:block"
              aria-label="Rename file"
            >
              <Pencil size={12} />
            </button>
            <button
              onClick={() => deleteFile(file.path)}
              className="hidden rounded p-1 hover:bg-zinc-700 group-hover:block"
              aria-label="Delete file"
            >
              <Trash2 size={12} />
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
