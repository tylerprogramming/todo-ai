import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface RecommendedTodo {
  id: string;
  title: string;
}

const API_BASE_URL = 'https://choice-entirely-coyote.ngrok-free.app';

export function useRecommendedTodos() {
  const [recommendations, setRecommendations] = useState<RecommendedTodo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setRecommendations([]);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/recommendations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: session.user.id,
          email: session.user.email,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

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
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('User not authenticated');

      const response = await fetch(`${API_BASE_URL}/thumbs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: todo.id,
          action: 'up',
          user: {
            id: session.user.id,
            email: session.user.email,
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process thumbs up');
      }

      // Add to todos
      const { error: insertError } = await supabase
        .from('todos')
        .insert({
          title: todo.title,
          user_id: session.user.id
        });

      if (insertError) throw insertError;

      // Remove from recommendations locally
      setRecommendations(prev => prev.filter(t => t.id !== todo.id));
    } catch (err) {
      console.error('Failed to process thumbs up:', err);
    }
  };

  const handleThumbsDown = async (todo: RecommendedTodo) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('User not authenticated');

      const response = await fetch(`${API_BASE_URL}/thumbs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: todo.id,
          action: 'down',
          user: {
            id: session.user.id,
            email: session.user.email,
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process thumbs down');
      }

      // Remove from recommendations locally
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