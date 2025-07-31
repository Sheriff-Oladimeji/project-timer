import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Project {
  id: string;
  name: string;
  color: string;
}

export interface Activity {
  date: string;
  projectId: string;
  time: number;
}

export interface Store {
  projects: Project[];
  activities: Activity[];
  activeProjectId: string | null;
  createProject: (name: string) => void;
  editProject: (id: string, name: string) => void;
  deleteProject: (id: string) => void;
  addActivity: (activity: Omit<Activity, "date">) => void;
  setActiveProject: (id: string) => void;
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      projects: [],
      activities: [],
      activeProjectId: null,
      createProject: (name) => {
        const newProject = {
          id: crypto.randomUUID(),
          name,
          color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        };
        set((state) => ({ projects: [...state.projects, newProject] }));
      },
      editProject: (id, name) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, name } : p
          ),
        }));
      },
      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        }));
      },
      setActiveProject: (id) => set({ activeProjectId: id }),
      addActivity: (activity) => {
        const newActivity = { ...activity, date: new Date().toISOString() };
        set((state) => ({
          activities: [...state.activities, newActivity],
        }));
      },
    }),
    {
      name: "time-tracker-storage",
    }
  )
);
