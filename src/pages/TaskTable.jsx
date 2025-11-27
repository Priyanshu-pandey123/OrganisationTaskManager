import React, { useMemo, useState, useEffect } from 'react';
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper, getExpandedRowModel } from '@tanstack/react-table';
import { CheckCircle, Clock, ListTodo, UserPlus, Calendar, AlertTriangle, ArrowUp, ArrowDown, Plus, MessageSquare, ChevronRight, ChevronDown, Trash2, Users } from 'lucide-react';
import AssignedUsersModal from '../components/AssignedUsersModal';
import TaskDetailDrawer from '../components/TaskDetailDrawer';
import CreateSubtaskModal from '../components/CreateSubtaskModal'; // Add this import
import { formatDueDate, getStatusIcon, getPriorityColor } from '../utils/helper';
import { useGetTasksQuery, useMeQuery, useCreateSubtaskMutation ,useGetSubtaskByParamsQuery, useUpdateTaskStatusMutation } from '../store/apiSlice';
import { useCurrentUser } from '../store/hooks';
import { toast } from 'react-toastify';

const columnHelper = createColumnHelper();

const TaskTable = ({ filters }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [expandedRows, setExpandedRows] = useState({});
    const [comments, setComments] = useState({}); // Store comments for each task
    const [subtaskComments, setSubtaskComments] = useState({}); // Store comments for subtasks
    // Comment form states (still needed for inline comment forms)
    const [showCommentForm, setShowCommentForm] = useState(null);
    const [showSubtaskCommentForm, setShowSubtaskCommentForm] = useState(null);
    
    // Subtask modal states
    const [showSubtaskModal, setShowSubtaskModal] = useState(false);
    const [selectedTaskForSubtask, setSelectedTaskForSubtask] = useState(null);
    
    // Remove these states as they're now handled in the modal:
    // const [newSubtaskName, setNewSubtaskName] = useState('');
    // const [newSubtaskDescription, setNewSubtaskDescription] = useState('');
    // const [newSubtaskDueDate, setNewSubtaskDueDate] = useState('');
    // const [newSubtaskAssignees, setNewSubtaskAssignees] = useState([]);

    const [newComment, setNewComment] = useState('');
    const [newSubtaskComment, setNewSubtaskComment] = useState('');
    // const [activeSubtaskQueries, setActiveSubtaskQueries] = useState(new Map()); // Removed to fix infinite re-render
    
    const [selectedUsersForSubtask, setSelectedUsersForSubtask] = useState([]);
    const [subtasksData, setSubtasksData] = useState({}); // Store fetched subtasks
    const [createSubtask, { isLoading: isCreatingSubtask, error: createSubtaskError }] = useCreateSubtaskMutation();
    const [updateTask, { isLoading: isUpdatingTask }] = useUpdateTaskStatusMutation();
    const [updateTaskStatus, { isLoading: isUpdatingTaskStatus }] = useUpdateTaskStatusMutation();      
    
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
    const userId = currentUser?.data?.user_id;
    
    // Fetch tasks using the API with the user ID
    const { data: apiResponse, isLoading: isTasksLoading, error: tasksError, refetch } = useGetTasksQuery(userId, {
        skip: !userId, // Skip the query if user ID is not available
    });

    
    // Extract tasks from API response
    const tasks = apiResponse?.data?.tasks || [];
    const expandedTaskIds = useMemo(() => 
        Object.keys(expandedRows).filter(taskId => expandedRows[taskId]), 
        [expandedRows]
    );
    console.log("EXPANDED TASK IDS ==========>", expandedTaskIds);
   
    const primaryExpandedTaskId = expandedTaskIds.length > 0 ? expandedTaskIds[0] : null;
    const { data: primarySubtaskData, isLoading: isPrimarySubtaskLoading, error: primarySubtaskError } = useGetSubtaskByParamsQuery(primaryExpandedTaskId, {
        skip: !primaryExpandedTaskId,
    });

    // Update subtasks data when the primary query completes
    useEffect(() => {
        if (primarySubtaskData?.data?.subtasks && primaryExpandedTaskId) {
            setSubtasksData(prev => ({
                ...prev,
                [primaryExpandedTaskId]: primarySubtaskData.data.subtasks
            }));
        }
    }, [primarySubtaskData, primaryExpandedTaskId]);
    // Log filters to show which query would be used
    // Log current state
    useEffect(() => {
        console.log('Current task filters:', filters);
        console.log('API Response:', apiResponse);
        console.log('Tasks:', tasks);
        console.log('Expanded Tasks:', expandedTaskIds);
        console.log('Primary expanded task ID:', primaryExpandedTaskId);
        console.log('Primary subtask data:', primarySubtaskData);
        console.log('Subtasks:', subtasksData);
    }, [filters, apiResponse, tasks, expandedTaskIds, primaryExpandedTaskId, primarySubtaskData, subtasksData]);
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

    // Update the create subtask handler
    const handleCreateSubtask = async (subtaskData) => {
        try {
                await createSubtask(subtaskData).unwrap();
                
                // Refetch subtasks for this task if it's expanded
            if (expandedRows[subtaskData.task_id]) {
                const query = subtaskQueries[subtaskData.task_id];
                    if (query) {
                        query.refetch();
                    }
                }
            } catch (error) {
                console.error('Failed to create subtask:', error);
            }
    };

    // Add handler for opening subtask modal
    const handleOpenSubtaskModal = (task) => {
        setSelectedTaskForSubtask(task);
        setShowSubtaskModal(true);
    };

    const handleSubtaskAssigneeToggle = (user) => {
        // This function is no longer needed as assignees are handled in the modal
    };

    const handleAddComment = (taskId) => {
        if (newComment.trim()) {
            const comment = {
                id: Date.now().toString(),
                text: newComment.trim(),
                created_at: new Date().toISOString(),
                author: currentUser?.full_name || currentUser?.name || 'Current User'
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
                author: currentUser?.full_name || currentUser?.name || 'Current User'
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

    // Update the status change handler with proper toast notifications
    const handleStatusChange = async (taskId, newStatus) => {
        try {
            // Update the task status
            await updateTaskStatus({
                task_id: taskId,
                status: newStatus
            }).unwrap();
            
            // Show success notification
            toast.success(`Task status updated to ${newStatus.replace('_', ' ')} successfully!`, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            
            // Explicitly refetch all tasks to show the latest updated task with new status
            console.log('Task status updated successfully, refetching all tasks...');
            await refetch();
            
            console.log('Tasks refetched successfully with updated status');
        } catch (error) {
            // Show error notification
            toast.error('Failed to update task status. Please try again.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            
            console.error('Failed to update task status:', error);
            
            // Even on error, we might want to refetch to ensure data consistency
            try {
                await refetch();
            } catch (refetchError) {
                console.error('Failed to refetch tasks after error:', refetchError);
            }
        }
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
        columnHelper.accessor("status", {
            header: () => "Status",
            cell: ({ row }) => {
              const task = row.original;
              const currentStatus = task.status;
          
              const statusOptions = [
                { value: "todo", label: "Todo" },
                { value: "in_progress", label: "In Progress" },
                { value: "done", label: "Done" },
              ];
          
              const statusColors = {
                todo: "bg-gray-700 text-gray-300 border border-gray-500",
                in_progress: "bg-yellow-500 text-black border border-yellow-600",
                done: "bg-green-600 text-white border border-green-700",
              };
          
              return (
                <select
                    value={currentStatus}
                    onChange={(e) => handleStatusChange(task.task_id, e.target.value)}
                    disabled={isUpdatingTask}
                    className={`px-3 py-1 rounded text-sm focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${statusColors[currentStatus]}`}
                >
                    {statusOptions.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                            className="bg-gray-800 text-white"
                        >
                            {isUpdatingTask ? `${option.label} (Updating...)` : option.label}
                        </option>
                    ))}
                </select>
            );
        },
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
                        onClick={() => handleOpenSubtaskModal(row.original)} // Updated this line
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
                        {subtasksData[row.original.task_id]?.length || 0} subtasks, {comments[row.original.task_id]?.length || 0} comments
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
    ], [expandedRows, subtasksData, comments, isUpdatingTask]);

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

    return (
        <div className="p-8 min-h-screen bg-gray-900 text-gray-200">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-indigo-400">My Tasks</h2>
                <div className='flex gap-3'>
                    <button
                        onClick={() => refetch()}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded transition"
                    >
                        Assigned To Me
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
                                    {/* Removed inline subtask form */}

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
                                                    {subtasksData[row.original.task_id]?.length > 0 && (
                                                        <div>
                                                            <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center">
                                                                <ListTodo className="w-4 h-4 mr-2" />
                                                                Subtasks ({subtasksData[row.original.task_id].length})
                                                            </h4>
                                                            <div className="space-y-3 ml-4">
                                                                {subtasksData[row.original.task_id].map((subtask) => (
                                                                    <div key={subtask.subtask_id} className="border border-gray-600 rounded-lg p-4 bg-gray-700 hover:bg-gray-650 transition">
                                                                        <div className="flex items-start justify-between mb-3">
                                                                            <div className="flex items-center space-x-3 flex-1">
                                                                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                                                                    subtask.status === 'completed' 
                                                                                        ? 'bg-green-500 border-green-500' 
                                                                                        : 'border-gray-400'
                                                                                }`}>
                                                                                    {subtask.status === 'completed' && (
                                                                                        <CheckCircle className="w-3 h-3 text-white" />
                                                                                    )}
                                                                                </div>
                                                                                <div className="flex-1">
                                                                                    <span className={`text-sm font-medium ${subtask.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-200'}`}>
                                                                                        {subtask.subtask_name}
                                                                                    </span>
                                                                                    {subtask.creator && (
                                                                                        <div className="text-xs text-gray-400 mt-1">
                                                                                            Created by {subtask.creator.full_name}
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex items-center space-x-2">
                                                                                <button
                                                                                    onClick={() => setShowSubtaskCommentForm(subtask.subtask_id)}
                                                                                    className="p-1.5 text-green-400 hover:text-green-300 transition rounded hover:bg-gray-600"
                                                                                    title="Add Comment"
                                                                                >
                                                                                    <MessageSquare className="w-4 h-4" />
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                        
                                                                        {/* Subtask Description */}
                                                                        {subtask.description && (
                                                                            <div className="mb-3 text-sm text-gray-400 bg-gray-600 rounded p-2">
                                                                                {subtask.description}
                                                                            </div>
                                                                        )}

                                                                        {/* Subtask Due Date */}
                                                                        {subtask.due_date && (
                                                                            <div className="mb-2 flex items-center text-xs text-gray-400">
                                                                                <Calendar className="w-3 h-3 mr-1" />
                                                                                Due: {formatDueDate(subtask.due_date)}
                                                                            </div>
                                                                        )}
                                                                        
                                                                        {/* Subtask Assignees */}
                                                                        {subtask.assignees?.length > 0 && (
                                                                            <div className="mb-2">
                                                                                <button
                                                                                    onClick={() => handleViewSubtaskUsers(subtask.assignees)}
                                                                                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center"
                                                                                >
                                                                                    <Users className="w-3 h-3 mr-1" />
                                                                                    {subtask.assignees.length} assigned user{subtask.assignees.length !== 1 ? 's' : ''}
                                                                                </button>
                                                                            </div>
                                                                        )}

                                                                        {/* Subtask Comments */}
                                                                        {subtaskComments[subtask.subtask_id]?.length > 0 && (
                                                                            <div className="space-y-2 mt-3">
                                                                                <div className="text-xs text-gray-400 mb-2">Comments:</div>
                                                                                {subtaskComments[subtask.subtask_id].map((comment) => (
                                                                                    <div key={comment.id} className="bg-gray-600 rounded p-3">
                                                                                        <div className="flex items-center space-x-2 mb-2">
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
                                                                        {showSubtaskCommentForm === subtask.subtask_id && (
                                                                            <div className="mt-3 space-y-2 border-t border-gray-600 pt-3">
                                                                                <textarea
                                                                                    value={newSubtaskComment}
                                                                                    onChange={(e) => setNewSubtaskComment(e.target.value)}
                                                                                    placeholder="Add a comment to this subtask..."
                                                                                    rows={2}
                                                                                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-gray-200 placeholder-gray-400 focus:outline-none focus:border-indigo-500 text-sm resize-none"
                                                                                />
                                                                                <div className="flex space-x-2">
                                                                                    <button
                                                                                        onClick={() => handleAddSubtaskComment(row.original.task_id, subtask.subtask_id)}
                                                                                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition"
                                                                                    >
                                                                                        Add Comment
                                                                                    </button>
                                                                                    <button
                                                                                        onClick={() => setShowSubtaskCommentForm(null)}
                                                                                        className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm transition"
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
                                                            <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center">
                                                                <MessageSquare className="w-4 h-4 mr-2" />
                                                                Task Comments ({comments[row.original.task_id].length})
                                                            </h4>
                                                            <div className="space-y-2 ml-4">
                                                                {comments[row.original.task_id].map((comment) => (
                                                                    <div key={comment.id} className="p-3 bg-gray-700 rounded-lg border border-gray-600">
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

                                                    {(!subtasksData[row.original.task_id]?.length && !comments[row.original.task_id]?.length) && (
                                                        <p className="text-sm text-gray-500 italic flex items-center">
                                                            <ListTodo className="w-4 h-4 mr-2" />
                                                            No subtasks or comments yet. Click the + button to add a subtask.
                                                        </p>
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

            {/* Add the CreateSubtaskModal */}
            <CreateSubtaskModal
                isOpen={showSubtaskModal}
                setIsOpen={setShowSubtaskModal}
                task={selectedTaskForSubtask}
                onCreateSubtask={handleCreateSubtask}
                isCreating={isCreatingSubtask}
            />

            {/* Task Detail Drawer */}
            <TaskDetailDrawer
                isOpen={isDrawerOpen}
                onClose={handleCloseDrawer}
                task={selectedTask}
                subtasks={subtasksData}
                comments={comments}
                subtaskComments={subtaskComments}
                onViewUsers={handleViewUsers}
                onViewSubtaskUsers={handleViewSubtaskUsers}
            />
        </div>
    );
};

export default TaskTable;