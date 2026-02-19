"use client";

import { create } from "zustand";
import { ChatMessage, ConsoleEntry, Project, ProjectFile, ProjectTemplate } from "@/app/types/project";
import { generateId } from "@/app/utils/id";
import { templateFiles } from "@/app/services/templates";
import { indexedDbService } from "@/app/services/indexedDbService";

interface IDEState {
  project: Project;
  activeFilePath?: string;
  openTabs: string[];
  consoleEntries: ConsoleEntry[];
  chat: ChatMessage[];
  setActiveFile: (path: string) => void;
  updateFileContent: (path: string, content: string) => Promise<void>;
  createProject: (name: string, template: ProjectTemplate) => Promise<void>;
  createFile: (path: string, language: ProjectFile["language"], content?: string) => Promise<void>;
  deleteFile: (path: string) => Promise<void>;
  renameFile: (oldPath: string, newPath: string) => Promise<void>;
  pushConsole: (entry: Omit<ConsoleEntry, "id" | "timestamp">) => void;
  clearConsole: () => void;
  pushMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => void;
}

const initialProject: Project = {
  id: generateId(),
  name: "My CodeFusion Project",
  template: "html-basic",
  files: templateFiles("html-basic"),
  createdAt: Date.now(),
  updatedAt: Date.now()
};

export const useIDEStore = create<IDEState>((set, get) => ({
  project: initialProject,
  activeFilePath: initialProject.files[0]?.path,
  openTabs: initialProject.files.slice(0, 1).map((f) => f.path),
  consoleEntries: [],
  chat: [],

  setActiveFile: (path) =>
    set((state) => ({
      activeFilePath: path,
      openTabs: state.openTabs.includes(path) ? state.openTabs : [...state.openTabs, path]
    })),

  updateFileContent: async (path, content) => {
    set((state) => ({
      project: {
        ...state.project,
        updatedAt: Date.now(),
        files: state.project.files.map((file) =>
          file.path === path ? { ...file, content, updatedAt: Date.now() } : file
        )
      }
    }));
    await indexedDbService.saveProject(get().project);
  },

  createProject: async (name, template) => {
    const project: Project = {
      id: generateId(),
      name,
      template,
      files: templateFiles(template),
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    set({ project, activeFilePath: project.files[0]?.path, openTabs: [project.files[0]?.path].filter(Boolean) as string[] });
    await indexedDbService.saveProject(project);
  },

  createFile: async (path, language, content = "") => {
    const newFile: ProjectFile = {
      id: generateId(),
      name: path.split("/").pop() ?? path,
      path,
      language,
      content,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    set((state) => ({
      project: { ...state.project, files: [...state.project.files, newFile], updatedAt: Date.now() },
      activeFilePath: path,
      openTabs: [...state.openTabs, path]
    }));
    await indexedDbService.saveProject(get().project);
  },

  deleteFile: async (path) => {
    set((state) => ({
      project: { ...state.project, files: state.project.files.filter((f) => f.path !== path), updatedAt: Date.now() },
      openTabs: state.openTabs.filter((tab) => tab !== path),
      activeFilePath: state.activeFilePath === path ? state.project.files[0]?.path : state.activeFilePath
    }));
    await indexedDbService.saveProject(get().project);
  },

  renameFile: async (oldPath, newPath) => {
    set((state) => ({
      project: {
        ...state.project,
        files: state.project.files.map((f) =>
          f.path === oldPath ? { ...f, path: newPath, name: newPath.split("/").pop() ?? newPath, updatedAt: Date.now() } : f
        ),
        updatedAt: Date.now()
      },
      openTabs: state.openTabs.map((tab) => (tab === oldPath ? newPath : tab)),
      activeFilePath: state.activeFilePath === oldPath ? newPath : state.activeFilePath
    }));
    await indexedDbService.saveProject(get().project);
  },

  pushConsole: (entry) =>
    set((state) => ({
      consoleEntries: [...state.consoleEntries, { ...entry, id: generateId(), timestamp: Date.now() }]
    })),
  clearConsole: () => set({ consoleEntries: [] }),
  pushMessage: (message) =>
    set((state) => ({ chat: [...state.chat, { ...message, id: generateId(), timestamp: Date.now() }] }))
}));
