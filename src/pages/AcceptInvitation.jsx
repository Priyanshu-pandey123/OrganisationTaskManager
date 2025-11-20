 import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAcceptInvitationQuery } from '../store/apiSlice';
import { toast } from 'react-toastify';

const AcceptInvitation = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [invitationProcessed, setInvitationProcessed] = useState(false);

  // Use the accept invitation query
  const { data, error, isLoading, isSuccess, isError } = useAcceptInvitationQuery(token, {
    skip: !token || invitationProcessed,
  });

  useEffect(() => {
    if (isSuccess && data) {
      setInvitationProcessed(true);
      toast.success('Invitation accepted successfully! Welcome to the team.');
      
      // Redirect to task manager or home page after a short delay
      setTimeout(() => {
        // If the user already exists, redirect to login/signup (Home), otherwise go to task manager
        if (data?.exists) {
          navigate('/', { replace: true }); // Home page has login/signup
        } else {
          navigate('/', { replace: true });
        }
      }, 2000);
    }

    if (isError && error) {
      setInvitationProcessed(true);
      const errorMessage = error?.data?.message || 'Failed to accept invitation. The link may be invalid or expired.';
      toast.error(errorMessage);
      
      // Redirect to home page after showing error
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 3000);
    }
  }, [isSuccess, isError, data, error, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
        <div className="p-8 sm:p-10 text-center">
          {isLoading && (
            <>
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
                <svg
                  className="animate-spin h-8 w-8 text-blue-600 dark:text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Accepting Invitation
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Please wait while we process your team invitation...
              </p>
            </>
          )}

          {isSuccess && (
            <>
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
                <svg
                  className="h-8 w-8 text-green-600 dark:text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Invitation Accepted!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Welcome to the team! You've successfully joined the organization.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Redirecting you to the task manager...
              </p>
            </>
          )}

          {isError && (
            <>
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900 mb-4">
                <svg
                  className="h-8 w-8 text-red-600 dark:text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Invitation Failed
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {error?.data?.message || 'Unable to accept invitation. The link may be invalid or expired.'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Redirecting you to the home page...
              </p>
            </>
          )}

          {!token && (
            <>
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 dark:bg-yellow-900 mb-4">
                <svg
                  className="h-8 w-8 text-yellow-600 dark:text-yellow-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Invalid Invitation Link
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                The invitation link appears to be malformed or incomplete.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AcceptInvitation;