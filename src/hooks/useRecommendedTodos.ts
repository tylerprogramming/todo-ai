import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface RecommendedTodo {
  id: string;
  title: string;
}

export function useRecommendedTodos() {
  const [recommendations, setRecommendations] = useState<RecommendedTodo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('recommended_todos')
        .select('id, title')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      
      setRecommendations(data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load recommendations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleThumbsUp = async (todo: RecommendedTodo) => {
    try {
      // Add the recommended todo to the user's todos
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error: insertError } = await supabase
        .from('todos')
        .insert({
          title: todo.title,
          user_id: user.id
        });

      if (insertError) throw insertError;

      // Remove from recommendations
      setRecommendations(prev => prev.filter(t => t.id !== todo.id));
    } catch (err) {
      console.error('Failed to process thumbs up:', err);
    }
  };

  const handleThumbsDown = async (todo: RecommendedTodo) => {
    try {
      // Simply remove from recommendations
      const { error: deleteError } = await supabase
        .from('recommended_todos')
        .delete()
        .eq('id', todo.id);

      if (deleteError) throw deleteError;
      
      setRecommendations(prev => prev.filter(t => t.id !== todo.id));
    } catch (err) {
      console.error('Failed to process thumbs down:', err);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  return {
    recommendations,
    loading,
    error,
    handleThumbsUp,
    handleThumbsDown,
  };
}