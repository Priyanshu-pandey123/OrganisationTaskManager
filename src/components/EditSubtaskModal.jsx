import React, { useState, useEffect } from 'react';
import { X, Edit, Calendar, Users } from 'lucide-react';
import { useUpdateSubtaskMutation } from '../store/apiSlice';
import { toast } from 'react-toastify';

const EditSubtaskModal = ({ 
    isOpen, 
    setIsOpen, 
    subtask, 
    task,
    onUpdateSuccess
}) => {
    const [updateSubtask, { isLoading: isUpdatingSubtask }] = useUpdateSubtaskMutation();
    
    const [subtaskData, setSubtaskData] = useState({
        subtask_name: '',
        description: '',
        status: 'todo',
        due_date: '',
        assignees: []
    });

    // Populate form with existing subtask data when modal opens
    useEffect(() => {
        if (subtask && isOpen) {
            setSubtaskData({
                subtask_name: subtask.subtask_name || '',
                description: subtask.description || '',
                status: subtask.status || 'todo',
                due_date: subtask.due_date ? new Date(subtask.due_date).toISOString().slice(0, 16) : '',
                assignees: subtask.assignees?.map(user => user.user_id) || []
            });
        }
    }, [subtask, isOpen]);

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            setSubtaskData({
                subtask_name: '',
                description: '',
                status: 'todo',
                due_date: '',
                assignees: []
            });
        }
    }, [isOpen]);

    if (!isOpen || !subtask) return null;

    const handleInputChange = (field, value) => {
        setSubtaskData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAssigneeToggle = (user) => {
        setSubtaskData(prev => {
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

    const handleSubmit = async () => {
        if (!subtaskData.subtask_name.trim()) {
            toast.error('Subtask name is required');
            return;
        }

        try {
            const updatePayload = {
                subtask_id: subtask.subtask_id,
                subtask_name: subtaskData.subtask_name.trim(),
                description: subtaskData.description.trim(),
                status: subtaskData.status,
                due_date: subtaskData.due_date || null,
                assignees: subtaskData.assignees
            };

            await updateSubtask(updatePayload).unwrap();
            
            toast.success('Subtask updated successfully!', {
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
            setIsOpen(false);
        } catch (error) {
            toast.error('Failed to update subtask. Please try again.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            
            console.error('Failed to update subtask:', error);
        }
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center backdrop-blur-sm">
            <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg p-6 border border-gray-700 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-indigo-400 flex items-center">
                        <Edit className="w-5 h-5 mr-2" />
                        Edit Subtask
                    </h3>
                    <button 
                        onClick={handleClose} 
                        className="text-gray-400 hover:text-gray-100 transition"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <hr className="border-gray-700 mb-6" />

                <div className="space-y-6">
                    {/* Subtask Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Subtask Name *
                        </label>
                        <input
                            type="text"
                            value={subtaskData.subtask_name}
                            onChange={(e) => handleInputChange('subtask_name', e.target.value)}
                            placeholder="Enter subtask name..."
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-200 placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Description
                        </label>
                        <textarea
                            value={subtaskData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder="Enter subtask description..."
                            rows={3}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-200 placeholder-gray-400 focus:outline-none focus:border-indigo-500 resize-none"
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Status
                        </label>
                        <select
                            value={subtaskData.status}
                            onChange={(e) => handleInputChange('status', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-200 focus:outline-none focus:border-indigo-500"
                        >
                            <option value="todo">To Do</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    {/* Due Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Due Date
                        </label>
                        <input
                            type="datetime-local"
                            value={subtaskData.due_date}
                            onChange={(e) => handleInputChange('due_date', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-200 focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    {/* Assignees */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            Assign Users ({subtaskData.assignees.length} selected)
                        </label>
                        {task?.assigned_users?.length > 0 ? (
                            <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-600 rounded p-2">
                                {task.assigned_users.map((user) => {
                                    const isSelected = subtaskData.assignees.includes(user.user_id);
                                    
                                    return (
                                        <div
                                            key={user.user_id}
                                            className={`p-2 border border-gray-500 rounded cursor-pointer hover:bg-gray-600 transition ${
                                                isSelected ? 'bg-indigo-900/30 border-indigo-500' : ''
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
                                                <span className="text-gray-200">{user.full_name}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">No users available to assign</p>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-6 mt-6 border-t border-gray-700">
                    <button
                        onClick={handleSubmit}
                        disabled={!subtaskData.subtask_name.trim() || isUpdatingSubtask}
                        className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded transition"
                    >
                        {isUpdatingSubtask ? 'Updating...' : 'Update Subtask'}
                    </button>
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditSubtaskModal;