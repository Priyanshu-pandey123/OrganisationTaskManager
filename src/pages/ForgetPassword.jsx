import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useForgotPasswordMutation } from '../store/apiSlice';

const ForgetPassword = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      await forgotPassword(email).unwrap();
      toast.success('Password reset link sent! Please check your email.');
      setMessage('If an account with that email exists, you will receive a password reset link.');
    } catch (err) {
      const errorMessage = err?.data?.message || 'Failed to send reset email. Please try again.';
      toast.error(errorMessage);
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">Forgot Password</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white">
              Email Your Registered Email Address
            </label>
            <input
              type="email"
              id="email"
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm transition duration-150"
              placeholder="you@example.com"
              disabled={isLoading}
            />
          </div>
          {error && (
            <div className="mb-2 p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded-md text-center">
              {error}
            </div>
          )}
          {message && (
            <div className="mb-2 p-3 bg-green-50 dark:bg-green-900 border border-green-300 dark:border-green-600 text-green-800 dark:text-green-200 rounded-md text-center">
              {message}
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white
              ${isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}
            `}
          >
            {isLoading ? (
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
