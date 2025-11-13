import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVerifyEmailQuery } from '../store/apiSlice';
import { toast } from 'react-toastify';

const EmailVerification = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [verificationAttempted, setVerificationAttempted] = useState(false);

  // Use the verification query
  const { data, error, isLoading, isSuccess, isError } = useVerifyEmailQuery(token, {
    skip: !token || verificationAttempted,
  });

  useEffect(() => {
    if (isSuccess && data) {
      setVerificationAttempted(true);
      toast.success('Email verified successfully! You can now log in.');
      
      // Redirect to home page (which shows login form) after a short delay
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 2000);
    }

    if (isError && error) {
      setVerificationAttempted(true);
      const errorMessage = error?.data?.message || 'Email verification failed. Please try again.';
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
                Verifying Your Email
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Please wait while we verify your email address...
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
                Email Verified!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Your email has been successfully verified.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Redirecting you to the login page...
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
                Verification Failed
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {error?.data?.message || 'Unable to verify your email. The link may be invalid or expired.'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Redirecting you to the login page...
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
                Invalid Link
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                The verification link appears to be malformed.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;