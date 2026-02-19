"use client";

import { useMemo } from "react";
import { useIDEStore } from "@/app/store/ideStore";

export function LivePreview() {
  const { project } = useIDEStore();

  const srcDoc = useMemo(() => {
    const html = project.files.find((f) => f.path.endsWith(".html"))?.content ?? "";
    const css = project.files.filter((f) => f.path.endsWith(".css")).map((f) => `<style>${f.content}</style>`).join("\n");
    const js = project.files.filter((f) => f.path.endsWith(".js")).map((f) => `<script>${f.content}</script>`).join("\n");
    return `${html}\n${css}\n${js}`;
  }, [project.files]);

  return (
    <section className="h-1/2 border-t border-border bg-panel">
      <header className="border-b border-border px-3 py-2 text-xs font-semibold">Live Preview</header>
      <iframe title="Live preview" className="h-[calc(100%-2rem)] w-full bg-white" sandbox="allow-scripts" srcDoc={srcDoc} />
    </section>
  );
}
