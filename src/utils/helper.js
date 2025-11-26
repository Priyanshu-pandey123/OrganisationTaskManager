import { CheckCircle, Clock, ListTodo, AlertTriangle, ArrowUp, ArrowDown } from 'lucide-react';

export const formatDueDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

export const getStatusIcon = (status) => {
    switch (status) {
        case 'todo':
            return { icon: ListTodo, color: 'text-blue-400' };
        case 'in_progress':
            return { icon: Clock, color: 'text-yellow-400' };
        case 'completed':
            return { icon: CheckCircle, color: 'text-green-400' };
        default:
            return { icon: AlertTriangle, color: 'text-gray-400' };
    }
};

export const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
        case 'high':
            return 'bg-red-900 text-red-300';
        case 'medium':
            return 'bg-yellow-900 text-yellow-300';
        case 'low':
            return 'bg-green-900 text-green-300';
        default:
            return 'bg-gray-600 text-gray-300';
    }
};