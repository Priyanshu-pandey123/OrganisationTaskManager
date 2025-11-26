import React, { useMemo, useState, useEffect } from 'react';
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper, getExpandedRowModel } from '@tanstack/react-table';
import { CheckCircle, Clock, ListTodo, UserPlus, Calendar, AlertTriangle, ArrowUp, ArrowDown, Plus, MessageSquare, ChevronRight, ChevronDown } from 'lucide-react';
import AssignedUsersModal from '../components/AssignedUsersModal';
import { formatDueDate, getStatusIcon, getPriorityColor } from '../utils/helper';

const taskData = {
    "status": true,
    "code": 200,
    "message": "Tasks fetched successfully",
    "data": {
        "total": 11,
        "page": 1,
        "limit": 20,
        "tasks": [
            {
                "task_id": "0540d3dc-c346-431e-b912-23856478b565",
                "task_name": "Testing the task creation",
                "description": "made some changes in the models",
                "team_id": "3b4a5d4f-63b5-4381-902d-990e6ef1e2df",
                "created_by_user_id": "ce8b79dc-9598-4dda-b20e-b80e5e3ecd1d",
                "last_edited_by": null,
                "last_edited_at": null,
                "status": "todo",
                "priority": "medium",
                "due_date": "2025-11-15T12:00:00.000Z",
                "is_deleted": false,
                "created_at": "2025-11-25T18:30:32.000Z",
                "updated_at": "2025-11-25T18:30:32.000Z",
                "assigned_users": [
                    {
                        "user_id": "ce8b79dc-9598-4dda-b20e-b80e5e3ecd1d",
                        "full_name": "Saurav Bhardwaj",
                        "email": "saurav@swiftramp.in",
                        "TaskAssignment": {
                            "can_edit": true
                        }
                    },
                    {
                        "user_id": "d41ff270-961f-4464-9f21-c650d3d9586d",
                        "full_name": "Saurav Bhardwaj",
                        "email": "saurav12@swiftramp.in",
                        "TaskAssignment": {
                            "can_edit": false
                        }
                    }
                ],
                "creator": {
                    "user_id": "ce8b79dc-9598-4dda-b20e-b80e5e3ecd1d",
                    "full_name": "Saurav Bhardwaj",
                    "email": "saurav@swiftramp.in"
                },
                "last_editor": null
            },
            {
                "task_id": "ac9a37c2-c871-42cc-a4c3-2f640acc3c79",
                "task_name": "Updated Task Name",
                "description": "Updated",
                "team_id": "3b4a5d4f-63b5-4381-902d-990e6ef1e2df",
                "created_by_user_id": "ce8b79dc-9598-4dda-b20e-b80e5e3ecd1d",
                "last_edited_by": "ce8b79dc-9598-4dda-b20e-b80e5e3ecd1d",
                "last_edited_at": "2025-11-25T18:30:06.000Z",
                "status": "in_progress",
                "priority": "high",
                "due_date": "2025-11-20T00:00:00.000Z",
                "is_deleted": false,
                "created_at": "2025-11-25T18:29:24.000Z",
                "updated_at": "2025-11-25T18:30:06.000Z",
                "assigned_users": [
                    {
                        "user_id": "ce8b79dc-9598-4dda-b20e-b80e5e3ecd1d",
                        "full_name": "Saurav Bhardwaj",
                        "email": "saurav@swiftramp.in",
                        "TaskAssignment": {
                            "can_edit": true
                        }
                    }
                ],
                "creator": {
                    "user_id": "ce8b79dc-9598-4dda-b20e-b80e5e3ecd1d",
                    "full_name": "Saurav Bhardwaj",
                    "email": "saurav@swiftramp.in"
                },
                "last_editor": {
                    "user_id": "ce8b79dc-9598-4dda-b20e-b80e5e3ecd1d",
                    "full_name": "Saurav Bhardwaj",
                    "email": "saurav@swiftramp.in"
                }
            },
            {
                "task_id": "b06eac83-235d-4483-95a6-a276b254824a",
                "task_name": "Updated Task Name",
                "description": "Updated",
                "team_id": "3b4a5d4f-63b5-4381-902d-990e6ef1e2df",
                "created_by_user_id": "ce8b79dc-9598-4dda-b20e-b80e5e3ecd1d",
                "last_edited_by": "ce8b79dc-9598-4dda-b20e-b80e5e3ecd1d",
                "last_edited_at": "2025-11-20T11:57:51.000Z",
                "status": "in_progress",
                "priority": "high",
                "due_date": "2025-11-20T00:00:00.000Z",
                "is_deleted": false,
                "created_at": "2025-11-16T11:23:04.000Z",
                "updated_at": "2025-11-20T11:57:51.000Z",
                "assigned_users": [],
                "creator": {
                    "user_id": "ce8b79dc-9598-4dda-b20e-b80e5e3ecd1d",
                    "full_name": "Saurav Bhardwaj",
                    "email": "saurav@swiftramp.in"
                },
                "last_editor": {
                    "user_id": "ce8b79dc-9598-4dda-b20e-b80e5e3ecd1d",
                    "full_name": "Saurav Bhardwaj",
                    "email": "saurav@swiftramp.in"
                }
            },
            {
                "task_id": "528d1e8a-bae1-4a6d-be35-02be907d08f4",
                "task_name": "Testing the task creation",
                "description": "made some changes in the models",
                "team_id": "3b4a5d4f-63b5-4381-902d-990e6ef1e2df",
                "created_by_user_id": "ce8b79dc-9598-4dda-b20e-b80e5e3ecd1d",
                "last_edited_by": null,
                "last_edited_at": null,
                "status": "todo",
                "priority": "medium",
                "due_date": "2025-11-15T12:00:00.000Z",
                "is_deleted": false,
                "created_at": "2025-11-11T18:44:36.000Z",
                "updated_at": "2025-11-11T18:44:36.000Z",
                "assigned_users": [
                    {
                        "user_id": "ce8b79dc-9598-4dda-b20e-b80e5e3ecd1d",
                        "full_name": "Saurav Bhardwaj",
                        "email": "saurav@swiftramp.in",
                        "TaskAssignment": {
                            "can_edit": true
                        }
                    }
                ],
                "creator": {
                    "user_id": "ce8b79dc-9598-4dda-b20e-b80e5e3ecd1d",
                    "full_name": "Saurav Bhardwaj",
                    "email": "saurav@swiftramp.in"
                },
                "last_editor": null
            },
            {
                "task_id": "30f8d69a-b968-40b8-88f5-96b233e97990",
                "task_name": "Testing the task creation",
                "description": "made some changes in the models",
                "team_id": "3b4a5d4f-63b5-4381-902d-990e6ef1e2df",
                "created_by_user_id": "ce8b79dc-9598-4dda-b20e-b80e5e3ecd1d",
                "last_edited_by": null,
                "last_edited_at": null,
                "status": "todo",
                "priority": "medium",
                "due_date": "2025-11-15T12:00:00.000Z",
                "is_deleted": false,
                "created_at": "2025-11-11T16:35:30.000Z",
                "updated_at": "2025-11-11T16:35:30.000Z",
                "assigned_users": [
                    {
                        "user_id": "ce8b79dc-9598-4dda-b20e-b80e5e3ecd1d",
                        "full_name": "Saurav Bhardwaj",
                        "email": "saurav@swiftramp.in",
                        "TaskAssignment": {
                            "can_edit": true
                        }
                    }
                ],
                "creator": {
                    "user_id": "ce8b79dc-9598-4dda-b20e-b80e5e3ecd1d",
                    "full_name": "Saurav Bhardwaj",
                    "email": "saurav@swiftramp.in"
                },
                "last_editor": null
            },
            {
                "task_id": "5247b93b-7135-422e-bcd8-cee871f7adf7",
                "task_name": "Testing the task creation",
                "description": "made some changes in the models",
                "team_id": "3b4a5d4f-63b5-4381-902d-990e6ef1e2df",
                "created_by_user_id": "ce8b79dc-9598-4dda-b20e-b80e5e3ecd1d",
                "last_edited_by": null,
                "last_edited_at": null,
                "status": "todo",
                "priority": "medium",
                "due_date": "2025-11-15T12:00:00.000Z",
                "is_deleted": false,
                "created_at": "2025-11-11T16:33:02.000Z",
                "updated_at": "2025-11-11T16:33:02.000Z",
                "assigned_users": [
                    {
                        "user_id": "ce8b79dc-9598-4dda-b20e-b80e5e3ecd1d",
                        "full_name": "Saurav Bhardwaj",
                        "email": "saurav@swiftramp.in",
                        "TaskAssignment": {
                            "can_edit": true
                        }
                    }
                ],
                "creator": {
                    "user_id": "ce8b79dc-9598-4dda-b20e-b80e5e3ecd1d",
                    "full_name": "Saurav Bhardwaj",
                    "email": "saurav@swiftramp.in"
                },
                "last_editor": null
            },
            {
                "task_id": "51576997-6f7d-4c23-986f-6dd65e6803c7",
                "task_name": "Prepare sprint planning",
                "description": "Draft agenda and collect metrics",
                "team_id": "3b4a5d4f-63b5-4381-902d-990e6ef1e2df",
                "created_by_user_id": "ce8b79dc-9598-4dda-b20e-b80e5e3ecd1d",
                "last_edited_by": null,
                "last_edited_at": null,
                "status": "todo",
                "priority": "medium",
                "due_date": "2025-11-15T12:00:00.000Z",
                "is_deleted": false,
                "created_at": "2025-11-11T16:28:05.000Z",
                "updated_at": "2025-11-11T16:28:05.000Z",
                "assigned_users": [
                    {
                        "user_id": "ce8b79dc-9598-4dda-b20e-b80e5e3ecd1d",
                        "full_name": "Saurav Bhardwaj",
                        "email": "saurav@swiftramp.in",
                        "TaskAssignment": {
                            "can_edit": true
                        }
                    }
                ],
                "creator": {
                    "user_id": "ce8b79dc-9598-4dda-b20e-b80e5e3ecd1d",
                    "full_name": "Saurav Bhardwaj",
                    "email": "saurav@swiftramp.in"
                },
                "last_editor": null
            },
            {
                "task_id": "a07ddd2e-937f-4c7b-88db-9e2d315156ce",
                "task_name": "Prepare sprint planning",
                "description": "Draft agenda and collect metrics",
                "team_id": "3b4a5d4f-63b5-4381-902d-990e6ef1e2df",
                "created_by_user_id": "ce8b79dc-9598-4dda-b20e-b80e5e3ecd1d",
                "last_edited_by": null,
                "last_edited_at": null,
                "status": "todo",
                "priority": "medium",
                "due_date": "2025-11-15T12:00:00.000Z",
                "is_deleted": false,
                "created_at": "2025-11-11T16:26:50.000Z",
                "updated_at": "2025-11-11T16:26:50.000Z",
                "assigned_users": [
                    {
                        "user_id": "ce8b79dc-9598-4dda-b20e-b80e5e3ecd1d",
                        "full_name": "Saurav Bhardwaj",
                        "email": "saurav@swiftramp.in",
                        "TaskAssignment": {
                            "can_edit": true
                        }
                    }
                ],
                "creator": {
                    "user_id": "ce8b79dc-9598-4dda-b20e-b80e5e3ecd1d",
                    "full_name": "Saurav Bhardwaj",
                    "email": "saurav@swiftramp.in"
                },
                "last_editor": null
            },
            {
                "task_id": "ea76d208-0cd6-42d9-9f03-ef25920a583f",
                "task_name": "Prepare sprint planning",
                "description": "Draft agenda and collect metrics",
                "team_id": "3b4a5d4f-63b5-4381-902d-990e6ef1e2df",
                "created_by_user_id": "ce8b79dc-9598-4dda-b20e-b80e5e3ecd1d",
                "last_edited_by": null,
                "last_edited_at": null,
                "status": "todo",
                "priority": "medium",
                "due_date": "2025-11-15T12:00:00.000Z",
                "is_deleted": false,
                "created_at": "2025-11-11T16:25:59.000Z",
                "updated_at": "2025-11-11T16:25:59.000Z",
                "assigned_users": [
                    {
                        "user_id": "ce8b79dc-9598-4dda-b20e-b80e5e3ecd1d",
                        "full_name": "Saurav Bhardwaj",
                        "email": "saurav@swiftramp.in",
                        "TaskAssignment": {
                            "can_edit": true
                        }
                    }
                ],
                "creator": {
                    "user_id": "ce8b79dc-9598-4dda-b20e-b80e5e3ecd1d",
                    "full_name": "Saurav Bhardwaj",
                    "email": "saurav@swiftramp.in"
                },
                "last_editor": null
            },
            {
                "task_id": "13606352-2bf5-4b36-a9c7-4459b17f37cf",
                "task_name": "Prepare sprint planning",
                "description": "Draft agenda and collect metrics",
                "team_id": "3b4a5d4f-63b5-4381-902d-990e6ef1e2df",
                "created_by_user_id": "ce8b79dc-9598-4dda-b20e-b80e5e3ecd1d",
                "last_edited_by": null,
                "last_edited_at": null,
                "status": "todo",
                "priority": "medium",
                "due_date": "2025-11-15T12:00:00.000Z",
                "is_deleted": false,
                "created_at": "2025-11-11T16:24:31.000Z",
                "updated_at": "2025-11-11T16:24:31.000Z",
                "assigned_users": [
                    {
                        "user_id": "ce8b79dc-9598-4dda-b20e-b80e5e3ecd1d",
                        "full_name": "Saurav Bhardwaj",
                        "email": "saurav@swiftramp.in",
                        "TaskAssignment": {
                            "can_edit": true
                        }
                    }
                ],
                "creator": {
                    "user_id": "ce8b79dc-9598-4dda-b20e-b80e5e3ecd1d",
                    "full_name": "Saurav Bhardwaj",
                    "email": "saurav@swiftramp.in"
                },
                "last_editor": null
            },
            {
                "task_id": "c26fe019-770e-42d6-a059-4da0ba86ceff",
                "task_name": "Prepare sprint planning",
                "description": "Draft agenda and collect metrics",
                "team_id": "3b4a5d4f-63b5-4381-902d-990e6ef1e2df",
                "created_by_user_id": "ce8b79dc-9598-4dda-b20e-b80e5e3ecd1d",
                "last_edited_by": null,
                "last_edited_at": null,
                "status": "todo",
                "priority": "medium",
                "due_date": "2025-11-15T12:00:00.000Z",
                "is_deleted": false,
                "created_at": "2025-11-11T16:20:11.000Z",
                "updated_at": "2025-11-11T16:20:11.000Z",
                "assigned_users": [
                    {
                        "user_id": "ce8b79dc-9598-4dda-b20e-b80e5e3ecd1d",
                        "full_name": "Saurav Bhardwaj",
                        "email": "saurav@swiftramp.in",
                        "TaskAssignment": {
                            "can_edit": true
                        }
                    }
                ],
                "creator": {
                    "user_id": "ce8b79dc-9598-4dda-b20e-b80e5e3ecd1d",
                    "full_name": "Saurav Bhardwaj",
                    "email": "saurav@swiftramp.in"
                },
                "last_editor": null
            }
        ]
    }
}

const data = taskData.data.tasks;

const columnHelper = createColumnHelper();

const TaskTable = ({ filters }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [expandedRows, setExpandedRows] = useState({});
    const [subtasks, setSubtasks] = useState({}); // Store subtasks for each task
    const [comments, setComments] = useState({}); // Store comments for each task
    const [showSubtaskForm, setShowSubtaskForm] = useState(null);
    const [showCommentForm, setShowCommentForm] = useState(null);
    const [newSubtaskName, setNewSubtaskName] = useState('');
    const [newComment, setNewComment] = useState('');

    // Log filters to show which query would be used
    useEffect(() => {
        console.log('Current task filters:', filters);
    }, [filters]);
    
    const handleViewUsers = (users) => {
        setSelectedUsers(users);
        setIsModalOpen(true);
    };

    const handleCreateSubtask = (taskId) => {
        if (newSubtaskName.trim()) {
            const newSubtask = {
                id: Date.now().toString(),
                name: newSubtaskName.trim(),
                status: 'todo',
                priority: 'medium',
                created_at: new Date().toISOString(),
                assigned_users: []
            };
            
            setSubtasks(prev => ({
                ...prev,
                [taskId]: [...(prev[taskId] || []), newSubtask]
            }));
            setNewSubtaskName('');
            setShowSubtaskForm(null);
        }
    };

    const handleAddComment = (taskId) => {
        if (newComment.trim()) {
            const comment = {
                id: Date.now().toString(),
                text: newComment.trim(),
                created_at: new Date().toISOString(),
                author: 'Current User' // You can get this from auth context
            };
            
            setComments(prev => ({
                ...prev,
                [taskId]: [...(prev[taskId] || []), comment]
            }));
            setNewComment('');
            setShowCommentForm(null);
        }
    };

    const toggleRowExpansion = (taskId) => {
        setExpandedRows(prev => ({
            ...prev,
            [taskId]: !prev[taskId]
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
            cell: info => <div className="font-semibold text-gray-100">{info.getValue()}</div>,
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
                        {comments[row.original.task_id]?.length || 0} comments
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
    ], [expandedRows, comments]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
    });

    return (
        <div className="p-8 min-h-screen bg-gray-900 text-gray-200">
            <h2 className="text-3xl font-bold mb-6 text-indigo-400">📝 Task Management Dashboard</h2>
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
                                        <td colSpan={columns.length} className="px-6 py-4 bg-gray-750">
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="text"
                                                    value={newSubtaskName}
                                                    onChange={(e) => setNewSubtaskName(e.target.value)}
                                                    placeholder="Enter subtask name..."
                                                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-200 placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                                                    onKeyPress={(e) => e.key === 'Enter' && handleCreateSubtask(row.original.task_id)}
                                                />
                                                <button
                                                    onClick={() => handleCreateSubtask(row.original.task_id)}
                                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded transition"
                                                >
                                                    Add
                                                </button>
                                                <button
                                                    onClick={() => setShowSubtaskForm(null)}
                                                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition"
                                                >
                                                    Cancel
                                                </button>
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
                                                        <div className="space-y-2 ml-4">
                                                            {subtasks[row.original.task_id].map((subtask) => (
                                                                <div key={subtask.id} className="flex items-center space-x-2 p-2 bg-gray-700 rounded">
                                                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                                                    <span className="text-sm text-gray-300">{subtask.name}</span>
                                                                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                                                                        subtask.status === 'completed' ? 'bg-green-600' : 'bg-yellow-600'
                                                                    }`}>
                                                                        {subtask.status}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Comments */}
                                                {comments[row.original.task_id]?.length > 0 && (
                                                    <div>
                                                        <h4 className="text-sm font-semibold text-gray-300 mb-2">Comments:</h4>
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
            
            <AssignedUsersModal
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
                users={selectedUsers}
            />
        </div>
    );
};

export default TaskTable;