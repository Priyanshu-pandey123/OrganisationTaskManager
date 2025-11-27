import React from 'react';
import { X, User, Mail } from 'lucide-react';

const AssignedUsersModal = ({ isOpen, setIsOpen, users }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center backdrop-blur-sm">
            <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6 border border-gray-700">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-indigo-400 flex items-center">
                        <User className="w-5 h-5 mr-2" />
                        Assigned Users ({users.length})
                    </h3>
                    <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-100 transition">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <hr className="border-gray-700 mb-4" />

                <ul className="space-y-4 max-h-80 overflow-y-auto pr-2">
                    {users.map((user, index) => (
                        <li key={index} className="bg-gray-700 p-3 rounded-lg flex items-center shadow-md">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg mr-4">
                                {user.full_name.charAt(0)}
                            </div>
                            <div>
                                <p className="text-gray-100 font-semibold">{user.full_name}</p>
                                <p className="text-sm text-gray-400 flex items-center">
                                    <Mail className="w-3 h-3 mr-1" />
                                    {user.email}
                                </p>
                                <span className={`text-xs font-mono mt-1 inline-block ${user.TaskAssignment?.can_edit ? 'text-green-400' : 'text-red-400'}`}>
                                    {user.TaskAssignment?.can_edit ? 'Can Edit' : 'Read Only'}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
                
                <div className="mt-6 text-center">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 rounded-lg transition duration-150 shadow-lg"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssignedUsersModal;