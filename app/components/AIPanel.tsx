"use client";

import { useState } from "react";
import { aiService } from "@/app/services/aiService";
import { useIDEStore } from "@/app/store/ideStore";

export function AIPanel() {
  const { chat, pushMessage, project, activeFilePath } = useIDEStore();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const runAction = async (mode: "chat" | "explain" | "fix" | "refactor" | "generate", seededPrompt?: string) => {
    const input = seededPrompt ?? prompt;
    if (!input.trim()) return;

    pushMessage({ role: "user", content: input });
    pushMessage({ role: "assistant", content: "" });
    setLoading(true);

    const activeCode = project.files.find((file) => file.path === activeFilePath)?.content;
    const existing = useIDEStore.getState().chat;
    const context = aiService.buildContext(existing, activeCode);

    try {
      let partial = "";
      await aiService.streamResponse({ prompt: input, context, mode }, (chunk) => {
        partial += chunk;
        useIDEStore.setState((state) => {
          const next = [...state.chat];
          const last = next[next.length - 1];
          if (last?.role === "assistant") {
            last.content = partial;
          }
          return { chat: next };
        });
      });
    } catch (error) {
      useIDEStore.getState().pushMessage({ role: "assistant", content: `Error: ${String(error)}` });
    } finally {
      setLoading(false);
      setPrompt("");
    }
  };

  return (
    <aside className="flex h-full w-96 flex-col border-l border-border bg-panel">
      <div className="border-b border-border p-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider">AI Copilot</h2>
        <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
          <button className="rounded bg-zinc-700 px-2 py-1" onClick={() => runAction("explain", "Explain selected code")}>Explain</button>
          <button className="rounded bg-zinc-700 px-2 py-1" onClick={() => runAction("fix", "Fix issues in current file")}>Fix</button>
          <button className="rounded bg-zinc-700 px-2 py-1" onClick={() => runAction("refactor", "Refactor this file for maintainability")}>Refactor</button>
          <button className="rounded bg-zinc-700 px-2 py-1" onClick={() => runAction("generate", "Generate a project scaffold")}>Generate</button>
        </div>
      </div>
      <div className="scrollbar-thin flex-1 space-y-2 overflow-auto p-3 text-sm">
        {chat.map((message) => (
          <div key={message.id} className={message.role === "assistant" ? "text-cyan-300" : "text-zinc-200"}>
            <strong>{message.role}:</strong> {message.content || "..."}
          </div>
        ))}
      </div>
      <div className="border-t border-border p-3">
        <textarea
          className="min-h-24 w-full rounded border border-border bg-[#1e1e1e] p-2 text-sm"
          placeholder="Ask CodeFusion AI..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          className="mt-2 w-full rounded bg-accent px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
          disabled={loading}
          onClick={() => runAction("chat")}
        >
          {loading ? "Thinking..." : "Send"}
        </button>
      </div>
    </aside>
  );
}
