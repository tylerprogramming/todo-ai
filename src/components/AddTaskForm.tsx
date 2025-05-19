import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface AddTaskFormProps {
  onAdd: (title: string) => Promise<void>;
}

export function AddTaskForm({ onAdd }: AddTaskFormProps) {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    setIsLoading(true);
    try {
      await onAdd(title);
      setTitle('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex items-center bg-white rounded-lg shadow-sm p-2 focus-within:ring-2 focus-within:ring-blue-300 transition-all">
        <input
          type="text"
          className="flex-1 p-2 border-none focus:outline-none text-gray-800 placeholder-gray-400"
          placeholder="Add a new task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isLoading}
        />
        <button
          type="submit"
          className="ml-2 p-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading || !title.trim()}
        >
          <Plus size={18} />
          <span className="ml-1">Add</span>
        </button>
      </div>
    </form>
  );
}