export type SupportedLanguage = "html" | "css" | "javascript" | "python" | "typescript" | "tsx";

export type ProjectTemplate = "html-basic" | "python-script" | "react-static";

export interface ProjectFile {
  id: string;
  name: string;
  path: string;
  content: string;
  language: SupportedLanguage;
  parentId?: string;
  isFolder?: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Project {
  id: string;
  name: string;
  template: ProjectTemplate;
  files: ProjectFile[];
  createdAt: number;
  updatedAt: number;
}

export interface ConsoleEntry {
  id: string;
  type: "stdout" | "stderr" | "info";
  message: string;
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}
