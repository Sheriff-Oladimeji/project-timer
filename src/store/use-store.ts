import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Project {
  id: string;
  name: string;
}

export interface Activity {
  date: string;
  projectId: string;
  time: number;
}

export interface Store {
  projects: Project[];
  activities: Activity[];
  createProject: (name: string) => void;
  addActivity: (activity: Omit<Activity, "date">) => void;
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      projects: [],
      activities: [],
      createProject: (name) => {
        const newProject = { id: crypto.randomUUID(), name };
        set((state) => ({ projects: [...state.projects, newProject] }));
      },
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
