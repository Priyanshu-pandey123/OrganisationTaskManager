import React, { useState, useEffect } from 'react';
import { useCreateTaskMutation, useGetMemberOfTeamAndOrgQuery } from '../store/apiSlice';
import { toast } from 'react-toastify';

const TaskAssignmentDrawer = ({ 
  isOpen, 
  onClose, 
  currentCompany, 
  currentCompanyTeams,
  teamMembersData 
}) => {
  const [createTask, { isLoading: creatingTask }] = useCreateTaskMutation();
  
  const [taskData, setTaskData] = useState({
    task_name: '',
    description: '',
    team_id: '',
    due_date: '',
    status: 'todo',
    priority: 'medium'
  });
  
  const [selectedAssignees, setSelectedAssignees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get team members for the selected team
  const { 
    data: teamMembers, 
    isLoading: loadingMembers,
    refetch: refetchMembers
  } = useGetMemberOfTeamAndOrgQuery(
    taskData.team_id && currentCompany?.id ? { 
      orgId: currentCompany.id, 
      teamId: taskData.team_id 
    } : { orgId: '', teamId: '' },
    { skip: !taskData.team_id || !currentCompany?.id }
  );



  const teamMembersList = teamMembers?.data?.users || [];

  // Reset form when drawer closes
  useEffect(() => {
    if (!isOpen) {
      setTaskData({
        task_name: '',
        description: '',
        team_id: '',
        due_date: '',
        status: 'todo',
        priority: 'medium'
      });
      setSelectedAssignees([]);
      setSearchTerm('');
    }
  }, [isOpen]);

  // Filter members based on search term
  const filteredMembers = teamMembersList.filter(member =>
    member.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (field, value) => {
    setTaskData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Reset assignees when team changes
    if (field === 'team_id') {
      setSelectedAssignees([]);
    }
  };

  const handleAssigneeToggle = (memberId) => {
    setSelectedAssignees(prev => {
      const isSelected = prev.some(assignee => assignee.user_id === memberId);
      if (isSelected) {
        return prev.filter(assignee => assignee.user_id !== memberId);
      } else {
        return [...prev, { user_id: memberId, can_edit: false }];
      }
    });
  };

  const handleAssigneePermissionChange = (memberId, canEdit) => {
    setSelectedAssignees(prev =>
      prev.map(assignee =>
        assignee.user_id === memberId
          ? { ...assignee, can_edit: canEdit }
          : assignee
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!taskData.task_name.trim() || !taskData.team_id || selectedAssignees.length === 0) {
      toast.error('Please fill in all required fields and select at least one assignee');
      return;
    }

    try {
      const taskPayload = {
        ...taskData,
        assignees: selectedAssignees,
        due_date: taskData.due_date ? new Date(taskData.due_date).toISOString() : null
      };

      await createTask(taskPayload).unwrap();
      
      toast.success('Task created successfully!');
      onClose();
    } catch (error) {

      toast.error(error?.data?.message || 'Failed to create task');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-md w-full bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Create New Task
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
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
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
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
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter task description"
                />
              </div>

              {/* Team Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Team *
                </label>
                <select
                  value={taskData.team_id}
                  onChange={(e) => handleInputChange('team_id', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Select a team</option>
                  {currentCompanyTeams?.map((team) => (
                    <option key={team.team_id} value={team.team_id}>
                      {team.team_name}
                    </option>
                  ))}
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
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
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
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={taskData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>

              {/* Assignees */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Assign to Members * ({selectedAssignees.length} selected)
                </label>
                
                {taskData.team_id && (
                  <>
                    {/* Search */}
                    <div className="mb-2">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search members..."
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                      />
                    </div>

                    {/* Member List */}
                    <div className="max-h-48 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-md">
                      {loadingMembers ? (
                        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                          Loading members...
                        </div>
                      ) : filteredMembers.length === 0 ? (
                        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                          No members found
                        </div>
                      ) : (
                        filteredMembers.map((member) => {
                          const isSelected = selectedAssignees.some(assignee => assignee.user_id === member.user_id);
                          
                          return (
                            <div
                              key={member.user_id}
                              className={`p-3 border-b border-gray-200 dark:border-gray-600 last:border-b-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                                isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                              }`}
                              onClick={() => handleAssigneeToggle(member.user_id)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => {}} // Handled by onClick
                                    className="mr-3"
                                  />
                                  <div>
                                    <div className="font-medium text-gray-900 dark:text-white">
                                      {member.full_name}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                      {member.email}
                                    </div>
                                  </div>
                                </div>
                                
                                {isSelected && (
                                  <select
                                    value={selectedAssignees.find(a => a.user_id === member.user_id)?.can_edit ? 'edit' : 'view'}
                                    onChange={(e) => handleAssigneePermissionChange(member.user_id, e.target.value === 'edit')}
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                                  >
                                    <option value="view">Can View</option>
                                    <option value="edit">Can Edit</option>
                                  </select>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </>
                )}
                
                {!taskData.team_id && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 p-3 border border-gray-300 dark:border-gray-600 rounded-md">
                    Please select a team first to see available members
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
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={creatingTask || !taskData.task_name.trim() || !taskData.team_id || selectedAssignees.length === 0}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creatingTask ? 'Creating...' : 'Create Task'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskAssignmentDrawer;