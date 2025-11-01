import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  teamId?: string;
  companyId: string;
  subtasks?: SubTask[];
}

interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  replies?: Reply[];
}

interface Reply {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
}

interface Company {
  id: string;
  name: string;
  employees: Employee[];
  teams: Team[];
  createdAt: string;
}

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Team {
  id: string;
  name: string;
  members: string[]; // employee IDs
}

interface TasksState {
  companies: Company[];
  currentCompany: Company | null;
  tasks: Task[];
  selectedTeam: string;
  selectedEmployee: string;
  employeeFilter: string;
  showCompletedOnly: boolean;
  expandedTasks: { [taskId: string]: boolean };
  expandedSubtasks: { [subtaskId: string]: boolean };
  isLoading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  companies: JSON.parse(localStorage.getItem('taskManager_companies') || '[]'),
  currentCompany: JSON.parse(localStorage.getItem('taskManager_currentCompany') || 'null'),
  tasks: JSON.parse(localStorage.getItem('taskManager_tasks') || '[]'),
  selectedTeam: '',
  selectedEmployee: '',
  employeeFilter: '',
  showCompletedOnly: false,
  expandedTasks: {},
  expandedSubtasks: {},
  isLoading: false,
  error: null,
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setCompanies: (state, action: PayloadAction<Company[]>) => {
      state.companies = action.payload;
      localStorage.setItem('taskManager_companies', JSON.stringify(action.payload));
    },
    
    setCurrentCompany: (state, action: PayloadAction<Company>) => {
      state.currentCompany = action.payload;
      localStorage.setItem('taskManager_currentCompany', JSON.stringify(action.payload));
      state.selectedTeam = action.payload.teams[0]?.id || '';
      state.selectedEmployee = action.payload.employees[0]?.id || '';
    },
    
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
      localStorage.setItem('taskManager_tasks', JSON.stringify(action.payload));
    },
    
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
      localStorage.setItem('taskManager_tasks', JSON.stringify(state.tasks));
    },
    
    updateTask: (state, action: PayloadAction<{ id: string; updates: Partial<Task> }>) => {
      const { id, updates } = action.payload;
      const taskIndex = state.tasks.findIndex(task => task.id === id);
      if (taskIndex !== -1) {
        state.tasks[taskIndex] = { ...state.tasks[taskIndex], ...updates };
        localStorage.setItem('taskManager_tasks', JSON.stringify(state.tasks));
      }
    },
    
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
      localStorage.setItem('taskManager_tasks', JSON.stringify(state.tasks));
    },
    
    setSelectedTeam: (state, action: PayloadAction<string>) => {
      state.selectedTeam = action.payload;
    },
    
    setSelectedEmployee: (state, action: PayloadAction<string>) => {
      state.selectedEmployee = action.payload;
    },
    
    setEmployeeFilter: (state, action: PayloadAction<string>) => {
      state.employeeFilter = action.payload;
    },
    
    setShowCompletedOnly: (state, action: PayloadAction<boolean>) => {
      state.showCompletedOnly = action.payload;
    },
    
    toggleTaskExpansion: (state, action: PayloadAction<string>) => {
      state.expandedTasks[action.payload] = !state.expandedTasks[action.payload];
    },
    
    toggleSubtaskExpansion: (state, action: PayloadAction<string>) => {
      state.expandedSubtasks[action.payload] = !state.expandedSubtasks[action.payload];
    },
    
    addCompany: (state, action: PayloadAction<Company>) => {
      state.companies.push(action.payload);
      localStorage.setItem('taskManager_companies', JSON.stringify(state.companies));
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCompanies,
  setCurrentCompany,
  setTasks,
  addTask,
  updateTask,
  deleteTask,
  setSelectedTeam,
  setSelectedEmployee,
  setEmployeeFilter,
  setShowCompletedOnly,
  toggleTaskExpansion,
  toggleSubtaskExpansion,
  addCompany,
  setLoading,
  setError,
} = tasksSlice.actions;

export default tasksSlice.reducer;
