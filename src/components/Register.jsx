import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { useSignupMutation } from '../store/apiSlice';
import { registerStart, registerSuccess, registerFailure, clearError } from '../store/slices/authSlice';
import { toggleTheme } from '../store/slices/themeSlice';
import { useAcceptInvitation } from '../hooks/useInvitation';

const Register = ({ onToggleForm }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // Get invitation data from navigation state
  const invitedEmail = location.state?.invitedEmail;
  const invitationToken = location.state?.invitationToken;
  const isInvitationFlow = !!invitationToken;
  const [showPassword, setShowPassword] = useState(false);

  const { isLoading, error } = useAppSelector(state => state.auth);
  const { isDarkMode } = useAppSelector(state => state.theme);
  const [signup] = useSignupMutation();
  const { acceptInvite, isAccepting, acceptError } = useAcceptInvitation();

  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: invitedEmail || '', // Pre-fill email for invitation flow
    password: '',
  });

  const [invitationError, setInvitationError] = useState('');

  // Sync theme with document body
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Clear invitation error when component unmounts or form changes
  useEffect(() => {
    return () => setInvitationError('');
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    
    // Clear invitation error when user starts typing
    if (invitationError) {
      setInvitationError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear any previous errors
    dispatch(clearError());
    
    // Start registration
    dispatch(registerStart());
    
    try {
      // Call the signup API with the correct payload structure
      const result = await signup({
        username: formData.username,
        full_name: formData.fullName,
        email: formData.email, 
        password: formData.password,
      }).unwrap();

      // Check if user is verified
      if (result.data?.is_verified === false) {
        // User registered but not verified - show verification modal and switch to login
        dispatch(registerSuccess({
          user: {
            id: result.data.user_id,
            email: result.data.email,
            name: result.data.full_name,
            is_verified: false,
            verification_token: result.data.verification_token,
          },
          token: result.token || '',
          is_verified: false,
          verification_token: result.data.verification_token,
        }));
        
        // For invitation flow, we need the user to verify email first
        // Don't accept invitation yet - they'll need to verify and login
        if (isInvitationFlow) {
          toast.info('Please check your email and verify your account to complete the invitation.');
        }
        
        // Toggle to login page
        onToggleForm();
      } else {
        // User is verified - proceed with normal success flow
        dispatch(registerSuccess({
          user: {
            id: result.data?.user_id || result.id,
            email: result.data?.email || result.email,
            name: result.data?.full_name || result.full_name || formData.fullName,
          },
          token: result.token || result.access_token,
        }));

        // If this is an invitation flow, accept the invitation
        if (isInvitationFlow) {
          try {
            await acceptInvite(invitationToken);
            
            // Clear invitation token and redirect to success page
            localStorage.removeItem('invite_token');
            navigate('/team-joined', { replace: true });
          } catch (inviteError) {
            // Handle invitation acceptance error
            const errorMsg = inviteError?.data?.message || 'Registration successful, but failed to accept invitation.';
            
            if (errorMsg.includes('email does not match')) {
              setInvitationError('Invitation email does not match your account.');
              // Don't redirect - let user try again
              return;
            } else {
              toast.error(errorMsg);
              navigate('/taskManager');
            }
          }
        } else {
          navigate('/taskManager');
        }
      }

    } catch (error) {
      // Registration failed - update Redux state with error
      const errorMessage = error?.data?.message || error?.message || 'Registration failed. Please try again.';
      dispatch(registerFailure(errorMessage));
    }
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
        <div className="p-8 sm:p-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white text-center flex-1">
              {isInvitationFlow ? 'Join Your Team' : 'Create Your Account'}
            </h2>
          
          </div>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-8">
            {isInvitationFlow 
              ? `Create your account with ${invitedEmail} to join your team.` 
              : 'Start your journey with us today.'
            }
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm transition duration-150"
                  placeholder="Full Name"
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm transition duration-150"
                  placeholder="userID123"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email Address {isInvitationFlow && '(Required)'}
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isInvitationFlow && !!invitedEmail} // Disable if pre-filled for invitation
                  className={`appearance-none block w-full px-4 py-2 border rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm transition duration-150 ${
                    isInvitationFlow && invitedEmail 
                      ? 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-600 cursor-not-allowed' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder={isInvitationFlow ? invitedEmail : "you@example.com"}
                />
              </div>
              {isInvitationFlow && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  You must use the invited email address to join the team.
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm transition duration-150"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    // Eye with slash (hide)
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    // Eye (show)
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
        
            </div>

            {/* Display error message from Redux state */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded-md">
                {error}
              </div>
            )}

            {/* Invitation Error */}
            {invitationError && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded-md">
                {invitationError}
              </div>
            )}

            {/* Submit Button */}
            <div>
              {/* Update the submit button to show loading state from Redux */}
              <button
                type="submit"
                disabled={isLoading || isAccepting}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white transition duration-150 ease-in-out ${
                  isLoading || isAccepting
                    ? 'bg-indigo-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                }`}
              >
                {isLoading || isAccepting ? (
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
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
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                 ) : (
                  isInvitationFlow ? 'Join Team' : 'Register'
                )}
              </button>
            </div>
          </form>

          {/* Toggle to Login */}
          {!isInvitationFlow && (
            <div className="text-center mt-6">
              <p className="text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <button
                  onClick={onToggleForm}
                  className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition duration-200"
                >
                  Sign in here
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;