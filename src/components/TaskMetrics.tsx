import React from 'react';
import { Task } from '../types';
import { CheckCircle, Circle, ListTodo } from 'lucide-react';

interface TaskMetricsProps {
  tasks: Task[];
}

export function TaskMetrics({ tasks }: TaskMetricsProps) {
  // Handle case where tasks is undefined or null
  const taskList = tasks || [];
  
  const completedTasks = taskList.filter(task => task.completed).length;
  const remainingTasks = taskList.length - completedTasks;
  const completionRate = taskList.length > 0 
    ? Math.round((completedTasks / taskList.length) * 100) 
    : 0;

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow-sm p-4 flex items-center">
        <ListTodo className="text-blue-500 mr-3" size={24} />
        <div>
          <div className="text-sm text-gray-500">Total Tasks</div>
          <div className="text-xl font-semibold">{taskList.length}</div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-4 flex items-center">
        <CheckCircle className="text-green-500 mr-3" size={24} />
        <div>
          <div className="text-sm text-gray-500">Completed</div>
          <div className="text-xl font-semibold">{completedTasks}</div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-4 flex items-center">
        <Circle className="text-orange-500 mr-3" size={24} />
        <div>
          <div className="text-sm text-gray-500">Remaining</div>
          <div className="text-xl font-semibold">{remainingTasks}</div>
        </div>
      </div>
      
      <div className="col-span-3 bg-white rounded-lg shadow-sm p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">Completion Rate</span>
          <span className="text-sm font-medium">{completionRate}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-green-500 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}