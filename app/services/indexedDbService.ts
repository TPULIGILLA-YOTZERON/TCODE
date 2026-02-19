import { openDB } from "idb";
import { Project } from "@/app/types/project";

const DB_NAME = "codefusion-db";
const STORE_NAME = "projects";
const VERSION = 1;

const dbPromise = openDB(DB_NAME, VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: "id" });
    }
  }
});

export const indexedDbService = {
  async saveProject(project: Project) {
    const db = await dbPromise;
    await db.put(STORE_NAME, project);
  },

  async getProject(id: string): Promise<Project | undefined> {
    const db = await dbPromise;
    return db.get(STORE_NAME, id);
  },

  async listProjects(): Promise<Project[]> {
    const db = await dbPromise;
    return db.getAll(STORE_NAME);
  },

  async deleteProject(id: string) {
    const db = await dbPromise;
    await db.delete(STORE_NAME, id);
  }
};
