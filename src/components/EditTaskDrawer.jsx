import React, { useState, useEffect } from 'react';
import { X, Edit } from 'lucide-react';
import { useUpdateTaskMutation } from '../store/apiSlice';
import { toast } from 'react-toastify';

const EditTaskDrawer = ({ 
  isOpen, 
  onClose, 
  task,
  onUpdateSuccess 
}) => {
  const [updateTask, { isLoading: isUpdatingTask }] = useUpdateTaskMutation();
  
  const [taskData, setTaskData] = useState({
    task_name: '',
    description: '',
    priority: 'medium',
    due_date: '',
    status: 'todo',
    assignees: []
  });

  // Populate form with existing task data when drawer opens
  useEffect(() => {
    if (task && isOpen) {
      setTaskData({
        task_name: task.task_name || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        due_date: task.due_date ? new Date(task.due_date).toISOString().slice(0, 16) : '',
        status: task.status || 'todo',
        assignees: task.assigned_users?.map(user => user.user_id) || []
      });
    }
  }, [task, isOpen]);

  // Reset form when drawer closes
  useEffect(() => {
    if (!isOpen) {
      setTaskData({
        task_name: '',
        description: '',
        priority: 'medium',
        due_date: '',
        status: 'todo',
        assignees: []
      });
    }
  }, [isOpen]);

  const handleInputChange = (field, value) => {
    setTaskData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAssigneeToggle = (user) => {
    setTaskData(prev => {
      const isSelected = prev.assignees.includes(user.user_id);
      if (isSelected) {
        return {
          ...prev,
          assignees: prev.assignees.filter(id => id !== user.user_id)
        };
      } else {
        return {
          ...prev,
          assignees: [...prev.assignees, user.user_id]
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!taskData.task_name.trim()) {
      toast.error('Task name is required');
      return;
    }

    try {
      const updatePayload = {
        task_id: task.task_id,
        task_name: taskData.task_name.trim(),
        description: taskData.description.trim(),
        priority: taskData.priority,
        due_date: taskData.due_date || null,
        status: taskData.status,
        assignees: taskData.assignees
      };

      await updateTask(updatePayload).unwrap();
      
      toast.success('Task updated successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      
      onUpdateSuccess?.();
      onClose();
    } catch (error) {
      toast.error('Failed to update task. Please try again.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      
      console.error('Failed to update task:', error);
    }
  };

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-lg w-full bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Edit className="w-5 h-5 mr-2" />
              Edit Task
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Task Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Task Name *
                </label>
                <input
                  type="text"
                  value={taskData.task_name}
                  onChange={(e) => handleInputChange('task_name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter task name"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={taskData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white resize-none"
                  placeholder="Enter task description"
                />
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priority
                </label>
                <select
                  value={taskData.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Due Date
                </label>
                <input
                  type="datetime-local"
                  value={taskData.due_date}
                  onChange={(e) => handleInputChange('due_date', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={taskData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>

              {/* Assignees */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Assigned Users ({taskData.assignees.length} selected)
                </label>
                {task.assigned_users && task.assigned_users.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-md p-2">
                    {task.assigned_users.map((user) => {
                      const isSelected = taskData.assignees.includes(user.user_id);
                      
                      return (
                        <div
                          key={user.user_id}
                          className={`p-3 border border-gray-200 dark:border-gray-600 rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition ${
                            isSelected ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-300 dark:border-indigo-600' : ''
                          }`}
                          onClick={() => handleAssigneeToggle(user)}
                        >
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}} // Handled by onClick
                              className="mr-3"
                            />
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {user.full_name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 dark:text-gray-400 p-3 border border-gray-300 dark:border-gray-600 rounded-md">
                    No users available to assign
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isUpdatingTask || !taskData.task_name.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {isUpdatingTask ? 'Updating...' : 'Update Task'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTaskDrawer;
