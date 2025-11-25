import React from 'react';

const TaskList = ({
  currentCompany,
  tasks,
  filteredTasks,
  showCompletedOnly,
  setShowCompletedOnly,
  employeeFilter,
  setEmployeeFilter,
  filteredEmployees,
  expandedTasks,
  setExpandedTasks,
  handleToggleCompleted,
  handleDeleteTask,
  subtaskInput,
  setSubtaskInput,
  handleAddSubtask,
  expandedSubtasks,
  setExpandedSubtasks,
  subtaskReplyInput,
  setSubtaskReplyInput,
  handleAddSubtaskReply,
  handleToggleSubtaskCompletion,
  handleDeleteSubtask,
  formatDate
}) => {
  if (!currentCompany) return null;

  return (
    <>
      {/* Task List and Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0">
        <h2 className="text-xl font-bold">Task List</h2>
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showCompletedOnly}
              onChange={(e) => setShowCompletedOnly(e.target.checked)}
              className="form-checkbox h-5 w-5 text-blue-500 rounded focus:ring-blue-500"
            />
            <span className="text-gray-600 dark:text-gray-300">Show Completed</span>
          </label>
          <select
            value={employeeFilter}
            onChange={(e) => setEmployeeFilter(e.target.value)}
            className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-lg"
          >
            <option value="">All Employees</option>
            {filteredEmployees.map((employee) => (
              <option key={employee.id} value={employee.id}>{employee.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <div key={task.id} className="bg-gray-200 dark:bg-gray-700 rounded-lg shadow-sm overflow-hidden">
              <div className="p-2 sm:p-3 flex flex-col items-start cursor-pointer" onClick={() => setExpandedTasks(prev => ({
                ...prev,
                [task.id]: !prev[task.id]
              }))}>
                <div className="w-full flex justify-between items-center mb-1">
                  <div className="flex-grow text-sm text-gray-600 dark:text-gray-300 font-semibold">
                    Assigned to: {task.assignedTo || 'N/A'} ({task.team || 'N/A'})
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>Created: {formatDate(task.createdAt)}</span>
                    {task.completed && <span>Completed: {formatDate(task.completedAt)}</span>}
                  </div>
                </div>
                <div className="w-full flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={(e) => { e.stopPropagation(); handleToggleCompleted(task.id); }}
                      className="form-checkbox h-5 w-5 text-blue-500 rounded focus:ring-blue-500 transition duration-150"
                    />
                    <span className={`text-lg font-medium ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-gray-200'}`}>
                      {task.title}
                    </span>
                  </div>
                  <div className="ml-2 flex items-center space-x-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteTask(task.id); }}
                      className="text-red-500 hover:text-red-700 transition-colors p-1"
                      title="Delete Task"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 112 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setExpandedTasks(prev => ({ ...prev, [task.id]: !prev[task.id] })); }}
                      className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      <svg
                        className={`w-4 h-4 transform transition-transform duration-300 ${expandedTasks[task.id] ? 'rotate-180' : ''}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              {expandedTasks[task.id] && (
                <div className="p-3 bg-gray-300 dark:bg-gray-750">
                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">Subtasks:</div>
                    {task.subtasks.length > 0 ? (
                      task.subtasks.map((subtask, subtaskIndex) => (
                        <div key={subtaskIndex} className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                          onClick={(e) => { e.stopPropagation(); setExpandedSubtasks(prev => ({ ...prev, [`${task.id}-${subtaskIndex}`]: !prev[`${task.id}-${subtaskIndex}`] })); }}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={subtask.completed}
                                onChange={(e) => { e.stopPropagation(); handleToggleSubtaskCompletion(task.id, subtaskIndex); }}
                                className="form-checkbox h-4 w-4 text-blue-500 rounded focus:ring-blue-500 transition duration-150"
                              />
                              <span className={`text-sm ${subtask.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-gray-200'}`}>
                                {subtask.title}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 ml-auto">
                              <span className="text-right">Created: {formatDate(subtask.createdAt)}</span>
                              {subtask.completed && <span className="text-right">Completed: {formatDate(subtask.completedAt)}</span>}
                              <button
                                onClick={(e) => { e.stopPropagation(); handleDeleteSubtask(task.id, subtaskIndex); }}
                                className="text-red-500 hover:text-red-700 transition-colors"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 112 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                          </div>
                          {expandedSubtasks[`${task.id}-${subtaskIndex}`] && (
                            <div className="mt-2 space-y-1">
                              <div className="text-xs font-semibold text-gray-600 dark:text-gray-400">Replies:</div>
                              {(subtask.replies || []).map((reply, replyIndex) => (
                                <div key={replyIndex} className="text-xs bg-gray-200 dark:bg-gray-600 p-1 rounded flex justify-between items-center">
                                  <div>
                                    <span className="font-semibold text-gray-800 dark:text-gray-200">{reply.userId.substring(0, 4)}: </span>
                                    {reply.text}
                                  </div>
                                  <span className="text-gray-500 dark:text-gray-400">({formatDate(reply.createdAt)})</span>
                                </div>
                              ))}
                              <div className="flex items-center space-x-2 mt-2">
                                <input
                                  type="text"
                                  value={subtaskReplyInput[`${task.id}-${subtaskIndex}`] || ''}
                                  onChange={(e) => setSubtaskReplyInput(prev => ({ ...prev, [`${task.id}-${subtaskIndex}`]: e.target.value }))}
                                  placeholder="Add reply..."
                                  className="w-full px-2 py-1 text-sm bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-lg placeholder-gray-400 focus:outline-none"
                                />
                                <button
                                  onClick={() => handleAddSubtaskReply(task.id, subtaskIndex)}
                                  className="px-2 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg"
                                >
                                  Reply
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500 dark:text-gray-400">No subtasks.</div>
                    )}
                    <div className="flex items-center space-x-2 mt-2">
                      <input
                        type="text"
                        value={subtaskInput[task.id] || ''}
                        onChange={(e) => setSubtaskInput(prev => ({ ...prev, [task.id]: e.target.value }))}
                        placeholder="Add subtask..."
                        className="w-full px-2 py-1 text-sm bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-lg placeholder-gray-400 focus:outline-none"
                      />
                      <button
                        onClick={() => handleAddSubtask(task.id)}
                        className="px-2 py-1 text-xs bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg whitespace-nowrap"
                      >
                        Add Sub-task
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">No tasks found.</p>
        )}
      </div>
    </>
  );
};

export default TaskList;
