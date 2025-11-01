export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface Task {
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

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  replies?: Reply[];
}

export interface Reply {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
}

export interface Company {
  id: string;
  name: string;
  employees: Employee[];
  teams: Team[];
  createdAt: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Team {
  id: string;
  name: string;
  members: string[]; // employee IDs
}
