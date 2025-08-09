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

export interface TimerState {
  isActive: boolean;
  isPaused: boolean;
  currentProjectId: string | null;
  startTime: number | null;
  duration: number;
  elapsedTime: number;
  lastSaveTime: number | null;
}

export interface Store {
  projects: Project[];
  activities: Activity[];
  activeProjectId: string | null;
  timerState: TimerState;
  createProject: (name: string) => void;
  editProject: (id: string, name: string) => void;
  deleteProject: (id: string) => void;
  addActivity: (activity: Omit<Activity, "date">) => void;
  setActiveProject: (id: string) => void;
  updateTimerState: (updates: Partial<TimerState>) => void;
  saveTimerProgress: () => void;
  resetTimer: () => void;
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      projects: [],
      activities: [],
      activeProjectId: null,
      timerState: {
        isActive: false,
        isPaused: false,
        currentProjectId: null,
        startTime: null,
        duration: 25 * 60, // 25 minutes default
        elapsedTime: 0,
        lastSaveTime: null,
      },
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
      updateTimerState: (updates) => {
        set((state) => ({
          timerState: { ...state.timerState, ...updates },
        }));
      },
      saveTimerProgress: () => {
        const state = get();
        if (
          state.timerState.currentProjectId &&
          state.timerState.elapsedTime > 0
        ) {
          const newActivity = {
            projectId: state.timerState.currentProjectId,
            time: state.timerState.elapsedTime,
            date: new Date().toISOString(),
          };
          set((currentState) => ({
            activities: [...currentState.activities, newActivity],
            timerState: {
              ...currentState.timerState,
              elapsedTime: 0,
              lastSaveTime: Date.now(),
            },
          }));
        }
      },
      resetTimer: () => {
        set((state) => ({
          timerState: {
            ...state.timerState,
            isActive: false,
            isPaused: false,
            startTime: null,
            elapsedTime: 0,
            lastSaveTime: null,
          },
        }));
      },
    }),
    {
      name: "time-tracker-storage",
    }
  )
);
