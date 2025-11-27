import React, { useState } from 'react';
import { X, Plus, Calendar, Users } from 'lucide-react';

const CreateSubtaskModal = ({ 
    isOpen, 
    setIsOpen, 
    task, 
    onCreateSubtask, 
    isCreating = false 
}) => {
    const [subtaskName, setSubtaskName] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [assignees, setAssignees] = useState([]);

    if (!isOpen) return null;

    const handleAssigneeToggle = (user) => {
        setAssignees(prev => {
            const isSelected = prev.some(u => u.user_id === user.user_id);
            if (isSelected) {
                return prev.filter(u => u.user_id !== user.user_id);
            } else {
                return [...prev, user];
            }
        });
    };

    const handleSubmit = async () => {
        if (subtaskName.trim()) {
            const subtaskData = {
                task_id: task.task_id,
                subtask_name: subtaskName.trim(),
                description: description.trim(),
                status: 'todo',
                due_date: dueDate || null,
                assignees: assignees.map(user => user.user_id),
            };
            
            await onCreateSubtask(subtaskData);
            
            // Reset form
            setSubtaskName('');
            setDescription('');
            setDueDate('');
            setAssignees([]);
            setIsOpen(false);
        }
    };

    const handleClose = () => {
        setSubtaskName('');
        setDescription('');
        setDueDate('');
        setAssignees([]);
        setIsOpen(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center backdrop-blur-sm">
            <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg p-6 border border-gray-700 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-indigo-400 flex items-center">
                        <Plus className="w-5 h-5 mr-2" />
                        Create New Subtask
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
                            value={subtaskName}
                            onChange={(e) => setSubtaskName(e.target.value)}
                            placeholder="Enter subtask name..."
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-200 placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter subtask description..."
                            rows={3}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-200 placeholder-gray-400 focus:outline-none focus:border-indigo-500 resize-none"
                        />
                    </div>

                    {/* Due Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Due Date
                        </label>
                        <input
                            type="datetime-local"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-200 focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    {/* Assignees */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            Assign Users
                        </label>
                        {task?.assigned_users?.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {task.assigned_users.map((user) => (
                                    <button
                                        key={user.user_id}
                                        onClick={() => handleAssigneeToggle(user)}
                                        className={`px-3 py-2 rounded text-sm font-medium transition ${
                                            assignees.some(u => u.user_id === user.user_id)
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        }`}
                                    >
                                        {user.full_name}
                                    </button>
                                ))}
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
                        disabled={!subtaskName.trim() || isCreating}
                        className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded transition"
                    >
                        {isCreating ? 'Creating...' : 'Create Subtask'}
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

export default CreateSubtaskModal;
