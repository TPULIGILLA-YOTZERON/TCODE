"use client";

import { useEffect, useRef } from "react";
import * as monaco from "monaco-editor";

interface Props {
  language: string;
  value: string;
  onChange: (value: string) => void;
}

export default function MonacoEditor({ language, value, onChange }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (!containerRef.current || editorRef.current) return;

    editorRef.current = monaco.editor.create(containerRef.current, {
      value,
      language,
      theme: "vs-dark",
      automaticLayout: true,
      minimap: { enabled: true },
      fontSize: 13,
      lineNumbers: "on",
      formatOnType: true,
      formatOnPaste: true
    });

    const disposable = editorRef.current.onDidChangeModelContent(() => {
      onChange(editorRef.current?.getValue() ?? "");
    });

    return () => {
      disposable.dispose();
      editorRef.current?.dispose();
      editorRef.current = null;
    };
  }, [onChange, language, value]);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    if (editor.getValue() !== value) editor.setValue(value);
    monaco.editor.setModelLanguage(editor.getModel()!, language);
  }, [language, value]);

  return <div ref={containerRef} className="h-full w-full" />;
}
