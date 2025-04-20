import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Task = {
  id: string;
  title: string;
  about: string;
  completed: boolean;
};

type TaskStore = {
  tasks: Task[];
  addTask: (title: string, about: string) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  updateTask: (id: string, title: string, about: string) => void;
  loadTasks: () => void;
};

const TASKS_KEY = 'TASKS_STORAGE';

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],

  addTask: async (title, about) => {
    const newTask = {
      id: Date.now().toString(),
      title,
      about,
      completed: false,
    };
    const updatedTasks = [...get().tasks, newTask];
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(updatedTasks));
    set({ tasks: updatedTasks });
  },

  deleteTask: async (id) => {
    const updatedTasks = get().tasks.filter((task) => task.id !== id);
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(updatedTasks));
    set({ tasks: updatedTasks });
  },

  toggleTask: async (id) => {
    const updatedTasks = get().tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(updatedTasks));
    set({ tasks: updatedTasks });
  },

  updateTask: async (id, title, about) => {
    const updatedTasks = get().tasks.map((task) =>
      task.id === id ? { ...task, title, about } : task
    );
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(updatedTasks));
    set({ tasks: updatedTasks });
  },

  loadTasks: async () => {
    const stored = await AsyncStorage.getItem(TASKS_KEY);
    if (stored) {
      set({ tasks: JSON.parse(stored) });
    }
  },
}));
