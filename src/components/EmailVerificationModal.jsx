import React from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { closeVerificationModal } from '../store/slices/authSlice';

const EmailVerificationModal = () => {
  const dispatch = useAppDispatch();
  const { showVerificationModal, pendingVerificationUser } = useAppSelector(state => state.auth);

  if (!showVerificationModal || !pendingVerificationUser) return null;

  const handleClose = () => {
    dispatch(closeVerificationModal());
  };

  const handleResendEmail = () => {
    // TODO: Implement resend verification email functionality
    console.log('Resend verification email to:', pendingVerificationUser.email);
    // You can add an API call here to resend the verification email
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
        <div className="text-center">
          {/* Email Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
            <svg
              className="h-8 w-8 text-blue-600 dark:text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Check Your Email
          </h3>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            We've sent a verification link to{' '}
            <span className="font-medium text-gray-900 dark:text-white">
              {pendingVerificationUser.email}
            </span>
          </p>

          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Please check your email and click the verification link to activate your account. 
            You won't be able to log in until your email is verified.
          </p>

          <div className="space-y-3">
            <button
              onClick={handleResendEmail}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
            >
              Resend Verification Email
            </button>

            <button
              onClick={handleClose}
              className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded-lg transition duration-200"
            >
              Continue to Login
            </button>
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
            Didn't receive the email? Check your spam folder or click "Resend" above.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationModal;