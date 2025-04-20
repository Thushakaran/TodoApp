import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

type TaskStore = {
  tasks: Task[];
  addTask: (title: string) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  loadTasks: () => void;
  updateTask: (id: string, title: string) => void;  // Added updateTask function
};

const TASKS_KEY = 'TASKS_STORAGE';

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],

  // Add a new task
  addTask: async (title) => {
    const newTask = {
      id: Date.now().toString(),
      title,
      completed: false,
    };

    try {
      const updatedTasks = [...get().tasks, newTask];
      await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(updatedTasks)); // AsyncStorage update first
      set({ tasks: updatedTasks }); // Then update state
    } catch (error) {
      console.error('Error adding task to AsyncStorage:', error);
    }
  },

  // Delete an existing task
  deleteTask: async (id) => {
    try {
      const updatedTasks = get().tasks.filter((task) => task.id !== id);
      await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(updatedTasks)); // AsyncStorage update first
      set({ tasks: updatedTasks }); // Then update state
    } catch (error) {
      console.error('Error deleting task from AsyncStorage:', error);
    }
  },

  // Toggle task completion
  toggleTask: async (id) => {
    try {
      const updatedTasks = get().tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );
      await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(updatedTasks)); // AsyncStorage update first
      set({ tasks: updatedTasks }); // Then update state
    } catch (error) {
      console.error('Error toggling task in AsyncStorage:', error);
    }
  },

  // Load tasks from AsyncStorage
  loadTasks: async () => {
    try {
      const stored = await AsyncStorage.getItem(TASKS_KEY);
      if (stored) {
        set({ tasks: JSON.parse(stored) });
      }
    } catch (error) {
      console.error('Error loading tasks from AsyncStorage:', error);
    }
  },

  // Update a task
  updateTask: async (id, title) => {
    try {
      const updatedTasks = get().tasks.map((task) =>
        task.id === id ? { ...task, title } : task
      );
      await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(updatedTasks)); // AsyncStorage update first
      set({ tasks: updatedTasks }); // Then update state
    } catch (error) {
      console.error('Error updating task in AsyncStorage:', error);
    }
  },
}));
