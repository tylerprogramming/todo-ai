import React, { useState } from 'react';
import { Task } from '../types';
import { Check, X, Edit, Trash, Save } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onToggle: (task: Task) => Promise<void>;
  onEdit: (id: string, title: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function TaskItem({ task, onToggle, onEdit, onDelete }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      await onToggle(task);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await onDelete(task.id);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!editTitle.trim()) return;
    
    setIsLoading(true);
    try {
      await onEdit(task.id, editTitle);
      setIsEditing(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 mb-3 border-l-4 ${
      task.completed ? 'border-green-500' : 'border-blue-500'
    } transition-all duration-200 hover:shadow-md`}>
      {isEditing ? (
        <div className="flex items-center">
          <input
            type="text"
            className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            autoFocus
            disabled={isLoading}
          />
          <button 
            className="ml-2 p-1.5 rounded-full text-green-600 hover:bg-green-100 transition-colors"
            onClick={handleEditSubmit}
            disabled={isLoading}
          >
            <Save size={18} />
          </button>
          <button 
            className="ml-1 p-1.5 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
            onClick={() => {
              setEditTitle(task.title);
              setIsEditing(false);
            }}
            disabled={isLoading}
          >
            <X size={18} />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              className={`p-1.5 rounded-full ${
                task.completed 
                  ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              } transition-colors mr-3`}
              onClick={handleToggle}
              disabled={isLoading}
              aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
            >
              <Check size={18} />
            </button>
            <span 
              className={`${
                task.completed ? 'text-gray-500 line-through' : 'text-gray-800'
              }`}
            >
              {task.title}
            </span>
          </div>
          
          <div className="flex items-center">
            <button 
              className="p-1.5 rounded-full text-blue-600 hover:bg-blue-100 transition-colors"
              onClick={() => setIsEditing(true)}
              disabled={isLoading}
              aria-label="Edit task"
            >
              <Edit size={18} />
            </button>
            <button 
              className="ml-1 p-1.5 rounded-full text-red-600 hover:bg-red-100 transition-colors"
              onClick={handleDelete}
              disabled={isLoading}
              aria-label="Delete task"
            >
              <Trash size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}