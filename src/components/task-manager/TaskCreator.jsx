import React from 'react';

const TaskCreator = ({
  currentCompany,
  newTaskTitle,
  setNewTaskTitle,
  handleAddTask,
  selectedTeam,
  setSelectedTeam,
  currentCompanyTeams,
  selectedEmployee,
  setSelectedEmployee,
  filteredEmployees,
  totalUsers
}) => {
  if (!currentCompany) return null;

  return (
    <div className="mb-4 space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Create New Task</h2>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Total Users: {totalUsers}
        </div>
      </div>
      <input
        type="text"
        value={newTaskTitle}
        onChange={(e) => setNewTaskTitle(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
        placeholder="Enter new task"
        className="w-full px-3 py-2 text-base bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
      />
      <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="assignTeam" className="text-gray-600 dark:text-gray-300">Assign to Team:</label>
          <select
            id="assignTeam"
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-lg"
          >
            <option value="">Select Team</option>
            {currentCompanyTeams.map((team, index) => (
              <option key={team.id || index} value={team.team_id}>{team.team_name}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="assignEmployee" className="text-gray-600 dark:text-gray-300">Assign to Employee:</label>
          <select
            id="assignEmployee"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-lg"
          >
            <option value="">Select Employee</option>
            {filteredEmployees.map((employee) => (
              <option key={employee.id} value={employee.id}>{employee.name}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default TaskCreator;
