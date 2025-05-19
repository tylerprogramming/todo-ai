import React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface RecommendedTodo {
  id: string;
  title: string;
}

interface RecommendedTodosProps {
  recommendations: RecommendedTodo[];
  onThumbsUp: (todo: RecommendedTodo) => void;
  onThumbsDown: (todo: RecommendedTodo) => void;
}

export function RecommendedTodos({ recommendations, onThumbsUp, onThumbsDown }: RecommendedTodosProps) {
  if (recommendations.length === 0) return null;

  return (
    <div className="fixed bottom-20 left-5 w-72 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-blue-500 text-white px-4 py-2">
        <h3 className="font-medium">Recommended Tasks</h3>
      </div>
      <div className="p-4">
        {recommendations.map((todo) => (
          <div key={todo.id} className="flex items-center justify-between mb-3 last:mb-0 p-2 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-700">{todo.title}</span>
            <div className="flex gap-2">
              <button
                onClick={() => onThumbsUp(todo)}
                className="p-1.5 rounded-full text-green-600 hover:bg-green-100 transition-colors"
                aria-label="Accept recommendation"
              >
                <ThumbsUp size={16} />
              </button>
              <button
                onClick={() => onThumbsDown(todo)}
                className="p-1.5 rounded-full text-red-600 hover:bg-red-100 transition-colors"
                aria-label="Reject recommendation"
              >
                <ThumbsDown size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );