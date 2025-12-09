import React, { useState, useEffect } from 'react';
import {  useGetCompaniesQuery, useCreateTeamMutation, useGetTeamsByOrganisationIdQuery,useInviteMemberMutation, useGetMemberOfTeamAndOrgQuery,useCreateOrganisationMutation ,useMeQuery} from '../store/apiSlice'
import { data } from 'autoprefixer';
import TaskAssignmentDrawer from '../components/TaskAssignmentDrawer';
import CompanyManagementDrawer from '../components/CompanyManagementDrawer';
import { toast } from 'react-toastify';
import TaskTable from '../pages/TaskTable';
import { useAppSelector } from '../store/hooks';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { logout } from '../store/slices/authSlice';

const TaskManager = () => {
  const { data: companiesData, isLoading: companiesLoading, error: companiesError, refetch: refetchCompanies } = useGetCompaniesQuery();
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
  const [isTaskDrawerOpen, setIsTaskDrawerOpen] = useState(false);
  const [isCompanyDrawerOpen, setIsCompanyDrawerOpen] = useState(false);
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
   const [createOrganisation, { isLoading: creatingOrganisation, error: createOrganisationError }] = useCreateOrganisationMutation();
   const currentCompanyTeams = teamsData?.data || [];

   const [taskFilters, setTaskFilters] = useState({
    team_id: '',
    org_id: '',
    user_id: '',
    assigned_user: '',
    search: '',
    sort_by: '',
    order: '',
    page: 1,
  });
  // Add this to fetch current user data
  const { data: userData, isLoading: userLoading, error: userError } = useMeQuery(undefined, {
    skip: !localStorage.getItem('auth_token'),
  });

  // Or alternatively, get user from Redux store (if already populated)
  const currentUser = useAppSelector((state) => state.user.currentUser);

    // Handler to update task filters
const updateTaskFilters = (updates) => {
  setTaskFilters(prev => ({ ...prev, ...updates }));
};

   // Fetch team members using getMemberOfTeamAndOrg API
   const { 
     data: teamMembersData, 
     isLoading: teamMembersLoading, 
     error: teamMembersError,
     refetch: refetchTeamMembers
   } = useGetMemberOfTeamAndOrgQuery(
     selectedTeam ? { orgId: currentCompany?.id, teamId: selectedTeam } : { orgId: '', teamId: '' },
     { skip: !currentCompany?.id || !selectedTeam }
   );
   
   // Fetch team members for filtering
   const { 
     data: filterTeamMembersData, 
     isLoading: filterTeamMembersLoading, 
     error: filterTeamMembersError
   } = useGetMemberOfTeamAndOrgQuery(
     selectedTeamFilter ? { 
       orgId: currentCompany?.id, 
       teamId: currentCompanyTeams.find(team => team.team_name === selectedTeamFilter)?.team_id 
     } : { orgId: '', teamId: '' },
     { skip: !currentCompany?.id || !selectedTeamFilter }
   );
   
   // Fetch team members for task creation
   const { 
     data: taskCreationTeamMembersData, 
     isLoading: taskCreationTeamMembersLoading, 
     error: taskCreationTeamMembersError
   } = useGetMemberOfTeamAndOrgQuery(
     selectedTeamForMember ? { 
       orgId: currentCompany?.id, 
       teamId: currentCompanyTeams.find(team => team.team_name === selectedTeamForMember)?.team_id 
     } : { orgId: '', teamId: '' },
     { skip: !currentCompany?.id || !selectedTeamForMember }
   );
   


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

  const handleCreateCompanyAndJoin = async () => {
    if (!newCompanyName.trim()) return;

    try {
      // Create organisation using API
      const result = await createOrganisation(newCompanyName).unwrap();
      
      // Show success message
      toast.success('Organisation created successfully!');
      
      // Refresh companies list to include the new organisation
      refetchCompanies();
      
      // Clear the input
      setNewCompanyName('');
      
      // Note: You might want to automatically select the newly created organisation
      // This would require the API to return the created organisation details
      
    } catch (error) {
      console.error('Failed to create organisation:', error);
      alert(`Failed to create organisation: ${error?.data?.message || error?.message || 'Unknown error'}`);
    }
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
      
      toast.success('Team created successfully!');
      // Clear the input and refetch teams
      setNewTeamName('');
      refetchTeams(); // Refresh the teams list

      
    } catch (error) {
      console.error('Failed to create team:', error);
      toast.error(error?.data?.message || 'Failed to create team. Please try again.');
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
      
      toast.success('Member invited successfully!');
    } catch (error) {
      console.error('Failed to invite member:', error);
      toast.error('Failed to invite member. Please try again.');
    }
  };

  // Remove the old handleInviteEmployee function as it's replaced by handleAddMemberToTeam

  const handleAddTask = () => {
    if (!currentCompany || !newTaskTitle.trim() || !selectedTeamForMember || !selectedEmployee) return;
    
    // Find the selected team data
    const selectedTeamData = currentCompanyTeams.find(team => team.team_name === selectedTeamForMember);
    const teamName = selectedTeamData?.team_name || selectedTeamForMember;
    
    const newTask = {
      id: 'task-' + Date.now(),
      companyId: currentCompany.id,
      title: newTaskTitle,
      assignedTo: selectedEmployee, // Now using email from API
      assignedEmployeeId: selectedEmployee,
      team: teamName,
      subtasks: [],
      completed: false,
      createdAt: Date.now(),
      completedAt: null
    };



    
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
    // Reset selections after task creation
    setSelectedTeamForMember('');
    setSelectedEmployee('');
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

  // Get all team members from API data
  const allTeamMembers = teamsData?.data?.flatMap(team => team.members || []) || [];
  
  // Calculate total users across all teams (unique by email)
  const totalUsers = [...new Set(allTeamMembers.map(member => member.email))].length;

  // Update the teams display to use API data

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsProfileDropdownOpen(false);
  };

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.relative')) {
        setIsProfileDropdownOpen(false);
      }
    };

    if (isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }} className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="w-[100%] px-[100px] rounded-xl  py-8 bg-gray-100 dark:bg-gray-800 ">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2 sm:mb-0">Collaborative Task Manager</h1>
          
          {/* User Profile Dropdown - Top Right */}
          <div className="relative ">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center space-x-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-2 rounded-lg transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <svg className={`w-4 h-4 text-gray-600 dark:text-gray-300 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isProfileDropdownOpen && (
              <div className="absolute right-0  top-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  {userLoading ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">Loading user...</p>
                  ) : userError ? (
                    <p className="text-sm text-red-500 dark:text-red-400">Error loading user</p>
                  ) : userData?.data ? (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {userData.data.email || userData.data.name || 'Current User'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            ID: {userData.data.user_id || userData.data.id}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : currentUser ? (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {currentUser.email || currentUser.name || 'Current User'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            ID: {currentUser.id}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">User</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            ID: {userId}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
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
              className="w-full sm:w-auto px-3 py-2 text-base bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-lg placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
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
          <div className="mb-4">
            <button
              onClick={() => setIsCompanyDrawerOpen(true)}
              className="flex items-center space-x-3 px-4 py-3 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 transition-colors duration-200"
            >
              <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Manage Company</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Create teams, invite members, and manage {currentCompany.name}</p>
              </div>
              <svg className="w-5 h-5 text-gray-400 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
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
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">.</p>
            )
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">.</p>
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
      <TaskTable/>
      <TaskAssignmentDrawer
        isOpen={isTaskDrawerOpen}
        onClose={() => setIsTaskDrawerOpen(false)}
        currentCompany={currentCompany}
        currentCompanyTeams={currentCompanyTeams}
        teamMembersData={teamMembersData}
      />
      <CompanyManagementDrawer
        isOpen={isCompanyDrawerOpen}
        onClose={() => setIsCompanyDrawerOpen(false)}
        currentCompany={currentCompany}
        currentCompanyTeams={currentCompanyTeams}
        newTeamName={newTeamName}
        setNewTeamName={setNewTeamName}
        creatingTeam={creatingTeam}
        createTeamError={createTeamError}
        handleCreateTeam={handleCreateTeam}
        selectedTeamForMember={selectedTeamForMember}
        setSelectedTeamForMember={setSelectedTeamForMember}
        invitedEmail={invitedEmail}
        setInvitedEmail={setInvitedEmail}
        invitingMember={invitingMember}
        handleAddMemberToTeam={handleAddMemberToTeam}
        selectedTeamFilter={selectedTeamFilter}
        setSelectedTeamFilter={setSelectedTeamFilter}
        selectedMemberFilter={selectedMemberFilter}
        setSelectedMemberFilter={setSelectedMemberFilter}
        filterTeamMembersData={filterTeamMembersData}
        isEditingCompanyName={isEditingCompanyName}
        setIsEditingCompanyName={setIsEditingCompanyName}
        editingCompanyName={editingCompanyName}
        setEditingCompanyName={setEditingCompanyName}
        handleEditCompanyName={handleEditCompanyName}
        setShowDeleteModal={setShowDeleteModal}
      />

      {/* Floating Action Button */}
      {currentCompany && (
        <button
          onClick={() => setIsTaskDrawerOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg z-40 transition-colors duration-200"
          title="Create New Task"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      )}
      </div>
    </div>
  );
  
};

export default TaskManager;