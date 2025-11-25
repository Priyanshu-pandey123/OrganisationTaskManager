import React from 'react';

const TeamProfiles = ({
  currentCompanyTeams,
  teamsLoading,
  teamsError,
  selectedTeamFilter,
  setSelectedTeamFilter,
  selectedMemberFilter,
  setSelectedMemberFilter
}) => {
  return (
    <>
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
    </>
  );
};

export default TeamProfiles;
