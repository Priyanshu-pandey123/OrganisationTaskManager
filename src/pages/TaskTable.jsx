import React, { useMemo, useState, useEffect } from 'react';
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper, getExpandedRowModel } from '@tanstack/react-table';
import { CheckCircle, Clock, ListTodo, UserPlus, Calendar, AlertTriangle, ArrowUp, ArrowDown, Plus, MessageSquare, ChevronRight, ChevronDown, Trash2, Users } from 'lucide-react';
import AssignedUsersModal from '../components/AssignedUsersModal';
import TaskDetailDrawer from '../components/TaskDetailDrawer'; // Add this import
import { formatDueDate, getStatusIcon, getPriorityColor } from '../utils/helper';
import { useGetTasksQuery, useMeQuery, useCreateSubtaskMutation } from '../store/apiSlice';
import { useCurrentUser } from '../store/hooks';

const columnHelper = createColumnHelper();

const TaskTable = ({ filters }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [expandedRows, setExpandedRows] = useState({});
    const [subtasks, setSubtasks] = useState({}); // Store subtasks for each task
    const [comments, setComments] = useState({}); // Store comments for each task
    const [subtaskComments, setSubtaskComments] = useState({}); // Store comments for subtasks
    const [showSubtaskForm, setShowSubtaskForm] = useState(null);
    const [showCommentForm, setShowCommentForm] = useState(null);
    const [showSubtaskCommentForm, setShowSubtaskCommentForm] = useState(null);
    const [showSubtaskAssignForm, setShowSubtaskAssignForm] = useState(null);
    const [newSubtaskName, setNewSubtaskName] = useState('');
    const [newSubtaskDescription, setNewSubtaskDescription] = useState('');
    const [newSubtaskDueDate, setNewSubtaskDueDate] = useState('');
    const [newSubtaskAssignees, setNewSubtaskAssignees] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [newSubtaskComment, setNewSubtaskComment] = useState('');
    const [selectedUsersForSubtask, setSelectedUsersForSubtask] = useState([]);
    const [createSubtask, { isLoading: isCreatingSubtask, error: createSubtaskError }] = useCreateSubtaskMutation();
    // Drawer state
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    // Get current user from user slice
    const currentUser = useCurrentUser();
    
    // Call me API if currentUser is null but we have an auth token
    const { data: userData, isLoading: isUserLoading, error: userError } = useMeQuery(undefined, {
        skip: !!currentUser || !localStorage.getItem('auth_token'), // Skip if we already have user data or no token
    });

    // Use user ID from either currentUser or the fetched userData
    const userId = currentUser?.data?.user_id ;
    console.log(currentUser, 'from the redux');
    console.log(userData, 'from me API');

    // Fetch tasks using the API with the user ID
    const { data: apiResponse, isLoading: isTasksLoading, error: tasksError, refetch } = useGetTasksQuery(userId, {
        skip: !userId, // Skip the query if user ID is not available
    });
    
    // console.log(apiResponse, 'from the api response');

    // Extract tasks from API response
    const tasks = apiResponse?.data?.tasks || [];

    // Log filters to show which query would be used
    useEffect(() => {
        // console.log('Current task filters:', filters);
        // console.log('API Response:', apiResponse);
        // console.log('Tasks:', tasks);
    }, [filters, apiResponse, tasks]);
    
    const handleViewUsers = (users) => {
        setSelectedUsers(users);
        setIsModalOpen(true);
    };

    const handleViewSubtaskUsers = (users) => {
        setSelectedUsers(users);
        setIsModalOpen(true);
    };

    // Add handler for opening task detail drawer
    const handleTaskClick = (task) => {
        setSelectedTask(task);
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
        setSelectedTask(null);
    };

    const handleCreateSubtask = async (taskId) => {
        if (newSubtaskName.trim()) {
            const newSubtask = {
                id: Date.now().toString(),
                task_id: taskId,
                subtask_name: newSubtaskName.trim(),
                description: newSubtaskDescription.trim(),
                status: 'todo',
                priority: 'medium',
                due_date: newSubtaskDueDate || null,
                assignees: newSubtaskAssignees,
                created_at: new Date().toISOString(),
                assigned_users: newSubtaskAssignees 
            };
            
            await createSubtask(newSubtask).unwrap();
            setSubtasks(prev => ({
                ...prev,
                [taskId]: [...(prev[taskId] || []), newSubtask]
            }));
            
            // Reset form
            setNewSubtaskName('');
            setNewSubtaskDescription('');
            setNewSubtaskDueDate('');
            setNewSubtaskAssignees([]);
            setShowSubtaskForm(null);
        }
    };

    const handleSubtaskAssigneeToggle = (user) => {
        setNewSubtaskAssignees(prev => {
            const isSelected = prev.some(u => u.user_id === user.user_id);
            if (isSelected) {
                return prev.filter(u => u.user_id !== user.user_id);
            } else {
                return [...prev, user];
            }
        });
    };

    const handleDeleteSubtask = (taskId, subtaskId) => {
        setSubtasks(prev => ({
            ...prev,
            [taskId]: prev[taskId].filter(subtask => subtask.id !== subtaskId)
        }));
    };

    const handleAssignUsersToSubtask = (taskId, subtaskId) => {
        const updatedSubtasks = subtasks[taskId].map(subtask => 
            subtask.id === subtaskId 
                ? { ...subtask, assigned_users: selectedUsersForSubtask }
                : subtask
        );
        
        setSubtasks(prev => ({
            ...prev,
            [taskId]: updatedSubtasks
        }));
        setShowSubtaskAssignForm(null);
        setSelectedUsersForSubtask([]);
    };

    const handleAddComment = (taskId) => {
        if (newComment.trim()) {
            const comment = {
                id: Date.now().toString(),
                text: newComment.trim(),
                created_at: new Date().toISOString(),
                author: currentUser?.full_name || currentUser?.name || 'Current User' // Updated to use currentUser
            };
            
            setComments(prev => ({
                ...prev,
                [taskId]: [...(prev[taskId] || []), comment]
            }));
            setNewComment('');
            setShowCommentForm(null);
        }
    };

    const handleAddSubtaskComment = (taskId, subtaskId) => {
        if (newSubtaskComment.trim()) {
            const comment = {
                id: Date.now().toString(),
                text: newSubtaskComment.trim(),
                created_at: new Date().toISOString(),
                author: currentUser?.full_name || currentUser?.name || 'Current User' // Updated to use currentUser
            };
            
            setSubtaskComments(prev => ({
                ...prev,
                [subtaskId]: [...(prev[subtaskId] || []), comment]
            }));
            setNewSubtaskComment('');
            setShowSubtaskCommentForm(null);
        }
    };

    const toggleRowExpansion = (taskId) => {
        setExpandedRows(prev => ({
            ...prev,
            [taskId]: !prev[taskId]
        }));
    };

    const toggleSubtaskStatus = (taskId, subtaskId) => {
        const updatedSubtasks = subtasks[taskId].map(subtask => 
            subtask.id === subtaskId 
                ? { ...subtask, status: subtask.status === 'completed' ? 'todo' : 'completed' }
                : subtask
        );
        
        setSubtasks(prev => ({
            ...prev,
            [taskId]: updatedSubtasks
        }));
    };

    const columns = useMemo(() => [
        columnHelper.display({
            id: 'expander',
            header: () => null,
            cell: ({ row }) => (
                <button
                    onClick={() => toggleRowExpansion(row.original.task_id)}
                    className="p-1 hover:bg-gray-700 rounded transition"
                >
                    {expandedRows[row.original.task_id] ? (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                    ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                </button>
            ),
        }),
        columnHelper.accessor('task_name', {
            header: () => 'Task Name',
            cell: info => (
                <button 
                    onClick={() => handleTaskClick(info.row.original)}
                    className="font-semibold text-left text-indigo-400 hover:text-indigo-300 transition duration-150 hover:underline"
                >
                    {info.getValue()}
                </button>
            ),
        }),
        columnHelper.accessor('description', {
            header: () => 'Description',
            cell: info => (
                <div className="text-sm text-gray-400 max-w-xs truncate" title={info.getValue()}>
                    {info.getValue()}
                </div>
            ),
        }),
        columnHelper.accessor('status', {
            header: () => 'Status',
            cell: info => (
                <div className={`flex items-center space-x-2 ${getStatusIcon(info.getValue()).color}`}>
                    {React.createElement(getStatusIcon(info.getValue()).icon, { className: 'w-4 h-4' })}
                    <span className="capitalize">{info.getValue().replace('_', ' ')}</span>
                </div>
            ),
        }),
        columnHelper.accessor('priority', {
            header: () => 'Priority',
            cell: info => (
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getPriorityColor(info.getValue())}`}>
                    {info.getValue().toUpperCase()}
                </span>
            ),
        }),
        columnHelper.accessor('due_date', {
            header: () => 'Due Date',
            cell: info => (
                <div className="text-sm text-gray-400">
                    <Calendar className="w-4 h-4 inline-block mr-1 text-red-400" />
                    {formatDueDate(info.getValue())}
                </div>
            ),
        }),
        columnHelper.display({
            id: 'actions',
            header: () => 'Actions',
            cell: ({ row }) => (
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setShowSubtaskForm(row.original.task_id)}
                        className="p-1 text-indigo-400 hover:text-indigo-300 transition"
                        title="Add Subtask"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setShowCommentForm(row.original.task_id)}
                        className="p-1 text-green-400 hover:text-green-300 transition"
                        title="Add Comment"
                    >
                        <MessageSquare className="w-4 h-4" />
                    </button>
                    <span className="text-xs text-gray-500">
                        {subtasks[row.original.task_id]?.length || 0} subtasks, {comments[row.original.task_id]?.length || 0} comments
                    </span>
                </div>
            ),
        }),
        columnHelper.accessor('assigned_users', {
            header: () => 'Assigned Users',
            cell: info => (
                <button
                    onClick={() => handleViewUsers(info.getValue())}
                    className="flex items-center text-sm font-medium text-indigo-400 hover:text-indigo-300 transition duration-150"
                >
                    <UserPlus className="w-4 h-4 mr-1" />
                    {info.getValue().length} User{info.getValue().length !== 1 ? 's' : ''}
                </button>
            ),
            enableSorting: false,
        }),
    ], [expandedRows, subtasks, comments]);

    const table = useReactTable({
        data: tasks,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
    });

    // Combined loading state
    const isLoading = isUserLoading || isTasksLoading;
    const error = userError || tasksError;

    // Loading state
    if (isLoading) {
        return (
            <div className="p-8 min-h-screen bg-gray-900 text-gray-200 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400 mx-auto mb-4"></div>
                    <h2 className="text-xl font-semibold text-gray-300">
                        {isUserLoading ? 'Loading user data...' : 'Loading Tasks...'}
                    </h2>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="p-8 min-h-screen bg-gray-900 text-gray-200 flex items-center justify-center">
                <div className="text-center">
                    <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-red-400 mb-2">
                        {userError ? 'Error Loading User Data' : 'Error Loading Tasks'}
                    </h2>
                    <p className="text-gray-400 mb-4">
                        {error?.data?.message || error?.error || 'Failed to load data. Please try again.'}
                    </p>
                    <button
                        onClick={() => refetch()}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded transition"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // // No user authenticated
    // if (!currentUser?.) {
    //     return (
    //         <div className="p-8 min-h-screen bg-gray-900 text-gray-200 flex items-center justify-center">
    //             <div className="text-center">
    //                 <UserPlus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
    //                 <h2 className="text-xl font-semibold text-gray-300 mb-2">Authentication Required</h2>
    //                 <p className="text-gray-400">Please log in to view your tasks.</p>
    //             </div>
    //         </div>
    //     );
    // }

    return (
        <div className="p-8 min-h-screen bg-gray-900 text-gray-200">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-indigo-400">My Task</h2>
              <div className='flex gap-3'>
              <button
                    onClick={() => refetch()}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded transition"
                >
                    Assigned To Mex
                </button>
                <button
                    onClick={() => refetch()}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded transition"
                >
                    Assigned By Me
                </button>
              <button
                    onClick={() => refetch()}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded transition"
                >
                    Refresh
                </button>
              </div>
            </div>
            
            {tasks.length === 0 ? (
                <div className="text-center py-12">
                    <ListTodo className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-300 mb-2">No Tasks Found</h3>
                    <p className="text-gray-400">You don't have any tasks yet. Create your first task to get started!</p>
                </div>
            ) : (
                <div className="overflow-x-auto shadow-2xl rounded-lg border border-gray-700">
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead className="bg-gray-800">
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <th
                                            key={header.id}
                                            colSpan={header.colSpan}
                                            className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 cursor-pointer hover:bg-gray-700 transition"
                                        >
                                            {header.isPlaceholder ? null : (
                                                <div
                                                    {...{
                                                        className: header.column.getCanSort()
                                                            ? 'flex items-center select-none'
                                                            : '',
                                                        onClick: header.column.getToggleSortingHandler(),
                                                    }}
                                                >
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                                    {{
                                                        asc: <ArrowUp className="ml-2 w-3 h-3 text-indigo-400" />,
                                                        desc: <ArrowDown className="ml-2 w-3 h-3 text-indigo-400" />,
                                                    }[header.column.getIsSorted()] ?? null}
                                                </div>
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="bg-gray-800 divide-y divide-gray-700">
                            {table.getRowModel().rows.map(row => (
                                <React.Fragment key={row.id}>
                                    <tr className="hover:bg-gray-700 transition duration-150">
                                        {row.getVisibleCells().map(cell => (
                                            <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                    
                                    {/* Subtask Form */}
                                    {showSubtaskForm === row.original.task_id && (
                                        <tr>
                                            <td colSpan={columns.length} className="px-6 py-6 bg-gray-750">
                                                <div className="space-y-4">
                                                    <h3 className="text-lg font-semibold text-gray-200">Create New Subtask</h3>
                                                    
                                                    {/* Subtask Name */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                                            Subtask Name *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={newSubtaskName}
                                                            onChange={(e) => setNewSubtaskName(e.target.value)}
                                                            placeholder="Enter subtask name..."
                                                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-200 placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                                                            onKeyPress={(e) => e.key === 'Enter' && handleCreateSubtask(row.original.task_id)}
                                                        />
                                                    </div>

                                                    {/* Description */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                                            Description
                                                        </label>
                                                        <textarea
                                                            value={newSubtaskDescription}
                                                            onChange={(e) => setNewSubtaskDescription(e.target.value)}
                                                            placeholder="Enter subtask description..."
                                                            rows={3}
                                                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-200 placeholder-gray-400 focus:outline-none focus:border-indigo-500 resize-none"
                                                        />
                                                    </div>

                                                    {/* Due Date */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                                            Due Date
                                                        </label>
                                                        <input
                                                            type="datetime-local"
                                                            value={newSubtaskDueDate}
                                                            onChange={(e) => setNewSubtaskDueDate(e.target.value)}
                                                            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-200 focus:outline-none focus:border-indigo-500"
                                                        />
                                                    </div>

                                                    {/* Assignees */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                                            Assign Users
                                                        </label>
                                                        {row.original.assigned_users?.length > 0 ? (
                                                            <div className="flex flex-wrap gap-2">
                                                                {row.original.assigned_users.map((user) => (
                                                                    <button
                                                                        key={user.user_id}
                                                                        onClick={() => handleSubtaskAssigneeToggle(user)}
                                                                        className={`px-3 py-2 rounded text-sm font-medium transition ${
                                                                            newSubtaskAssignees.some(u => u.user_id === user.user_id)
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

                                                    {/* Action Buttons */}
                                                    <div className="flex space-x-3 pt-2">
                                                        <button
                                                            onClick={() => handleCreateSubtask(row.original.task_id)}
                                                            disabled={!newSubtaskName.trim()}
                                                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded transition"
                                                        >
                                                            Create Subtask
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setShowSubtaskForm(null);
                                                                setNewSubtaskName('');
                                                                setNewSubtaskDescription('');
                                                                setNewSubtaskDueDate('');
                                                                setNewSubtaskAssignees([]);
                                                            }}
                                                            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}

                                    {/* Comment Form */}
                                    {showCommentForm === row.original.task_id && (
                                        <tr>
                                            <td colSpan={columns.length} className="px-6 py-4 bg-gray-750">
                                                <div className="flex items-center space-x-2">
                                                    <textarea
                                                        value={newComment}
                                                        onChange={(e) => setNewComment(e.target.value)}
                                                        placeholder="Enter your comment..."
                                                        rows={2}
                                                        className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-200 placeholder-gray-400 focus:outline-none focus:border-indigo-500 resize-none"
                                                    />
                                                    <button
                                                        onClick={() => handleAddComment(row.original.task_id)}
                                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition"
                                                    >
                                                        Comment
                                                    </button>
                                                    <button
                                                        onClick={() => setShowCommentForm(null)}
                                                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}

                                    {/* Expanded Content */}
                                    {expandedRows[row.original.task_id] && (
                                        <tr>
                                            <td colSpan={columns.length} className="px-6 py-4 bg-gray-750">
                                                <div className="space-y-4">
                                                    {/* Subtasks */}
                                                    {subtasks[row.original.task_id]?.length > 0 && (
                                                        <div>
                                                            <h4 className="text-sm font-semibold text-gray-300 mb-2">Subtasks:</h4>
                                                            <div className="space-y-3 ml-4">
                                                                {subtasks[row.original.task_id].map((subtask) => (
                                                                    <div key={subtask.id} className="border border-gray-600 rounded-lg p-3 bg-gray-700">
                                                                        <div className="flex items-start justify-between mb-2">
                                                                            <div className="flex items-center space-x-2 flex-1">
                                                                                <button
                                                                                    onClick={() => toggleSubtaskStatus(row.original.task_id, subtask.id)}
                                                                                    className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                                                                        subtask.status === 'completed' 
                                                                                            ? 'bg-green-500 border-green-500' 
                                                                                            : 'border-gray-400'
                                                                                    }`}
                                                                                >
                                                                                    {subtask.status === 'completed' && (
                                                                                        <CheckCircle className="w-3 h-3 text-white" />
                                                                                    )}
                                                                                </button>
                                                                                <span className={`text-sm ${subtask.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-300'}`}>
                                                                                    {subtask.subtask_name || subtask.name}
                                                                                </span>
                                                                            </div>
                                                                            <div className="flex items-center space-x-1">
                                                                                <button
                                                                                    onClick={() => setShowSubtaskAssignForm(subtask.id)}
                                                                                    className="p-1 text-blue-400 hover:text-blue-300 transition"
                                                                                    title="Assign Users"
                                                                                >
                                                                                    <Users className="w-4 h-4" />
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => setShowSubtaskCommentForm(subtask.id)}
                                                                                    className="p-1 text-green-400 hover:text-green-300 transition"
                                                                                    title="Add Comment"
                                                                                >
                                                                                    <MessageSquare className="w-4 h-4" />
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => handleDeleteSubtask(row.original.task_id, subtask.id)}
                                                                                    className="p-1 text-red-400 hover:text-red-300 transition"
                                                                                    title="Delete Subtask"
                                                                                >
                                                                                    <Trash2 className="w-4 h-4" />
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                        
                                                                        {/* Subtask Description */}
                                                                        {subtask.description && (
                                                                            <div className="mb-2 text-xs text-gray-400">
                                                                                {subtask.description}
                                                                            </div>
                                                                        )}

                                                                        {/* Subtask Due Date */}
                                                                        {subtask.due_date && (
                                                                            <div className="mb-2 text-xs text-gray-400">
                                                                                <Calendar className="w-3 h-3 inline-block mr-1" />
                                                                                Due: {formatDueDate(subtask.due_date)}
                                                                            </div>
                                                                        )}
                                                                        
                                                                        {/* Subtask Users */}
                                                                        {subtask.assigned_users?.length > 0 && (
                                                                            <div className="mb-2">
                                                                                <button
                                                                                    onClick={() => handleViewSubtaskUsers(subtask.assigned_users)}
                                                                                    className="text-xs text-blue-400 hover:text-blue-300"
                                                                                >
                                                                                    {subtask.assigned_users.length} assigned user{subtask.assigned_users.length !== 1 ? 's' : ''}
                                                                                </button>
                                                                            </div>
                                                                        )}

                                                                        {/* Subtask Comments */}
                                                                        {subtaskComments[subtask.id]?.length > 0 && (
                                                                            <div className="space-y-1 mt-2">
                                                                                <div className="text-xs text-gray-400 mb-1">Comments:</div>
                                                                                {subtaskComments[subtask.id].map((comment) => (
                                                                                    <div key={comment.id} className="bg-gray-600 rounded p-2">
                                                                                        <div className="flex items-center space-x-2 mb-1">
                                                                                            <span className="text-xs font-medium text-gray-300">{comment.author}</span>
                                                                                            <span className="text-xs text-gray-500">
                                                                                                {new Date(comment.created_at).toLocaleString()}
                                                                                            </span>
                                                                                        </div>
                                                                                        <p className="text-xs text-gray-200">{comment.text}</p>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        )}

                                                                        {/* Subtask Comment Form */}
                                                                        {showSubtaskCommentForm === subtask.id && (
                                                                            <div className="mt-2 space-y-2">
                                                                                <textarea
                                                                                    value={newSubtaskComment}
                                                                                    onChange={(e) => setNewSubtaskComment(e.target.value)}
                                                                                    placeholder="Add a comment to this subtask..."
                                                                                    rows={2}
                                                                                    className="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded text-gray-200 placeholder-gray-400 focus:outline-none focus:border-indigo-500 text-xs resize-none"
                                                                                />
                                                                                <div className="flex space-x-2">
                                                                                    <button
                                                                                        onClick={() => handleAddSubtaskComment(row.original.task_id, subtask.id)}
                                                                                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs transition"
                                                                                    >
                                                                                        Add Comment
                                                                                    </button>
                                                                                    <button
                                                                                        onClick={() => setShowSubtaskCommentForm(null)}
                                                                                        className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-xs transition"
                                                                                    >
                                                                                        Cancel
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        )}

                                                                        {/* Subtask User Assignment Form */}
                                                                        {showSubtaskAssignForm === subtask.id && (
                                                                            <div className="mt-2 space-y-2">
                                                                                <div className="text-xs text-gray-300 mb-1">Assign users to this subtask:</div>
                                                                                {/* You can replace this with a proper user selection component */}
                                                                                <div className="flex flex-wrap gap-1">
                                                                                    {row.original.assigned_users.map((user) => (
                                                                                        <button
                                                                                            key={user.user_id}
                                                                                            onClick={() => {
                                                                                                const isSelected = selectedUsersForSubtask.some(u => u.user_id === user.user_id);
                                                                                                if (isSelected) {
                                                                                                setSelectedUsersForSubtask(prev => prev.filter(u => u.user_id !== user.user_id));
                                                                                                } else {
                                                                                                    setSelectedUsersForSubtask(prev => [...prev, user]);
                                                                                                }
                                                                                            }}
                                                                                            className={`px-2 py-1 rounded text-xs ${
                                                                                                selectedUsersForSubtask.some(u => u.user_id === user.user_id)
                                                                                                    ? 'bg-blue-600 text-white'
                                                                                                    : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                                                                                            }`}
                                                                                        >
                                                                                            {user.full_name}
                                                                                        </button>
                                                                                    ))}
                                                                                </div>
                                                                                <div className="flex space-x-2">
                                                                                    <button
                                                                                        onClick={() => handleAssignUsersToSubtask(row.original.task_id, subtask.id)}
                                                                                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs transition"
                                                                                    >
                                                                                        Assign
                                                                                    </button>
                                                                                    <button
                                                                                        onClick={() => {
                                                                                            setShowSubtaskAssignForm(null);
                                                                                            setSelectedUsersForSubtask([]);
                                                                                        }}
                                                                                        className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-xs transition"
                                                                                    >
                                                                                        Cancel
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Task Comments */}
                                                    {comments[row.original.task_id]?.length > 0 && (
                                                        <div>
                                                            <h4 className="text-sm font-semibold text-gray-300 mb-2">Task Comments:</h4>
                                                            <div className="space-y-2 ml-4">
                                                                {comments[row.original.task_id].map((comment) => (
                                                                    <div key={comment.id} className="p-3 bg-gray-700 rounded">
                                                                        <div className="flex items-center space-x-2 mb-1">
                                                                            <span className="text-xs font-medium text-gray-400">{comment.author}</span>
                                                                            <span className="text-xs text-gray-500">
                                                                                {new Date(comment.created_at).toLocaleString()}
                                                                            </span>
                                                                        </div>
                                                                        <p className="text-sm text-gray-300">{comment.text}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {(!subtasks[row.original.task_id]?.length && !comments[row.original.task_id]?.length) && (
                                                        <p className="text-sm text-gray-500 italic">No subtasks or comments yet.</p>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            
            <AssignedUsersModal
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
                users={selectedUsers}
            />

            {/* Task Detail Drawer */}
            <TaskDetailDrawer
                isOpen={isDrawerOpen}
                onClose={handleCloseDrawer}
                task={selectedTask}
                subtasks={subtasks}
                comments={comments}
                subtaskComments={subtaskComments}
                onViewUsers={handleViewUsers}
                onViewSubtaskUsers={handleViewSubtaskUsers}
            />
        </div>
    );
};

export default TaskTable;