import React from 'react';

const DeleteModal = ({ showDeleteModal, setShowDeleteModal, currentCompany, handleDeleteCompany }) => {
  if (!showDeleteModal) return null;

  return (
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
  );
};

export default DeleteModal;
