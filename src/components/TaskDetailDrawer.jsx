import React from 'react';
import { X, CheckCircle, Clock, AlertTriangle, Calendar, UserPlus, Users, MessageSquare } from 'lucide-react';
import { formatDueDate, getStatusIcon, getPriorityColor } from '../utils/helper';

const TaskDetailDrawer = ({ isOpen, onClose, task, subtasks, comments, subtaskComments, onViewUsers, onViewSubtaskUsers }) => {
  if (!task) return null;

  return (
    <div className={`fixed inset-0 z-50 overflow-hidden ${isOpen ? '' : 'pointer-events-none'}`}>
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black bg-opacity-50 transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`absolute inset-y-0 right-0 max-w-lg w-full bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Task Details</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Task Title */}
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {task.task_name}
              </h3>
              
              {/* Status and Priority */}
              <div className="flex items-center space-x-3 mb-3">
                <div className={`flex items-center space-x-2 ${getStatusIcon(task.status).color}`}>
                  {React.createElement(getStatusIcon(task.status).icon, { className: 'w-4 h-4' })}
                  <span className="capitalize text-sm">{task.status.replace('_', ' ')}</span>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                  {task.priority.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Description */}
            {task.description && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                  {task.description}
                </p>
              </div>
            )}

            {/* Due Date */}
            {task.due_date && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Due Date</h4>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4 mr-2 text-red-400" />
                  {formatDueDate(task.due_date)}
                </div>
              </div>
            )}

            {/* Assigned Users */}
            {task.assigned_users && task.assigned_users.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Assigned Users</h4>
                <button
                  onClick={() => onViewUsers(task.assigned_users)}
                  className="flex items-center text-sm font-medium text-indigo-400 hover:text-indigo-300 transition"
                >
                  <UserPlus className="w-4 h-4 mr-1" />
                  {task.assigned_users.length} User{task.assigned_users.length !== 1 ? 's' : ''}
                </button>
              </div>
            )}

            {/* Creator and Dates */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Task Info</h4>
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <div>Created by: {task.creator?.full_name || 'Unknown'}</div>
                <div>Created: {new Date(task.created_at).toLocaleString()}</div>
                {task.updated_at !== task.created_at && (
                  <div>Last updated: {new Date(task.updated_at).toLocaleString()}</div>
                )}
                {task.last_editor && (
                  <div>Last edited by: {task.last_editor.full_name}</div>
                )}
              </div>
            </div>

            {/* Subtasks */}
            {subtasks[task.task_id] && subtasks[task.task_id].length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Subtasks ({subtasks[task.task_id].length})
                </h4>
                <div className="space-y-2">
                  {subtasks[task.task_id].map((subtask) => (
                    <div key={subtask.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-700">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2 flex-1">
                          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                            subtask.status === 'completed' 
                              ? 'bg-green-500 border-green-500' 
                              : 'border-gray-400'
                          }`}>
                            {subtask.status === 'completed' && (
                              <CheckCircle className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className={`text-sm font-medium ${subtask.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                              {subtask.subtask_name || subtask.name}
                            </div>
                            {subtask.description && (
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {subtask.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Subtask Due Date */}
                      {subtask.due_date && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          <Calendar className="w-3 h-3 inline-block mr-1" />
                          Due: {formatDueDate(subtask.due_date)}
                        </div>
                      )}

                      {/* Subtask Assignees */}
                      {subtask.assigned_users && subtask.assigned_users.length > 0 && (
                        <button
                          onClick={() => onViewSubtaskUsers(subtask.assigned_users)}
                          className="text-xs text-blue-400 hover:text-blue-300"
                        >
                          <Users className="w-3 h-3 inline-block mr-1" />
                          {subtask.assigned_users.length} assigned
                        </button>
                      )}

                      {/* Subtask Comments */}
                      {subtaskComments[subtask.id] && subtaskComments[subtask.id].length > 0 && (
                        <div className="mt-2 space-y-1">
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            <MessageSquare className="w-3 h-3 inline-block mr-1" />
                            Comments ({subtaskComments[subtask.id].length})
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Task Comments */}
            {comments[task.task_id] && comments[task.task_id].length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Comments ({comments[task.task_id].length})
                </h4>
                <div className="space-y-3">
                  {comments[task.task_id].map((comment) => (
                    <div key={comment.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          {comment.author}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          {new Date(comment.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {comment.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty States */}
            {(!subtasks[task.task_id] || subtasks[task.task_id].length === 0) && 
             (!comments[task.task_id] || comments[task.task_id].length === 0) && (
              <div className="text-center py-8">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  No subtasks or comments yet
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailDrawer;
