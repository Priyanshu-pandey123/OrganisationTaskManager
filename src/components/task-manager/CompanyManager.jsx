import React from 'react';
import TeamProfiles from './TeamProfiles';

const CompanyManager = ({
  currentCompany,
  isEditingCompanyName,
  editingCompanyName,
  setIsEditingCompanyName,
  setEditingCompanyName,
  handleEditCompanyName,
  setShowDeleteModal,
  newTeamName,
  setNewTeamName,
  creatingTeam,
  createTeamError,
  handleCreateTeam,
  invitedEmail,
  setInvitedEmail,
  selectedTeamForMember,
  setSelectedTeamForMember,
  invitingMember,
  handleAddMemberToTeam,
  currentCompanyTeams,
  teamsLoading,
  teamsError,
  selectedTeamFilter,
  setSelectedTeamFilter,
  selectedMemberFilter,
  setSelectedMemberFilter
}) => {
  if (!currentCompany) return null;

  return (
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
          
          <TeamProfiles
            currentCompanyTeams={currentCompanyTeams}
            teamsLoading={teamsLoading}
            teamsError={teamsError}
            selectedTeamFilter={selectedTeamFilter}
            setSelectedTeamFilter={setSelectedTeamFilter}
            selectedMemberFilter={selectedMemberFilter}
            setSelectedMemberFilter={setSelectedMemberFilter}
          />
        </div>
      )}
    </div>
  );
};

export default CompanyManager;
