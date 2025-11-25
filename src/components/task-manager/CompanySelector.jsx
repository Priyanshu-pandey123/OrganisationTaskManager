import React from 'react';

const CompanySelector = ({
  companies,
  companiesLoading,
  companiesError,
  currentCompany,
  newCompanyName,
  setNewCompanyName,
  handleSelectCompany,
  handleCreateCompanyAndJoin
}) => {
  return (
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
  );
};

export default CompanySelector;
