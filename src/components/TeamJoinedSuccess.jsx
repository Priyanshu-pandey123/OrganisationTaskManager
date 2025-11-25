import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const TeamJoinedSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto redirect after showing success
    const timer = setTimeout(() => {
      navigate('/taskManager', { replace: true });
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
        <div className="p-8 sm:p-10 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
            <svg className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to the Team!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You've successfully joined the organization. Let's get started!
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Redirecting to your dashboard...
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeamJoinedSuccess;
