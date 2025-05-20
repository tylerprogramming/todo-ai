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

      if (!data?.response) {
        console.warn('Unexpected data format from backend:', data);
        setRecommendations([]);
        return;
      }

      const transformedData: RecommendedTodo[] = data.response.map((todo: { title: string }) => ({
        id: crypto.randomUUID(),
        title: todo.title
      }));
      
      setRecommendations(transformedData);
      setError(null);
    } catch (err) {
      setError('Failed to load recommendations');
      console.error('Error fetching recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleThumbsAction = async (todo: RecommendedTodo, action: 'up' | 'down') => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('User not authenticated');

      const response = await fetch(`${API_BASE_URL}/thumbs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          todo: {
            id: todo.id,
            title: todo.title,
          },
          action,
          user: {
            id: session.user.id,
            email: session.user.email,
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to process thumbs ${action}`);
      }

      // Remove from recommendations locally
      setRecommendations(prev => prev.filter(t => t.id !== todo.id));

      // Refresh tasks if thumbs up (the backend will have created the task)
      if (action === 'up') {
        const event = new CustomEvent('refresh-tasks');
        window.dispatchEvent(event);
      }
    } catch (err) {
      console.error(`Failed to process thumbs ${action}:`, err);
    }
  };

  const handleThumbsUp = (todo: RecommendedTodo) => handleThumbsAction(todo, 'up');
  const handleThumbsDown = (todo: RecommendedTodo) => handleThumbsAction(todo, 'down');

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