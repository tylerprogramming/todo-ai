import { supabase } from '../lib/supabase';
import { Task } from '../types';

export const fetchTasks = async (): Promise<Task[]> => {
  const { data: session } = await supabase.auth.getSession();
  if (!session?.session?.user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }

  return data.map(todo => ({
    id: todo.id,
    title: todo.title,
    completed: todo.completed
  }));
};

export const createTask = async (title: string): Promise<Task> => {
  const { data: session } = await supabase.auth.getSession();
  if (!session?.session?.user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('todos')
    .insert([{ 
      title,
      user_id: session.session.user.id 
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating task:', error);
    throw error;
  }

  return {
    id: data.id,
    title: data.title,
    completed: data.completed
  };
};

export const updateTask = async (task: Task): Promise<Task> => {
  const { data: session } = await supabase.auth.getSession();
  if (!session?.session?.user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('todos')
    .update({
      title: task.title,
      completed: task.completed
    })
    .eq('id', task.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating task:', error);
    throw error;
  }

  return {
    id: data.id,
    title: data.title,
    completed: data.completed
  };
};

export const deleteTask = async (id: string): Promise<void> => {
  const { data: session } = await supabase.auth.getSession();
  if (!session?.session?.user) {
    throw new Error('User not authenticated');
  }

  const { error } = await supabase
    .from('todos')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};