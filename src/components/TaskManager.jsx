import React, { useState, useEffect } from 'react';
import {  useGetCompaniesQuery, useCreateTeamMutation, useGetTeamsByOrganisationIdQuery,useInviteMemberMutation } from '../store/apiSlice'
import { data } from 'autoprefixer';
const TaskManager = () => {
  const { data: companiesData, isLoading: companiesLoading, error: companiesError } = useGetCompaniesQuery();
   const [companies, setCompanies] = useState([]);
   const [currentCompany, setCurrentCompany] = useState(null);
   const [newCompanyName, setNewCompanyName] = useState('');
   const [invitedEmail, setInvitedEmail] = useState('');
   const [tasks, setTasks] = useState([]);
   const [newTaskTitle, setNewTaskTitle] = useState('');
   const [newTeamName, setNewTeamName] = useState('');
   const [selectedTeam, setSelectedTeam] = useState('');
   const [selectedTeamForMember, setSelectedTeamForMember] = useState('');
   const [selectedEmployee, setSelectedEmployee] = useState('');
   const [employeeFilter, setEmployeeFilter] = useState('');
   const [selectedTeamFilter, setSelectedTeamFilter] = useState('');
   const [selectedMemberFilter, setSelectedMemberFilter] = useState('');
   const [userId, setUserId] = useState('user-' + Date.now());
   const [showCompletedOnly, setShowCompletedOnly] = useState(false);
   const [expandedTasks, setExpandedTasks] = useState({});
   const [subtaskInput, setSubtaskInput] = useState({});
   const [expandedSubtasks, setExpandedSubtasks] = useState({});
   const [subtaskReplyInput, setSubtaskReplyInput] = useState({});
   const [isDarkMode, setIsDarkMode] = useState(() => {
     const savedTheme = localStorage.getItem('theme');
     return savedTheme ? savedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
   });
   const [isEditingCompanyName, setIsEditingCompanyName] = useState(false);
   const [editingCompanyName, setEditingCompanyName] = useState('');
   const [showDeleteModal, setShowDeleteModal] = useState(false);
   const [createTeam, { isLoading: creatingTeam, error: createTeamError }] = useCreateTeamMutation();
   const [inviteMember, { isLoading: invitingMember, error: inviteMemberError }] = useInviteMemberMutation();
   const { 
     data: teamsData, 
     isLoading: teamsLoading, 
     error: teamsError, 
     refetch: refetchTeams 
   } = useGetTeamsByOrganisationIdQuery(currentCompany?.id, {
     skip: !currentCompany?.id 
   });


  useEffect(() => {
    if (companiesData?.data) {
      const transformedCompanies = companiesData.data.map(org => ({
        id: org.org_id,
        name: org.org_name,
        teams: [], // Teams will come from API now
        employees: [], 
        created_at: org.created_at,
        updated_at: org.updated_at
      }));
      setCompanies(transformedCompanies);
      
      if (!currentCompany && transformedCompanies.length > 0) {
        const firstCompany = transformedCompanies[0];
        setCurrentCompany(firstCompany);
      }
    }
  }, [companiesData, currentCompany]);
  useEffect(() => {
    const savedTasks = localStorage.getItem('taskManager_tasks');
    const savedCurrentCompany = localStorage.getItem('taskManager_currentCompany');

    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks);
      setTasks(parsedTasks);
    }

    if (savedCurrentCompany && !currentCompany) {
      const parsedCurrentCompany = JSON.parse(savedCurrentCompany);
      setCurrentCompany(parsedCurrentCompany);
      setSelectedTeam(parsedCurrentCompany.teams[0] || '');
      setSelectedEmployee(parsedCurrentCompany.employees[0]?.id || '');
    }
  }, []);




  // Sync theme with localStorage and document body
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleSelectCompany = (company) => {
    if (company) {
      setCurrentCompany(company);
      setSelectedTeam(company.teams[0] || '');
      setSelectedEmployee(company.employees[0]?.id || '');
    } else {
      setCurrentCompany(null);
      setSelectedTeam('');
      setSelectedEmployee('');
    }
  };

  const handleCreateCompanyAndJoin = () => {
    if (!newCompanyName.trim()) return;
    
    // Check if company already exists
    const existingCompany = companies.find(c => c.name === newCompanyName);
    
    if (existingCompany) {
      // Join existing company
      const isAlreadyEmployee = existingCompany.employees.some(emp => emp.id === userId);
      if (!isAlreadyEmployee) {
        const updatedCompany = {
          ...existingCompany,
          employees: [...existingCompany.employees, { 
            id: userId, 
            name: `Employee ${userId.substring(0, 4)}`, 
            email: null 
          }]
        };
        const updatedCompanies = companies.map(c => 
          c.id === existingCompany.id ? updatedCompany : c
        );
        setCompanies(updatedCompanies);
        handleSelectCompany(updatedCompany);
      } else {
        handleSelectCompany(existingCompany);
      }
    } else {
      // Create new company
      const newCompany = {
        id: 'company-' + Date.now(),
        name: newCompanyName,
        teams: ['Default Team'],
        employees: [{ 
          id: userId, 
          name: `Employee ${userId.substring(0, 4)}`, 
          email: null 
        }],
        pendingInvites: []
      };
      setCompanies([...companies, newCompany]);
      handleSelectCompany(newCompany);
    }
    
    setNewCompanyName('');
  };

  const handleEditCompanyName = () => {
    if (!currentCompany || !editingCompanyName.trim()) return;
    const updatedCompany = { ...currentCompany, name: editingCompanyName };
    const updatedCompanies = companies.map(c => 
      c.id === currentCompany.id ? updatedCompany : c
    );
    setCompanies(updatedCompanies);
    setCurrentCompany(updatedCompany);
    setIsEditingCompanyName(false);
  };

  const handleDeleteCompany = () => {
    if (!currentCompany) return;
    
    // Remove all tasks for this company
    const filteredTasks = tasks.filter(task => task.companyId !== currentCompany.id);
    setTasks(filteredTasks);
    
    // Remove company
    const filteredCompanies = companies.filter(c => c.id !== currentCompany.id);
    setCompanies(filteredCompanies);
    
    setCurrentCompany(null);
    setShowDeleteModal(false);
  };

  // Update the handleCreateTeam function to use the API
  const handleCreateTeam = async () => {
    if (!currentCompany || !newTeamName.trim()) return;
    
    try {
      const teamData = {
        name: newTeamName.trim(),
        organisationId: currentCompany.id,
        // Add any other required fields for team creation
      };
      
      await createTeam(teamData).unwrap();
      
      // Clear the input and refetch teams
      setNewTeamName('');
      refetchTeams(); // Refresh the teams list
      
    } catch (error) {
      console.error('Failed to create team:', error);
      alert('Failed to create team. Please try again.');
    }
  };

  const handleAddMemberToTeam = async () => {
    if (!currentCompany || !selectedTeamForMember || !invitedEmail.trim()) return;

    try {
      // Find the selected team to get its ID
      const selectedTeam = currentCompanyTeams.find(team => team.team_name === selectedTeamForMember);
      if (!selectedTeam) {
        alert('Selected team not found!');
        return;
      }
      console.log(selectedTeam,'*&*&*&*&*&*&*&*')

      // Call the invite member API
      await inviteMember({
        email: invitedEmail.trim(),
        teamId: selectedTeam.team_id,
        organisationId: currentCompany.id
      }).unwrap();

      // Clear the form
      setInvitedEmail('');
      setSelectedTeamForMember(''); 
      
      // Refetch teams to update the UI with the new member
      refetchTeams();
      
      alert('Member invited successfully!');
    } catch (error) {
      console.error('Failed to invite member:', error);
      alert('Failed to invite member. Please try again.');
    }
  };

  // Remove the old handleInviteEmployee function as it's replaced by handleAddMemberToTeam

  const handleAddTask = () => {
    if (!currentCompany || !newTaskTitle.trim() || !selectedTeam || !selectedEmployee) return;
    
    const newTask = {
      id: 'task-' + Date.now(),
      companyId: currentCompany.id,
      title: newTaskTitle,
      assignedTo: currentCompany.employees.find(e => e.id === selectedEmployee)?.name || 'N/A',
      assignedEmployeeId: selectedEmployee,
      team: selectedTeam,
      subtasks: [],
      completed: false,
      createdAt: Date.now(),
      completedAt: null
    };
    
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
  };

  const handleToggleTask = (taskId) => {
    setExpandedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const handleToggleCompleted = (taskId) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const isCompleting = !task.completed;
        return {
          ...task,
          completed: isCompleting,
          completedAt: isCompleting ? Date.now() : null,
        };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const handleDeleteTask = (taskId) => {
    const filteredTasks = tasks.filter(task => task.id !== taskId);
    setTasks(filteredTasks);
  };

  const handleAddSubtask = (taskId) => {
    const input = subtaskInput[taskId] ? subtaskInput[taskId].trim() : '';
    if (!input) return;
    
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const newSubtask = { 
          title: input, 
          completed: false, 
          replies: [], 
          createdAt: Date.now(), 
          completedAt: null 
        };
        return { ...task, subtasks: [...task.subtasks, newSubtask] };
      }
      return task;
    });
    
    setTasks(updatedTasks);
    setSubtaskInput(prev => ({ ...prev, [taskId]: '' }));
  };

  const handleToggleSubtaskCompletion = (taskId, subtaskIndex) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const updatedSubtasks = [...task.subtasks];
        const isCompleting = !updatedSubtasks[subtaskIndex].completed;
        updatedSubtasks[subtaskIndex].completed = isCompleting;
        updatedSubtasks[subtaskIndex].completedAt = isCompleting ? Date.now() : null;
        
        const allSubtasksCompleted = updatedSubtasks.every(sub => sub.completed);
        return {
          ...task,
          subtasks: updatedSubtasks,
          completed: allSubtasksCompleted
        };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const handleDeleteSubtask = (taskId, subtaskIndex) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const updatedSubtasks = task.subtasks.filter((_, index) => index !== subtaskIndex);
        const allSubtasksCompleted = updatedSubtasks.every(sub => sub.completed);
        return {
          ...task,
          subtasks: updatedSubtasks,
          completed: allSubtasksCompleted
        };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const handleAddSubtaskReply = (taskId, subtaskIndex) => {
    const replyInput = subtaskReplyInput[`${taskId}-${subtaskIndex}`] || '';
    if (!replyInput.trim()) return;
    
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const updatedSubtasks = [...task.subtasks];
        updatedSubtasks[subtaskIndex].replies = [
          ...(updatedSubtasks[subtaskIndex].replies || []), 
          {
            text: replyInput,
            userId: userId,
            createdAt: Date.now()
          }
        ];
        return { ...task, subtasks: updatedSubtasks };
      }
      return task;
    });
    
    setTasks(updatedTasks);
    setSubtaskReplyInput(prev => ({ ...prev, [`${taskId}-${subtaskIndex}`]: '' }));
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const handleCopyUserId = () => {
    if (userId) {
      navigator.clipboard.writeText(userId).then(() => {
        console.log("User ID copied to clipboard!");
      }).catch(err => {
        console.error("Failed to copy user ID: ", err);
      });
    }
  };

  // Filter tasks for current company and apply filters
  const currentCompanyTasks = currentCompany 
    ? tasks.filter(task => task.companyId === currentCompany.id)
    : [];
    
  const filteredTasks = currentCompanyTasks.filter(task => {
    const matchesCompletedFilter = showCompletedOnly ? task.completed : true;
    const matchesEmployeeFilter = employeeFilter ? task.assignedEmployeeId === employeeFilter : true;
    return matchesCompletedFilter && matchesEmployeeFilter;
  }).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  const filteredTeams = currentCompany?.teams.map(team => team.name) || [];
  const filteredEmployees = currentCompany?.employees || [];

  // Update the teams display to use API data
  const currentCompanyTeams = teamsData?.data || [];

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }} className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-2 sm:p-4 transition-colors duration-300it ">
      <div className="max-w-7xl mx-auto rounded-xl p-4 sm:p-6 bg-gray-100 dark:bg-gray-800 shadow-lg">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2 sm:mb-0">Collaborative Task Manager</h1>
         
        </div>
        <hr className="border-gray-300 dark:border-gray-700 mb-4" />

        {/* User and Company Info */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 text-sm sm:text-base">
          <div className="flex items-center space-x-2 mb-2 sm:mb-0">
            <p className="font-mono text-gray-500 dark:text-gray-400 break-all">
              User ID: <span className="text-gray-900 dark:text-white">{userId}</span>
            </p>
            <button onClick={handleCopyUserId} className="text-blue-500 hover:text-blue-700 focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Company Selection and Creation */}
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-2">
            <h2 className="text-base font-bold">My Companies</h2>
            {companiesLoading ? (
              <div className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-500 rounded-lg">
                Loading companies...
              </div>
            ) : companiesError ? (
              <div className="px-3 py-2 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-lg">
                Error loading companies
              </div>
            ) : (
              <select
                value={currentCompany ? currentCompany.id : ''}
                onChange={(e) => {
                  const selectedCompany = companies.find(c => c.id === e.target.value);
                  handleSelectCompany(selectedCompany);
                }}
                className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              >
                <option value="">Select a company</option>
                {companies.map(company => (
                  <option key={company.id} value={company.id}>{company.name}</option>
                ))}
              </select>
            )}
            <input
              type="text"
              value={newCompanyName}
              onChange={(e) => setNewCompanyName(e.target.value)}
              placeholder="Enter new company name"
              className="w-full sm:w-auto px-3 py-2 text-base bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
            <button
              onClick={handleCreateCompanyAndJoin}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 w-full sm:w-auto"
            >
              Join/Create
            </button>
          </div>
        </div>

             {/* Manage Company Section */}
             {currentCompany && (
          <div className="mb-4 p-4 bg-gray-200 dark:bg-gray-700 rounded-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 sm:space-x-4 mb-2">
              <h2 className="text-xl font-bold">Manage Company</h2>
              <div className="flex items-center space-x-2">
                {isEditingCompanyName ? (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={editingCompanyName}
                      onChange={(e) => setEditingCompanyName(e.target.value)}
                      className="px-2 py-1 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-gray-200 rounded-lg"
                    />
                    <button onClick={handleEditCompanyName} className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200" title="Save changes">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button onClick={() => setIsEditingCompanyName(false)} className="p-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200" title="Cancel editing">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold">{currentCompany.name}</span>
                    <button
                      onClick={() => {
                        setIsEditingCompanyName(true);
                        setEditingCompanyName(currentCompany.name);
                      }}
                      className="p-2 bg-gray-300 dark:bg-gray-600 hover:bg-yellow-600 dark:hover:bg-yellow-700 text-gray-800 dark:text-gray-200 hover:text-white rounded-lg transition-colors duration-200"
                      title="Edit company name"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="p-2 bg-gray-300 dark:bg-gray-600 hover:bg-red-600 dark:hover:bg-red-700 text-gray-800 dark:text-gray-200 hover:text-white rounded-lg transition-colors duration-200"
                      title="Delete company"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 112 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Create New Team Section */}
            <div className="mt-4 p-3 bg-gray-300 dark:bg-gray-600 rounded-lg mb-4 w-[500px]">
              <h3 className="text-lg font-semibold mb-3">Create New Team</h3>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="Enter team name"
                  className="flex-1 px-3 py-2 text-base bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                  disabled={creatingTeam}
                />
                <button
                  onClick={handleCreateTeam}
                  disabled={creatingTeam || !newTeamName.trim()}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition duration-200"
                >
                  {creatingTeam ? 'Creating...' : 'Create Team'}
                </button>
              </div>
              {createTeamError && (
                <p className="text-red-500 text-sm mt-2">Error creating team: {createTeamError.message}</p>
              )}
            </div>

            {/* Add Member to Team Section */}
            {currentCompanyTeams.length > 0 && (
              <div className="mt-4 p-3 bg-gray-300 dark:bg-gray-600 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Add Member to Team</h3>
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <label className="text-sm font-medium">Select Team:</label>
                    <select
                      value={selectedTeamForMember}
                      onChange={(e) => setSelectedTeamForMember(e.target.value)}
                      className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-lg"
                    >
                      <option value="">Select Team</option>
                      {currentCompanyTeams.map((team, index) => (
                        <option key={team.id || index} value={team.team_name}>{team.team_name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <input
                      type="email"
                      value={invitedEmail}
                      onChange={(e) => setInvitedEmail(e.target.value)}
                      placeholder="Member email"
                      className="flex-1 px-3 py-2 text-base bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    />
                   <button
                      onClick={handleAddMemberToTeam}
                      disabled={!selectedTeamForMember || invitingMember}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition duration-200"
                    >
                      {invitingMember ? 'Inviting...' : 'Add Member'}
                    </button>
                  </div>
                </div>
                
                {/* Display Teams and Members */}
                              {/* Team Filters */}
                              <div className="mt-4 flex flex-wrap gap-4 items-center">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium">Filter by Team:</label>
                    <select
                      value={selectedTeamFilter || ''}
                      onChange={(e) => setSelectedTeamFilter(e.target.value)}
                      className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-lg text-sm"
                    >
                      <option value="">All Teams</option>
                      {currentCompanyTeams.map((team, index) => (
                        <option key={team.id || index} value={team.team_name}>{team.team_name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium">Filter by Member:</label>
                    <select
                      value={selectedMemberFilter || ''}
                      onChange={(e) => setSelectedMemberFilter(e.target.value)}
                      className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-lg text-sm"
                    >
                      <option value="">All Members</option>
                      {currentCompanyTeams
                        .filter(team => !selectedTeamFilter || team.team_name === selectedTeamFilter)
                        .flatMap(team => team.members || [])
                        .filter((member, index, self) => 
                          index === self.findIndex(m => m.email === member.email)
                        )
                        .map((member, index) => (
                          <option key={index} value={member.email}>{member.email}</option>
                        ))}
                    </select>
                  </div>
                </div>

                {/* Teams Display - Compact Profile View */}
                <div className="mt-4 space-y-3">
                  <h4 className="text-md font-semibold">Team Profiles:</h4>
                  {teamsLoading ? (
                    <div className="text-gray-500">Loading teams...</div>
                  ) : teamsError ? (
                    <div className="text-red-500">Error loading teams: {teamsError.message}</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {currentCompanyTeams
                        .filter(team => !selectedTeamFilter || team.team_name === selectedTeamFilter)
                        .filter(team => !selectedMemberFilter || 
                          (team.members && team.members.some(member => member.email === selectedMemberFilter))
                        )
                        .map((team, teamIndex) => (
                          <div key={team.id || teamIndex} className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                            <div className="flex flex-col space-y-3">
                              {/* Team Header */}
                              <div className="flex justify-between items-center">
                                <h5 className="font-semibold text-lg">{team.team_name}</h5>
                                <span className="text-sm text-gray-600 dark:text-gray-400 bg-gray-300 dark:bg-gray-600 px-2 py-1 rounded-full">
                                  {team.members ? team.members.length : 0}
                                </span>
                              </div>
                              
                              {/* Member Avatars Row */}
                              <div className="flex items-center space-x-2 overflow-x-auto">
                                {team.members && team.members.length > 0 ? (
                                  team.members.map((member, memberIndex) => (
                                    <div key={memberIndex} className="flex-shrink-0">
                                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium text-sm shadow-sm">
                                        {member.email.charAt(0).toUpperCase()}
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                                    No members yet
                                  </div>
                                )}
                              </div>
                              
                              {/* Member Status Summary */}
                              {team.members && team.members.length > 0 && (
                                <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                                  <span>
                                    Active: {team.members.filter(m => m.status === 'active').length}
                                  </span>
                                  <span>
                                    Invited: {team.members.filter(m => m.status !== 'active').length}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* New Task Input Section */}
        {currentCompany && (
          <div className="mb-4 space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Create New Task</h2>
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
                      value={selectedTeamForMember}
                      onChange={(e) => setSelectedTeamForMember(e.target.value)}
                      className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-lg"
                    >
                      <option value="">Select Team</option>
                      {currentCompanyTeams.map((team, index) => (
                        <option key={team.id || index} value={team.team_name}>{team.team_name}</option>
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
        )}
        
        {/* Task List and Filters */}
        {currentCompany && (
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0">
            <h2 className="text-xl font-bold">Task List</h2>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showCompletedOnly}
                  onChange={(e) => setShowCompletedOnly(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-blue-500 rounded focus:ring-blue-500"
                />
                <span className="text-gray-600 dark:text-gray-300">Show Completed</span>
              </label>
              <select
                value={employeeFilter}
                onChange={(e) => setEmployeeFilter(e.target.value)}
                className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-lg"
              >
                <option value="">All Employees</option>
                {filteredEmployees.map((employee) => (
                  <option key={employee.id} value={employee.id}>{employee.name}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Task List */}
        <div className="space-y-2">
          {currentCompany ? (
            filteredTasks.length > 0 ? (
              filteredTasks.map(task => (
                <div key={task.id} className="bg-gray-200 dark:bg-gray-700 rounded-lg shadow-sm overflow-hidden">
                  <div className="p-2 sm:p-3 flex flex-col items-start cursor-pointer" onClick={() => handleToggleTask(task.id)}>
                    <div className="w-full flex justify-between items-center mb-1">
                      <div className="flex-grow text-sm text-gray-600 dark:text-gray-300 font-semibold">
                        Assigned to: {task.assignedTo || 'N/A'} ({task.team || 'N/A'})
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                        <span>Created: {formatDate(task.createdAt)}</span>
                        {task.completed && <span>Completed: {formatDate(task.completedAt)}</span>}
                      </div>
                    </div>
                    <div className="w-full flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={(e) => { e.stopPropagation(); handleToggleCompleted(task.id); }}
                          className="form-checkbox h-5 w-5 text-blue-500 rounded focus:ring-blue-500 transition duration-150"
                        />
                        <span className={`text-lg font-medium ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-gray-200'}`}>
                          {task.title}
                        </span>
                      </div>
                      <div className="ml-2 flex items-center space-x-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteTask(task.id); }}
                          className="text-red-500 hover:text-red-700 transition-colors p-1"
                          title="Delete Task"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 112 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleToggleTask(task.id); }}
                          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                          <svg
                            className={`w-4 h-4 transform transition-transform duration-300 ${expandedTasks[task.id] ? 'rotate-180' : ''}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  {expandedTasks[task.id] && (
                    <div className="p-3 bg-gray-300 dark:bg-gray-750">
                      <div className="space-y-2">
                        <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">Subtasks:</div>
                        {task.subtasks.length > 0 ? (
                          task.subtasks.map((subtask, subtaskIndex) => (
                            <div key={subtaskIndex} className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                              onClick={(e) => { e.stopPropagation(); setExpandedSubtasks(prev => ({ ...prev, [`${task.id}-${subtaskIndex}`]: !prev[`${task.id}-${subtaskIndex}`] })); }}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={subtask.completed}
                                    onChange={(e) => { e.stopPropagation(); handleToggleSubtaskCompletion(task.id, subtaskIndex); }}
                                    className="form-checkbox h-4 w-4 text-blue-500 rounded focus:ring-blue-500 transition duration-150"
                                  />
                                  <span className={`text-sm ${subtask.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-gray-200'}`}>
                                    {subtask.title}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 ml-auto">
                                  <span className="text-right">Created: {formatDate(subtask.createdAt)}</span>
                                  {subtask.completed && <span className="text-right">Completed: {formatDate(subtask.completedAt)}</span>}
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleDeleteSubtask(task.id, subtaskIndex); }}
                                    className="text-red-500 hover:text-red-700 transition-colors"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 112 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                              {expandedSubtasks[`${task.id}-${subtaskIndex}`] && (
                                <div className="mt-2 space-y-1">
                                  <div className="text-xs font-semibold text-gray-600 dark:text-gray-400">Replies:</div>
                                  {(subtask.replies || []).map((reply, replyIndex) => (
                                    <div key={replyIndex} className="text-xs bg-gray-200 dark:bg-gray-600 p-1 rounded flex justify-between items-center">
                                      <div>
                                        <span className="font-semibold text-gray-800 dark:text-gray-200">{reply.userId.substring(0, 4)}: </span>
                                        {reply.text}
                                      </div>
                                      <span className="text-gray-500 dark:text-gray-400">({formatDate(reply.createdAt)})</span>
                                    </div>
                                  ))}
                                  <div className="flex items-center space-x-2 mt-2">
                                    <input
                                      type="text"
                                      value={subtaskReplyInput[`${task.id}-${subtaskIndex}`] || ''}
                                      onChange={(e) => setSubtaskReplyInput(prev => ({ ...prev, [`${task.id}-${subtaskIndex}`]: e.target.value }))}
                                      placeholder="Add reply..."
                                      className="w-full px-2 py-1 text-sm bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-lg placeholder-gray-400 focus:outline-none"
                                    />
                                    <button
                                      onClick={() => handleAddSubtaskReply(task.id, subtaskIndex)}
                                      className="px-2 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg"
                                    >
                                      Reply
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="text-sm text-gray-500 dark:text-gray-400">No subtasks.</div>
                        )}
                        <div className="flex items-center space-x-2 mt-2">
                          <input
                            type="text"
                            value={subtaskInput[task.id] || ''}
                            onChange={(e) => setSubtaskInput(prev => ({ ...prev, [task.id]: e.target.value }))}
                            placeholder="Add subtask..."
                            className="w-full px-2 py-1 text-sm bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-lg placeholder-gray-400 focus:outline-none"
                          />
                          <button
                            onClick={() => handleAddSubtask(task.id)}
                            className="px-2 py-1 text-xs bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg whitespace-nowrap"
                          >
                            Add Sub-task
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">Please join or create a company to get started.</p>
            )
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">Please join or create a company to get started.</p>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-gray-200 dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Are you sure you want to delete the company "{currentCompany?.name}"? This action cannot be undone and will delete all associated tasks.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteCompany}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskManager;
