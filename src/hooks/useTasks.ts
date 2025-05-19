import { useState, useEffect, useCallback } from 'react';
import { Task } from '../types';
import { fetchTasks, createTask, updateTask, deleteTask } from '../services/taskService';
import { supabase } from '../lib/supabase';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setTasks([]);
        return;
      }

      setLoading(true);
      const tasks = await fetchTasks();
      setTasks(tasks);
      setError(null);
    } catch (err) {
      setError('Failed to load tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();

    // Subscribe to auth changes to reload tasks when user signs in/out
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        loadTasks();
      } else if (event === 'SIGNED_OUT') {
        setTasks([]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadTasks]);

  const addTask = async (title: string) => {
    try {
      const newTask = await createTask(title);
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (err) {
      setError('Failed to add task');
      console.error(err);
      throw err;
    }
  };

  const toggleTaskCompletion = async (task: Task) => {
    try {
      const updatedTask = { ...task, completed: !task.completed };
      await updateTask(updatedTask);
      setTasks(prev => prev.map(t => (t.id === task.id ? updatedTask : t)));
    } catch (err) {
      setError('Failed to update task');
      console.error(err);
      throw err;
    }
  };

  const editTask = async (id: string, title: string) => {
    try {
      const task = tasks.find(t => t.id === id);
      if (!task) return;
      
      const updatedTask = { ...task, title };
      await updateTask(updatedTask);
      setTasks(prev => prev.map(t => (t.id === id ? updatedTask : t)));
    } catch (err) {
      setError('Failed to update task');
      console.error(err);
      throw err;
    }
  };

  const removeTask = async (id: string) => {
    try {
      await deleteTask(id);
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      setError('Failed to delete task');
      console.error(err);
      throw err;
    }
  };

  return {
    tasks,
    loading,
    error,
    addTask,
    toggleTaskCompletion,
    editTask,
    removeTask,
    refresh: loadTasks,
  };
}