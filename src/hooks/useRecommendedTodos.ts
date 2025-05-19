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
      const response = await fetch('https://your-backend-url/recommendations');
      if (!response.ok) throw new Error('Failed to fetch recommendations');
      const data = await response.json();
      setRecommendations(data);
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
      await fetch('https://your-backend-url/thumbs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: todo.id, action: 'up' }),
      });
      setRecommendations(prev => prev.filter(t => t.id !== todo.id));
    } catch (err) {
      console.error('Failed to process thumbs up:', err);
    }
  };

  const handleThumbsDown = async (todo: RecommendedTodo) => {
    try {
      await fetch('https://your-backend-url/thumbs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: todo.id, action: 'down' }),
      });
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