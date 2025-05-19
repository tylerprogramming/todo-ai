import React from 'react';
import { Task } from '../types';
import { TaskItem } from './TaskItem';
import { AddTaskForm } from './AddTaskForm';
import { SearchBar } from './SearchBar';
import { TaskMetrics } from './TaskMetrics';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  onSearch: (term: string) => void;
  onAdd: (title: string) => Promise<void>;
  onToggle: (task: Task) => Promise<void>;
  onEdit: (id: string, title: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function TaskList({
  tasks,
  loading,
  error,
  searchTerm,
  onSearch,
  onAdd,
  onToggle,
  onEdit,
  onDelete,
}: TaskListProps) {
  const taskList = tasks || [];

  if (loading && taskList.length === 0) {
    return <div className="text-center py-4">Loading tasks...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  const filteredTasks = taskList.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <TaskMetrics tasks={taskList} />
      <AddTaskForm onAdd={onAdd} />
      <SearchBar searchTerm={searchTerm} onSearch={onSearch} />
      
      {filteredTasks.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          {taskList.length === 0 
            ? "No tasks yet. Add your first task above!"
            : "No tasks found matching your search."}
        </div>
      ) : (
        <div>
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}