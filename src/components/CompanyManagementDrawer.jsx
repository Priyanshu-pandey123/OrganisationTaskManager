import React from 'react';

const CompanyManagementDrawer = ({
  isOpen,
  onClose,
  currentCompany,
  currentCompanyTeams,
  newTeamName,
  setNewTeamName,
  creatingTeam,
  createTeamError,
  handleCreateTeam,
  selectedTeamForMember,
  setSelectedTeamForMember,
  invitedEmail,
  setInvitedEmail,
  invitingMember,
  handleAddMemberToTeam,
  selectedTeamFilter,
  setSelectedTeamFilter,
  selectedMemberFilter,
  setSelectedMemberFilter,
  filterTeamMembersData,
  isEditingCompanyName,
  setIsEditingCompanyName,
  editingCompanyName,
  setEditingCompanyName,
  handleEditCompanyName,
  setShowDeleteModal
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-end z-50">
      <div className="bg-white dark:bg-gray-800 w-full max-w-xl h-full overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Manage Company</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{currentCompany?.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Company Info & Actions */}
          <div className="">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Company Details</h3>
              <div className="flex items-center space-x-2">
                {isEditingCompanyName ? (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={editingCompanyName}
                      onChange={(e) => setEditingCompanyName(e.target.value)}
                      className="px-3 py-1 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-200 rounded-lg border border-gray-300 dark:border-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      autoFocus
                    />
                    <button
                      onClick={handleEditCompanyName}
                      className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
                      title="Save changes"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setIsEditingCompanyName(false)}
                      className="p-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
                      title="Cancel editing"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{currentCompany.name}</span>
                    <button
                      onClick={() => {
                        setIsEditingCompanyName(true);
                        setEditingCompanyName(currentCompany.name);
                      }}
                      className="p-2 bg-gray-200 dark:bg-gray-600 hover:bg-yellow-600 dark:hover:bg-yellow-700 text-gray-700 dark:text-gray-200 hover:text-white rounded-lg transition-colors duration-200"
                      title="Edit company name"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="p-2 bg-gray-200 dark:bg-gray-600 hover:bg-red-600 dark:hover:bg-red-700 text-gray-700 dark:text-gray-200 hover:text-white rounded-lg transition-colors duration-200"
                      title="Delete company"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Teams:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">{currentCompanyTeams.length}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Total Members:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">
                  {[...new Set(currentCompanyTeams.flatMap(team => team.members || []).map(member => member.email))].length}
                </span>
              </div>
            </div>
          </div>

          {/* Create New Team Section */}
          <div className="">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text">Create New Team</h3>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                placeholder="Enter team name"
                className="flex-1 px-4 py-2 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-200 rounded-lg border border-gray-300 dark:border-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                disabled={creatingTeam}
              />
              <button
                onClick={handleCreateTeam}
                disabled={creatingTeam || !newTeamName.trim()}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition duration-200 flex items-center space-x-2"
              >
                {creatingTeam ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Create Team</span>
                  </>
                )}
              </button>
            </div>
            {createTeamError && (
              <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-600 dark:text-red-400 text-sm">{createTeamError.message}</p>
              </div>
            )}
          </div>

          {/* Add Member to Team Section */}
          {currentCompanyTeams.length > 0 && (
            <div className="">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <h3 className="">Invite Member to Team</h3>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Team</label>
                    <select
                      value={selectedTeamForMember}
                      onChange={(e) => setSelectedTeamForMember(e.target.value)}
                      className="w-full px-4 py-2 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-200 rounded-lg border border-gray-300 dark:border-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    >
                      <option value="">Select Team</option>
                      {currentCompanyTeams.map((team, index) => (
                        <option key={team.id || index} value={team.team_name}>{team.team_name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Member Email</label>
                    <input
                      type="email"
                      value={invitedEmail}
                      onChange={(e) => setInvitedEmail(e.target.value)}
                      placeholder="Enter member email"
                      className="w-full px-4 py-2 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-200 rounded-lg border border-gray-300 dark:border-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    />
                  </div>
                </div>
                <button
                  onClick={handleAddMemberToTeam}
                  disabled={!selectedTeamForMember || invitingMember || !invitedEmail.trim()}
                  className="w-full md:w-auto px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition duration-200 flex items-center justify-center space-x-2"
                >
                  {invitingMember ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Inviting...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>Send Invitation</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Team Overview */}
          {currentCompanyTeams.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Team Overview</h3>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filter by Team</label>
                  <select
                    value={selectedTeamFilter || ''}
                    onChange={(e) => setSelectedTeamFilter(e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-200 rounded-lg border border-gray-300 dark:border-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                  >
                    <option value="">All Teams</option>
                    {currentCompanyTeams.map((team, index) => (
                      <option key={team.id || index} value={team.team_name}>{team.team_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filter by Member</label>
                  <select
                    value={selectedMemberFilter || ''}
                    onChange={(e) => setSelectedMemberFilter(e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-200 rounded-lg border border-gray-300 dark:border-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
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

              {/* Team Display */}
              {selectedTeamFilter && filterTeamMembersData?.data && (
                <div className="bg-white dark:bg-gray-600 rounded-lg p-4">
                  <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Team: {selectedTeamFilter}</h4>
                  <div className="mb-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Members: </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{filterTeamMembersData.data.total}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filterTeamMembersData?.data?.user?.map((member, index) => (
                      <div key={index} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {member.name ? member.name.charAt(0).toUpperCase() : member.email.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 dark:text-white truncate">
                              {member.name || 'Unknown User'}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {member.email}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* All Teams Summary */}
              {!selectedTeamFilter && (
                <div className="space-y-3">
                  {currentCompanyTeams.map((team, index) => (
                    <div key={team.id || index} className="bg-white dark:bg-gray-600 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">{team.team_name}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{team.members?.length || 0} members</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {currentCompanyTeams.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Teams Yet</h3>
              <p className="text-gray-500 dark:text-gray-400">Create your first team to get started with team management.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyManagementDrawer;